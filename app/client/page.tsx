"use client";

import { useState } from "react";
import LockScreen from "@/app/components/LockScreen";
import ChatInterface from "@/app/components/ChatInterface";
import CaseStatus from "@/app/components/CaseStatus";
import DeviceFrame from "@/app/components/DeviceFrame";

export default function ClientPage() {
  const [view, setView] = useState<"lock" | "chat" | "status">("lock");
  const [caseSummary, setCaseSummary] = useState<Record<string, unknown> | null>(null);

  return (
    <DeviceFrame>
      {view === "status" && caseSummary ? (
        <CaseStatus caseSummary={caseSummary} />
      ) : view === "chat" ? (
        <ChatInterface
          onCaseSummary={setCaseSummary}
          onComplete={() => setView("status")}
        />
      ) : (
        <LockScreen onResolveNow={() => setView("chat")} />
      )}
    </DeviceFrame>
  );
}
