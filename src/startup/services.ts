import { getDBConnection } from "./db";
import { BookstoreRepository, CartRepository } from "../repositories";

export const bookstoreRepository = new BookstoreRepository(getDBConnection);
export const cartRepository = new CartRepository(getDBConnection);
