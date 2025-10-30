import { type IFirebaseSchema } from "../startup/db";
import { type CartDB, type CartItemDB } from "../types";

// TODO: split into CartRepository and CartItemRepository
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

  /**
   * Retrieves the active cart ID for a given userId or anonymousId.
   * If none exists, creates a new cart and returns its ID.
   */
  public async getOrCreateCartId(
    id:
      | { userId: string; anonymousId?: null }
      | { userId?: null; anonymousId: string }
  ): Promise<string> {
    const db = this.getDB();

    const { userId, anonymousId } = id;

    // // Validate input
    if (!userId && !anonymousId) {
      throw new Error("Either userId or anonymousId must be provided.");
    }

    // Try to find existing active cart
    const query = db.carts
      .where(userId ? "userId" : "anonymousId", "==", userId ?? anonymousId)
      .where("status", "==", "active")
      .limit(1);

    const snapshot = await query.get();

    if (!snapshot.empty) {
      const existingCartId = snapshot.docs[0].id;
      console.log(`🛒 Found existing active cart: ${existingCartId}`);
      return existingCartId;
    }

    // No active cart found → create one
    const newCartRef = db.carts.doc();

    let newCart: CartDB;

    if (userId) {
      newCart = {
        status: "active",
        userId,
        anonymousId: null,
      };
    } else if (anonymousId) {
      newCart = {
        status: "active",
        userId: null,
        anonymousId,
      };
    } else {
      throw new Error("Either userId or anonymousId must be provided.");
    }

    await newCartRef.set(newCart);
    return newCartRef.id;
  }

  /**
   * Adds a book variant (bookVariantId) to a cart.
   * If it already exists in the cart, increments the quantity.
   */
  public async addToCart(
    cartId: string,
    productId: string,
    quantity: number = 1
  ): Promise<void> {
    const db = this.getDB();

    // Check if the item already exists in the cart
    const existingQuery = await db.cartItems
      .where("cartId", "==", cartId)
      .where("productId", "==", productId)
      .limit(1)
      .get();

    if (!existingQuery.empty) {
      //  Increment quantity
      const docRef = existingQuery.docs[0].ref;
      const existingData = existingQuery.docs[0].data();
      const newQuantity = existingData.quantity + quantity;

      await docRef.update({ quantity: newQuantity });
    } else {
      // Add new cart item
      const newItemRef = db.cartItems.doc(); // auto-generated ID
      const newItem: CartItemDB = {
        cartId,
        productId,
        quantity,
      };
      await newItemRef.set(newItem);
    }
  }

  public async getCartItems(): Promise<CartItemDB[]> {
    const snapshot = await this.getDB().cartItems.get();
    return snapshot.docs.map((doc) => doc.data());
  }
}
