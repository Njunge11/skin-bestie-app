// import { anton } from "../fonts";
// import { MButton } from "./onboarding/components/button";

// export default function Journey() {
//   const cardBase =
//     "w-full min-[1350px]:w-[322px] min-[1350px]:shrink-0 bg-[#FFFBE7] border-b-[0.4px] border-[#B5AF95] rounded-b-lg h-[280px]";

//   return (
//     <div
//       className="min-h-screen w-full flex flex-col min-[1350px]:flex-row"
//       style={{ background: "radial-gradient(circle, #FDDF66, #F3ECC7)" }}
//     >
//       {/* Column 1: Text content */}
//       <div className="p-6 min-[1350px]:pl-[4.375rem] min-[1350px]:pt-24">
//         <div className="w-full min-[1350px]:max-w-[355px]">
//           <h2
//             className={`${anton.className} w-full min-[1350px]:max-w-[330px] font-normal text-4xl sm:text-5xl min-[1350px]:text-[52px] leading-[1.15] tracking-tighter uppercase text-[#222118]`}
//           >
//             How your SkinBestie journey unfolds
//           </h2>
//           <p className="mt-6 font-medium text-base sm:text-lg leading-[1.5] tracking-[-0.01em] text-[#1B1D1F]">
//             Coaching and community that empowers you with judgment-free skincare
//             guidance, education, and routines built just for you.
//           </p>
//           <MButton
//             className="mt-9 w-full sm:w-auto sm:max-w-[304px] py-5"
//             showIcon
//           >
//             Begin My SkinBestie Journey
//           </MButton>
//         </div>
//       </div>

//       {/* Column 2: Cards */}
//       <div className="flex-1">
//         {/* ≤1350px: stack; ≥1351px: 3 across, right-aligned */}
//         <div className="p-2 md:p-6 min-[1350px]:!p-0 flex flex-col gap-2 min-[1350px]:flex-row min-[1350px]:justify-end min-[1350px]:items-start w-full min-[1350px]:w-auto">
//           <div
//             className={`${cardBase} h-auto min-[1350px]:h-[450px] p-6 min-[1350px]:pt-16  min-[1350px]:px-6`}
//           >
//             <img src="/calendar.svg" className="w-[40px] h-[40px]" />
//             <h2
//               className={`mt-6 ${anton.className} font-normal text-3xl leading-[1.1] tracking-[-0.02em] uppercase text-[#12110F]`}
//             >
//               1. Share your details & pick a time
//             </h2>
//             <p className="mt-5">
//               Answer a few quick questions about your skin, and book a slot that
//               works for you.
//             </p>
//           </div>
//           <div
//             className={`${cardBase} h-auto min-[1350px]:h-[400px] p-6 min-[1350px]:pt-16  min-[1350px]:px-6`}
//           >
//             <img src="/calendar.svg" className="w-[40px] h-[40px]" />
//             <h2
//               className={`mt-6 ${anton.className} font-normal text-3xl leading-[1.1] tracking-[-0.02em] uppercase text-[#12110F]`}
//             >
//               2. meet your coach
//             </h2>
//             <p className="mt-5">
//               A relaxed video chat where we get to know more about you and your
//               lifestyle, your skin history, current state of skin, create skin
//               goals, analyse your current routine and create a plan for your
//               tailored routine.
//             </p>
//           </div>

//           <div
//             className={`${cardBase} h-auto min-[1350px]:h-[323px] p-6 min-[1350px]:pt-16  min-[1350px]:px-6`}
//           >
//             <img src="/calendar.svg" className="w-[40px] h-[40px]" />
//             <h2
//               className={`mt-6 ${anton.className} font-normal text-3xl leading-[1.1] tracking-[-0.02em] uppercase text-[#12110F]`}
//             >
//               3. GROW TOGETHER
//             </h2>
//             <p className="mt-5">
//               Get ongoing support, guidance, and pep talks along the way. Expect
//               small tweaks, weekly reflections, and a coach who makes sure every
//               win gets noticed.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// app/(marketing)/journey.tsx
import { anton } from "../fonts";
import { MButton } from "./onboarding/components/button";

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
    "w-full min-[1350px]:w-[322px] min-[1350px]:shrink-0 bg-[#FFFBE7] border-b-[0.4px] border-[#B5AF95] rounded-b-lg h-[280px]";

  return (
    <div
      className="min-h-screen w-full flex flex-col min-[1350px]:flex-row"
      style={{ background: "radial-gradient(circle, #FDDF66, #F3ECC7)" }}
    >
      {/* Column 1: Text content */}
      <div className="p-6 min-[1350px]:pl-[4.375rem] min-[1350px]:pt-24">
        <div className="w-full min-[1350px]:max-w-[355px]">
          <h2
            className={`${anton.className} w-full min-[1350px]:max-w-[330px] font-normal text-4xl sm:text-5xl min-[1350px]:text-[52px] leading-[1.15] tracking-tighter uppercase text-[#222118]`}
          >
            {heading}
          </h2>
          <p className="mt-6 font-medium text-base sm:text-lg leading-[1.5] tracking-[-0.01em] text-[#1B1D1F]">
            {subheading}
          </p>
          <MButton
            className="mt-9 w-full sm:w-auto sm:max-w-[304px] py-5"
            showIcon
          >
            Begin My SkinBestie Journey
          </MButton>
        </div>
      </div>

      {/* Column 2: Cards */}
      <div className="flex-1">
        {/* ≤1350px: stack; ≥1351px: 3 across, right-aligned */}
        <div className="p-2 md:p-6 min-[1350px]:!p-0 flex flex-col gap-2 min-[1350px]:flex-row min-[1350px]:justify-end min-[1350px]:items-start w-full min-[1350px]:w-auto">
          {steps.slice(0, 3).map((s, i) => (
            <div
              key={i}
              className={`${cardBase} ${
                i === 0
                  ? "h-auto min-[1350px]:h-[450px] p-6 min-[1350px]:pt-16  min-[1350px]:px-6"
                  : i === 1
                    ? "h-auto min-[1350px]:h-[400px] p-6 min-[1350px]:pt-16  min-[1350px]:px-6"
                    : "h-auto min-[1350px]:h-[323px] p-6 min-[1350px]:pt-16  min-[1350px]:px-6"
              }`}
            >
              <img
                src={s.iconSrc}
                alt={s.iconAlt}
                className="w-[40px] h-[40px]"
              />
              <h2
                className={`mt-6 ${anton.className} font-normal text-3xl leading-[1.1] tracking-[-0.02em] uppercase text-[#12110F]`}
              >
                {s.title}
              </h2>
              <p className="mt-5">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
