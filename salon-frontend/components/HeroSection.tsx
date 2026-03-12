'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_URL = 'https://pub-5d2bae0ce45142838ad6241bc5e9a2dc.r2.dev/Hair_ribbon_composition_rose_gold_delpmaspu_%20(1).mp4';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !containerRef.current) return;

    // Muted autoplay
    video.muted = true;
    video.playsInline = true;
    video.play().catch(() => {});

    // Always show text immediately (no opacity:0 waiting for GSAP)
    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 1, y: 0 });
    }

    let trigger: ScrollTrigger | null = null;

    const initScrollScrub = () => {
      // Pin + scrub video
      trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          if (video.duration) {
            video.currentTime = self.progress * video.duration;
          }
        },
      });

      // Fade out text on scroll
      if (textRef.current) {
        gsap.to(textRef.current, {
          opacity: 0,
          y: -40,
          scrollTrigger: {
            trigger: containerRef.current,
            start: '20%',
            end: '60%',
            scrub: true,
          },
        });
      }
    };

    // Init whether video is already ready or waits for loadeddata
    if (video.readyState >= 2) {
      initScrollScrub();
    } else {
      video.addEventListener('loadeddata', initScrollScrub, { once: true });
      // Fallback: init after 2 seconds even if video hasn't loaded (e.g. slow connection)
      const fallbackTimer = setTimeout(initScrollScrub, 2000);
      return () => {
        clearTimeout(fallbackTimer);
        trigger?.kill();
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }

    return () => {
      trigger?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#0d0d0d]">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        loop
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,13,13,0.4)] via-transparent to-[rgba(13,13,13,0.85)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(13,13,13,0.2)] to-transparent" />

      {/* Hero text — always visible, fades out on scroll */}
      <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-[#B76E79] uppercase tracking-[0.5em] text-xs mb-6 font-light">Hair X Studio · Ballari</p>
        <h1 className="text-5xl md:text-8xl font-serif font-light text-[#F5EFE7] text-center leading-tight max-w-5xl px-6">
          Luxury.<br />
          <span className="italic text-[#B76E79]">Crafted.</span>
        </h1>
        <p className="text-[#F5EFE7] opacity-60 text-base mt-8 font-light tracking-[0.2em]">Scroll to discover</p>
        <div className="mt-6 w-px h-10 bg-gradient-to-b from-[#B76E79] to-transparent animate-pulse" />
      </div>

      {/* Book Now CTA */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
        <Link
          href="/book"
          className="px-10 py-4 bg-[rgba(183,110,121,0.15)] backdrop-blur-md border border-[rgba(183,110,121,0.5)] text-[#F5EFE7] rounded-full hover:bg-[#B76E79] hover:text-[#0d0d0d] transition-all duration-500 tracking-[0.3em] uppercase text-xs font-medium pointer-events-auto"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
