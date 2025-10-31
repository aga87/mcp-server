import { z } from "zod";
import { type ToolDef } from "../lib";
import { cartRepository } from "../startup/services";

// No inputs needed
const shape = {} as const;

export const getCartItemsTool: ToolDef<typeof shape> = {
  name: "getCartItemsTool",
  title: "Get Cart Items Tool",
  description:
    "Returns the current items, quantities, and prices in the shopping cart",
  schema: shape,
  handler: async (_args: z.infer<z.ZodObject<typeof shape>>) => {
    try {
      const items = await cartRepository.getCartItems();
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(items, null, 2),
          },
        ],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Failed to fetch cart items: ${err?.message ?? String(err)}`,
          },
        ],
      };
    }
  },
};
