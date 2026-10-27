import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Send, Search, Lightbulb, CloudUpload, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

// -------------------------------------------------------------
// PUBLISHING CARD
// -------------------------------------------------------------
export function PublishingCard() {
    const { register, watch } = useFormContext();
    const status = watch('status');

    return (
        <div className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 mb-4">
                <Send size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Publishing</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">Control the visibility of the About section.</p>

            <div className="space-y-4">
                <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Status</label>
                    <div className="relative">
                        <select 
                            {...register("status")}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm appearance-none cursor-pointer pl-8"
                        >
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                            <option value="Hidden">Hidden</option>
                        </select>
                        {status === 'Published' && <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500"></div>}
                        {status === 'Draft' && <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-500"></div>}
                        {status === 'Hidden' && <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400"></div>}
                        
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700">Last Updated</span>
                    <span className="text-xs text-slate-500">3 July, 2026 at 11:15 AM</span>
                </div>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// SEO CARD
// -------------------------------------------------------------
export function SEOCard() {
    const { register, watch } = useFormContext();
    const metaDescription = watch('metaDescription') || '';
    const keywords = watch('keywords') || '';

    return (
        <div className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 mb-4">
                <Search size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">SEO Settings</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">Optimize this section for search engines.</p>

            <div className="space-y-4">
                <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">Meta Title</label>
                    <input {...register("metaTitle")} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" />
                </div>
                
                <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">Meta Description</label>
                    <textarea 
                        {...register("metaDescription")} 
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm resize-none"
                    ></textarea>
                    <div className="absolute bottom-3 right-3 text-[9px] font-semibold text-slate-400">
                        {metaDescription.length} / 160
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">Keywords</label>
                    <textarea 
                        {...register("keywords")} 
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm resize-none"
                    ></textarea>
                    <div className="absolute bottom-3 right-3 text-[9px] font-semibold text-slate-400">
                        {keywords.length} / 200
                    </div>
                </div>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// QUICK TIPS CARD
// -------------------------------------------------------------
export function QuickTipsCard() {
    const tips = [
        "Write a compelling tagline.",
        "Keep biography professional yet personal.",
        "Ensure resume PDF is under 5MB.",
        "Test Lottie animation URL."
    ];

    return (
        <div className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Quick Tips</h3>
            </div>
            
            <ul className="space-y-3">
                {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{tip}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
