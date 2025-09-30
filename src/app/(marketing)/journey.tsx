import { ArrowRight } from "lucide-react";
import { anton } from "../fonts";

type JourneyStep = {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
};

export default function Journey({
  heading,
  subheading,
  steps,
}: {
  heading: string;
  subheading: string;
  steps: JourneyStep[];
}) {
  const cardBase =
    "w-full lg:w-[322px] bg-[#FFFBE7] border-b-[0.4px] border-[#B5AF95] rounded-b-lg";

  return (
    // Parent container - flex column on mobile for ordering, regular layout on larger screens
    <section
      className="w-full h-auto flex flex-col min-[1440px]:flex-row overflow-hidden py-10 md:py-20 min-[1440px]:!py-0"
      style={{ background: "radial-gradient(circle, #FDDF66, #F3ECC7)" }}
    >
      {/* Column 1 - Text content and button */}
      <div className="w-full flex flex-col min-[1440px]:min-w-[460px] min-[1440px]:w-auto min-[1440px]:pb-20">
        {/* Text content wrapper - order-1 on mobile */}
        <div className="px-4 md:px-6 min-[1440px]:!pl-20 order-1 lg:order-none min-[1440px]:pt-24 lg:max-[1439px]:flex lg:max-[1439px]:flex-col lg:max-[1439px]:items-center lg:max-[1439px]:text-center">
          <h2
            className={`${anton.className} font-normal text-4xl sm:text-5xl lg:text-[52px] leading-[1.15] tracking-tighter uppercase text-[#222118] min-[1440px]:max-w-[330px]`}
          >
            {heading}
          </h2>
          <p className="w-full min-[1440px]:w-[355px] mt-6 font-medium text-base sm:text-lg leading-[1.5] tracking-[-0.01em] text-[#1B1D1F]">
            {subheading}
          </p>
          {/* Button hidden on mobile, shown on lg+ */}
          <a
            href="#"
            className="mt-9 hidden py-4.5 lg:grid w-[328px] grid-cols-[1fr_auto] items-center gap-[10px]
             rounded-xl border-2 border-white bg-black px-5"
          >
            <span className="font-medium text-white text-[18px] leading-[1.5] tracking-[-0.01em] whitespace-nowrap">
              Begin My SkinBestie Journey
            </span>
            <ArrowRight className="w-6 h-6 text-white" />
          </a>
        </div>
      </div>

      {/* Column 2 - Cards container - order-2 on mobile */}
      <div className="order-2 lg:order-none flex-1 min-[1440px]:flex min-[1440px]:justify-end">
        <div className="w-full min-[1440px]:w-[982px] min-[1440px]:flex min-[1440px]:justify-end">
          <div className="pt-10 px-4 md:px-6 w-full min-[1440px]:w-auto flex flex-col lg:flex-row gap-4 sm:gap-2 min-[1440px]:!p-0 lg:justify-center min-[1440px]:justify-end">
            {steps.slice(0, 3).map((s, i) => (
              <div
                key={i}
                className={`${cardBase} p-6 ${
                  // Mobile: auto height
                  // lg to <1440px: equal heights (400px)
                  // 1440px+: staggered heights (with max-lg to prevent override)
                  i === 0
                    ? "h-auto lg:max-[1439px]:h-[400px] min-[1440px]:h-[450px]"
                    : i === 1
                      ? "h-auto lg:max-[1439px]:h-[400px] min-[1440px]:h-[400px]"
                      : "h-auto lg:max-[1439px]:h-[400px] min-[1440px]:h-[323px]"
                }`}
              >
                <img
                  src={s.iconSrc}
                  alt={s.iconAlt}
                  className="w-[40px] h-[40px]"
                />
                <h2
                  className={`mt-6 ${anton.className} font-normal text-2xl sm:text-3xl leading-[1.1] tracking-[-0.02em] uppercase text-[#12110F]`}
                >
                  {s.title}
                </h2>
                <p className="mt-5">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Button for mobile only - order-3 */}
      <div className="order-3 lg:hidden px-4">
        <a
          href="#"
          className="mt-6 flex w-full py-4.5 items-center justify-center gap-2.5
               rounded-xl border-2 border-white bg-black px-5"
        >
          <span className="font-medium text-white text-[18px] leading-[1.5] tracking-[-0.01em] whitespace-nowrap text-center">
            Begin My SkinBestie Journey
          </span>
          <ArrowRight className="w-6 h-6 text-white" />
        </a>
      </div>
    </section>
  );
}
