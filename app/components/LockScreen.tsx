"use client";

interface LockScreenProps {
  onResolveNow: () => void;
}

export default function LockScreen({ onResolveNow }: LockScreenProps) {
  return (
    <div className="min-h-dvh flex flex-col justify-between px-6 py-12 bg-melt-bg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-melt-muted">Account</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-melt-danger/15 text-melt-danger">
          Restricted
        </span>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center text-center space-y-6 -mt-12">
        {/* Lock icon */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-melt-surface">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-melt-danger"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-melt-text">
          Your account has been frozen
        </h1>

        <p className="text-sm leading-relaxed max-w-[280px] text-melt-muted">
          We&apos;ve noticed something that needs your attention. To protect
          you, we&apos;ve temporarily restricted your account.
        </p>

        <p className="text-xs max-w-[260px] text-melt-muted/70">
          Your funds are safe. We just need to verify some information before
          restoring full access.
        </p>
      </div>

      {/* CTA */}
      <div className="space-y-4">
        <button
          onClick={onResolveNow}
          className="w-full py-4 rounded-xl text-sm font-semibold bg-melt-accent text-melt-bg transition-colors hover:bg-melt-accent-hover active:scale-[0.98] transform"
        >
          Resolve Now
        </button>
        <p className="text-center text-xs text-melt-muted">
          Or call support: 1-888-555-0123
        </p>
      </div>
    </div>
  );
}
