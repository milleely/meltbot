"use client";

export default function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-melt-bg flex items-center justify-center">
      {/* Phone frame: full-bleed on mobile, device silhouette on desktop */}
      <div
        className="
          relative w-full h-dvh overflow-hidden
          min-[430px]:w-[390px] min-[430px]:h-[844px] min-[430px]:rounded-[40px]
          min-[430px]:border min-[430px]:border-melt-border
          min-[430px]:shadow-[0_0_80px_rgba(0,0,0,0.6)]
        "
      >
        {/* Dynamic Island pill — desktop only */}
        <div
          className="
            hidden min-[430px]:block absolute top-3 left-1/2 -translate-x-1/2
            w-[120px] h-[34px] bg-black rounded-full z-50
          "
        />
        {/* Content */}
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
