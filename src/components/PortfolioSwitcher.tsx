"use client";
import React, { useEffect, useState } from 'react';
import { usePersona } from '@/components/PersonaContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioSwitcherProps {
  developerContent: React.ReactNode;
  designerContent: React.ReactNode;
}

export default function PortfolioSwitcher({ developerContent, designerContent }: PortfolioSwitcherProps) {
  const { persona, isInitialized } = usePersona();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      document.body.style.overflowX = 'hidden';
    } else {
      document.body.style.overflowX = '';
    }
    return () => {
      document.body.style.overflowX = '';
    };
  }, [isAnimating]);

  useEffect(() => {
    if (isInitialized) {
      // Smoothly scroll to top when switching personas
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [persona, isInitialized]);

  if (!isInitialized) {
    return <div className="min-h-screen" />; // Prevent hydration mismatch and wait for preference
  }

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const pageTransition = {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1] // Custom premium easing curve (Apple-like)
  };

  return (
    <div className="relative w-full min-h-screen">
      <AnimatePresence mode="wait">
        {persona === 'developer' ? (
          <motion.div
            key="developer-portfolio"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            className="w-full"
          >
            {developerContent}
          </motion.div>
        ) : (
          <motion.div
            key="designer-portfolio"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            className="w-full"
          >
            {designerContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
