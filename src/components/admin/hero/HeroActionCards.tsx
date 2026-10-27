"use client";

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { 
    Plus, Trash2, Globe, Eye, EyeOff, Sparkles, 
    Share2, ExternalLink, Link as LinkIcon 
} from 'lucide-react';
import Image from 'next/image';

// -------------------------------------------------------------
// SOCIAL LINKS STUDIO
// -------------------------------------------------------------
export function SocialLinksCard({ persona }: { persona: 'developer' | 'designer' }) {
    const { register, control, watch } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "socialLinks"
    });

    const isDesigner = persona === 'designer';

    // Popular platform presets
    const platformPresets = [
        { platform: 'GitHub', domain: 'github.com', defaultUrl: 'https://github.com/hdmix', icon: 'github' },
        { platform: 'LinkedIn', domain: 'linkedin.com', defaultUrl: 'https://linkedin.com/in/hdmixture', icon: 'linkedin' },
        { platform: 'Twitter', domain: 'twitter.com', defaultUrl: 'https://twitter.com/hdmixture', icon: 'twitter' },
        { platform: 'Instagram', domain: 'instagram.com', defaultUrl: 'https://instagram.com/hdmixture', icon: 'instagram' },
        { platform: 'Behance', domain: 'behance.net', defaultUrl: 'https://behance.net/hdmixture', icon: 'behance' },
        { platform: 'Dribbble', domain: 'dribbble.com', defaultUrl: 'https://dribbble.com/hdmixture', icon: 'dribbble' },
        { platform: 'WhatsApp', domain: 'whatsapp.com', defaultUrl: 'https://wa.me/919876543210', icon: 'whatsapp' },
        { platform: 'YouTube', domain: 'youtube.com', defaultUrl: 'https://youtube.com/@hdmixture', icon: 'youtube' },
    ];

    const handleAddPlatform = (preset: typeof platformPresets[0]) => {
        // Check if already added
        const currentLinks = fields.map((f: any) => f.platform?.toLowerCase());
        if (!currentLinks.includes(preset.platform.toLowerCase())) {
            append({
                id: Date.now().toString(),
                platform: preset.platform,
                url: preset.defaultUrl,
                visible: true
            });
        }
    };

    const getFavicon = (url: string) => {
        try {
            if (!url) return '';
            const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
            let domain = parsedUrl.hostname;
            if (domain.includes('wa.me') || domain.includes('wa.link')) domain = 'whatsapp.com';
            if (domain.includes('youtu.be')) domain = 'youtube.com';
            if (domain.includes('x.com')) domain = 'twitter.com';
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch {
            return '';
        }
    };

    return (
        <div className="bg-white dark:bg-[#141724] rounded-[28px] p-6 sm:p-7 border border-slate-200/80 dark:border-white/5 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                        isDesigner 
                            ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20' 
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                    }`}>
                        <Share2 size={18} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                            Hero Social Ecosystem
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                {fields.length} Links Connected
                            </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage clickable social icon badges displayed on your landing page.</p>
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={() => append({ id: Date.now().toString(), platform: 'Custom Link', url: '', visible: true })}
                    className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        isDesigner ? 'bg-pink-600 hover:bg-pink-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    <Plus size={15} /> Add Custom
                </button>
            </div>

            {/* Quick 1-Click Platform Adders */}
            <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Sparkles size={13} className="text-amber-500" />
                    <span>Quick Add Channels:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {platformPresets.map((preset, idx) => {
                        const isAdded = fields.some((f: any) => f.platform?.toLowerCase() === preset.platform.toLowerCase());
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleAddPlatform(preset)}
                                disabled={isAdded}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    isAdded 
                                        ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 cursor-default opacity-60' 
                                        : 'bg-slate-50 dark:bg-[#0c0e17] hover:bg-blue-50 dark:hover:bg-blue-500/15 border-slate-200/80 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-500/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer shadow-2xs'
                                }`}
                            >
                                <Plus size={12} className={isAdded ? "hidden" : "text-blue-500"} />
                                <span>{preset.platform}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Social Links List */}
            <div className="space-y-3">
                {fields.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-[#0c0e17] rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-400">
                        No social links added yet. Click one of the quick buttons above to connect your channels!
                    </div>
                ) : (
                    fields.map((item: any, index) => {
                        const currentUrl = watch(`socialLinks.${index}.url`);
                        const isVisible = watch(`socialLinks.${index}.visible`) !== false;
                        const favicon = getFavicon(currentUrl || item.url);

                        return (
                            <div 
                                key={item.id} 
                                className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 rounded-2xl border transition-all ${
                                    isVisible 
                                        ? 'bg-slate-50/80 dark:bg-[#0c0e17] border-slate-200/80 dark:border-white/5 hover:border-blue-500/30' 
                                        : 'bg-slate-100/40 dark:bg-white/[0.02] border-slate-200/40 dark:border-white/5 opacity-60'
                                }`}
                            >
                                {/* Favicon Icon Box */}
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1a1d2d] flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-white/5 shadow-xs overflow-hidden">
                                    {favicon ? (
                                        <Image src={favicon} alt="icon" width={20} height={20} className="object-contain" unoptimized />
                                    ) : (
                                        <Globe size={18} className="text-slate-400" />
                                    )}
                                </div>

                                {/* Platform Title */}
                                <div className="w-full sm:w-32 shrink-0">
                                    <input 
                                        {...register(`socialLinks.${index}.platform` as const)}
                                        placeholder="Platform Name"
                                        className="w-full px-2 py-1.5 bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none border-b border-transparent focus:border-blue-500"
                                    />
                                </div>

                                {/* Destination URL */}
                                <div className="flex-1">
                                    <input 
                                        {...register(`socialLinks.${index}.url` as const)}
                                        placeholder="https://..."
                                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#141724] border border-slate-200/80 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* Visibility Toggle & Delete */}
                                <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0">
                                    <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer bg-white dark:bg-[#1a1d2d] px-2.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                                        <input 
                                            type="checkbox" 
                                            {...register(`socialLinks.${index}.visible` as const)}
                                            className="rounded text-blue-600 focus:ring-0"
                                        />
                                        <span>Show</span>
                                    </label>

                                    {currentUrl && (
                                        <a 
                                            href={currentUrl.startsWith('http') ? currentUrl : `https://${currentUrl}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="w-8 h-8 rounded-xl bg-white dark:bg-[#1a1d2d] hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200/60 dark:border-white/5 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                                            title="Test Link in New Tab"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    )}

                                    <button 
                                        type="button" 
                                        onClick={() => remove(index)}
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                                        title="Remove Link"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
