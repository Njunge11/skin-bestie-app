// onboarding.marketing.tsx
"use client";

import { useWizard } from "./wizard.provider";
import { anton } from "@/app/fonts";

export default function OnboardingMarketing() {
  const { current } = useWizard();

  const PricingCard = () => {
    const price = current.subscriptionHeadline || "£60 / MONTH";
    const sub =
      current.subscriptionSubHeadline || "Limited Time – Early Access";
    const features = current.subscriptionBenefits?.length
      ? current.subscriptionBenefits
      : [
          "Personalised routine within 24 hours",
          "Monthly 1:1 coaching call",
          "Exclusive Skin Science Brief (every 2 wks)",
          "Weekly WhatsApp nudges + check-ins",
          "Interactive progress tracker",
        ];

    return (
      <div className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-xl bg-[#292A36]/20 backdrop-blur-xs border border-white/10 p-[1.875rem]">
        <h1
          className={`${anton.className} text-[#F3F1DE] text-center uppercase tracking-[-0.02em] leading-[1.1] text-[3.5rem]`}
        >
          {price}
        </h1>

        {sub && (
          <p className="pt-1 text-[#F2EDC7] text-center font-medium tracking-[-0.01em] leading-[1.5] text-[1.25rem]">
            {sub}
          </p>
        )}

        <div className="pt-6 space-y-2">
          {features.map((feature) => (
            <div
              key={feature}
              className="pl-[1.1875rem] py-[0.9375rem] border-[0.025rem] rounded-[0.5rem] border-[#68696E]"
            >
              <p className="text-[#EBEAE0] text-left leading-[1.2] tracking-normal">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="hidden md:flex flex-col bg-cover bg-center pt-[11.3125rem] p-[8.625rem]"
      style={{ backgroundImage: `url('${current.bgImage}')` }}
      aria-label={current.headline}
    >
      {current.component === "subscribe" || current.component === "book" ? (
        <PricingCard />
      ) : (
        <>
          <h1
            className={`w-full max-w-[485px] ${anton.className} text-[#FFF7D4] text-[3.5rem] font-normal leading-[120%] tracking-[-0.02em] uppercase`}
          >
            {current.headline}
          </h1>
          <p className="w-full max-w-[376px] pt-4 text-[1.125rem] font-medium leading-[150%] tracking-[-0.01em] text-[#FFFDF5]">
            {current.subhead}
          </p>
        </>
      )}
    </div>
  );
}
