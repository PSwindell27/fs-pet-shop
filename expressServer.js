import express from "express";
import { readFile, writeFile } from "node:fs/promises"
import { stringify } from "node:querystring";

const server = express();
const port = 4000; 

const wrongURL = function(req, res, next){
    res.statusCode = 404;
    res.set("Content-Type", "text/plain");
    res.end("Not Found");
}
server.use(express.json());


server.get("/pets", (req, res) => {
    readFile("./pets.json", "utf-8").then((text) =>{
        res.set("Content-Type", "application/json");
        // res.status(200);
        // res.send(text); 
        res.json(JSON.parse(text));  
    });
});

server.use(wrongURL);

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


server.post("/pets", (req, res) => {
    
    const pet = req.body;
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        pets.push(pet);
    
        return writeFile("./pets.json", JSON.stringify(pets));
    })
})


// server.use(express.json());

// server.get("/donuts", (req, res) => {
//     res.send("yum");
// });

// server.post("/donuts", (req, res)=>{
//     res.send("yum");
// })

// server.listen(port, () => {
//     console.log(`Example app running on port ${port}`)
// });



server.listen(port, () => {
    console.log(`Example app running on port ${port}`)
});