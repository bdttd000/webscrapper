import mongoose, { Connection } from "mongoose";
import { MongoClientOptions } from "mongodb";

mongoose.connect("mongodb://localhost:27017/data", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as MongoClientOptions);

const database: Connection = mongoose.connection;

database.on("error", console.error.bind(console, "Błąd połączenia z MongoDB:"));
database.once("open", () => {
  console.log("Połączono z bazą danych MongoDB");
});

const lvbet = {
  pageName: "lvbet",
  baseUrl:
    "https://bv2.digitalsportstech.com/betbuilder?sb=beefeepl-lv&language=pl",
};

const mongodbUrl = "mongodb://localhost:27017";

export { database, lvbet, mongodbUrl };
