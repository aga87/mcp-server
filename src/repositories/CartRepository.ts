import { type CartItemDB } from "../types";

export class CartRepository {
  async getCartItems(): Promise<CartItemDB[]> {
    return [
      { id: "sku-123", name: "T-shirt", price: 20, quantity: 2 },
      { id: "sku-456", name: "Sneakers", price: 60, quantity: 1 },
    ];
  }
}
