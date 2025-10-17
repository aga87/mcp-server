import { type IFirebaseSchema } from "../startup/db";
import { type CartItemDB } from "../types";

export class CartRepository {
  private db?: IFirebaseSchema;
  private dbConnectionFn: () => IFirebaseSchema;

  constructor(dbConnectionFn: () => IFirebaseSchema) {
    this.dbConnectionFn = dbConnectionFn;
  }

  private getDB = () => {
    if (!this.db) {
      this.db = this.dbConnectionFn();
    }
    return this.db;
  };

  async getCartItems(): Promise<CartItemDB[]> {
    const snapshot = await this.getDB().cartItems.get();
    return snapshot.docs.map((doc) => doc.data());
  }
}
