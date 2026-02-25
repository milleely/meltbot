"use client";

interface LockScreenProps {
  onResolveNow: () => void;
}

export default function LockScreen({ onResolveNow }: LockScreenProps) {
  return (
    <div className="min-h-full flex flex-col justify-between px-6 py-12 bg-melt-bg">
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
            viewBox="0 0 48 48"
            className="w-12 h-12"
            fill="none"
          >
            <defs>
              <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E05A4F" />
                <stop offset="100%" stopColor="#A83228" />
              </linearGradient>
              <linearGradient id="shackleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E8685D" />
                <stop offset="100%" stopColor="#B8382E" />
              </linearGradient>
              <filter id="lockShadow" x="-10%" y="-10%" width="130%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
              </filter>
            </defs>
            <g filter="url(#lockShadow)">
              {/* Shackle */}
              <path
                d="M16 20V15C16 10.58 19.58 7 24 7C28.42 7 32 10.58 32 15V20"
                stroke="url(#shackleGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Lock body */}
              <rect x="12" y="20" width="24" height="20" rx="4" fill="url(#bodyGrad)" />
              {/* Body highlight */}
              <rect x="13" y="21" width="22" height="8" rx="3" fill="white" fillOpacity="0.1" />
              {/* Keyhole */}
              <circle cx="24" cy="29" r="2.5" fill="#1A1A1A" fillOpacity="0.6" />
              <path d="M23 29L22.5 34H25.5L25 29" fill="#1A1A1A" fillOpacity="0.6" />
            </g>
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-melt-text">
          Your account has been locked
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
