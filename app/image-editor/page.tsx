"use client";

import { useState, useRef } from "react";

interface EditedImage {
  id: string;
  url: string;
  prompt: string;
}

const EDIT_PRESETS = [
  {
    category: "Background",
    options: [
      { label: "Clean White Background", prompt: "Change the background to clean white, keep the main product/subject intact and sharp" },
      { label: "Professional Studio", prompt: "Change to professional studio background with soft lighting and neutral tones, enhance the product" },
      { label: "Transparent Background", prompt: "Remove the background and make it transparent, keep the product sharp and detailed" },
      { label: "Gradient Background", prompt: "Add a subtle gradient background, keep the main subject prominent and clear" },
    ],
  },
  {
    category: "Colors & Style",
    options: [
      { label: "Change Colors", prompt: "Adjust and enhance the colors for a more vibrant and appealing look, keep the product recognizable" },
      { label: "Warmer Tones", prompt: "Adjust lighting and colors to warmer tones, make the product more inviting" },
      { label: "Professional Look", prompt: "Enhance professional appearance with better lighting and color grading" },
      { label: "Increase Contrast", prompt: "Increase contrast and saturation to make the product stand out more" },
    ],
  },
  {
    category: "Product Enhancement",
    options: [
      { label: "Add Reflections", prompt: "Add subtle reflections and shadows to enhance the product's dimension and appeal" },
      { label: "Improve Lighting", prompt: "Improve lighting to highlight the product features, professional product photography style" },
      { label: "Add Lifestyle Element", prompt: "Add subtle lifestyle context around the product while keeping it as the main focus" },
      { label: "Show Details", prompt: "Enhance and clearly show product details and textures" },
    ],
  },
  {
    category: "Special Effects",
    options: [
      { label: "Add Glow Effect", prompt: "Add a subtle glow or highlight effect to make the product more eye-catching" },
      { label: "Remove Element", prompt: "Remove any unwanted background elements while preserving the main product" },
      { label: "Add Shadow/Depth", prompt: "Add depth with shadow effects to make the product appear more three-dimensional" },
      { label: "Clean & Polish", prompt: "Clean up any imperfections and polish the image for a professional e-commerce look" },
    ],
  },
];

export default function ImageEditorPage() {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [editPrompt, setEditPrompt] = useState("");
  const [editedImages, setEditedImages] = useState<EditedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleEditImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImage || !editPrompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/edit-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: uploadedImage,
          prompt: editPrompt
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit image");
      }

      const data = await response.json();
      const newImage: EditedImage = {
        id: Date.now().toString(),
        url: data.url,
        prompt: editPrompt,
      };

      setEditedImages((prev) => [newImage, ...prev]);
      setEditPrompt("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetPrompt: string) => {
    setEditPrompt(presetPrompt);
  };

  const downloadImage = (url: string, prompt: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `afrisca-edited-${prompt.substring(0, 20).replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-wrap">
      <div className="page-inner">
        <div>
          <h1 className="page-title">Edit Images</h1>
          <p className="page-subtitle">Upload a photo and describe how to transform it</p>
        </div>

        <div className="panel">
          <label className="field-label">Upload an image to edit</label>
          <div onClick={() => fileInputRef.current?.click()} className="dropzone">
            {uploadedImage ? (
              <>
                <p className="font-semibold text-gray-800">Image uploaded</p>
                <p className="text-xs mt-1">Click to change</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-gray-800">Click to upload an image</p>
                <p className="text-xs mt-1">PNG or JPG, up to 10MB</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {uploadedImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="panel">
              <label className="field-label">Original image</label>
              <img src={uploadedImage} alt="Uploaded" className="w-full rounded-lg object-contain bg-gray-50" />
            </div>

            <form onSubmit={handleEditImage} className="panel">
              <div>
                <label className="field-label">Describe how to edit the image</label>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="E.g., Change the background to white, enhance the product colors..."
                  disabled={loading}
                  className="field"
                  rows={4}
                />
              </div>

              <div>
                <label className="field-label">Quick edit options</label>
                <div className="chip-grid">
                  {EDIT_PRESETS.map((category) => (
                    <button
                      key={category.category}
                      type="button"
                      onClick={() =>
                        setSelectedCategory(selectedCategory === category.category ? null : category.category)
                      }
                      className={`chip ${selectedCategory === category.category ? "chip-active" : ""}`}
                    >
                      {category.category}
                    </button>
                  ))}
                </div>
                {selectedCategory && (
                  <div className="chip-grid mt-3">
                    {EDIT_PRESETS.find((c) => c.category === selectedCategory)?.options.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => applyPreset(option.prompt)}
                        className="chip"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !editPrompt.trim()}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Editing... (up to a minute)" : "Edit Image"}
              </button>

              {error && <div className="error-box">{error}</div>}
            </form>
          </div>
        )}

        {editedImages.length > 0 && (
          <div>
            <h2 className="section-title">Edited images</h2>
            <div className="result-grid">
              {editedImages.map((img) => (
                <div key={img.id} className="result-card">
                  <img src={img.url} alt={img.prompt} />
                  <div className="result-card-body">
                    <p className="text-sm text-gray-600 line-clamp-3">{img.prompt}</p>
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
