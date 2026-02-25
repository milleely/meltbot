"use client";

import { useRef, useState } from "react";

interface CaseStatusProps {
  caseSummary: Record<string, unknown>;
  analystDecision?: "approved" | "escalated" | null;
}

function getTimeline(decision: "approved" | "escalated" | null | undefined) {
  if (decision === "approved") {
    return [
      { label: "Information collected", done: true },
      { label: "Under analyst review", done: true },
      { label: "Unfreeze approved", done: true },
      { label: "Account unfrozen", done: true },
    ];
  }
  if (decision === "escalated") {
    return [
      { label: "Information collected", done: true },
      { label: "Under analyst review", done: true },
      { label: "Case escalated", done: true },
    ];
  }
  return [
    { label: "Information collected", done: true },
    { label: "Under analyst review", current: true },
    { label: "Decision made" },
    { label: "Account unfrozen" },
  ];
}

function generateCaseId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "MB-";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export default function CaseStatus({ caseSummary, analystDecision }: CaseStatusProps) {
  const caseId = useRef(generateCaseId());
  const [rating, setRating] = useState<number | null>(null);
  const clientName = (caseSummary.client_name as string) || "Client";
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeline = getTimeline(analystDecision);

  return (
    <div className="min-h-full flex flex-col px-6 py-10 bg-melt-bg">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <p className="text-xs text-melt-muted">Case {caseId.current}</p>
        <h1 className="text-xl font-semibold text-melt-text">
          Thanks, {clientName}
        </h1>
        <span
          className={`inline-block text-xs px-3 py-1 rounded-full ${
            analystDecision === "approved"
              ? "bg-melt-success/15 text-melt-success"
              : analystDecision === "escalated"
              ? "bg-melt-danger/15 text-melt-danger"
              : "bg-melt-accent/15 text-melt-accent"
          }`}
        >
          {analystDecision === "approved"
            ? "Resolved"
            : analystDecision === "escalated"
            ? "Escalated"
            : "Under Review"}
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-0 mb-8">
        {timeline.map((step, i) => (
          <div key={step.label} className="flex items-start gap-3">
            {/* Indicator column */}
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step.done
                    ? "bg-melt-success text-white"
                    : step.current
                    ? "bg-melt-accent/20 text-melt-accent"
                    : "bg-melt-surface text-melt-muted"
                }`}
              >
                {step.done ? (
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor">
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                  </svg>
                ) : step.current ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {i < timeline.length - 1 && (
                <div className={`w-px h-8 ${step.done ? "bg-melt-success/40" : "bg-melt-border"}`} />
              )}
            </div>
            {/* Label */}
            <p
              className={`text-sm pt-0.5 ${
                step.done
                  ? "text-melt-success"
                  : step.current
                  ? "text-melt-text"
                  : "text-melt-muted"
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>

      {/* Decision message */}
      {analystDecision === "approved" && (
        <>
          <div className="text-center mb-4 px-4 py-4 rounded-xl bg-melt-success/10 border border-melt-success/20">
            <p className="text-sm text-melt-success font-medium">
              Your account has been unfrozen
            </p>
            <p className="text-xs text-melt-muted mt-1">
              You can now log back into your account.
            </p>
          </div>
          <div className="text-center mb-6">
            {rating !== null ? (
              <p className="text-xs text-melt-success">Thanks for your feedback!</p>
            ) : (
              <>
                <p className="text-xs text-melt-muted mb-2">How was your experience?</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-2xl text-melt-muted hover:text-melt-accent transition-colors"
                    >
                      &#9733;
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
      {analystDecision === "escalated" && (
        <div className="text-center mb-6 px-4 py-4 rounded-xl bg-melt-accent/10 border border-melt-accent/20">
          <p className="text-sm text-melt-accent font-medium">
            Your case has been escalated
          </p>
          <p className="text-xs text-melt-muted mt-1">
            A senior analyst will review your case and get back to you within 5-7 business days.
          </p>
        </div>
      )}

      {/* Details */}
      <div className="space-y-3 text-center mt-auto">
        <p className="text-xs text-melt-muted">
          Submitted {today}
        </p>
        <p className="text-xs text-melt-muted">
          {analystDecision === "approved"
            ? "Resolved today"
            : analystDecision === "escalated"
            ? "Estimated resolution: 5-7 business days"
            : "Estimated resolution: 24-48 hours"}
        </p>
        {!analystDecision && (
          <button className="text-xs text-melt-accent hover:text-melt-accent-hover transition-colors">
            Need help?
          </button>
        )}
      </div>
    </div>
  );
}
