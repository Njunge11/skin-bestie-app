"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { anton } from "../fonts";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";

type TestimonialItem = {
  concern: string;
  goal: string;
  timeline: string;
  testimonial: string;
  customerName: string;
};

export default function Testimonials({
  heading,
  items,
}: {
  heading?: string;
  items: TestimonialItem[];
}) {
  const [carouselApi, setCarouselApi] = React.useState<
    { scrollPrev: () => void; scrollNext: () => void } | undefined
  >(undefined);
  const autoplay = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  return (
    // OUTER fills the scene (100dvh from wrapper)
    <section
      id="community"
      className="w-full bg-skinbestie-landing-white border-b-[0.3px] border-[#959170]"
    >
      <div className="w-full max-w-7xl mx-auto py-10 md:py-20 px-4">
        <h1
          className={`${anton.className} text-skinbestie-landing-blue text-4xl sm:text-5xl text-center uppercase leading-[1.2] tracking-[-0.02em]`}
        >
          {heading}
        </h1>

        <Carousel
          // Key bits: center + trimSnaps + loop
          opts={{ align: "center", containScroll: "trimSnaps", loop: true }}
          plugins={[autoplay.current]}
          setApi={setCarouselApi}
          className="w-full max-w-7xl mx-auto pt-11"
          // Optional: you can remove these since stopOnMouseEnter is true above
          // onMouseEnter={autoplay.current.stop}
          // onMouseLeave={autoplay.current.reset}
        >
          <CarouselContent className="-ml-0 md:-ml-4">
            {items.map((card, idx) => (
              <CarouselItem
                key={`${card.customerName}-${idx}`}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 flex"
              >
                <div className="p-6 rounded-xl bg-skinbestie-landing-gray border-[0.3px] border-[#FDFAEB4D] w-full max-w-[413px] h-full flex flex-col">
                  {/* <div>
                      <h2
                        className={`${anton.className} font-normal text-2xl text-[#FFF7D4] uppercase leading-[1.2] tracking-[-0.02em]`}
                      >
                        SKIN CONCERNS
                      </h2>
                      <p className="mt-2 font-medium text-base text-[#DFDBD2] leading-[1.5] tracking-[-0.01em]">
                        {card.concern}
                      </p>
                    </div>
                    <div className="pt-8">
                      <h2
                        className={`${anton.className} font-normal text-2xl text-[#FFF7D4] uppercase leading-[1.2] tracking-[-0.02em]`}
                      >
                        SKIN GOALS
                      </h2>
                      <p className="mt-2 font-medium text-base text-[#DFDBD2] leading-[1.5] tracking-[-0.01em]">
                        {card.goal}
                      </p>
                    </div>
                    <div className="pt-8">
                      <h2
                        className={`${anton.className} font-normal text-2xl text-[#FFF7D4] uppercase leading-[1.2] tracking-[-0.02em]`}
                      >
                        TIMELINE
                      </h2>
                      <p className="mt-2 font-medium text-base text-[#DFDBD2] leading-[1.5] tracking-[-0.01em]">
                        {card.timeline}
                      </p>
                    </div> */}
                  <div className="flex-grow">
                    {/* <h2
                        className={`${anton.className} font-normal text-2xl text-[#FFF7D4] uppercase leading-[1.2] tracking-[-0.02em]`}
                      >
                        TESTIMONIAL
                      </h2> */}
                    <p className="font-medium text-base text-skinbestie-landing-black leading-[1.5] tracking-[-0.01em]">
                      {card.testimonial}
                    </p>
                  </div>
                  <div className="pt-6">
                    <hr className="border-[0.5px] border-[#2F2B27]" />
                  </div>
                  <div className="pt-4">
                    <p className="font-medium text-center text-lg text-skinbestie-landing-blue leading-[1.5] tracking-[-0.01em]">
                      {`- ${card.customerName}`}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden xl:flex border-0 bg-transparent hover:bg-transparent w-[21px] h-[20px] p-0 text-skinbestie-landing-blue">
            <ArrowLeft width={21} height={20} />
            <span className="sr-only">Previous slide</span>
          </CarouselPrevious>
          <CarouselNext className="hidden xl:flex border-0 bg-transparent hover:bg-transparent w-[21px] h-[20px] p-0 text-skinbestie-landing-blue">
            <ArrowRight width={21} height={20} />
            <span className="sr-only">Next slide</span>
          </CarouselNext>
        </Carousel>

        {/* Mobile/Tablet/iPad Pro arrows below carousel */}
        <div className="flex justify-center gap-4 mt-6 xl:hidden">
          <button
            onClick={() => carouselApi?.scrollPrev()}
            className="border-0 bg-transparent w-[21px] h-[20px] p-0 text-skinbestie-landing-blue"
            aria-label="Previous slide"
          >
            <ArrowLeft width={21} height={20} />
          </button>
          <button
            onClick={() => carouselApi?.scrollNext()}
            className="border-0 bg-transparent w-[21px] h-[20px] p-0 text-skinbestie-landing-blue"
            aria-label="Next slide"
          >
            <ArrowRight width={21} height={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
