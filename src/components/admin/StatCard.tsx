import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    growth?: string;
    icon: LucideIcon;
    colorClass: string;
    bgClass: string;
    subtext?: string;
}

export default function StatCard({ title, value, growth, icon: Icon, colorClass, bgClass, subtext }: StatCardProps) {
    // Extract base color (e.g. text-blue-600 -> bg-blue-600) for the glow effect
    const glowClass = colorClass.replace('text-', 'bg-');
    
    return (
        <div className="group relative overflow-hidden bg-white dark:bg-[#0a0a0a] rounded-2xl p-5 border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-black/50">
            {/* Subtle Gradient Glow Background on Hover */}
            <div className={`absolute -right-20 -top-20 w-48 h-48 blur-3xl opacity-0 group-hover:opacity-[0.15] dark:group-hover:opacity-20 transition-opacity duration-700 rounded-full ${glowClass} pointer-events-none`}></div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClass} dark:bg-opacity-10 ${colorClass} ring-1 ring-black/5 dark:ring-white/10 shadow-sm`}>
                        <Icon size={20} strokeWidth={2.5} />
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-100 dark:border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</p>
                    </div>
                </div>
                
                <div>
                    <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{value}</h3>
                        {growth && (
                            <span className="flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-500/20">
                                <TrendingUp size={12} strokeWidth={3} className="mr-0.5" />
                                +{growth}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                            {growth ? 'vs last month' : subtext}
                        </p>
                        
                        {/* Decorative Sparkline */}
                        <div className="w-16 h-5 opacity-30 dark:opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                            <svg viewBox="0 0 100 30" className={`w-full h-full ${colorClass}`}>
                                <path d="M0,25 Q10,25 20,15 T40,20 T60,10 T80,15 T100,5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
