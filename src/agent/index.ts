import "dotenv/config";
import express, { Application, Request, Response } from "express";
import { askController, pingController } from "./controllers";

const app: Application = express();

app.use(express.json()); // for parsing application/json
app.get("/ping", pingController);
app.post("/ask", askController); // E.g. "Can you recommend me a sci-fi book?"

const { PORT } = process.env;
const port = PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
