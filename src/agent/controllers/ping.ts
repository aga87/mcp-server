import { RequestHandler } from "express";
import { bookstoreAgent } from "../startup/services";

export const pingController: RequestHandler = async (_req, res, next) => {
  res.send("Hello World");
};
