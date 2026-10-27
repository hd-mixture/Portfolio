"use client";

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AboutHeader from '@/components/admin/about/AboutHeader';
import { 
    BasicInfoCard, 
    BiographyCard, 
    ResumeUploadCard, 
    IllustrationCard,
    ServicesCard
} from '@/components/admin/about/AboutContentCards';
import AdminLoadingState from '@/components/admin/AdminLoadingState';

const aboutSchema = z.object({
    tagline: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    resumeUrl: z.string().optional(),
    illustrationImage: z.string().optional(),
    services: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        icon: z.string()
    }))
});

export type AboutFormValues = z.infer<typeof aboutSchema>;

export default function AboutAdminPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activePersona, setActivePersona] = useState<'developer' | 'designer'>('developer');

    const methods = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            tagline: "",
            description: "",
            resumeUrl: "",
            illustrationImage: "",
            services: []
        }
    });

    useEffect(() => {
        const fetchAboutData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/about?persona=${activePersona}`);
                if (res.ok) {
                    const data = await res.json();
                    methods.reset({
                        tagline: data.tagline || "",
                        description: data.description || "",
                        resumeUrl: data.resumeUrl || "",
                        illustrationImage: data.illustrationImage || "",
                        services: data.services || []
                    });
                }
            } catch (error) {
                console.error("Failed to fetch about data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutData();
    }, [activePersona, methods]);

    const { isDirty } = methods.formState;

    const onSubmit = async (data: AboutFormValues) => {
        setIsSaving(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/about?persona=${activePersona}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                // Update defaultValues to current data to clear isDirty
                methods.reset(data);
            }
        } catch (error) {
            console.error("Failed to update about data", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLoadingState 
                title="Loading About Section..."
                subtitle="Fetching biography, services offered & illustration assets"
                minHeight="min-h-[500px]"
            />
        );
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 pb-20 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">About Me</h1>
                        <p className="text-slate-500 dark:text-gray-400 mt-1">Manage your biography and professional summary.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative inline-flex bg-slate-100/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200/50 dark:border-white/5 w-full sm:w-auto shadow-inner">
                            <button
                                type="button"
                                onClick={() => setActivePersona('developer')}
                                className={`relative flex-1 sm:flex-none justify-center px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 min-w-[140px] z-10 ${
                                    activePersona === 'developer' 
                                        ? 'text-blue-600 dark:text-blue-400 shadow-md bg-white dark:bg-[#2a2a2a] ring-1 ring-slate-200/80 dark:ring-white/10' 
                                        : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 hover:bg-slate-200/50 dark:hover:bg-white/5'
                                }`}
                            >
                                <i className="fa-solid fa-code"></i> Developer
                            </button>
                            <button
                                type="button"
                                onClick={() => setActivePersona('designer')}
                                className={`relative flex-1 sm:flex-none justify-center px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 min-w-[140px] z-10 ${
                                    activePersona === 'designer' 
                                        ? 'text-pink-600 dark:text-pink-400 shadow-md bg-white dark:bg-[#2a2a2a] ring-1 ring-slate-200/80 dark:ring-white/10' 
                                        : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 hover:bg-slate-200/50 dark:hover:bg-white/5'
                                }`}
                            >
                                <i className="fa-solid fa-palette"></i> Designer
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSaving || !isDirty}
                            className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center w-full sm:w-auto mt-4 sm:mt-0"
                        >
                            {isSaving ? (
                                <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving...</>
                            ) : (
                                <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="w-full">
                    
                    {activePersona === 'developer' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr w-full items-stretch">
                            <BasicInfoCard />
                            <ResumeUploadCard />
                            <BiographyCard />
                            <IllustrationCard />
                        </div>
                    )}

                    {activePersona === 'designer' && (
                        <div className="flex flex-col gap-6 w-full">
                            <div className="w-full">
                                <BiographyCard />
                            </div>
                            <div className="w-full">
                                <ServicesCard />
                            </div>
                        </div>
                    )}

                </div>
                
            </form>
        </FormProvider>
    );
}
