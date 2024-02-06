import express from 'express';
import { database } from './config/database.js';
import { getLvbetData } from './scrappers/lvbet.js';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.get("/api", async (req, res) => {
    const collection = await database.collection("lvbet");
    const results = await collection.find({}).toArray();
    res.status(200).send(results);
})

app.get("/updateApi", async (req, res) => {
    await getLvbetData();

    try {
        const collection = await database.collection("lvbet");
        const results = await collection.find({}).toArray();
        res.status(200).send(results);
    } catch (error) {
        console.error("Błąd podczas aktualizowania danych:", error);
        res.status(500).send("Wystąpił błąd podczas aktualizowania danych.");
    }
});

app.post('/api', async (req, res) => {
    const odebraneDane = req.body;
    await database.collection('lvbet').insertOne(odebraneDane);
});

app.listen(3001, () => {
    console.log("Server started on port 3001")
})