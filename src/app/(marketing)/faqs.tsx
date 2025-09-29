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
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );

  return (
    <section className="bg-[#FFFBE7] w-full overflow-x-hidden">
      {/* Responsive container with max-width */}
      <div className="mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 lg:py-20">
        {/* Use CSS Grid with fr units for true responsive behavior */}
        {/* On large screens: maintain the 413/739 ratio with 128px gap */}
        {/* Below lg: stack vertically */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,413px)_minmax(400px,739px)] gap-8 lg:gap-32 max-w-[1280px] mx-auto">
          {/* Left Column - Responsive with max-width constraint */}
          <div className="w-full">
            <h1
              className={`${anton.className} text-3xl sm:text-4xl lg:text-5xl font-normal text-[#222118] mb-4 sm:mb-6 uppercase leading-[1.2] tracking-[-0.02em]`}
            >
              {heading}
              {heading2 ? <span className="block">{heading2}</span> : null}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
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
                    "border border-[#D4C9A3] bg-[#F5F0E0]",
                    isFirst ? "rounded-t-lg" : "",
                    isLast ? "rounded-b-lg" : "border-b-0",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-left transition-colors hover:bg-[#EDE5D0]"
                  >
                    <span
                      className={`${anton.className} text-[#2C2C2C] text-base sm:text-lg tracking-wider pr-2`}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={[
                        "h-5 w-5 text-[#2C2C2C] transition-transform duration-200 flex-shrink-0",
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
                              className="flex items-start leading-relaxed text-sm sm:text-base text-[#4A4A4A]"
                            >
                              <span className="mr-2 flex-shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="leading-relaxed text-sm sm:text-base text-[#4A4A4A]">
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
