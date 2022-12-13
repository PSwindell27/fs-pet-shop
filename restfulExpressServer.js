import express from "express";
import { readFile, writeFile } from "node:fs/promises"
import morgan from "morgan";

const server = express();
const port = 4000; 


server.use(express.json());
server.use(morgan("tiny"));


server.get("/pets", (req, res) => {
    readFile("./pets.json", "utf-8").then((text) =>{
        res.set("Content-Type", "application/json");
        // res.status(200);
        // res.send(text); 
        res.json(JSON.parse(text));  
    });
});

// server.use(wrongURL);

server.get("/pets/:index", (req, res) => {
    const index = req.params.index;
    readFile("./pets.json", "utf-8").then((text) =>{
        const pets = JSON.parse(text);
        const selectedPet = pets[index];
        if(index >= 0 && index <= pets.length -1){
            res.json(selectedPet);
        }else{
            res.statusCode = 404;
            res.set("Content-Type", "text/plain");
            res.end("Not Found");
            
        }
            
    })
    
})

server.patch("/pets/:index", (req, res) =>{
    const { index } = req.params;
    const updates = req.body;

    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        const existingPet = pets[index];
        for(let key in updates){
            existingPet[key] = updates[key];
        }

        return writeFile("./pets.json", JSON.stringify(pets)).then(()=> {
            res.json(existingPet)
        })
    })
} )


server.post("/pets", (req, res) => {
    
    const pet = req.body;
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        pets.push(pet);
    
        return writeFile("./pets.json", JSON.stringify(pets));
    })
})

server.delete("/pets/:index", (req, res) => {
    const { index } = req.params;
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        pets.splice(index, 1);

        return writeFile("./pets.json", JSON.stringify(pets)).then(() => {
            res.json(pets);
        })
    })
//  res.send("Deleted");
})

server.listen(port, () => {
    console.log(`Example app running on port ${port}`)
});