import "dotenv/config";
import express, { Application, Request, Response } from "express";
import { pingController } from "./controllers";

const app: Application = express();

app.get("/ping", pingController);

const { PORT } = process.env;
const port = PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
