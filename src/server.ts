import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTool } from "./lib";
import { additionTool, cartItemsRetrievalTool } from "./tools";

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0",
});

registerTool(server, additionTool);

registerTool(server, cartItemsRetrievalTool);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();

(async () => {
  try {
    await server.connect(transport);
    console.log("[mcp] server started (stdio)");
  } catch (err) {
    console.error("[mcp] failed to start", err);
    process.exit(1);
  }
})();
