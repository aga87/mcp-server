import { getDBConnection } from "./db";
import { CartRepository } from "../repositories";

export const cartRepository = new CartRepository(getDBConnection);
