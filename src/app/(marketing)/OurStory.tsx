"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { anton } from "../fonts";

type ValuesItem = {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
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
      aria-label="Play video"
      className={`grid place-items-center w-[60px] h-[60px] rounded-[100px] bg-[#F3EDC6] hover:bg-[#ede7b8] transition-colors ${className}`}
    >
      <svg
        width={22}
        height={25.6959}
        viewBox="0 0 22 25.6959"
        aria-hidden="true"
        className="ml-[2px]"
      >
        <polygon points="1 1 21 12.8479 1 24.6959" fill="#030303" />
      </svg>
    </button>
  );
}

function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if HLS is supported natively (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (typeof window !== "undefined") {
      // Use HLS.js for other browsers
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            debug: false,
          });

          hlsRef.current = hls;

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log("HLS manifest parsed successfully");
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS error:", data);
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.error("Fatal network error, trying to recover");
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.error("Fatal media error, trying to recover");
                  hls.recoverMediaError();
                  break;
                default:
                  console.error("Fatal error, cannot recover");
                  hls.destroy();
                  break;
              }
            }
          });

          hls.loadSource(src);
          hls.attachMedia(video);
        }
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  const handlePlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[8px] w-full max-w-[393px] h-[207px] md:max-w-[519px] md:h-[332px]">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain"
        controls={isPlaying}
        preload="metadata"
        playsInline
        aria-label="Our story video"
      >
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <>
          {/* 16:9 Poster - fills container */}
          <img
            src="/story-poster-16-9.jpg"
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#00000066]" />
          <PlayButton
            onClick={handlePlay}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          />
        </>
      )}
    </div>
  );
}

export default function OurStory({
  heading = "WHY WE STARTED SKINBESTIE",
  items = [],
}: {
  heading?: string;
  items?: ValuesItem[];
}) {
  return (
    <section
      id="story"
      className="w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/background.svg')",
      }}
    >
      <div className="w-full px-4 pt-10 md:pt-20 pb-10 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <h1
            className={`${anton.className} text-left sm:text-center xl:text-left text-[#222118] text-4xl sm:text-5xl leading-[1.1] tracking-[-0.02em] uppercase font-normal`}
          >
            {heading}
          </h1>

          {/* Main Grid: 2 columns on desktop */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-16">
            {/* Left Column - Video + Black Card */}
            <div className="grid grid-cols-1">
              {/* Nested grid for overlapping on desktop only */}
              <div className="grid grid-cols-1 xl:grid-rows-1">
                {/* Video */}
                <div className="pt-10 lg:col-start-1 lg:row-start-1 lg:self-start">
                  <Suspense fallback={
                    <div className="relative overflow-hidden rounded-[8px] w-full max-w-[393px] h-[207px] md:max-w-[519px] md:h-[332px] bg-gray-200 animate-pulse flex items-center justify-center">
                      <span className="text-gray-400">Loading video...</span>
                    </div>
                  }>
                    <VideoPlayer
                      src="https://d1druk2o8f2ss7.cloudfront.net/hls/skin-bestie-clip/story_hls/master.m3u8"
                    />
                  </Suspense>
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
