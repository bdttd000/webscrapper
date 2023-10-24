import express from 'express';
import { database } from './config/database.js';
import { getLvbetData } from './scrappers/lvbet.js';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.get("/api", async (req, res) => {
    let collection = await database.collection("lvbet");
    let results = await collection.find({})
        .toArray();
    res.send(results).status(200);
})

app.post('/api', async (req, res) => {
    const odebraneDane = req.body;
    // console.log('Odebrane dane:', odebraneDane);
  
    await database.collection('inne').insertOne(odebraneDane);
});

app.listen(3001, () => {
    console.log("Server started on port 3001")
})

// getLvbetData();