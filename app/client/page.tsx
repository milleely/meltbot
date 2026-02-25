"use client";

import { useState } from "react";
import LockScreen from "@/app/components/LockScreen";
import ChatInterface from "@/app/components/ChatInterface";
import DeviceFrame from "@/app/components/DeviceFrame";

export default function ClientPage() {
  const [view, setView] = useState<"lock" | "chat">("lock");

  return (
    <DeviceFrame>
      {view === "chat" ? (
        <ChatInterface />
      ) : (
        <LockScreen onResolveNow={() => setView("chat")} />
      )}
    </DeviceFrame>
  );
}
