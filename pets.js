//Usage: node pets.js [read | create | update | destroy]
// import { writeFile } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

const subCommand = process.argv[2];
console.log(process.argv[2])

if(subCommand === "read"){

    readFile("./pets.json", "utf-8").then((text) => {
        const petIndex = process.argv[3];
        const pets = JSON.parse(text);

        if(petIndex === undefined){
            console.log(pets);
            }else if(petIndex > pets.length -1 || petIndex <= -1){
               console.error("Usage: node pets.js read INDEX");
               process.exit(2);
    }else{
        console.log(pets[petIndex]);
    }
});

}else if(subCommand === "create"){
    const age = process.argv[3];
    const kind = process.argv[4];
    const name = process.argv[5];
    const pet  = {age, kind, name};
    readFile("./pets.json", "utf-8")
    .then((text) => {
    const pets = JSON.parse(text);
    pets.push(pet);
    return writeFile("./pets.json", JSON.stringify(pets));
   })
   .catch((err) => {
    console.log("kjhkjf");
   });
}else{
    console.log(process.argv);
    console.error("Usage: node pets.js [read | create | update | destroy]");
    process.exit(1);
};




// const createCommand = process.argv[2];
// console.log(process.argv);



