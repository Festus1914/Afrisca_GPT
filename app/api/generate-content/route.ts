import { NextRequest, NextResponse } from "next/server";
import { getAfricaContext } from "@/lib/afrisca-knowledge";

type ContentType = "instagram" | "ad-copy" | "product-description" | "whatsapp" | "voiceover";

const CONTENT_PROMPTS: Record<ContentType, string> = {
  instagram: `Create an engaging Instagram caption for the following product/brand details.
Include relevant emojis, hashtags, and a call-to-action. Keep it authentic to Afrisca's brand voice.
Make it visually appealing for Instagram and encourage engagement.`,

  "ad-copy": `Write compelling ad copy for the following product/campaign.
The copy should be attention-grabbing, benefit-focused, and persuasive.
It should highlight unique selling points and create urgency.
Keep Afrisca's premium positioning and African heritage in mind.`,

  "product-description": `Write a detailed and compelling product description for the following item.
Include key features, materials, benefits, and use cases.
Make it appealing to both local and international customers.
Highlight the African craftsmanship and quality aspects.`,

  whatsapp: `Write a friendly and engaging WhatsApp message for the following customer segment/promotion.
Keep it concise, personal, and conversational.
Include a clear call-to-action.
Avoid being overly salesy - focus on building relationships.`,

  voiceover: `Write a professional voiceover script for a product video or advertisement.
The script should be engaging, clear, and suitable for narration.
Include natural pauses and pacing cues where appropriate.
Highlight the product benefits and Afrisca's brand values.`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, input } = body;

    if (!type || !input) {
      return NextResponse.json(
        { error: "Type and input are required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const prompt = CONTENT_PROMPTS[type as ContentType];
    if (!prompt) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: getAfricaContext(),
          },
          {
            role: "user",
            content: `${prompt}\n\nDetails: ${input}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || "Failed to generate content");
    }

    const content = data.choices?.[0]?.message?.content || "Unable to generate content.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to generate content" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
