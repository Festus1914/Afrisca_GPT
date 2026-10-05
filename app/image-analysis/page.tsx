"use client";

import { useState, useRef } from "react";

interface Analysis {
  id: string;
  imageUrl: string;
  question: string;
  response: string;
}

export default function ImageAnalysisPage() {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
      setAnalyses([]);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImage || !question.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: uploadedImage,
          question,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const data = await response.json();
      const newAnalysis: Analysis = {
        id: Date.now().toString(),
        imageUrl: uploadedImage,
        question,
        response: data.analysis,
      };

      setAnalyses((prev) => [newAnalysis, ...prev]);
      setQuestion("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What's in this image? Describe everything you see.",
    "Analyze this product. What are its key features and qualities?",
    "What could be improved in this design or product presentation?",
    "Suggest how this product could be displayed or marketed better.",
    "What is the color scheme and style of this image?",
  ];

  return (
    <div className="page-wrap">
      <div className="page-inner">
        <div>
          <h1 className="page-title">Analyze Images</h1>
          <p className="page-subtitle">Upload an image and ask AI about it</p>
        </div>

        <div className="panel">
          <label className="field-label">Upload an image to analyze</label>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="panel lg:col-span-1">
              <label className="field-label">Uploaded image</label>
              <img src={uploadedImage} alt="Uploaded" className="w-full rounded-lg object-contain bg-gray-50" />
            </div>

            <form onSubmit={handleAnalyzeImage} className="panel lg:col-span-2">
              <div>
                <label className="field-label">Ask a question about the image</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="E.g., What product is this and what are its features?"
                  disabled={loading}
                  className="field"
                  rows={4}
                />
              </div>

              <div>
                <label className="field-label">Quick questions</label>
                <div className="flex flex-col gap-2">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuestion(q)}
                      className="chip text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Analyze Image"}
              </button>

              {error && <div className="error-box">{error}</div>}
            </form>
          </div>
        )}

        {analyses.length > 0 && (
          <div>
            <h2 className="section-title">Analysis results</h2>
            <div className="flex flex-col gap-4">
              {analyses.map((analysis) => (
                <div key={analysis.id} className="panel">
                  <p className="font-semibold text-[#10a37f]">Q: {analysis.question}</p>
                  <p className="result-text">{analysis.response}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
