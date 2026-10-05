"use client";

import { useState } from "react";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  size: string;
}

type ImageSize = "1024x1024" | "1024x1792" | "1792x1024";

const IMAGE_SIZES: { label: string; value: ImageSize; desc: string }[] = [
  { label: "Square", value: "1024x1024", desc: "1:1" },
  { label: "Portrait", value: "1024x1792", desc: "2:3" },
  { label: "Landscape", value: "1792x1024", desc: "3:2" },
];

const PRODUCT_PRESETS = [
  {
    label: "Professional",
    template: "Professional product photography of {product} on clean white background, studio lighting, high quality, 4k",
  },
  {
    label: "Lifestyle",
    template: "Lifestyle photography of {product} being used in a natural setting, warm lighting, aspirational",
  },
  {
    label: "Minimalist",
    template: "Minimalist product photography of {product}, clean aesthetic, white background, minimal styling",
  },
  {
    label: "E-commerce",
    template: "Professional e-commerce product image of {product}, product centered, clear details, marketplace ready",
  },
];

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [imageSize, setImageSize] = useState<ImageSize>("1024x1024");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size: imageSize }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImages((prev) => [
        { id: Date.now().toString(), url: data.url, prompt, size: imageSize },
        ...prev,
      ]);
      setPrompt("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (url: string, prompt: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `afrisca-${prompt.substring(0, 20).replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-wrap">
      <div className="page-inner">
        <div>
          <h1 className="page-title">Generate Images</h1>
          <p className="page-subtitle">Create realistic product images with AI</p>
        </div>

        <form onSubmit={handleGenerateImage} className="panel">
          <div>
            <label className="field-label">Describe your image</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Premium handmade leather handbag with African patterns..."
              disabled={loading}
              className="field h-28"
            />
          </div>

          <div>
            <label className="field-label">Image size</label>
            <div className="chip-grid">
              {IMAGE_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setImageSize(size.value)}
                  className={`chip ${imageSize === size.value ? "chip-active" : ""}`}
                >
                  {size.label}
                  <small>{size.desc}</small>
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="link-btn"
            >
              {showPresets ? "Hide style presets" : "+ Use a style preset"}
            </button>

            {showPresets && (
              <div className="chip-grid mt-3">
                {PRODUCT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setPrompt(preset.template.replace("{product}", prompt.trim() || "product"));
                      setShowPresets(false);
                    }}
                    className="chip"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "Generating... (up to a minute)" : "Generate Image"}
          </button>

          {error && <div className="error-box">{error}</div>}
        </form>

        {images.length > 0 && (
          <div>
            <h2 className="section-title">Generated images</h2>
            <div className="result-grid">
              {images.map((img) => (
                <div key={img.id} className="result-card">
                  <img src={img.url} alt={img.prompt} />
                  <div className="result-card-body">
                    <p className="text-sm text-gray-600 line-clamp-2">{img.prompt}</p>
                    <button onClick={() => downloadImage(img.url, img.prompt)} className="btn-secondary">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
