"use client";

import { useState } from "react";

interface GeneratedContent {
  id: string;
  type: string;
  input: string;
  output: string;
}

type ContentType = "instagram" | "ad-copy" | "product-description" | "whatsapp" | "voiceover";

const CONTENT_TYPES: { value: ContentType; label: string; description: string }[] = [
  {
    value: "instagram",
    label: "Instagram Captions",
    description: "Create engaging Instagram captions for your products",
  },
  {
    value: "ad-copy",
    label: "Ad Copy",
    description: "Write compelling ad copy for marketing campaigns",
  },
  {
    value: "product-description",
    label: "Product Descriptions",
    description: "Generate detailed and appealing product descriptions",
  },
  {
    value: "whatsapp",
    label: "WhatsApp Messages",
    description: "Craft personalized WhatsApp marketing messages",
  },
  {
    value: "voiceover",
    label: "Voiceover Scripts",
    description: "Write scripts for product voiceovers and videos",
  },
];

export default function WritingToolsPage() {
  const [selectedType, setSelectedType] = useState<ContentType>("instagram");
  const [input, setInput] = useState("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentType = CONTENT_TYPES.find((t) => t.value === selectedType)!;

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          input,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content");
      }

      const data = await response.json();
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        type: selectedType,
        input,
        output: data.content,
      };

      setGeneratedContent((prev) => [newContent, ...prev]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="page-wrap">
      <div className="page-inner">
        <div>
          <h1 className="page-title">Writing Tools</h1>
          <p className="page-subtitle">Generate marketing copy in Afrisca&apos;s brand voice</p>
        </div>

        <div className="chip-grid">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`chip ${selectedType === type.value ? "chip-active" : ""}`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleGenerateContent} className="panel">
          <div>
            <label className="field-label">
              {selectedType === "instagram" && "Product or brand details"}
              {selectedType === "ad-copy" && "What are you advertising?"}
              {selectedType === "product-description" && "Describe your product"}
              {selectedType === "whatsapp" && "Customer segment or promotion details"}
              {selectedType === "voiceover" && "Product or service details"}
            </label>
            <p className="text-sm text-gray-500 mb-3">{currentType.description}</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedType === "instagram"
                  ? "E.g., Premium handmade leather bags, eco-friendly, available in 5 colors"
                  : selectedType === "ad-copy"
                  ? "E.g., Summer collection of dresses, 30% off, limited time"
                  : selectedType === "product-description"
                  ? "E.g., Blue cotton shirt, breathable, perfect for summer"
                  : selectedType === "whatsapp"
                  ? "E.g., First-time customers, new product launch"
                  : "E.g., Our new skincare line, natural ingredients, luxury packaging"
              }
              disabled={loading}
              className="field"
              rows={5}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Content"}
          </button>

          {error && <div className="error-box">{error}</div>}
        </form>

        {generatedContent.length > 0 && (
          <div>
            <h2 className="section-title">Generated content</h2>
            <div className="flex flex-col gap-4">
              {generatedContent.map((content) => (
                <div key={content.id} className="panel">
                  <div>
                    <p className="font-semibold text-[#10a37f] text-sm">
                      {CONTENT_TYPES.find((t) => t.value === content.type)?.label}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">Input: {content.input}</p>
                  </div>
                  <p className="result-text">{content.output}</p>
                  <button onClick={() => copyToClipboard(content.output)} className="btn-secondary">
                    Copy to clipboard
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
