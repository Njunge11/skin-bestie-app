export function PaymentSkeleton() {
  const tile =
    "rounded-[0.25rem] bg-[#FFF5CC] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]";

  return (
    <div
      className="h-full w-full p-3 animate-pulse"
      role="status"
      aria-label="Loading payment form"
    >
      <div className={`h-14 w-full ${tile}`} />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={`h-14 ${tile}`} />
        <div className={`h-14 ${tile}`} />
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-4 w-11/12 rounded bg-[#FFF1C7]" />
        <div className="h-4 w-9/12  rounded bg-[#FFF1C7]" />
        <div className="h-4 w-3/5   rounded bg-[#FFF1C7]" />
      </div>
    </div>
  );
}
