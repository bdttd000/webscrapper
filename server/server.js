import express from 'express';
import { database } from './config/database.js';

const app = express();

app.get("/api", async (req, res) => {
    let collection = await database.collection("lvbet");
    let results = await collection.find({})
        .toArray();
    res.send(results).status(200);
})

app.listen(3001, () => {
    console.log("Server started on port 3001")
})