"use client";

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { 
    CloudUpload, GripVertical, Plus, Trash2, Edit2, 
    Sparkles, RefreshCw, Sliders, Zap, Check, Type,
    Image as ImageIcon, HelpCircle
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";

// -------------------------------------------------------------
// PROFILE IMAGE STUDIO
// -------------------------------------------------------------
export function ProfileImageUploader({ persona }: { persona: 'developer' | 'designer' }) {
    const { watch, setValue } = useFormContext();
    const [uploading, setUploading] = React.useState(false);
    const profileImage = watch('profileImage');
    const { toast } = useToast();
    const isDesigner = persona === 'designer';
    
    const handleActualUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('image', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                body: data
            });
            let result;
            try {
                result = await res.json();
            } catch (e) {
                result = { message: "Server returned an invalid response." };
            }

            if (res.ok) {
                setValue('profileImage', result.url, { shouldDirty: true, shouldValidate: true });
                toast({
                    title: "Image Uploaded Successfully",
                    description: "Your hero profile picture is updated.",
                });
            } else {
                toast({
                    title: "Upload Failed",
                    description: result.message || "Something went wrong during upload.",
                    variant: "destructive"
                });
            }
        } catch (err: any) {
            console.error(err);
            toast({
                title: "Network Error",
                description: "Failed to connect to backend server.",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#141724] rounded-[28px] p-6 sm:p-7 border border-slate-200/80 dark:border-white/5 shadow-xs relative overflow-hidden space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                        isDesigner 
                            ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20' 
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                    }`}>
                        <ImageIcon size={18} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-base">Hero Profile Avatar</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Featured visual portrait on your landing hero section.</p>
                    </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                    isDesigner ? 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}>
                    {persona} Mode
                </span>
            </div>
            
            {/* Content Row */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 items-center pt-1">
                {/* Left: Avatar Circle Preview */}
                <div className="w-full sm:w-auto lg:w-full xl:w-auto flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0c0e17] rounded-[24px] border border-slate-100 dark:border-white/5 shrink-0">
                    <div className="relative group">
                        <div className={`w-32 h-32 rounded-full p-1 bg-gradient-to-tr ${
                            isDesigner ? 'from-pink-500 via-purple-500 to-amber-400' : 'from-blue-500 via-indigo-500 to-cyan-400'
                        } shadow-xl relative`}>
                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 relative">
                                <Image 
                                    src={profileImage || "/Logos/hd_image.png"} 
                                    alt="Profile" 
                                    fill 
                                    className="object-cover" 
                                    unoptimized 
                                />
                            </div>

                            {/* Hover Change Trigger */}
                            <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <CloudUpload size={22} className="mb-1 text-white" />
                                <span className="text-[11px] font-bold">Replace</span>
                                <input type="file" accept="image/*" onChange={handleActualUpload} className="hidden" />
                            </label>
                        </div>

                        {/* Floating Status Ring Badge */}
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#141724] shadow-md flex items-center justify-center" title="Active on Website">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 w-full">
                        <label className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                            isDesigner 
                                ? 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-500/15 text-pink-600 dark:text-pink-400' 
                                : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        }`}>
                            <input type="file" accept="image/*" onChange={handleActualUpload} className="hidden" />
                            <CloudUpload size={14} /> Upload
                        </label>

                        {profileImage && profileImage !== "/Logos/hd_image.png" && (
                            <button 
                                type="button" 
                                onClick={() => setValue('profileImage', '/Logos/hd_image.png', { shouldDirty: true, shouldValidate: true })} 
                                className="py-2 px-3 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 bg-white dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/5 hover:border-red-200 rounded-xl transition-all"
                                title="Reset to Default"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Right: Dropzone Container */}
                <div className="w-full flex-1 h-full min-h-[140px]">
                    <label className="w-full h-full min-h-[140px] border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-400 rounded-[24px] p-5 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-[#0c0e17]/50 hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-all cursor-pointer group relative">
                        <input type="file" accept="image/*" onChange={handleActualUpload} className="hidden" />
                        
                        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#1a1d2d] shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 group-hover:text-blue-500 transition-all text-slate-400">
                            {uploading ? <RefreshCw size={18} className="animate-spin text-blue-500" /> : <CloudUpload size={18} />}
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                            {uploading ? 'Uploading to CDN...' : 'Drop your portrait image here'}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                            PNG, JPG, or WebP (1:1 Square)
                        </p>
                    </label>
                </div>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// TYPEWRITER STUDIO
// -------------------------------------------------------------
export function TypewriterEditor({ persona }: { persona: 'developer' | 'designer' }) {
    const { register, control, watch, setValue } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "typewriterTexts"
    });

    const isDesigner = persona === 'designer';
    const typingSpeed = watch('typingSpeed') || 80;
    const delayBetween = watch('delayBetween') || 1500;
    const loopAnimation = watch('loopAnimation');

    // Quick presets for convenience
    const developerPresets = [
        "Full Stack Developer", "Creative UI/UX Engineer", 
        "Next.js & Node.js Specialist", "Mobile App Developer", 
        "Open Source Builder"
    ];

    const designerPresets = [
        "Brand Identity Designer", "Visual & Graphic Artist", 
        "UI/UX Product Designer", "Typography & Poster Creator", 
        "3D & Motion Enthusiast"
    ];

    const currentPresets = isDesigner ? designerPresets : developerPresets;

    const handleAddPreset = (presetText: string) => {
        // Prevent duplicate addition
        const existing = fields.map((f: any) => f.text);
        if (!existing.includes(presetText)) {
            append({ id: Date.now().toString(), text: presetText });
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
                        <Type size={18} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                            Typewriter Strings Lab
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                Live Typing
                            </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Rotating headlines displayed dynamically right below your greeting.</p>
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={() => append({ id: Date.now().toString(), text: "" })}
                    className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        isDesigner ? 'bg-pink-600 hover:bg-pink-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    <Plus size={15} /> Add Line
                </button>
            </div>

            {/* Quick Presets Cloud */}
            <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Sparkles size={13} className="text-amber-500" />
                    <span>Quick Suggestion Chips (Click to append):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {currentPresets.map((preset, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddPreset(preset)}
                            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0c0e17] hover:bg-blue-50 dark:hover:bg-blue-500/15 border border-slate-200/80 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-500/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        >
                            <Plus size={11} className="text-slate-400" />
                            <span>{preset}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* String Items List */}
            <div className="space-y-3">
                {fields.map((item, index) => (
                    <div 
                        key={item.id} 
                        className="group flex items-center gap-3 p-2 bg-slate-50/80 dark:bg-[#0c0e17] rounded-2xl border border-slate-200/80 dark:border-white/5 hover:border-blue-500/30 transition-all"
                    >
                        <div className="w-7 h-7 rounded-xl bg-white dark:bg-[#1a1d2d] flex items-center justify-center text-[11px] font-black text-slate-400 border border-slate-200/60 dark:border-white/5 shadow-xs shrink-0">
                            {index + 1}
                        </div>

                        <input 
                            {...register(`typewriterTexts.${index}.text` as const)}
                            placeholder="e.g. Full Stack Developer & UI Designer"
                            className="flex-1 px-3 py-2 bg-transparent text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                        />

                        <button 
                            type="button" 
                            onClick={() => remove(index)}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete String"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Interactive Motion & Timing Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Typing Speed Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Zap size={14} className="text-amber-500" />
                            Typing Speed
                        </label>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md">
                            {typingSpeed} ms
                        </span>
                    </div>
                    <input 
                        type="range" 
                        min={20} 
                        max={200} 
                        step={5}
                        {...register("typingSpeed", { valueAsNumber: true })}
                        className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                        <span>Fast (20ms)</span>
                        <span>Smooth (80ms)</span>
                        <span>Cinematic (200ms)</span>
                    </div>
                </div>

                {/* Delay Between Words Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Sliders size={14} className="text-indigo-500" />
                            Pause Delay
                        </label>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
                            {(delayBetween / 1000).toFixed(1)} s
                        </span>
                    </div>
                    <input 
                        type="range" 
                        min={500} 
                        max={4000} 
                        step={100}
                        {...register("delayBetween", { valueAsNumber: true })}
                        className="w-full accent-indigo-600 dark:accent-indigo-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                        <span>0.5s (Quick)</span>
                        <span>1.5s (Default)</span>
                        <span>4.0s (Long)</span>
                    </div>
                </div>

                {/* Loop Animation Toggle Switch */}
                <div className="flex flex-col justify-between space-y-2 bg-slate-50 dark:bg-[#0c0e17] p-3.5 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Loop Repeat</span>
                            <span className="text-[10px] text-slate-400">Continuous typing loop</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" {...register("loopAnimation")} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
