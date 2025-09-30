// "use client";
// import React from "react";
// import { anton } from "../fonts";

// type ValuesItem = {
//   iconSrc: string;
//   iconAlt: string;
//   title: string;
//   description: string;
//   frameborder: string;
// };

// function PlayButton({
//   onClick,
//   className = "",
// }: {
//   onClick?: () => void;
//   className?: string;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-label="Play"
//       className={`grid place-items-center w-[60px] h-[60px] rounded-[100px] bg-[#F3EDC6] ${className}`}
//     >
//       {/* Triangle: 22 × 25.6959, solid fill #030303 */}
//       <svg
//         width={22}
//         height={25.6959}
//         viewBox="0 0 22 25.6959"
//         aria-hidden="true"
//       >
//         <polygon points="1 1 21 12.8479 1 24.6959" fill="#030303" />
//       </svg>
//     </button>
//   );
// }

// function YouTube({
//   id,
//   title = "YouTube video",
// }: {
//   id: string; // e.g. "dQw4w9WgXcQ"
//   title?: string;
// }) {
//   const [playing, setPlaying] = React.useState(false);
//   const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;

//   return (
//     <div
//       className="relative overflow-hidden rounded-[8px]"
//       style={{ width: 519, height: 332 }}
//     >
//       {playing ? (
//         <iframe
//           className="w-full h-full block"
//           src={src}
//           title={title}
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//           allowFullScreen
//         />
//       ) : (
//         <>
//           <img
//             src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
//             alt=""
//             className="w-full h-full object-cover block"
//           />
//           <div className="absolute inset-0 bg-black/30" />
//           <PlayButton
//             onClick={() => setPlaying(true)}
//             className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
//           />
//         </>
//       )}
//     </div>
//   );
// }

// export default function OurStory({
//   imageSrc,
//   imageAlt,
//   items,
// }: {
//   imageSrc: string;
//   imageAlt: string;
//   items: ValuesItem[];
// }) {
//   return (
//     <section
//       className="w-full bg-cover bg-center bg-no-repeat"
//       style={{
//         backgroundImage: "url('/background.svg')",
//       }}
//     >
//       <div className="w-full h-full py-10 md:py-20 px-4 xl:flex xl:items-center xl:justify-center">
//         <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 xl:items-start">
//           {/* Left Column */}
//           <div>
//             <h1
//               className={`${anton.className} text-center sm:text-left text-[#222118] text-4xl sm:text-5xl leading-[1.1] tracking-[-0.02em] uppercase font-normal`}
//             >
//               WHY WE STARTED SKINBESTIE
//             </h1>

//             <div className="pt-10">
//               {/* Video Container - flows naturally on mobile, positioned relatively on desktop */}
//               <div className="lg:relative">
//                 <YouTube id="dQw4w9WgXcQ" />

//                 {/* Black Card - stacks on mobile, overlaps on desktop */}
//                 <div className="mt-6 lg:mt-0 lg:absolute lg:top-[200px] lg:-right-8 xl:-right-16 w-full max-w-[433px] bg-[#030303] p-6 rounded-lg">
//                   <p className="text-[#FFFBE6] font-medium text-base leading-[150%] tracking-tight">
//                     &quot;After doing research and watching my friends drown in
//                     skin and ingredient anxiety, I realised we don't need
//                     another miracle serum.
//                   </p>
//                   <p className="mt-8 text-[#FFFBE6] font-medium text-base leading-[150%] tracking-tight">
//                     We need a trusted best-friend-coach who can take the
//                     guesswork out of product selection and help you build a
//                     simple routine that works best for YOU&quot;.
//                   </p>
//                   <p
//                     className={`${anton.className} mt-6 text-[#FDE148] font-normal text-2xl leading-[130%] tracking-tight uppercase`}
//                   >
//                     BENJI
//                   </p>
//                   <p className="text-[#FFFBE6] font-medium text-base leading-[150%] tracking-[-0.01em]">
//                     Certified Skincare Coach
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Values list */}
//           <div className="flex flex-col justify-center lg:pt-[200px]">
//             <div className="space-y-10">
//               {items.map((v, i) => (
//                 <div key={`${v.title}-${i}`} className="flex items-start">
//                   <div className="shrink-0 overflow-hidden flex justify-center pr-4">
//                     {v.iconSrc ? (
//                       <img
//                         src={v.iconSrc}
//                         alt={v.iconAlt || v.title}
//                         className="object-contain"
//                       />
//                     ) : null}
//                   </div>
//                   <div>
//                     <h3
//                       className={`${anton.className} text-[#2A2E30] text-2xl sm:text-3xl leading-[1.2] tracking-[-0.02em] uppercase font-normal`}
//                     >
//                       {v.title}
//                     </h3>
//                     <p className="mt-2 text-[#222527] text-lg leading-[1.5] tracking-[-0.01em] font-medium">
//                       {v.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import React from "react";
import { anton } from "../fonts";

