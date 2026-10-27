"use client";

import React from 'react';
import Image from 'next/image';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, HardDrive, ArrowUpRight } from 'lucide-react';

export function ContentOverview() {
    const data = [
        { name: 'Jun 1', views: 5 },
        { name: 'Jun 8', views: 15 },
        { name: 'Jun 15', views: 35 },
        { name: 'Jun 22', views: 20 },
        { name: 'Jun 29', views: 40 },
    ];

    return (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 shadow-sm h-full flex flex-col relative overflow-hidden group">
            {/* Subtle Chart Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100"></div>

            <div className="flex items-start justify-between mb-8 relative z-10">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Content Performance</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Profile views over time</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    This Month <ChevronDown size={14} className="opacity-50" />
                </div>
            </div>
            
            <div className="flex-1 w-full relative z-10 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorViewsDark" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dx={-10} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', padding: '8px 12px' }}
                            itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}
                            labelStyle={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViewsDark)" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function StorageOverview() {
    const data = [
        { name: 'Images', value: 1.1, color: '#3b82f6' },
        { name: 'Documents', value: 0.2, color: '#8b5cf6' },
        { name: 'Others', value: 0.1, color: '#10b981' },
    ];

    return (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 shadow-sm h-full flex flex-col">
            <div className="mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Storage Usage</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Media and document space</p>
            </div>
            
            <div className="flex flex-row items-center gap-8 flex-1">
                {/* Modern Donut Chart */}
                <div className="relative w-32 h-32 flex-shrink-0 drop-shadow-xl">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={48}
                                outerRadius={64}
                                paddingAngle={6}
                                dataKey="value"
                                cornerRadius={8}
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <HardDrive size={20} className="text-slate-400 dark:text-slate-500 mb-1" />
                        <span className="text-sm font-black text-slate-900 dark:text-white leading-none">28%</span>
                    </div>
                </div>

                {/* Storage Breakdown & Stats */}
                <div className="flex-1 flex flex-col justify-center gap-5">
                    <div className="space-y-4">
                        {data.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{ backgroundColor: item.color }}></div>
                                    <span className="font-semibold text-slate-600 dark:text-slate-400">{item.name}</span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white">{item.value} GB</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 dark:border-white/5 pt-5">
                <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">1.4 GB <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">/ 5 GB</span></p>
                </div>
                <button className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
                    Manage
                </button>
            </div>
        </div>
    );
}

export function LatestUpdates() {
    const updates = [
        { id: 1, title: 'Modern Office Interior', type: 'Project', typeColor: 'text-blue-600 dark:text-blue-400', typeBg: 'bg-blue-50 dark:bg-blue-500/10', date: '2 July, 2026', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&q=80' },
        { id: 2, title: 'John Doe', type: 'Testimonial', typeColor: 'text-purple-600 dark:text-purple-400', typeBg: 'bg-purple-50 dark:bg-purple-500/10', date: '1 July, 2026', image: 'https://i.pravatar.cc/150?u=johndoe' },
        { id: 3, title: 'Acme Corporation', type: 'Internship', typeColor: 'text-orange-600 dark:text-orange-400', typeBg: 'bg-orange-50 dark:bg-orange-500/10', date: '30 June, 2026', image: 'https://static.wixstatic.com/media/8daa46_6ca56cecc3a143c78f1453d2f2b71293~mv2.png/v1/fill/w_68,h_68,q_85,usm_0.66_1.00_0.01/8daa46_6ca56cecc3a143c78f1453d2f2b71293~mv2.png' },
    ];

    return (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Recent Additions</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Newly published items</p>
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors">
                    <ArrowUpRight size={16} />
                </button>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1 -mr-1">
                {updates.map((update) => (
                    <div key={update.id} className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors border border-transparent dark:hover:border-white/5 group">
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                <Image src={update.image} alt={update.title} width={44} height={44} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mb-0.5">{update.title}</h4>
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{update.date}</span>
                            </div>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${update.typeBg} ${update.typeColor}`}>
                            {update.type}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
