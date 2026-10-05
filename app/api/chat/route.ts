import { NextRequest, NextResponse } from "next/server";
import { getAfricaContext } from "@/lib/afrisca-knowledge";
import { validatePrompt, validateApiKey } from "@/lib/validation";
import { getRateLimitKey, checkRateLimit } from "@/lib/rate-limit";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const key = getRateLimitKey(request);
    const rateLimit = checkRateLimit(key);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    // Validate input
    if (!validatePrompt(message)) {
      return NextResponse.json(
        { error: "Message must be between 3 and 2000 characters" },
        { status: 400 }
      );
    }

    // Validate API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!validateApiKey(apiKey)) {
      console.error("Invalid or missing OpenAI API key");
      return NextResponse.json(
        { error: "Server configuration error: Invalid API key" },
        { status: 500 }
      );
    }

    // Convert conversation history to OpenAI format
    const messages: any[] = [
      {
        role: "system",
        content: getAfricaContext(),
      },
      ...conversationHistory.map((msg: Message) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    // Call OpenAI API directly
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `OpenAI API error: ${openaiResponse.status}`;

      console.error("OpenAI API Error:", errorMessage);

      if (openaiResponse.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key. Please check your OpenAI API key." },
          { status: 401 }
        );
      }
      if (openaiResponse.status === 429) {
        return NextResponse.json(
          { error: "OpenAI rate limit exceeded. Please try again in a moment." },
          { status: 429 }
        );
      }
      if (openaiResponse.status === 500) {
        return NextResponse.json(
          { error: "OpenAI service error. Please try again later." },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: openaiResponse.status }
      );
    }

    const data = await openaiResponse.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    if (error instanceof Error) {
      const errorMessage = error.message || "Failed to process request";
      console.error("Error details:", {
        message: errorMessage,
        name: error.name,
      });

      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