type ValuesItem = {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
  frameborder: string;
};

function PlayButton({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Play"
      className={`grid place-items-center w-[60px] h-[60px] rounded-[100px] bg-[#F3EDC6] ${className}`}
    >
      <svg
        width={22}
        height={25.6959}
        viewBox="0 0 22 25.6959"
        aria-hidden="true"
      >
        <polygon points="1 1 21 12.8479 1 24.6959" fill="#030303" />
      </svg>
    </button>
  );
}

function YouTube({
  id,
  title = "YouTube video",
}: {
  id: string;
  title?: string;
}) {
  const [playing, setPlaying] = React.useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;

  return (
    <div
      className="relative overflow-hidden rounded-[8px] w-full xl:max-w-[519px]"
      // style={{ width: 519, height: 332 }}
    >
      {playing ? (
        <iframe
          className="w-full h-full block"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            alt=""
            className="w-full h-full object-cover block"
          />
          <div className="absolute inset-0 bg-black/30" />
          <PlayButton
            onClick={() => setPlaying(true)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </>
      )}
    </div>
  );
}

export default function OurStory({
  imageSrc,
  imageAlt,
  items,
}: {
  imageSrc: string;
  imageAlt: string;
  items: ValuesItem[];
}) {
  return (
    <section
      className="min-h-screen xl:h-[816px] w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/background.svg')",
      }}
    >
      <div className="w-full px-4 pt-10 md:pt-20 pb-10 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <h1
            className={`${anton.className} text-center xl:text-left text-[#222118] text-4xl sm:text-5xl leading-[1.1] tracking-[-0.02em] uppercase font-normal`}
          >
            WHY WE STARTED SKINBESTIE
          </h1>

          {/* Main Grid: 2 columns on desktop */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-16">
            {/* Left Column - Video + Black Card */}
            <div className="grid grid-cols-1">
              {/* Nested grid for overlapping on desktop only */}
              <div className="grid grid-cols-1 xl:grid-rows-1">
                {/* Video */}
                <div className="pt-10 lg:col-start-1 lg:row-start-1 lg:self-start">
                  <YouTube id="dQw4w9WgXcQ" />
                </div>

                {/* Black Card - stacks below on mobile, overlaps on desktop */}
                <div className="mt-6 xl:mt-0 xl:col-start-1 xl:row-start-1 xl:self-end xl:translate-y-56 xl:translate-x-52 w-full xl:max-w-[433px] bg-[#030303] p-6 rounded-lg">
                  <p className="text-[#FFFBE6] font-medium text-base leading-[150%] tracking-tight">
                    &quot;After doing research and watching my friends drown in
                    skin and ingredient anxiety, I realised we don't need
                    another miracle serum.
                  </p>
                  <p className="mt-8 text-[#FFFBE6] font-medium text-base leading-[150%] tracking-tight">
                    We need a trusted best-friend-coach who can take the
                    guesswork out of product selection and help you build a
                    simple routine that works best for YOU&quot;.
                  </p>
                  <p
                    className={`${anton.className} mt-6 text-[#FDE148] font-normal text-2xl leading-[130%] tracking-tight uppercase`}
                  >
                    BENJI
                  </p>
                  <p className="mt-1 text-[#FFFBE6] font-medium text-base leading-[150%] tracking-[-0.01em]">
                    Certified Skincare Coach
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Values */}
            <div className="flex flex-col items-center">
              <div className="pt-4 xl:pt-10 space-y-10">
                {items.map((v, i) => (
                  <div key={`${v.title}-${i}`} className="flex items-start">
                    <div className="shrink-0 overflow-hidden flex justify-center pr-4">
                      {v.iconSrc ? (
                        <img
                          src={v.iconSrc}
                          alt={v.iconAlt || v.title}
                          className="object-contain"
                        />
                      ) : null}
                    </div>
                    <div>
                      <h3
                        className={`${anton.className} text-[#2A2E30] text-2xl sm:text-3xl leading-[1.2] tracking-[-0.02em] uppercase font-normal`}
                      >
                        {v.title}
                      </h3>
                      <p className="mt-2 text-[#222527] text-lg leading-[1.5] tracking-[-0.01em] font-medium">
                        {v.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
