import {
  BookstoreAgent,
  McpClientService,
  OpenAiApiService,
} from "../services";

export const openAiApiService = new OpenAiApiService();
export const mcpClientService = new McpClientService();
export const bookstoreAgent = new BookstoreAgent(
  mcpClientService,
  openAiApiService
);
