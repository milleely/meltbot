interface ProgressBarProps {
  step: number; // 0–4
}

const STEPS = ["Photo ID", "Email", "Account", "Confirm"];

export default function ProgressBar({ step }: ProgressBarProps) {
  return (
    <div className="px-4 py-2 flex items-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`h-1 w-full rounded-full transition-colors ${
              i < step ? "bg-melt-success" : "bg-melt-border"
            }`}
          />
          <span
            className={`text-[10px] transition-colors ${
              i < step ? "text-melt-success" : "text-melt-muted"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
