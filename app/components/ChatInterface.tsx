"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const greetingFired = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Trigger initial greeting on mount
  useEffect(() => {
    if (!greetingFired.current) {
      greetingFired.current = true;
      fetchResponse([]);
    }
  }, []);

  async function fetchResponse(currentMessages: Message[]) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: currentMessages }),
      });
      const data = await res.json();
      setMessages([
        ...currentMessages,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages([
        ...currentMessages,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    fetchResponse(updatedMessages);
  }

  return (
    <div className="min-h-dvh flex flex-col bg-melt-bg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-melt-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-melt-accent text-melt-bg">
          M
        </div>
        <div>
          <p className="text-sm font-medium text-melt-text">MeltBot</p>
          <p className="text-xs text-melt-success">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-melt-accent text-melt-bg rounded-2xl rounded-br-md"
                  : "bg-melt-surface text-melt-text rounded-2xl rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-md text-sm bg-melt-surface text-melt-muted">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:0.15s]">.</span>
                <span className="animate-bounce [animation-delay:0.3s]">.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t border-melt-border flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none bg-melt-surface text-melt-text border border-melt-border placeholder:text-melt-muted focus:border-melt-accent/50 transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-3 rounded-xl text-sm font-medium bg-melt-accent text-melt-bg transition-opacity disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
