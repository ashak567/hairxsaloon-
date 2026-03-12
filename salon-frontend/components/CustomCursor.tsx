'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: any) => {
      if (
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.classList.contains('interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const variants: any = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
      backgroundColor: 'transparent',
      border: '1px solid rgba(183, 110, 121, 0.5)', // Rose gold thin border
      transition: { type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }
    },
    hover: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1.5,
      backgroundColor: 'rgba(183, 110, 121, 0.1)', // Soft rose gold fill
      border: '1px solid rgba(183, 110, 121, 1)', 
      backdropFilter: 'blur(2px)',
      transition: { type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }
    }
  };

  return (
    <>
      <style>{`
        body {
          cursor: none;
        }
        @media (max-width: 768px) {
          body { cursor: auto; }
          .custom-cursor { display: none !important; }
        }
      `}</style>
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
        variants={variants}
        animate={isHovering ? 'hover' : 'default'}
      />
      {/* Inner dot */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-50 bg-[#B76E79]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          transition: { type: 'spring', stiffness: 1000, damping: 40, mass: 0.1 }
        }}
      />
    </>
  );
};

export default CustomCursor;
