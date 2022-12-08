import http from "node:http";
// import nodemon from "nodemon";
import { readFile } from "node:fs/promises";


const petRegExp = /^\/pets\/(.*)$/;

const server = http.createServer((req, res) => {
    // console.log(req.method);
    // console.log(req.url);
    // console.log(req);
   const { method, url } = req;
//    
    
    if(method === "GET" && url === "/pets"){
            readFile("./pets.json", "utf-8").then((text) =>{
                res.setHeader("Content-Type", "application/json");
                res.end(text); 
            });
    }else if(method === "GET" && petRegExp.test(url)){
        const matches = petRegExp.exec(url);
        const petIndex = matches[1];
        readFile("./pets.json", "utf-8").then((text) =>{
            const pets = JSON.parse(text);
            const selectedPet = pets[petIndex];
            console.log("Looking for a specific pet");
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(selectedPet));

        })
    }else{
        res.end("Not Found");
    ;}
    
});
server.listen(9002, () => {
    console.log("Server running on port 9002");
    
    // console.log(method);
});
//const app = express();
//app.get("/pets", (req, res) => {
//
//})
//app.get("/pets/index", (req, res) => {
//if(index > pets.length -1 || index <= -1){
//     res.send("Index not found");
// }
//})//app.post("/pets", (req, res) => {
//
//})