"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Monitor, Smartphone, Tablet, RotateCcw, Sparkles, 
    ExternalLink, CheckCircle2, ArrowRight, Eye, Play, Pause, RefreshCw 
} from 'lucide-react';

interface InteractiveHeroSimulatorProps {
    persona: 'developer' | 'designer';
    profileImage?: string;
    typewriterTexts: { id: string; text: string }[];
    typingSpeed?: number;
    delayBetween?: number;
    loopAnimation?: boolean;
    socialLinks: { id: string; platform: string; url: string; visible?: boolean }[];
}

export default function InteractiveHeroSimulator({
    persona,
    profileImage = "/Logos/hd_image.png",
    typewriterTexts = [],
    typingSpeed = 80,
    delayBetween = 1500,
    loopAnimation = true,
    socialLinks = []
}: InteractiveHeroSimulatorProps) {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Live Typewriter Effect Engine
    useEffect(() => {
        if (!typewriterTexts.length || isPaused) return;

        const validTexts = typewriterTexts.map(t => t.text).filter(Boolean);
        if (!validTexts.length) {
            setDisplayedText(persona === 'developer' ? 'Full Stack Developer' : 'Graphic Designer');
            return;
        }

        const currentFullText = validTexts[currentTextIndex % validTexts.length];
        
        const timer = setTimeout(() => {
            if (!isDeleting) {
                // Typing forward
                if (displayedText.length < currentFullText.length) {
                    setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
                } else {
                    // Reached full text -> wait delay then delete
                    if (validTexts.length > 1 || loopAnimation) {
                        setTimeout(() => setIsDeleting(true), delayBetween);
                    }
                }
            } else {
                // Deleting backward
                if (displayedText.length > 0) {
                    setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
                } else {
                    // Fully deleted -> move to next text
                    setIsDeleting(false);
                    setCurrentTextIndex((prev) => (prev + 1) % validTexts.length);
                }
            }
        }, isDeleting ? Math.max(30, typingSpeed / 2) : Math.max(30, typingSpeed));

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, currentTextIndex, typewriterTexts, typingSpeed, delayBetween, loopAnimation, isPaused, persona]);

    const handleRestartTypewriter = () => {
        setCurrentTextIndex(0);
        setDisplayedText('');
        setIsDeleting(false);
        setIsPaused(false);
    };

    const isDesigner = persona === 'designer';
    const activeSocials = socialLinks.filter(s => s.visible !== false && s.url);

    return (
        <div className="bg-white dark:bg-[#141724] rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-sm overflow-hidden flex flex-col sticky top-6">
            {/* Top Toolbar */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Eye size={14} className="text-blue-500" />
                        Live Interactive Simulator
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Device Viewport Toggle */}
                    <div className="bg-slate-200/80 dark:bg-white/10 p-0.5 rounded-xl flex items-center">
                        <button
                            type="button"
                            onClick={() => setViewMode('desktop')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white dark:bg-[#1f2333] text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                            title="Desktop View"
                        >
                            <Monitor size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('mobile')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white dark:bg-[#1f2333] text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                            title="Mobile View"
                        >
                            <Smartphone size={14} />
                        </button>
                    </div>

                    {/* Play/Pause Simulator */}
                    <button
                        type="button"
                        onClick={() => setIsPaused(!isPaused)}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all text-xs font-bold"
                        title={isPaused ? "Resume Animation" : "Pause Animation"}
                    >
                        {isPaused ? <Play size={14} className="text-emerald-500" /> : <Pause size={14} />}
                    </button>

                    {/* Reset Simulator */}
                    <button
                        type="button"
                        onClick={handleRestartTypewriter}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all text-xs font-bold"
                        title="Replay from Beginning"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>

            {/* Device Canvas Frame */}
            <div className="p-6 bg-slate-100/70 dark:bg-[#0c0e17] flex items-center justify-center min-h-[460px] overflow-hidden">
                <motion.div
                    layout
                    className={`transition-all duration-300 bg-slate-900 text-white rounded-[24px] shadow-2xl border border-white/10 overflow-hidden relative ${
                        viewMode === 'mobile' ? 'w-[320px] p-5' : 'w-full max-w-[620px] p-8'
                    }`}
                >
                    {/* Ambient Background Light in preview */}
                    <div className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-[70px] pointer-events-none ${isDesigner ? 'bg-pink-600/20' : 'bg-blue-600/25'}`} />
                    <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-600/15 rounded-full blur-[70px] pointer-events-none" />

                    {/* Status Bar for mobile */}
                    {viewMode === 'mobile' && (
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-4 pb-2 border-b border-white/5">
                            <span>9:41 AM</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>Portfolio Live</span>
                            </div>
                        </div>
                    )}

                    <div className={`flex ${viewMode === 'mobile' ? 'flex-col items-center text-center gap-5' : 'items-center justify-between gap-6'}`}>
                        {/* Left Info / Text */}
                        <div className="space-y-3 flex-1 min-w-0">
                            {/* Available Badge */}
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Available for Work</span>
                            </div>

                            {/* Main Greeting */}
                            <div>
                                <p className="text-xs font-semibold text-slate-400">Hello, I'm</p>
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                                    Darshan Prajapati
                                </h2>
                            </div>

                            {/* Live Typewriter Headline */}
                            <div className="min-h-[32px] flex items-center">
                                <span className={`text-base sm:text-lg font-black tracking-tight ${
                                    isDesigner 
                                        ? 'bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent' 
                                        : 'bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent'
                                }`}>
                                    {displayedText}
                                </span>
                                <span className="w-0.5 h-5 bg-blue-400 ml-1 animate-pulse" />
                            </div>

                            {/* Social Icons Row in Simulator */}
                            <div className={`flex items-center gap-2 pt-2 ${viewMode === 'mobile' ? 'justify-center flex-wrap' : ''}`}>
                                {activeSocials.length > 0 ? (
                                    activeSocials.slice(0, 5).map((s, idx) => (
                                        <div 
                                            key={idx}
                                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-xs text-slate-300 transition-all hover:scale-110"
                                            title={`${s.platform}: ${s.url}`}
                                        >
                                            <span className="font-bold text-[10px] uppercase">{s.platform.slice(0, 2)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-[11px] text-slate-500 italic">No visible social links</span>
                                )}
                            </div>
                        </div>

                        {/* Right Avatar Preview in Simulator */}
                        <div className="relative shrink-0">
                            <div className={`relative rounded-full p-1 bg-gradient-to-tr ${
                                isDesigner ? 'from-pink-500 via-purple-500 to-amber-400' : 'from-blue-500 via-indigo-500 to-cyan-400'
                            } shadow-xl shadow-blue-500/10`}>
                                <div className={`rounded-full overflow-hidden bg-slate-800 relative ${
                                    viewMode === 'mobile' ? 'w-24 h-24' : 'w-32 h-32'
                                }`}>
                                    <Image
                                        src={profileImage || "/Logos/hd_image.png"}
                                        alt="Avatar Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA preview buttons */}
                    <div className={`mt-6 pt-4 border-t border-white/5 flex gap-2.5 ${viewMode === 'mobile' ? 'flex-col' : ''}`}>
                        <div className={`px-4 py-2 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md ${
                            isDesigner ? 'bg-pink-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                            <span>View Portfolio</span>
                            <ArrowRight size={12} />
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold text-center hover:bg-white/15 transition-colors">
                            <span>Get in Touch</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Tip Footer */}
            <div className="p-4 bg-slate-50/80 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500 shrink-0" />
                    <span>Real-time animation mirror</span>
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-400">
                    {typingSpeed}ms / {delayBetween}ms
                </span>
            </div>
        </div>
    );
}
