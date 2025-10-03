import type {
  McpServer,
  ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export type ToolDef<S extends z.ZodRawShape> = {
  name: string;
  title: string;
  description: string;
  schema: S; // ZodRawShape (plain shape, not z.object)
  handler: ToolCallback<S>;
};

export function registerTool<S extends z.ZodRawShape>(
  server: McpServer,
  tool: ToolDef<S>
) {
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.schema,
    },
    tool.handler
  );
}
