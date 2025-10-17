import { z } from "zod";
import { type ToolDef } from "../lib";
import { cartRepository } from "../startup/services";

// ✅ A simple Zod *object shape*, not a union
const shape = {
  userId: z.string().nullable().optional(),
  anonymousId: z.string().nullable().optional(),
  productId: z.string().min(1, "productId is required"),
  quantity: z.number().int().positive().default(1),
} as const;

export const addProductToCartTool: ToolDef<typeof shape> = {
  name: "addProductToCartTool",
  title: "Add Product to Cart Tool",
  description:
    "Adds a product to a user's or guest's cart. Automatically creates a cart if one doesn't exist.",
  schema: shape,
  handler: async (args: z.infer<z.ZodObject<typeof shape>>) => {
    try {
      // Validate identity logic at runtime (since union not allowed in ToolDef)
      if (!args.userId && !args.anonymousId) {
        throw new Error("Either userId or anonymousId must be provided.");
      }
      if (args.userId && args.anonymousId) {
        throw new Error("Provide either userId or anonymousId, not both.");
      }

      // Create or find a cart
      const cartId = await cartRepository.getOrCreateCartId({
        userId: args.userId ?? undefined,
        anonymousId: args.anonymousId ?? undefined,
      } as any);

      // Add product
      await cartRepository.addToCart(cartId, args.productId, args.quantity);

      return {
        content: [
          {
            type: "text" as const,
            text: `Added ${args.quantity} × '${args.productId}' to cart ${cartId}`,
          },
        ],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Failed to add product to cart: ${
              err?.message ?? String(err)
            }`,
          },
        ],
      };
    }
  },
};
