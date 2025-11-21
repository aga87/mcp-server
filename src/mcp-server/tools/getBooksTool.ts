import { z } from "zod";
import { type ToolDef } from "../lib";
import { bookstoreRepository } from "../startup/services"; // ⬅️ make sure this is exported from your service setup

// No inputs needed
const shape = {} as const;

export const getBooksTool: ToolDef<typeof shape> = {
  name: "getBooksTool",
  title: "Get Books Tool",
  description: "Returns all books in the bookstore, including author details",
  schema: shape,
  handler: async (_args: z.infer<z.ZodObject<typeof shape>>) => {
    try {
      const books = await bookstoreRepository.getBooksWithAuthors();
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(books, null, 2),
          },
        ],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Failed to fetch bookstore books: ${
              err?.message ?? String(err)
            }`,
          },
        ],
      };
    }
  },
};
