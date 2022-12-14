import express from "express";
import morgan from "morgan";
import postgres from "postgres";

const sql = postgres({database: "petshop"});

const server = express();
const port = 4000; 


server.use(express.json());
server.use(morgan("tiny"));


server.get("/pets", (req, res, next) => {
    sql`SELECT * FROM pets`.then((pets) =>{
        console.log(pets);
        res.json(pets);
    }).catch(next);
});

server.get("/pets", (req, res, next) => {
    const { q } = req.query;
    if(q){
        sql`SELECT * FROM pets WHERE name ILIKE ${q + "%"}`.then((pets) => {
            res.json(pets);
        })
    }else{
        sql`SELECT * FROM pets`.then((pets) => {
            res.json(pets);
        }).catch(next);
    }
})


server.get("/pets/:id", (req, res, next) => {
    const id = req.params;
    //tagged template literal
    sql`SELECT * FROM pets WHERE id = ${id}`.then((result) =>{
        if(result.length === 0){
            res.statusCode = 404;
            res.set("Content-Type", "text/plain");
            res.end("Not Found");
        }else{
        res.json(result[0]);
        }
    })
    .catch(next);
})

server.patch("/pets/:id", (req, res, next) =>{
    const id = req.params.id;
    const {age, name, kind} = req.body;
    
    sql`
    UPDATE pets 
    SET ${sql(req.body)} 
    WHERE id = ${id} RETURNING *`
    .then(result => {
        console.log(result.statement.string);
        res.send(result[0]);
    }).catch(next);
})


server.post("/pets", (req, res, next) => {
    const pet = req.body;
    const requiredFields = ["name", "age", "kind"];
    const errors = [];
    for(let field of requiredFields){
        if(pet[field] === undefined){
            errors.push(`Missing pet '${field}' .`);
        }
    }
    if(pet.age && typeof pet.age !== "number"){
        errors.push("Pet age must be a number.");
    }
    const {age, name, kind} = pet;
    if(errors.length > 0){
        res.status(422);
        res.send(errors.join(" "));
    }else {
    sql`INSERT INTO pets (age, name, kind) VALUES(${age}, ${name}, ${kind}) RETURNING *`.then(result => {
        res.status(201);
        res.json(result[0]);
    }).catch(next);
        

    }
})


server.delete("/pets/:id", (req, res, next) => {
    const { id } = req.params;
  sql`DELETE FROM pets WHERE id = ${id}`.then((result) => {
    res.send("DELETED");
  }).catch(next);
});


server.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Internal Server Error");
})

server.listen(port, () => {
    console.log(`Example app running on port ${port}`)
});