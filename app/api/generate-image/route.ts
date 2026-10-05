import { NextRequest, NextResponse } from "next/server";
import { validatePrompt, validateApiKey } from "@/lib/validation";
import { getRateLimitKey, checkRateLimit } from "@/lib/rate-limit";

type ImageSize = "1024x1024" | "1024x1792" | "1792x1024";

const GPT_IMAGE_SIZES: Record<ImageSize, string> = {
  "1024x1024": "1024x1024",
  "1024x1792": "1024x1536",
  "1792x1024": "1536x1024",
};

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
    const { prompt, size = "1024x1024" } = body;

    // Validate input
    if (!validatePrompt(prompt)) {
      return NextResponse.json(
        { error: "Prompt must be between 3 and 2000 characters" },
        { status: 400 }
      );
    }

    // Validate API key
    if (!validateApiKey(process.env.OPENAI_API_KEY)) {
      console.error("Invalid or missing OpenAI API key");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const validSizes: ImageSize[] = ["1024x1024", "1024x1792", "1792x1024"];
    const imageSize: ImageSize = validSizes.includes(size) ? size : "1024x1024";

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        n: 1,
        size: GPT_IMAGE_SIZES[imageSize],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || "Failed to generate image");
    }

    const b64 = data.data?.[0]?.b64_json;
    const imageUrl = b64 ? `data:image/png;base64,${b64}` : data.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image returned from OpenAI");
    }

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to generate image" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
