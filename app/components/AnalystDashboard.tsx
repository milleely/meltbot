"use client";

import { useState } from "react";

interface AnalystDashboardProps {
  caseSummary: Record<string, unknown> | null;
}

export default function AnalystDashboard({ caseSummary }: AnalystDashboardProps) {
  const [decision, setDecision] = useState<"approved" | "escalated" | null>(null);

  if (!caseSummary) {
    return (
      <div className="min-h-full flex items-center justify-center bg-[#F5F3EF]">
        <div className="text-center space-y-2">
          <p className="text-sm text-[#6B6B6B]">No cases pending review</p>
          <p className="text-xs text-[#9B9B9B]">
            Complete the client flow to generate a case
          </p>
        </div>
      </div>
    );
  }

  const clientName = (caseSummary.client_name as string) || "Client";
  const flagReason = (caseSummary.flag_reason as string) || "Duplicate account detected";
  const recommendation = (caseSummary.recommended_action as string) || "Pending";
  const docs = (caseSummary.documents_collected as Array<Record<string, string>>) || [];
  const responses = (caseSummary.client_responses as Record<string, string>) || {};

  if (decision) {
    return (
      <div className="min-h-full flex items-center justify-center bg-[#F5F3EF]">
        <div className="text-center space-y-3 px-8">
          <div
            className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
              decision === "approved" ? "bg-[#4A9B6E]/15" : "bg-[#C9A96E]/15"
            }`}
          >
            {decision === "approved" ? (
              <svg viewBox="0 0 16 16" className="w-6 h-6 text-[#4A9B6E]" fill="currentColor">
                <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
              </svg>
            ) : (
              <span className="text-[#C9A96E] text-lg font-bold">!</span>
            )}
          </div>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">
            {decision === "approved" ? "Unfreeze Approved" : "Case Escalated"}
          </h2>
          <p className="text-xs text-[#6B6B6B]">
            {decision === "approved"
              ? `${clientName}'s account will be unfrozen and the duplicate closed.`
              : `Case forwarded to senior analyst for further review.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F5F3EF] px-5 py-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-base font-semibold text-[#1A1A1A]">Case Review</h1>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A96E]/15 text-[#C9A96E]">
          Ready for Review
        </span>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {/* Client Info */}
        <Section title="Client Info">
          <Row label="Name" value={clientName} />
          <Row label="Accounts" value="TFSA + Chequing" />
        </Section>

        {/* Flag Details */}
        <Section title="Flag Details">
          <p className="text-xs text-[#3A3A3A] leading-relaxed">{flagReason}</p>
        </Section>

        {/* Documents Collected */}
        <Section title="Documents Collected">
          {docs.length > 0 ? (
            docs.map((doc, i) => (
              <Row key={i} label={doc.type || "Document"} value={doc.document || "Provided"} />
            ))
          ) : (
            <p className="text-xs text-[#6B6B6B]">See client responses</p>
          )}
          {Object.entries(responses).map(([key, val]) => (
            <Row key={key} label={key.replace(/_/g, " ")} value={String(val)} />
          ))}
        </Section>

        {/* Recommendation */}
        <Section title="Agent Recommendation">
          <p className="text-xs text-[#3A3A3A] leading-relaxed">{recommendation}</p>
        </Section>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setDecision("approved")}
          className="flex-1 py-3 rounded-xl text-xs font-semibold bg-[#4A9B6E] text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          Approve Unfreeze
        </button>
        <button
          onClick={() => setDecision("escalated")}
          className="flex-1 py-3 rounded-xl text-xs font-semibold bg-[#C9A96E] text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          Escalate
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-3.5 border border-[#E5E2DC]">
      <p className="text-[10px] font-medium text-[#9B9B9B] uppercase tracking-wider mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-1">
      <span className="text-[11px] text-[#6B6B6B] capitalize">{label}</span>
      <span className="text-[11px] text-[#1A1A1A] text-right max-w-[60%]">{value}</span>
    </div>
  );
}
