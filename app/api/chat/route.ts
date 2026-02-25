import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/app/lib/systemPrompt";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // If no messages yet, inject a minimal user message to trigger the greeting
    const claudeMessages =
      messages.length === 0
        ? [{ role: "user" as const, content: "Hello" }]
        : messages.map((msg: { role: string; content: string }) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: claudeMessages,
    });

    const textContent = response.content.find(
      (block) => block.type === "text"
    );
    const message = textContent
      ? textContent.text
      : "I'm having trouble responding right now.";

    return Response.json({ message });
  } catch (error) {
    console.error("Claude API error:", error);
    return Response.json(
      { error: "Failed to get response from MeltBot" },
      { status: 500 }
    );
  }
}
