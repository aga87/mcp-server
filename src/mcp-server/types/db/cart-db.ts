// import { Timestamp } from "firebase-admin/firestore";

type CartBase = {
  status: "active" | "converted" | "abandoned";

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

export type CartDB =
  | (CartBase & {
      userId: string;
      anonymousId: null;
    })
  | (CartBase & {
      userId: null;
      anonymousId: string;
    });
