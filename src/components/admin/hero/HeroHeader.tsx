"use client";

import React from 'react';
import { Save, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export default function HeroHeader({ 
    isSaving, 
    persona 
}: { 
    isSaving: boolean; 
    persona: 'developer' | 'designer';
}) {
    const { formState: { isDirty } } = useFormContext();
    const canSave = isDirty && !isSaving;
    const isDesigner = persona === 'designer';

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#141724] p-6 sm:p-7 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        isDesigner 
                            ? 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-500/20' 
                            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'
                    }`}>
                        {persona} Landing Experience
                    </span>

                    {isDirty && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-200/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Unsaved Changes
                        </span>
                    )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Hero Section Studio
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 font-medium">
                    Configure high-impact greeting headlines, typewriter animations, and live social channels.
                </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                    type="submit"
                    disabled={!canSave}
                    className={`flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold rounded-2xl shadow-sm transition-all w-full md:w-auto ${
                        canSave 
                            ? isDesigner 
                                ? 'bg-pink-600 hover:bg-pink-700 text-white cursor-pointer shadow-pink-500/25 active:scale-95' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-blue-500/25 active:scale-95'
                            : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 shadow-none'
                    }`}
                >
                    {isSaving ? (
                        <>
                            <RefreshCw size={16} className="animate-spin text-white" /> 
                            <span>Saving Changes...</span>
                        </>
                    ) : (
                        <>
                            <Save size={16} /> 
                            <span>Save Hero Section</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
