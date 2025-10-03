import { z } from "zod";

const schema = z.object({
  a: z.number(),
  b: z.number(),
});

export const additionTool = {
  name: "addition",
  schema: schema.shape,
  handler: async ({ a, b }: z.infer<typeof schema>) => ({
    content: [{ type: "text" as const, text: String(a + b) }],
  }),
};
