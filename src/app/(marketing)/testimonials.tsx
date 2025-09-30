"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { anton } from "../fonts";
import Autoplay from "embla-carousel-autoplay";

type TestimonialItem = {
  concern: string;
  goal: string;
  testimonial: string;
  customerName: string;
};

export default function Testimonials({
  heading,
  subheading,
  imageSrc,
  imageAlt,
  items,
}: {
  heading?: string;
  subheading?: string;
  imageSrc?: string;
  imageAlt?: string;
  items: TestimonialItem[];
}) {
  const autoplay = React.useRef(
    Autoplay({
      delay: 3000, // 3s between slides
      stopOnInteraction: false, // keep playing after arrows/swipe
      stopOnMouseEnter: true, // pause on hover (desktop)
      // rootNode lets the plugin find the viewport if your markup differs
      // rootNode: (emblaRoot) => emblaRoot.parentElement,
    })
  );
  return (
    // OUTER fills the scene (100dvh from wrapper)
    <section
      id="community"
      className="h-full w-full bg-[#13110F] overflow-hidden"
    >
      {/* Inner content centered into a 795px frame on xl */}
      <div className="w-full h-full xl:flex xl:items-center xl:justify-center">
        <div className="w-full max-w-7xl mx-auto xl:flex xl:flex-col xl:justify-center py-10 md:py-20 lg:py-40 px-4">
          <div className="flex justify-center">
            <Image src={imageSrc!} alt={imageAlt!} width={219} height={84} />
          </div>

          <h1
            className={`mt-6 ${anton.className} text-[#FFF7D4] text-4xl sm:text-5xl text-center uppercase leading-[1.2] tracking-[-0.02em]`}
          >
            {heading}
          </h1>
          <p className="w-full max-w-[478px] mx-auto mt-2 font-medium text-[#FAFAFA] text-lg text-center leading-[1.5] tracking-[-0.01em]">
            {subheading}
          </p>

          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplay.current]}
            // optional: also pause/resume on hover via events
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
            className="pt-11 w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-0 md:-ml-4">
              {items.map((card, idx) => (
                <CarouselItem
                  key={`${card.customerName}-${idx}`}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-6 rounded-xl bg-[#EDEDED05] border-[0.3px] border-[#FDFAEB4D] w-full max-w-[413px]">
                    <div>
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
                        TESTIMONIAL
                      </h2>
                      <p className="mt-2 font-medium text-base text-[#DFDBD2] leading-[1.5] tracking-[-0.01em]">
                        {card.testimonial}
                      </p>
                    </div>
                    <div className="pt-6">
                      <hr className="border-[0.5px] border-[#2F2B27]" />
                    </div>
                    <div className="pt-4">
                      <p className="font-medium text-center text-lg text-[#DFDBD2] leading-[1.5] tracking-[-0.01em]">
                        {`- ${card.customerName}`}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious
              className="hidden sm:flex border-0 bg-transparent hover:bg-transparent"
              style={{ color: "#FFF7D4" }}
            />
            <CarouselNext
              className="hidden sm:flex border-0 bg-transparent hover:bg-transparent"
              style={{ color: "#FFF7D4" }}
            />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
