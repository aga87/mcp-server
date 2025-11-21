import { z } from "zod";
import { type ToolDef } from "../lib";
import { cartRepository } from "../startup/services";

// No inputs needed
const shape = {} as const;

export const getCartCountTool: ToolDef<typeof shape> = {
  name: "getCartCountTool",
  title: "Get Cart Count Tool",
  description: "Returns the total count of items in the shopping cart",
  schema: shape,
  handler: async (_args: z.infer<z.ZodObject<typeof shape>>) => {
    try {
      // Retrieve the items from the cart
      const items = await cartRepository.getCartItems();

      // Calculate the total count of items (sum of quantities)
      const totalCount = items.reduce(
        (sum: number, item: { quantity: number }) => sum + (item.quantity || 0),
        0
      );

      return {
        content: [
          {
            type: "text" as const,
            text: String(totalCount),
          },
        ],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Failed to get cart count: ${err?.message ?? String(err)}`,
          },
        ],
      };
    }
  },
};
