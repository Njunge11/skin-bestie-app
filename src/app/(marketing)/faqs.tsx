// app/(marketing)/faqs.tsx
"use client";
import React from "react";
import { anton } from "../fonts";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  type: "text" | "list";
  text?: string;
  list?: string[];
};

export default function Faqs({
  heading,
  heading2, // optional second line
  subheading,
  items,
}: {
  heading: string;
  heading2?: string;
  subheading: string;
  items: FaqItem[];
}) {
  const [openItems, setOpenItems] = React.useState<number[]>([]);
  const toggleItem = (index: number) =>
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );

  return (
    <section className="bg-skinbestie-landing-white w-full overflow-x-hidden border-b-[0.3px] border-[#959170]">
      {/* Responsive container with max-width */}
      <div className="mx-auto w-full px-4 md:px-6  py-10 md:py-20 lg:py-40">
        {/* Use CSS Grid with fr units for true responsive behavior */}
        {/* On large screens: maintain the 413/739 ratio with 128px gap */}
        {/* Below lg: stack vertically */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,413px)_minmax(400px,739px)] gap-8 lg:gap-32 max-w-[1280px] mx-auto">
          {/* Left Column - Responsive with max-width constraint */}
          <div className="w-full">
            <h1
              className={`${anton.className} text-3xl sm:text-4xl lg:text-5xl font-normal text-skinbestie-landing-pink mb-4 sm:mb-6 uppercase leading-[1.2] tracking-[-0.02em]`}
            >
              {heading}
              {heading2 ? <span className="block">{heading2}</span> : null}
            </h1>
            <p className="font-medium text-base sm:text-lg lg:text-xl text-[#1B1D1F] leading-relaxed">
              {subheading}
            </p>
          </div>

          {/* Right Column - FAQs - Responsive */}
          <div className="w-full">
            {items.map((faq, i) => {
              const isOpen = openItems.includes(i);
              const isFirst = i === 0;
              const isLast = i === items.length - 1;

              return (
                <div
                  key={`${faq.question}-${i}`}
                  className={[
                    "border border-skinbestie-landing-blue bg-skinbestie-landing-blue",
                    isFirst ? "rounded-t-lg" : "",
                    isLast ? "rounded-b-lg" : "border-b-0",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-left"
                  >
                    <span
                      className={`${anton.className} text-white text-base lg:text-2xl tracking-wider pr-2`}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={[
                        "h-5 w-5 text-white transition-transform duration-200 flex-shrink-0",
                        isOpen ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-6 lg:px-8 pt-2 pb-4 sm:pb-6">
                      {faq.type === "list" && faq.list?.length ? (
                        <ul className="space-y-2">
                          {faq.list.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start leading-relaxed text-base lg:text-lg text-white"
                            >
                              <span className="mr-2 flex-shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="leading-relaxed text-sm sm:text-base text-white">
                          {faq.text}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
