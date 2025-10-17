// import { Timestamp } from "firebase-admin/firestore";

export type CartDB = {
  status: "active" | "converted" | "abandoned";
  userId: string | null; // null for guest carts
  anonymousId: string | null; // session id for guests
  // createdAt: Timestamp;
  // updatedAt: Timestamp | null;
  // expiresAt: Timestamp | null; // for cleanup/abandoned logic

  // TODO: Consider having totals and itemsCount on the cart as a cache for performance.
  //   totals: {
  //     itemsSubtotal: number;
  //     discountsTotal: number;
  //     taxTotal: number;
  //     shippingTotal: number;
  //     grandTotal: number;
  //   currency: "EUR";
  //   };
  //   itemsCount: number; // denormalized sum of quantities

  // coupon: { code: string; discountId?: string } | null;
};
