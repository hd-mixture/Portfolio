"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Users, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { initialTestimonials } from '@/components/sections/Testimonials';
import { AnimatePresence } from 'framer-motion';

interface DesignerTestimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
  designerSrc?: string;
  stars?: number;
}

export default function DesignerStatsTestimonial() {
  const [testimonials, setTestimonials] = useState<DesignerTestimonial[]>(initialTestimonials);
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const scrollDirection = useRef<'down' | 'up' | 'none'>('none');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setTestimonials(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch testimonials from backend", error);
      }
    };
    fetchTestimonials();
  }, []);

  // Cleanup interval on unmount or active change
  useEffect(() => {
    scrollDirection.current = 'none';
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    return () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
  }, [active]);

  const handleMouseEnter = () => {
    if (!scrollRef.current) return;

    // Clear existing to avoid multiple intervals
    if (scrollInterval.current) clearInterval(scrollInterval.current);

    scrollInterval.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const { scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight) return;

      if (scrollDirection.current === 'down') {
        el.scrollTop += 2; // slightly faster for manual control
      } else if (scrollDirection.current === 'up') {
        el.scrollTop -= 2;
      }
    }, 30);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const percentage = relativeY / rect.height;

    // Top 40% scrolls up, Bottom 40% scrolls down, Middle 20% pauses
    if (percentage > 0.6) {
      scrollDirection.current = 'down';
    } else if (percentage < 0.4) {
      scrollDirection.current = 'up';
    } else {
      scrollDirection.current = 'none';
    }
  };

  const handleMouseLeave = () => {
    scrollDirection.current = 'none';
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
  };

  const handleNext = () => setActive((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const stats = [
    { icon: <CheckSquare className="w-5 h-5 text-pink-500" />, value: "500+", label: "Projects Completed" },
    { icon: <Users className="w-5 h-5 text-pink-500" />, value: "100+", label: "Happy Clients" },
    { icon: <Clock className="w-5 h-5 text-pink-500" />, value: "4+", label: "Years of Experience" },
    { icon: <Award className="w-5 h-5 text-pink-500" />, value: "1M+", label: "Designs Delivered" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-50 dark:border-[#333] flex flex-col h-fit"
    >

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center mb-3">
              {stat.icon}
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 3D Glass Testimonial Card - Fixed Height */}
      <div className="mt-8 relative rounded-[1.5rem] p-6 bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_20px_40px_rgba(31,38,135,0.1),_inset_1px_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),_inset_1px_1px_0_rgba(255,255,255,0.2)] overflow-hidden flex flex-col h-[270px]">

        {/* Shine Glare */}
        <div className="absolute top-0 left-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent -translate-x-[150%] skew-x-[-25deg]" style={{ animation: 'card-shimmer 8s infinite' }}></div>

        {/* Quote Icon */}
        <div className="absolute top-6 left-6 text-pink-500 opacity-30 z-0">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              <div
                ref={scrollRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                onTouchStart={handleMouseEnter}
                onTouchEnd={handleMouseLeave}
                className="overflow-hidden flex-1 mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-ns-resize"
                style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
              >
                <p className="text-gray-800 dark:text-gray-200 italic font-medium leading-relaxed pl-12 md:pl-14 text-[13px] md:text-sm pb-4">
                  "{testimonials[active]?.quote}"
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden relative shadow-sm shrink-0">
                    <Image 
                      src={testimonials[active]?.designerSrc || testimonials[active]?.src || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"} 
                      alt={testimonials[active]?.name || "Client"} 
                      fill 
                      className="object-cover transition-transform" 
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1 pr-2">
                    <h5 className="font-bold text-gray-900 dark:text-white text-xs md:text-sm truncate">{testimonials[active]?.name}</h5>
                    <p className="text-[10px] leading-[1.2] text-gray-600 dark:text-gray-400 font-medium mt-0.5 whitespace-normal break-words">{testimonials[active]?.designation}</p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2 shrink-0 z-20">
                  <button onClick={handlePrev} className="w-9 h-9 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-sm border border-gray-200/50 dark:border-[#444]/50 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-black hover:text-pink-500 hover:border-pink-300 transition-all shadow-sm">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={handleNext} className="w-9 h-9 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-sm border border-gray-200/50 dark:border-[#444]/50 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-black hover:text-pink-500 hover:border-pink-300 transition-all shadow-sm">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
}
