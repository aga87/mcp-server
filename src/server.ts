import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTool } from "./lib";
import { additionTool } from "./tools";

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0",
});

registerTool(server, additionTool);

// Add a dynamic greeting resource
server.registerResource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  {
    title: "Greeting Resource", // Display name for UI
    description: "Dynamic greeting generator",
  },
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  })
);

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
