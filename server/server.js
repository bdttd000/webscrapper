import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { database } from './config/database.js';
import { getLvbetData } from './scrappers/lvbet.js';
import { getSports888Data } from './scrappers/sports888.js';
import bodyParser from 'body-parser';
import { compareData } from './utils/compareData.js';

const app = express();
app.use(bodyParser.json());

app.get("/api", async (req, res) => {
    res.status(200).send({'test api': 'ok'});
})

app.get("/api/lvbet", async (req, res) => {
    const collection = await database.collection("lvbet");
    const results = await collection.find({}).toArray();
    res.status(200).send(results);
})

app.get("/api/lvbet/update", async (req, res) => {
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

app.get("/api/sports888", async (req, res) => {
    const collection = await database.collection("sports888");
    const results = await collection.find({}).toArray();
    res.status(200).send(results);
})

app.get("/api/sports888/update", async(req, res) => {
    await getSports888Data();
    try {
        const collection = await database.collection("sports888");
        const results = await collection.find({}).toArray();
        res.status(200).send(results);
    } catch (error) {
        console.error("Błąd podczas aktualizowania danych:", error);
        res.status(500).send("Wystąpił błąd podczas aktualizowania danych.");
    }
})

app.get("/api/compare", async (req, res) => {
    const result = await compareData();
    console.log(result);
    res.status(200).send(result);
});

app.post('/api', async (req, res) => {
    const receivedData = req.body;
    await database.collection(`${receivedData.pageName}`).insertOne(receivedData.leagues);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});