"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AdminLoadingStateProps {
  title?: string;
  subtitle?: string;
  minHeight?: string;
}

export default function AdminLoadingState({
  title = "Loading Section...",
  subtitle = "Fetching live CMS records & data",
  minHeight = "min-h-[420px]"
}: AdminLoadingStateProps) {
  return (
    <div className={`w-full ${minHeight} flex flex-col items-center justify-center p-8 relative overflow-hidden rounded-[32px]`}>
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[90px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[70px] pointer-events-none -z-10" />

      {/* Center Animated Monogram / Spinner Box */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Pulsing Outer Rings */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-3.5 rounded-3xl bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-md"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-2 rounded-[22px] border-2 border-dashed border-blue-500/30 dark:border-blue-400/20"
        />

        {/* Center Card with Logo */}
        <div className="relative w-16 h-16 rounded-2xl bg-black border border-white/10 shadow-2xl flex items-center justify-center p-3 overflow-hidden group">
          <Image
            src="/Logos/hd_logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="w-full h-full object-contain filter drop-shadow-md animate-pulse"
          />
        </div>
      </div>

      {/* Text & Dynamic Progress Indicator */}
      <div className="flex flex-col items-center text-center max-w-sm space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold shadow-xs">
          <Sparkles size={13} className="animate-spin text-blue-500" style={{ animationDuration: '3s' }} />
          <span>{title}</span>
        </div>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {subtitle}
        </p>

        {/* Modern Animated Gradient Progress Bar */}
        <div className="w-48 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mt-3 relative border border-slate-200/40 dark:border-white/5">
          <motion.div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-full"
            initial={{ left: "-40%", width: "40%" }}
            animate={{ left: "100%", width: "40%" }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
}
