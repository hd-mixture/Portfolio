"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  useEffect(() => {
    if (!autoplay || !isClient) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, isClient]);

  const randomRotate = () => (isClient ? Math.floor(Math.random() * 21) - 10 : 0);

  return (
    <div className="testimonial-section-container">
      <div className="testimonial-grid">
        <div className="testimonial-image-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{
                opacity: 0,
                scale: 0.9,
                rotate: randomRotate(),
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
                y: [0, -20, 0],
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                rotate: randomRotate(),
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
              className="testimonial-image-motion"
            >
              <Image
                src={testimonials[active].src}
                alt={testimonials[active].name}
                width={500}
                height={500}
                draggable={false}
                className="testimonial-image"
                data-ai-hint="person"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="testimonial-content-container">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="testimonial-name">
              {testimonials[active].name}
            </h3>
            <p className="testimonial-designation">
              {testimonials[active].designation}
            </p>
            <div className="testimonial-quote">
              {testimonials[active].quote}
            </div>
          </motion.div>
          <div className="testimonial-nav-buttons">
            <button
              onClick={handlePrev}
              className="testimonial-nav-button"
              suppressHydrationWarning
              aria-label="Previous testimonial"
            >
              <IconArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="testimonial-nav-button"
              suppressHydrationWarning
              aria-label="Next testimonial"
            >
              <IconArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
