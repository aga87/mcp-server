import { z } from "zod";
import { type ToolDef } from "../lib";

const shape = {
  a: z.number(),
  b: z.number(),
};

export const additionTool: ToolDef<typeof shape> = {
  name: "addition",
  title: "Addition Tool",
  description: "Add two numbers",
  schema: shape,
  handler: async ({ a, b }: z.infer<z.ZodObject<typeof shape>>) => ({
    content: [{ type: "text" as const, text: String(a + b) }],
  }),
};
