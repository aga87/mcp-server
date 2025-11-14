import { McpClientService } from "./McpClientService";
import { OpenAiApiService } from "./OpenAiService";

export interface Tool {
  tool: string;
  args: Record<string, unknown>;
}

export class BookstoreAgent {
  private mcpClient: McpClientService;
  private llm: OpenAiApiService;
  private toolsPromptCache?: string;

  constructor(mcpClient: McpClientService, llm: OpenAiApiService) {
    this.mcpClient = mcpClient;
    this.llm = llm;
  }

  public async handleCustomerQuery(query: string): Promise<string> {
    const tool = await this.decideTool(query);

    const toolResult = await this.executeTool(tool);

    return await this.generateFinalAnswer(query, tool, toolResult);
  }

  private async generateFinalAnswer(
    query: string,
    tool: Tool,
    toolResult: unknown
  ): Promise<string> {
    const systemPrompt = `
You are a helpful assistant for an online bookstore.

You will receive:
- the customer's question,
- information about which internal tool was used (if any),
- and the tool result (if any).

Use this information to answer the customer in a friendly, concise way.
If the tool result is empty or does not contain what they want, be honest about it.
`.trim();

    const userPrompt = `
Customer question:
${query}

Chosen tool and arguments:
${JSON.stringify(tool, null, 2)}

Tool result (may be null):
${JSON.stringify(toolResult, null, 2)}
`.trim();

    return this.llm.ask(systemPrompt, userPrompt);
  }

  private async executeTool(tool: Tool): Promise<unknown | null> {
    // If router decided no tool is needed
    if (tool.tool === "none") return null;

    // Otherwise, call MCP tool with the suggested args
    return this.mcpClient.callTool(tool.tool, tool.args);
  }

  private async decideTool(customerQuery: string): Promise<Tool> {
    // 1. Build or reuse the system prompt with dynamic tool list
    const systemPrompt = await this.buildToolSystemPrompt();

    // 2. User message for the router LLM
    const userPrompt = `
Customer question:
"${customerQuery}"

Remember: respond with ONLY valid JSON (no extra text).
`.trim();

    // 3. Ask the LLM which tool to use
    const raw = await this.llm.ask(systemPrompt, userPrompt);

    // 4. Try to parse the response as JSON and validate minimal shape
    try {
      const parsed = JSON.parse(raw);

      if (parsed && typeof parsed === "object") {
        const obj = parsed as { [key: string]: unknown };
        const tool = obj["tool"];
        const args = obj["args"];

        if (typeof tool === "string" && args && typeof args === "object") {
          return {
            tool,
            args: args as Record<string, unknown>,
          };
        }
      }
    } catch {
      // ignore parse errors and fall through to default
    }

    // 5. Fallback: no tool, answer directly
    return { tool: "none", args: {} };
  }

  private async buildToolSystemPrompt(): Promise<string> {
    if (!this.toolsPromptCache) {
      const toolList = await this.mcpClient.listTools();

      const toolDescriptions = toolList.tools
        .map((t) => {
          const schema = JSON.stringify(t.inputSchema, null, 2);
          return `
- ${t.name}
  Description: ${t.description}
  Args schema (JSON Schema):
${schema}
`;
        })
        .join("\n");

      this.toolsPromptCache = `
You are a routing assistant for the Bookstore Agent.
Your job is to decide which MCP tool to call based on the customer's message.

AVAILABLE TOOLS:
${toolDescriptions}

Also allowed:
- none: no tool is needed; respond directly.

RULES:
- Always choose exactly one "tool" (either a tool name from above or "none").
- The "args" object MUST follow the arg schema of the selected tool.
- Respond ONLY with JSON:

{
  "tool": "<tool name from above or 'none'>",
  "args": { ... }
}
`.trim();
    }

    return this.toolsPromptCache;
  }
}
