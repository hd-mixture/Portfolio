"use client";

import React from 'react';
import Link from 'next/link';
import { 
    Edit2, Plus, UploadCloud, Star, Folder, Image as ImageIcon, 
    Briefcase, Settings, ChevronRight, CheckCircle2, ArrowRight
} from 'lucide-react';

export function RecentActivity() {
    const activities = [
        { id: 1, title: 'Updated Hero Section', desc: 'Changed name and designation', time: '2 min ago', icon: Edit2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { id: 2, title: 'Added New Project', desc: 'Modern Office Interior', time: '1 hour ago', icon: Plus, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
        { id: 3, title: 'Uploaded New Resume', desc: 'Resume_Darshan.pdf', time: '3 hours ago', icon: UploadCloud, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
        { id: 4, title: 'Added Testimonial', desc: 'From John Doe', time: '5 hours ago', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
        { id: 5, title: 'Edited About Me', desc: 'Updated description', time: '1 day ago', icon: Edit2, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-500/10' },
    ];

    return (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Activity Pulse</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your latest portfolio changes</p>
                </div>
                <button className="group flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 transition-all">
                    View All <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
            <div className="relative flex-1 space-y-7 before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-slate-200 dark:before:from-white/10 before:via-slate-200 dark:before:via-white/10 before:to-transparent">
                {activities.map((act) => (
                    <div key={act.id} className="relative flex items-start justify-between group cursor-default">
                        <div className="flex items-start gap-4">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center relative z-10 ${act.bg} ${act.color} ring-4 ring-white dark:ring-[#0a0a0a] group-hover:scale-110 transition-transform duration-300`}>
                                <act.icon size={16} strokeWidth={2.5} />
                            </div>
                            <div className="pt-0.5">
                                <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{act.title}</p>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{act.desc}</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 pt-1">{act.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LayersIcon(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>;
}

export function QuickActions() {
    const actions = [
        { href: '/admin/projects', icon: Folder, label: 'New Project', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'hover:border-blue-200 dark:hover:border-blue-500/30' },
        { href: '/admin/hero', icon: UploadCloud, label: 'Upload Resume', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'hover:border-emerald-200 dark:hover:border-emerald-500/30' },
        { href: '/admin/testimonials', icon: Star, label: 'Add Testimonial', color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'hover:border-purple-200 dark:hover:border-purple-500/30' },
        { href: '/admin/internships', icon: Briefcase, label: 'Add Internship', color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'hover:border-orange-200 dark:hover:border-orange-500/30' },
        { href: '/admin/media', icon: ImageIcon, label: 'Upload Media', color: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10', border: 'hover:border-cyan-200 dark:hover:border-cyan-500/30' },
        { href: '/admin/hero', icon: UserIcon, label: 'Update Hero', color: 'text-pink-500 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-500/10', border: 'hover:border-pink-200 dark:hover:border-pink-500/30' },
    ];

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 shadow-sm flex-1">
                <div className="mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Quick Actions</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Create or update content</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {actions.map((act, i) => (
                        <Link key={i} href={act.href} className={`flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all duration-300 group ${act.border}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${act.bg} ${act.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <act.icon size={16} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{act.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
            {/* Premium CTA Card */}
            <div className="relative overflow-hidden rounded-2xl p-6 border border-blue-500/20 shadow-lg shadow-blue-500/10 bg-gradient-to-br from-blue-600 to-indigo-700">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <div className="mt-0.5 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                            <Star size={20} className="text-white" fill="currentColor" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white tracking-tight mb-1">Portfolio Pro</h4>
                            <p className="text-blue-100/80 text-xs max-w-[180px] leading-relaxed font-medium">Configure advanced settings and SEO optimizations.</p>
                        </div>
                    </div>
                    <Link href="/admin/settings" className="bg-white/10 hover:bg-white text-white hover:text-blue-700 border border-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
                        Settings
                    </Link>
                </div>
            </div>
        </div>
    );
}

function UserIcon(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

export function PortfolioCompletion() {
    const checklist = [
        { label: 'Hero Section', done: true },
        { label: 'About Me', done: true },
        { label: 'Projects', done: true },
        { label: 'Internships', done: true },
        { label: 'Testimonials', done: true },
        { label: 'Skills', done: false, soon: true },
        { label: 'Contact Details', done: true },
    ];

    return (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 shadow-sm h-full flex flex-col relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>

            <div className="mb-6 relative z-10">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Completion</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Profile setup progress</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center relative z-10">
                {/* Modern Neon Progress Ring */}
                <div className="relative w-32 h-32 mb-8">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-white/5" />
                        <circle cx="50" cy="50" r="42" fill="transparent" stroke="url(#blueGradient)" strokeWidth="8" strokeDasharray="263.89" strokeDashoffset="47.5" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                        <defs>
                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">82%</span>
                    </div>
                </div>

                <div className="w-full space-y-3.5 mb-6">
                    {checklist.map((item, i) => (
                        <div key={i} className="flex items-center justify-between group">
                            <span className={`text-xs font-bold ${item.done ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>{item.label}</span>
                            {item.soon ? (
                                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">Soon</span>
                            ) : item.done ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 size={12} className="text-emerald-500 dark:text-emerald-400" strokeWidth={3} />
                                </div>
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-white/10"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
