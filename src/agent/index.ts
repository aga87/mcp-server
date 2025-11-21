import "dotenv/config";
import express, { Application } from "express";
import {
  askController,
  askStreamController,
  pingController,
} from "./controllers";

const app: Application = express();

app.use(express.json()); // for parsing application/json
app.get("/ping", pingController);
app.post("/ask", askController); // E.g. "Can you recommend me a sci-fi book?"
app.post("/ask-stream", askStreamController);

const { PORT } = process.env;
const port = PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

// TODO: add agent memory
