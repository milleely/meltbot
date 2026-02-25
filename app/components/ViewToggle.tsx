"use client";

interface ViewToggleProps {
  active: "client" | "analyst";
  onToggle: (view: "client" | "analyst") => void;
}

export default function ViewToggle({ active, onToggle }: ViewToggleProps) {
  return (
    <div className="flex justify-center gap-8 pb-4">
      {(["client", "analyst"] as const).map((view) => (
        <button
          key={view}
          onClick={() => onToggle(view)}
          className={`text-sm pb-1 transition-colors border-b-2 ${
            active === view
              ? "text-melt-accent border-melt-accent"
              : "text-melt-muted border-transparent hover:text-melt-text"
          }`}
        >
          {view === "client" ? "Client" : "Analyst"}
        </button>
      ))}
    </div>
  );
}
