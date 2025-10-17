import { Timestamp } from "firebase-admin/firestore";

export type CartItemDB = {
  productId: string;
  cartId: string;
  quantity: number;
  // createdAt: Timestamp;
  // updatedAt: Timestamp | null;
};
