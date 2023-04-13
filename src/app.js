import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv"

// Criação e configuração do servidor
const app = express();
app.use(express.json())
app.use(cors())
dotenv.config()
//

// Configuração e conexão do bd
let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL);
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((erro) => console.log(erro.message))
//

//Aqui está os endpoints da aplicação
app.get("/memes", (req, res) => {
    db.collection("memes").find().toArray()
        .then((ok) => res.status(200).send(ok))
        .catch(erro => res.status(500).send(erro.message))
})

app.post("/memes", (req, res) => {
    const {description, image, category} = req.body;
    //pequena validação de dados
    if(!description || !image || !category){
        return res.status(422).send("formato invalido")
    }
    //
    const newMeme = {description, image, category};
    db.collection("memes").insertOne(newMeme)
    .then((ok) => res.status(201).send("meme criado com sucesso"))
    .catch((erro) => res.status(500).send(erro.message))

})
//

// Sempre no final, aqui fica a função que fica escutando as requisições
app.listen(5000, () => console.log("servidor está rodando na porta 5000"))