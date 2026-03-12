'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RibbonTransition = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    // Create a smooth upward reveal effect for the content
    gsap.fromTo(
      contentRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%", // trigger when top of container hits 80% down the viewport
          toggleActions: "play none none reverse",
        }
      }
    );

    // Creates an abstract ribbon sweeping effect using SVG/ClipPath
    gsap.fromTo(
      ribbonRef.current,
      { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
      {
        clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
        duration: 1.5,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
          if(t.trigger === currentContainer) t.kill()
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
        {/* Abstract ribbon backdrop */}
        <div 
            ref={ribbonRef}
            className="absolute top-0 left-0 w-full h-full bg-[#1C1C1C] z-[-1]"
            style={{ 
                clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                borderTop: "1px solid rgba(183, 110, 121, 0.2)"
            }}
        />
        
        {/* Wrapped Content */}
        <div ref={contentRef} className="opacity-0 relative z-10">
            {children}
        </div>
    </div>
  );
};

export default RibbonTransition;
