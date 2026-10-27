"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Code2, Palette, Layers } from 'lucide-react';

import HeroHeader from '@/components/admin/hero/HeroHeader';
import { 
    ProfileImageUploader, 
    TypewriterEditor 
} from '@/components/admin/hero/HeroContentCards';
import { SocialLinksCard } from '@/components/admin/hero/HeroActionCards';
import { useToast } from "@/hooks/use-toast";
import AdminLoadingState from '@/components/admin/AdminLoadingState';

const heroSchema = z.object({
    profileImage: z.string().optional(),
    typewriterTexts: z.array(z.object({
        id: z.string(),
        text: z.string()
    })).min(1, "Add at least one text"),
    typingSpeed: z.coerce.number().min(10),
    delayBetween: z.coerce.number().min(100),
    loopAnimation: z.boolean(),
    socialLinks: z.array(z.object({
        id: z.string(),
        platform: z.string(),
        url: z.string(),
        visible: z.boolean().optional()
    })),
});

export type HeroFormValues = z.infer<typeof heroSchema>;

export default function HeroAdminPage() {
    const [activePersona, setActivePersona] = useState<'developer' | 'designer'>('developer');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const methods = useForm<HeroFormValues>({
        resolver: zodResolver(heroSchema),
        defaultValues: {
            profileImage: "/Logos/hd_image.png",
            typewriterTexts: [],
            typingSpeed: 80,
            delayBetween: 1500,
            loopAnimation: true,
            socialLinks: []
        }
    });

    useEffect(() => {
        const fetchHero = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/hero?persona=${activePersona}`);
                if (res.ok) {
                    let data;
                    try {
                        data = await res.json();
                    } catch(e) {
                        data = null;
                    }
                    if (data) {
                        methods.reset({
                            profileImage: data.profileImage || "/Logos/hd_image.png",
                            typewriterTexts: data.typewriterTexts?.length ? data.typewriterTexts : [
                                { id: '1', text: activePersona === 'developer' ? "Full Stack Developer" : "Graphic Designer" }
                            ],
                            typingSpeed: data.typingSpeed || 80,
                            delayBetween: data.delayBetween || 1500,
                            loopAnimation: data.loopAnimation ?? true,
                            socialLinks: data.socialLinks?.length ? data.socialLinks : []
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch hero settings:", err);
                toast({
                    title: "Failed to load",
                    description: "Could not connect to the server to fetch settings.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchHero();
    }, [activePersona, methods, toast]);

    const onSubmit = async (data: HeroFormValues) => {
        setIsSaving(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/hero`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, persona: activePersona })
            });
            if (!res.ok) throw new Error('Failed to save');
            
            methods.reset(data); // Clears dirty state
            toast({
                title: "Changes Saved Successfully",
                description: `${activePersona === 'developer' ? 'Developer' : 'Designer'} hero settings are now live on your portfolio.`,
            });
        } catch (err) {
            console.error(err);
            toast({
                title: "Save Failed",
                description: "Failed to save hero section. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    const watchedValues = methods.watch();

    if (isLoading) {
        return (
            <AdminLoadingState 
                title="Loading Hero Section Studio..."
                subtitle="Fetching hero profile, typewriter prompts & social links"
                minHeight="min-h-[550px]"
            />
        );
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 pb-20 animate-in fade-in duration-500 w-full">
                
                {/* Modern Header */}
                <HeroHeader isSaving={isSaving} persona={activePersona} />

                {/* Persona Mode Switcher Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#141724] p-3 sm:p-4 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs">
                    <div className="flex items-center gap-2.5 px-3">
                        <Layers size={16} className="text-blue-500" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Select Persona Configuration:
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-[#0c0e17] p-1.5 rounded-2xl w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setActivePersona('developer')}
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                                activePersona === 'developer' 
                                    ? 'bg-white dark:bg-[#1f2333] text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-slate-200/80 dark:ring-white/10' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                            }`}
                        >
                            <Code2 size={15} />
                            Developer Persona
                        </button>
                        <button
                            type="button"
                            onClick={() => setActivePersona('designer')}
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                                activePersona === 'designer' 
                                    ? 'bg-white dark:bg-[#1f2333] text-pink-600 dark:text-pink-400 shadow-sm ring-1 ring-slate-200/80 dark:ring-white/10' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                            }`}
                        >
                            <Palette size={15} />
                            Designer Persona
                        </button>
                    </div>
                </div>

                {/* 2-Column Responsive Studio Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Avatar Portrait Studio & Social Ecosystem */}
                    <div className="lg:col-span-5 space-y-6">
                        <ProfileImageUploader persona={activePersona} />
                        <SocialLinksCard persona={activePersona} />
                    </div>

                    {/* Right Column: Typewriter Strings Lab & Motion Controls */}
                    <div className="lg:col-span-7 space-y-6">
                        <TypewriterEditor persona={activePersona} />
                    </div>
                </div>
                
            </form>
        </FormProvider>
    );
}
