"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  stars?: number;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const wrapperRef = useCallback((node: HTMLDivElement | null) => {
    if (node && textRef.current) {
      const textEl = textRef.current;
      // Reset to base size
      textEl.style.fontSize = '1.25rem';
      
      let size = 1.25;
      // Keep reducing font size until the wrapper is no longer overflowing
      while (node.scrollHeight > node.clientHeight && size > 0.6) {
        size -= 0.05;
        textEl.style.fontSize = `${size}rem`;
      }
    }
  }, [active]);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay || !isClient || isHovered) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, isClient, isHovered, handleNext]); // Added handleNext to dependencies

  if (!isClient) return null;

  return (
    <div className="tm-carousel-container">
      <div 
        className="tm-solid-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Left Side: Content */}
        <div className="tm-content-left">
          <div className="tm-quote-mark">“</div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
            >
              <div className="tm-review-text-wrapper" ref={wrapperRef}>
                <p className="tm-review-text" ref={textRef}>
                  {testimonials[active].quote}
                </p>
              </div>
              
              <div className="tm-stars-review">
                {Array.from({ length: testimonials[active].stars || 5 }).map((_, i) => (
                  <i key={i} className="fa-solid fa-star"></i>
                ))}
              </div>
              
              <div className="tm-client-info">
                <div className="tm-client-details">
                  <h4 className="tm-client-name">{testimonials[active].name}</h4>
                  <p className="tm-client-role">{testimonials[active].designation}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Portrait */}
        <div className="tm-image-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="tm-acrylic-frame"
            >
              <Image
                src={testimonials[active].src}
                alt={testimonials[active].name}
                width={500}
                height={600}
                draggable={false}
                className="tm-portrait-img"
                unoptimized
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Side Navigation */}
        {testimonials.length > 1 && (
          <>
            <button className="tm-nav-btn tm-nav-prev" onClick={handlePrev} aria-label="Previous">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="tm-nav-btn tm-nav-next" onClick={handleNext} aria-label="Next">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </>
        )}
      </div>

      {/* Dots Navigation (Below Card) */}
      {testimonials.length > 1 && (
        <div className="tm-nav-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`tm-dot ${index === active ? 'active' : ''}`}
              onClick={() => setActive(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
