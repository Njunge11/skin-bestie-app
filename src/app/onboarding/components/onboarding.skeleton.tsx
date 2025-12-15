export function OnboardingSkeleton() {
  return (
    <div
      className="min-h-screen bg-skinbestie-landing-white animate-pulse"
      role="status"
      aria-label="Loading onboarding"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 md:h-[784px]">
        {/* Marketing side skeleton */}
        <div className="hidden md:block bg-gray-200" />

        {/* Form side skeleton */}
        <div className="flex flex-col pt-5 pb-5 px-4 md:px-[30px]">
          {/* Top bar */}
          <div className="flex justify-between items-baseline">
            <div className="h-8 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
          </div>

          {/* Card */}
          <div className="mt-8 mx-auto w-full max-w-[440px] bg-skinbestie-landing-gray p-6 rounded-lg">
            {/* Title */}
            <div className="h-8 w-3/4 mx-auto bg-gray-200 rounded" />
            {/* Subtitle */}
            <div className="h-5 w-full mx-auto bg-gray-200 rounded mt-3" />

            {/* Form fields */}
            <div className="mt-7 space-y-4">
              <div className="h-12 w-full bg-gray-200 rounded" />
              <div className="h-12 w-full bg-gray-200 rounded" />
              <div className="h-12 w-full bg-gray-200 rounded" />
            </div>

            {/* Button */}
            <div className="h-12 w-full bg-gray-300 rounded mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
