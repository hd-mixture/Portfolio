"use client";

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { usePersona } from './PersonaContext';

export default function VisionScrollbar() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const { theme, systemTheme } = useTheme();
  const { persona } = usePersona();
  const isDesigner = persona === 'designer';
  
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(100);
  const [isDesktop, setIsDesktop] = useState(true);
  
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if device supports hover (is likely a desktop)
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth > 768 && window.matchMedia("(pointer: fine)").matches);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    // Calculate thumb height based on content ratio
    const updateThumbHeight = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const ratio = windowHeight / documentHeight;
      // Minimum height of 40px, maximum of window height
      const calculatedHeight = Math.max(40, windowHeight * ratio);
      setThumbHeight(calculatedHeight);
    };

    updateThumbHeight();
    window.addEventListener('resize', updateThumbHeight);
    
    // Watch for ANY document size changes (like persona toggle)
    const resizeObserver = new ResizeObserver(() => {
      updateThumbHeight();
    });
    resizeObserver.observe(document.body);

    // Show scrollbar on scroll and hide after inactivity
    const handleScroll = () => {
      setIsVisible(true);
      
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      
      if (!isDragging) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 1200); // 1.2 seconds of inactivity
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', updateThumbHeight);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isDesktop]);

  // Calculate the vertical position of the thumb
  // It moves from 10px (top padding) to windowHeight - thumbHeight - 10px (bottom padding)
  const trackHeight = typeof window !== 'undefined' ? window.innerHeight - thumbHeight - 20 : 0;
  const yPosition = useTransform(
    scrollYProgress,
    [0, 1],
    [10, 10 + trackHeight]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (typeof window === 'undefined') return;
    e.preventDefault();
    setIsDragging(true);
    setIsHovered(true);

    const startY = e.clientY;
    const startScrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const scrollPercentage = deltaY / trackHeight;
      const deltaScroll = scrollPercentage * scrollHeight;
      window.scrollTo(0, startScrollY + deltaScroll);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setIsHovered(false);
      
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1200);

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // If on admin route or not desktop (mobile/tablet), don't render anything
  if (pathname?.startsWith('/admin') || !isDesktop) return null;

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  
  const bgIdle = isDesigner 
    ? 'linear-gradient(135deg, #FF4D8D, #FF7A45)'
    : 'linear-gradient(135deg, #3B82F6, #8B5CF6)';
  
  const bgHover = isDesigner
    ? 'linear-gradient(135deg, #FF1A6B, #FF5511)'
    : 'linear-gradient(135deg, #2563EB, #7C3AED)';
    
  const borderCol = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)';
  
  const shadowHover = isDesigner
    ? '0 0 24px rgba(255, 77, 141, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.8)'
    : '0 0 24px rgba(59, 130, 246, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.8)';
    
  const shadowIdle = isDesigner
    ? '0 0 16px rgba(255, 77, 141, 0.3), inset 0 0 4px rgba(255, 255, 255, 0.5)'
    : '0 0 16px rgba(59, 130, 246, 0.3), inset 0 0 4px rgba(255, 255, 255, 0.5)';

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '30px',
        zIndex: 9999,
        pointerEvents: 'none' // The container shouldn't block clicks
      }}
    >
      <AnimatePresence>
        {(isVisible || isHovered || isDragging) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.8, ease: "easeOut" } }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              right: '12px',
              y: yPosition,
              height: thumbHeight,
              width: (isHovered || isDragging) ? '12px' : '8px',
              borderRadius: '999px',
              background: (isHovered || isDragging) ? bgHover : bgIdle,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: `1px solid ${borderCol}`,
              boxShadow: (isHovered || isDragging) ? shadowHover : shadowIdle,
              pointerEvents: 'auto',
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: 'width 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease, background 0.25s ease'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => !isDragging && setIsHovered(false)}
            onPointerDown={handlePointerDown}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
