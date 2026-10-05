export function validateApiKey(apiKey: string | undefined): boolean {
  if (!apiKey) return false;
  if (apiKey.length < 20) return false;
  return true;
}

export function validatePrompt(prompt: string | undefined): boolean {
  if (!prompt) return false;
  const trimmed = prompt.trim();
  if (trimmed.length < 3) return false;
  if (trimmed.length > 2000) return false;
  return true;
}

export function validateBase64Image(image: string | undefined): boolean {
  if (!image) return false;
  if (!image.startsWith("data:image/")) return false;
  if (image.length > 20 * 1024 * 1024) return false; // Max 20MB
  return true;
}

export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose internal API errors to client
    if (error.message.includes("API")) {
      return "An error occurred while processing your request";
    }
    return error.message;
  }
  return "An unexpected error occurred";
}
