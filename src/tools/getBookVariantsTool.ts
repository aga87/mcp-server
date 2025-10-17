import { z } from "zod";
import { type ToolDef } from "../lib";
import { bookstoreRepository } from "../startup/services";

// Optional input schema: allows filtering by bookId
const shape = {
  bookId: z.string().optional(),
} as const;

export const getBookVariantsTool: ToolDef<typeof shape> = {
  name: "getBookVariantsTool",
  title: "Get Book Variants Tool",
  description:
    "Returns all book variants in the bookstore, optionally filtered by bookId",
  schema: shape,
  handler: async (args: z.infer<z.ZodObject<typeof shape>>) => {
    try {
      const variants = await bookstoreRepository.getBookVariants(args.bookId);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(variants, null, 2),
          },
        ],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Failed to fetch book variants: ${
              err?.message ?? String(err)
            }`,
          },
        ],
      };
    }
  },
};
