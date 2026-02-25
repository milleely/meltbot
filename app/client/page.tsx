"use client";

import { useState } from "react";
import LockScreen from "@/app/components/LockScreen";
import ChatInterface from "@/app/components/ChatInterface";
import DeviceFrame from "@/app/components/DeviceFrame";

export default function ClientPage() {
  const [view, setView] = useState<"lock" | "chat">("lock");
  const [caseSummary, setCaseSummary] = useState<Record<string, unknown> | null>(null);

  return (
    <DeviceFrame>
      {view === "chat" ? (
        <ChatInterface onCaseSummary={setCaseSummary} />
      ) : (
        <LockScreen onResolveNow={() => setView("chat")} />
      )}
    </DeviceFrame>
  );
}
