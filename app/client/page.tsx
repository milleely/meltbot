"use client";

import { useState } from "react";
import LockScreen from "@/app/components/LockScreen";
import ChatInterface from "@/app/components/ChatInterface";

export default function ClientPage() {
  const [view, setView] = useState<"lock" | "chat">("lock");

  if (view === "chat") {
    return <ChatInterface />;
  }

  return <LockScreen onResolveNow={() => setView("chat")} />;
}
