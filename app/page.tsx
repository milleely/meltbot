"use client";

import { useState } from "react";
import LockScreen from "@/app/components/LockScreen";
import ChatInterface from "@/app/components/ChatInterface";
import CaseStatus from "@/app/components/CaseStatus";
import AnalystDashboard from "@/app/components/AnalystDashboard";
import DeviceFrame from "@/app/components/DeviceFrame";
import ViewToggle from "@/app/components/ViewToggle";

export default function DemoPage() {
  const [demoView, setDemoView] = useState<"client" | "analyst">("client");
  const [clientView, setClientView] = useState<"lock" | "chat" | "status">("lock");
  const [caseSummary, setCaseSummary] = useState<Record<string, unknown> | null>(null);
  const [analystDecision, setAnalystDecision] = useState<"approved" | "escalated" | null>(null);

  return (
    <div className="min-h-dvh bg-melt-bg flex flex-col items-center justify-center py-6">
      <ViewToggle active={demoView} onToggle={setDemoView} />
      {demoView === "analyst" ? (
        <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.3)]">
          <AnalystDashboard caseSummary={caseSummary} onDecision={setAnalystDecision} />
        </div>
      ) : (
        <DeviceFrame>
          {clientView === "status" && caseSummary ? (
            <CaseStatus caseSummary={caseSummary} analystDecision={analystDecision} />
          ) : clientView === "chat" ? (
            <ChatInterface
              onCaseSummary={setCaseSummary}
              onComplete={() => setClientView("status")}
            />
          ) : (
            <LockScreen onResolveNow={() => setClientView("chat")} />
          )}
        </DeviceFrame>
      )}
    </div>
  );
}
