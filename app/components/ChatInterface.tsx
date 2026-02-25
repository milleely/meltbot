"use client";

import { useState, useRef, useEffect } from "react";
import ProgressBar from "@/app/components/ProgressBar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  onCaseSummary?: (summary: Record<string, unknown>) => void;
  onComplete?: () => void;
}

export default function ChatInterface({ onCaseSummary, onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
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
      let displayText = data.message;

      // Parse and extract [CASE_SUMMARY] if present
      const summaryIndex = data.message.indexOf("[CASE_SUMMARY]");
      if (summaryIndex !== -1) {
        displayText = data.message.slice(0, summaryIndex).trim();
        const jsonPart = data.message.slice(summaryIndex + "[CASE_SUMMARY]".length)
          .replace(/```json\s?/g, "")
          .replace(/```/g, "")
          .trim();
        try {
          const parsed = JSON.parse(jsonPart);
          onCaseSummary?.(parsed);
          if (onComplete) {
            setTimeout(onComplete, 2000);
          }
        } catch {
          // JSON parse failed — still hide the raw text from the client
        }
      }

      setMessages([
        ...currentMessages,
        { role: "assistant", content: displayText },
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

  // Derive pending action from the last message's tags
  const lastMsg = messages[messages.length - 1];
  const docMatch = lastMsg?.role === "assistant" && lastMsg.content.match(/\[REQUEST_DOCUMENT:(.+?)\]/);
  const confirmMatch = lastMsg?.role === "assistant" && lastMsg.content.match(/\[REQUEST_CONFIRM:(.+?)\]/);
  const pendingAction = docMatch
    ? { type: "document" as const, label: docMatch[1] }
    : confirmMatch
    ? { type: "confirm" as const, label: confirmMatch[1] }
    : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    if (step >= 1 && step < 4) {
      setStep((prev) => prev + 1);
    }

    fetchResponse(updatedMessages);
  }

  function handleAction() {
    if (!pendingAction || isLoading) return;
    if (step < 4) setStep((prev) => prev + 1);

    const content = pendingAction.type === "document"
      ? `[${pendingAction.label} attached: Driver's License]`
      : "I confirm and acknowledge.";
    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    fetchResponse(updatedMessages);
  }

  return (
    <div className="min-h-full flex flex-col bg-melt-bg">
      <div className="sticky top-0 z-10 bg-melt-bg">
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

        {/* Progress */}
        <ProgressBar step={step} />
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
              {msg.content.replace(/\[REQUEST_(?:DOCUMENT|CONFIRM):.+?\]/g, "").trim()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-md text-sm bg-melt-surface text-melt-muted">
              {messages.length === 0 ? (
                <span className="animate-pulse">MeltBot is reading your case...</span>
              ) : (
                <span className="inline-flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce [animation-delay:0.15s]">.</span>
                  <span className="animate-bounce [animation-delay:0.3s]">.</span>
                </span>
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Contextual action button */}
      {pendingAction && !isLoading && (
        <div className="px-4 pt-2">
          <button
            onClick={handleAction}
            className="w-full py-2.5 rounded-xl text-xs font-medium border border-melt-border text-melt-muted hover:text-melt-text hover:border-melt-accent/50 transition-colors"
          >
            {pendingAction.type === "document"
              ? `Attach ${pendingAction.label}`
              : "Confirm"}
          </button>
        </div>
      )}

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
