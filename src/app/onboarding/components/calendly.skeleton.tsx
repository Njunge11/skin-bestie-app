"use client";

export function CalendlySkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading scheduler"
      className="absolute inset-0 bg-[#F3ECC7] motion-safe:animate-pulse pointer-events-none"
    >
      <div className="h-full w-full p-4 md:p-6">
        {/* Title */}
        <div className="h-7 w-48 md:w-64 rounded bg-[#FFF1C7]" />

        {/* Month / nav row */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#FFF1C7]" />
          <div className="h-6 w-56 md:w-72 rounded bg-[#FFF1C7]" />
          <div className="ml-auto h-10 w-10 rounded-full bg-[#FFF1C7]" />
        </div>

        {/* Weekday labels */}
        <div className="mt-6 grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-[#FFF1C7]" />
          ))}
        </div>

        {/* Days grid (5 rows x 7) */}
        <div className="mt-4 grid grid-cols-7 gap-3">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-12 md:h-14 rounded-full bg-[#FFF1C7]" />
          ))}
        </div>

        {/* Timezone row */}
        <div className="mt-6 h-5 w-3/4 md:w-1/2 rounded bg-[#FFF1C7]" />
      </div>
    </div>
  );
}
