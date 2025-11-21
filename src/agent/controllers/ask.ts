import { RequestHandler } from "express";
import { bookstoreAgent } from "../startup/services";

export const askController: RequestHandler = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (typeof query !== "string" || query.trim() === "") {
      res.status(400).send("Invalid query - must be a non-empty string");
      return;
    }

    const answer = await bookstoreAgent.handleCustomerQuery(query);

    res.send(answer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Unexpected server error");
  }
};
