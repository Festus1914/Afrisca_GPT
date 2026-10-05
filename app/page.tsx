"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: "assistant",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `Error: ${error instanceof Error ? error.message : "Failed to send message"}`,
        sender: "assistant",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "What products does Afrisca offer?",
    "Tell me about Afrisca",
    "How do I place an order?",
    "What about pricing?",
  ];

  return (
    <div className="chat-container">
      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">✨</div>
            <h1 className="chat-empty-title">Afrisca GPT</h1>
            <p className="chat-empty-subtitle">Your AI assistant for Afrisca</p>
            <div className="chat-suggestions">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="chat-suggestion-card"
                >
                  <p className="chat-suggestion-text">{q}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${msg.sender === "user" ? "chat-message-user" : ""}`}
              >
                <div className={`chat-message-avatar ${msg.sender === "user" ? "chat-message-avatar-user" : ""}`}>
                  {msg.sender === "user" ? "U" : "A"}
                </div>
                <div className="chat-message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message">
                <div className="chat-message-avatar">A</div>
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <form onSubmit={handleSendMessage} className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as any);
              }
            }}
            placeholder="Message Afrisca GPT..."
            disabled={loading}
            className="chat-input"
            rows={1}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="chat-send-button"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}
