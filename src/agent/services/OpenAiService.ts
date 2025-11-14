import OpenAI from "openai";

export class OpenAiApiService {
  private openai?: OpenAI;

  // Generic chat method: given a message, get a reply from the model.
  public async ask(systemPrompt: string, userPrompt: string): Promise<string> {
    const openai = this.getOpenAI();

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    return chat.choices[0].message?.content?.trim() || "";
  }

  // Test connection — quick way to confirm API access works
  public async testConnection(): Promise<string> {
    const openai = this.getOpenAI();

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4-turbo
      messages: [{ role: "user", content: "Say hello!" }],
    });

    return chat.choices[0].message?.content?.trim() || "";
  }

  private getOpenAI() {
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not set in environment variables.");
      }
      this.openai = new OpenAI({
        apiKey,
      });
    }

    return this.openai;
  }
}
