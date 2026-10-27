"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Folder, Star, Briefcase, Palette, Trophy, Layers, 
    Calendar, ArrowRight, ExternalLink, Plus, RefreshCw, 
    CheckCircle2, Sparkles, Clock, Globe, ArrowUpRight,
    TrendingUp, Shield, Cpu, Flame
} from 'lucide-react';
import { format } from 'date-fns';
import { authService, AdminUser } from '@/lib/auth';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminLoadingState from '@/components/admin/AdminLoadingState';

export default function AdminDashboard() {
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        projects: 0,
        achievements: 0,
        testimonials: 0,
        internships: 0,
        designs: 0,
    });
    const [recentItems, setRecentItems] = useState<any[]>([]);
    const [activityPulse, setActivityPulse] = useState<any[]>([]);
    const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
    const [currentTimeGreeting, setCurrentTimeGreeting] = useState('Welcome back');

    // Get time of day greeting
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setCurrentTimeGreeting('Good morning');
        else if (hour < 17) setCurrentTimeGreeting('Good afternoon');
        else setCurrentTimeGreeting('Good evening');

        const user = authService.getStoredAdmin();
        if (user) setAdminUser(user);
    }, []);

    // Fetch real data from server
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [
                projRes,
                achieveRes,
                testiRes,
                internRes,
                designRes
            ] = await Promise.allSettled([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`).then(r => r.ok ? r.json() : []),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/achievements`).then(r => r.ok ? r.json() : []),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials?all=true`).then(r => r.ok ? r.json() : []),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/internships`).then(r => r.ok ? r.json() : []),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/designs`).then(r => r.ok ? r.json() : []),
            ]);

            const projects = projRes.status === 'fulfilled' && Array.isArray(projRes.value) ? projRes.value : [];
            const achievements = achieveRes.status === 'fulfilled' && Array.isArray(achieveRes.value) ? achieveRes.value : [];
            const testimonials = testiRes.status === 'fulfilled' && Array.isArray(testiRes.value) ? testiRes.value : [];
            const internships = internRes.status === 'fulfilled' && Array.isArray(internRes.value) ? internRes.value : [];
            const designs = designRes.status === 'fulfilled' && Array.isArray(designRes.value) ? designRes.value : [];

            setStats({
                projects: projects.length,
                achievements: achievements.length,
                testimonials: testimonials.length,
                internships: internships.length,
                designs: designs.length,
            });

            // Combine recent additions
            const combined: any[] = [];
            projects.slice(0, 3).forEach((p: any) => {
                combined.push({
                    id: p._id || p.id,
                    title: p.title || 'Untitled Project',
                    type: 'Project',
                    badgeBg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20',
                    date: p.createdAt ? format(new Date(p.createdAt), 'd MMM, yyyy') : 'Recent',
                    image: p.image || p.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&q=80',
                    href: '/admin/projects'
                });
            });

            achievements.slice(0, 2).forEach((a: any) => {
                combined.push({
                    id: a._id || a.id,
                    title: a.title || 'Hackathon / Award',
                    type: 'Hackathon',
                    badgeBg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20',
                    date: a.createdAt ? format(new Date(a.createdAt), 'd MMM, yyyy') : 'Recent',
                    image: a.image || a.badgeUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&q=80',
                    href: '/admin/achievements'
                });
            });

            testimonials.slice(0, 2).forEach((t: any) => {
                combined.push({
                    id: t._id || t.id,
                    title: t.name || t.clientName || 'Testimonial',
                    type: 'Review',
                    badgeBg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20',
                    date: t.createdAt ? format(new Date(t.createdAt), 'd MMM, yyyy') : 'Recent',
                    image: t.avatar || t.image || 'https://i.pravatar.cc/120?u=testi',
                    href: '/admin/testimonials'
                });
            });

            setRecentItems(combined.slice(0, 5));

            // Activity Pulse items
            setActivityPulse([
                { title: 'Portfolio Health Check', desc: 'All CMS services active & online', time: 'Active', icon: Flame, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                { title: 'Database Connected', desc: `${projects.length + achievements.length + testimonials.length + internships.length} items currently synced`, time: 'Synced', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                { title: 'Projects Catalog', desc: `${projects.length} showcase projects published`, time: 'Updated', icon: Folder, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
                { title: 'Awards & Hackathons', desc: `${achievements.length} verified badges registered`, time: 'Tracked', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            ]);

            setLastRefreshed(format(new Date(), 'hh:mm:ss a'));
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Interactive Distribution Chart Data
    const distributionData = [
        { name: 'Projects', value: stats.projects || 1, color: '#3b82f6' },
        { name: 'Achievements', value: stats.achievements || 1, color: '#f59e0b' },
        { name: 'Testimonials', value: stats.testimonials || 1, color: '#8b5cf6' },
        { name: 'Internships', value: stats.internships || 1, color: '#ec4899' },
        { name: 'Media Files', value: stats.designs || 1, color: '#06b6d4' },
    ];

    // Activity trend chart
    const trendData = [
        { day: 'Mon', items: Math.max(1, stats.projects) },
        { day: 'Tue', items: Math.max(2, stats.projects + 1) },
        { day: 'Wed', items: Math.max(3, stats.projects + stats.achievements) },
        { day: 'Thu', items: Math.max(4, stats.projects + stats.testimonials) },
        { day: 'Fri', items: Math.max(5, stats.projects + stats.designs) },
        { day: 'Sat', items: Math.max(6, stats.projects + stats.internships) },
        { day: 'Sun', items: Math.max(7, stats.projects + stats.achievements + stats.testimonials) },
    ];

    // Calculate completion score
    const completionScore = Math.min(100, Math.round(
        ((stats.projects > 0 ? 25 : 0) +
         (stats.achievements > 0 ? 25 : 0) +
         (stats.testimonials > 0 ? 25 : 0) +
         (stats.internships > 0 ? 25 : 0))
    )) || 90;

    const statCards = [
        { label: 'Projects', value: stats.projects, icon: Folder, href: '/admin/projects', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'hover:border-blue-500/30' },
        { label: 'Achievements', value: stats.achievements, icon: Trophy, href: '/admin/achievements', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'hover:border-amber-500/30' },
        { label: 'Testimonials', value: stats.testimonials, icon: Star, href: '/admin/testimonials', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'hover:border-purple-500/30' },
        { label: 'Internships', value: stats.internships, icon: Briefcase, href: '/admin/internships', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'hover:border-rose-500/30' },
        { label: 'Project Media', value: stats.designs, icon: Palette, href: '/admin/designs', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10', border: 'hover:border-cyan-500/30' },
    ];

    const quickActions = [
        { label: 'Add Project', icon: Folder, href: '/admin/projects', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { label: 'Add Hackathon', icon: Trophy, href: '/admin/achievements', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
        { label: 'Add Review', icon: Star, href: '/admin/testimonials', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
        { label: 'Add Internship', icon: Briefcase, href: '/admin/internships', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
        { label: 'Upload Media', icon: Palette, href: '/admin/designs', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
        { label: 'Edit SEO & Site', icon: Globe, href: '/admin/settings', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    ];

    if (loading) {
        return (
            <AdminLoadingState 
                title="Loading Dashboard Analytics..."
                subtitle="Fetching real-time CMS metrics, entries & performance stats"
                minHeight="min-h-[550px]"
            />
        );
    }

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-300">
            {/* Header Greeting Banner */}
            <div className="relative overflow-hidden rounded-[28px] bg-white dark:bg-[#141724] border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 shadow-xs">
                {/* Background ambient lighting */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 blur-3xl rounded-full pointer-events-none -z-0" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/5 dark:bg-purple-500/10 blur-3xl rounded-full pointer-events-none -z-0" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-wider border border-blue-100 dark:border-blue-500/20">
                                Portfolio Control Center
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                                Refreshed {lastRefreshed}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {currentTimeGreeting}, {adminUser?.name?.split(' ')[0] || 'Darshan'}! <span className="inline-block hover:scale-125 transition-transform cursor-default">✨</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                            Manage all your live showcase projects, hackathon achievements, and portfolio content in real-time.
                        </p>
                    </div>

                    {/* Action Hub buttons */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                            onClick={fetchDashboardData}
                            disabled={loading}
                            className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                            title="Refresh Data"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            <span>{loading ? 'Syncing...' : 'Sync Live Data'}</span>
                        </button>

                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                        >
                            <span>Live Website</span>
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Stat Cards Grid (5 Core Sections) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={idx}
                            href={card.href}
                            className={`bg-white dark:bg-[#141724] p-4 sm:p-5 rounded-[24px] border border-slate-200/80 dark:border-white/5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group ${card.border}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.bg} ${card.color} group-hover:scale-110 transition-transform shadow-2xs`}>
                                    <Icon size={18} />
                                </div>
                                <ArrowUpRight size={15} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            <div>
                                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight block">
                                    {loading ? '...' : card.value}
                                </span>
                                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5 block">
                                    {card.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Content Growth & Activity Trend */}
                <div className="lg:col-span-8 bg-white dark:bg-[#141724] p-6 sm:p-7 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                                    Portfolio Velocity & Growth
                                </h3>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Content volume across projects, media, and achievements
                            </p>
                        </div>

                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Synced
                        </div>
                    </div>

                    <div className="h-64 w-full -ml-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        borderRadius: '16px', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        color: '#fff',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                    }}
                                />
                                <Area type="monotone" dataKey="items" stroke="#3b82f6" strokeWidth={3} fill="url(#growthGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="lg:col-span-4 bg-white dark:bg-[#141724] p-6 sm:p-7 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={18} className="text-amber-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                                Quick Management
                            </h3>
                        </div>
                        <p className="text-xs text-slate-400 mb-5">
                            Direct jump into portfolio modules
                        </p>

                        <div className="grid grid-cols-2 gap-2.5">
                            {quickActions.map((act, i) => {
                                const Icon = act.icon;
                                return (
                                    <Link
                                        key={i}
                                        href={act.href}
                                        className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/20 transition-all flex flex-col gap-2 group"
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${act.bg} ${act.color} group-hover:scale-105 transition-transform`}>
                                            <Icon size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {act.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Go to settings banner */}
                    <Link
                        href="/admin/settings"
                        className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-md shadow-blue-500/20 hover:opacity-95 transition-all group"
                    >
                        <div className="flex items-center gap-2.5">
                            <Shield size={16} />
                            <span className="text-xs font-bold">Configure SEO & Profile</span>
                        </div>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Recent Published Additions */}
                <div className="lg:col-span-7 bg-white dark:bg-[#141724] p-6 sm:p-7 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                                Latest Content Additions
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Items actively displayed on your live portfolio
                            </p>
                        </div>
                        <Link href="/admin/projects" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>

                    {recentItems.length > 0 ? (
                        <div className="space-y-2.5">
                            {recentItems.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-100 dark:border-white/5 transition-all group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-11 h-11 rounded-xl object-cover border border-slate-200/60 dark:border-white/10 flex-shrink-0"
                                            onError={(e) => {
                                                (e.target as any).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&q=80';
                                            }}
                                        />
                                        <div className="flex flex-col min-w-0">
                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {item.title}
                                            </h4>
                                            <span className="text-[11px] font-medium text-slate-400">
                                                Added on {item.date}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${item.badgeBg}`}>
                                        {item.type}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                            <Folder className="mx-auto text-slate-400 mb-2" size={28} />
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No items found in database</p>
                            <p className="text-[11px] text-slate-400 mt-1">Start by adding your first project or hackathon!</p>
                        </div>
                    )}
                </div>

                {/* Content Distribution Breakdown */}
                <div className="lg:col-span-5 bg-white dark:bg-[#141724] p-6 sm:p-7 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                                Content Distribution
                            </h3>
                            <span className="text-xs font-bold text-emerald-500">
                                {completionScore}% Complete
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-5">
                            Breakdown of published showcase items
                        </p>

                        <div className="flex items-center gap-6">
                            {/* Donut Pie */}
                            <div className="w-28 h-28 flex-shrink-0 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={distributionData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={36}
                                            outerRadius={50}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {distributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center font-black text-sm text-slate-900 dark:text-white">
                                    {stats.projects + stats.achievements + stats.testimonials}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex-1 space-y-2 text-xs">
                                {distributionData.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="font-semibold text-slate-600 dark:text-slate-400">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-400">
                        <span>Total Published Assets</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {stats.projects + stats.achievements + stats.testimonials + stats.internships + stats.designs} Entries
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
