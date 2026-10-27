"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Plus, Edit2, Trash2, Image as ImageIcon, Loader2, Search, 
    Filter, ChevronLeft, ChevronRight, LayoutGrid, HardDrive, Images, 
    ArrowUpDown, FileImage
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import DesignFormModal, { DesignFormValues } from '@/components/admin/designs/DesignFormModal';
import AdminLoadingState from '@/components/admin/AdminLoadingState';

interface DesignItem {
    _id: string;
    title: string;
    category: string;
    caption?: string;
    src: string;
    size?: number;
    dimensions?: string;
    createdAt: string;
    isFeatured?: boolean; // Mock support for featured badge
}

export default function GraphicDesignsAdminPage() {
    const [designs, setDesigns] = useState<DesignItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DesignItem | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Filter/Sort State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [sortBy, setSortBy] = useState("Newest");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    const categoryRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // Close custom dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setCategoryDropdownOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchDesigns();
    }, []);

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/designs`);
            const data = await res.json();
            setDesigns(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: DesignFormValues, id?: string) => {
        const url = id ? `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/designs/${id}` : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/designs`;
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Failed to save");
        await fetchDesigns();
    };

    const confirmDelete = (id: string) => {
        setDeleteConfirmId(id);
    };

    const executeDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/designs/${id}`, { method: 'DELETE' });
            
            // Allow animation to play out before removing
            setTimeout(() => {
                setDesigns(prev => prev.filter(d => d._id !== id));
                setDeleteConfirmId(null);
                setDeletingId(null);
            }, 500);
        } catch (error) {
            console.error(error);
            setDeleteConfirmId(null);
            setDeletingId(null);
        }
    };

    // --- Derived Data ---
    const uniqueCategories = useMemo(() => {
        const cats = new Set(designs.map(d => d.category));
        return ["All Categories", ...Array.from(cats)];
    }, [designs]);

    const formatBytes = (bytes: number = 0) => {
        if (bytes === 0) return 'Unknown Size';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const totalStorageBytes = useMemo(() => designs.reduce((acc, curr) => acc + (curr.size || 0), 0), [designs]);

    const filteredAndSortedDesigns = useMemo(() => {
        let result = [...designs];

        if (searchQuery) {
            result = result.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (selectedCategory !== "All Categories") {
            result = result.filter(d => d.category === selectedCategory);
        }

        const getTime = (dateString: any) => {
            if (!dateString) return 0;
            const time = new Date(dateString).getTime();
            return isNaN(time) ? 0 : time;
        };

        switch(sortBy) {
            case "Newest":
                result.sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt));
                break;
            case "Oldest":
                result.sort((a, b) => getTime(a.createdAt) - getTime(b.createdAt));
                break;
            case "Name A-Z":
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "Name Z-A":
                result.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case "Largest File":
                result.sort((a, b) => (b.size || 0) - (a.size || 0));
                break;
            case "Smallest File":
                result.sort((a, b) => (a.size || 0) - (b.size || 0));
                break;
        };

        return result;
    }, [designs, searchQuery, selectedCategory, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredAndSortedDesigns.length / itemsPerPage));
    const paginatedDesigns = filteredAndSortedDesigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination when filters change
    useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory, sortBy]);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return { date: '-', time: '-' };
        const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return { date, time };
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1400px] mx-auto">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-400 dark:text-slate-500 mb-2">
                        <span>Admin</span>
                        <ChevronRight size={14} className="opacity-50" />
                        <span className="text-slate-900 dark:text-white">Project Media</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                            <Images size={20} />
                        </div>
                        <div>
                            <h1 className="text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight">Project Media</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-[14px] font-medium mt-0.5">Upload, manage and organize media assets for your featured work.</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }} 
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 w-full sm:w-auto"
                >
                    <Plus size={18} /> Add Media
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Total Media", value: designs.length, desc: "All uploaded assets", icon: <Images size={20} />, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
                    { title: "Categories", value: Math.max(0, uniqueCategories.length - 1), desc: "Media categories", icon: <FileImage size={20} />, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                    { title: "Storage Used", value: formatBytes(totalStorageBytes), desc: "Total storage space", icon: <HardDrive size={20} />, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
                    { title: "Media Displayed", value: filteredAndSortedDesigns.length, desc: "Across all projects", icon: <LayoutGrid size={20} />, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#1a1c23] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <div className="text-[22px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{stat.value}</div>
                            <div className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">{stat.title}</div>
                            <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{stat.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-white dark:bg-[#1a1c23] p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search media by title..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 bg-slate-50 dark:bg-[#0f1115] focus:bg-white dark:focus:bg-[#1a1c23] text-slate-900 dark:text-white text-[14px] font-medium transition-all outline-none"
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Custom Category Dropdown */}
                    <div 
                        ref={categoryRef}
                        className="relative min-w-[180px]" 
                        onClick={() => { setSortDropdownOpen(false); setCategoryDropdownOpen(!categoryDropdownOpen); }}
                    >
                        <div className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1115] text-[13px] font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all cursor-pointer flex items-center h-[46px]">
                            <LayoutGrid className="absolute left-4 text-slate-400 dark:text-slate-500" size={16} />
                            <span className="truncate">{selectedCategory}</span>
                            <ChevronRight className={`absolute right-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${categoryDropdownOpen ? '-rotate-90' : 'rotate-90'}`} size={14} />
                        </div>
                        
                        {categoryDropdownOpen && (
                            <div className="absolute top-[calc(100%+8px)] left-0 min-w-[200px] bg-white dark:bg-[#1a1c23] rounded-xl border border-slate-100 dark:border-slate-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden z-30 py-1.5 animate-in fade-in zoom-in-95 duration-200">
                                {uniqueCategories.map(cat => (
                                    <div 
                                        key={cat}
                                        onClick={() => { setSelectedCategory(cat); setCategoryDropdownOpen(false); }}
                                        className={`px-4 py-2.5 text-[13px] font-bold cursor-pointer transition-colors flex items-center justify-between mx-1.5 rounded-lg ${
                                            selectedCategory === cat ? 'bg-indigo-50/80 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#0f1115]'
                                        }`}
                                    >
                                        <span className="truncate">{cat}</span>
                                        {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 ml-3"></div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Custom Sort Dropdown */}
                    <div 
                        ref={sortRef}
                        className="relative min-w-[160px]"
                        onClick={() => { setCategoryDropdownOpen(false); setSortDropdownOpen(!sortDropdownOpen); }}
                    >
                        <div className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1115] text-[13px] font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all cursor-pointer flex items-center h-[46px]">
                            <ArrowUpDown className="absolute left-4 text-slate-400 dark:text-slate-500" size={16} />
                            <span className="truncate">{sortBy}</span>
                            <ChevronRight className={`absolute right-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${sortDropdownOpen ? '-rotate-90' : 'rotate-90'}`} size={14} />
                        </div>

                        {sortDropdownOpen && (
                            <div className="absolute top-[calc(100%+8px)] right-0 sm:left-0 min-w-[180px] bg-white dark:bg-[#1a1c23] rounded-xl border border-slate-100 dark:border-slate-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden z-30 py-1.5 animate-in fade-in zoom-in-95 duration-200">
                                {["Newest", "Oldest", "Name A-Z", "Name Z-A", "Largest File", "Smallest File"].map(option => (
                                    <div 
                                        key={option}
                                        onClick={() => { setSortBy(option); setSortDropdownOpen(false); }}
                                        className={`px-4 py-2 text-[13px] font-bold cursor-pointer transition-colors flex items-center justify-between mx-1.5 rounded-lg ${
                                            sortBy === option ? 'bg-indigo-50/80 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#0f1115]'
                                        }`}
                                    >
                                        <span className="truncate">{option}</span>
                                        {sortBy === option && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 ml-3"></div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative group/toggle flex items-center justify-center">
                        <button 
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                            className="w-[46px] h-[46px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1115] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a1c23] hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-all shrink-0 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] active:scale-[0.95]"
                        >
                            {viewMode === 'grid' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                            )}
                        </button>
                        <div className="absolute top-[calc(100%+8px)] right-0 opacity-0 invisible group-hover/toggle:opacity-100 group-hover/toggle:visible transition-all duration-200 z-20">
                            <div className="bg-slate-800 dark:bg-slate-700 text-white text-[12px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                                Switch to {viewMode === 'grid' ? 'List' : 'Grid'} View
                                <div className="absolute -top-1 right-4 w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45 rounded-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Area */}
            {loading ? (
                <div className="bg-white dark:bg-[#141724] rounded-[28px] border border-slate-200/80 dark:border-white/5 p-4 shadow-xs">
                    <AdminLoadingState 
                        title="Loading Media & Designs Gallery..."
                        subtitle="Fetching visual assets, logos, UI shots & dimensions"
                        minHeight="min-h-[400px]"
                    />
                </div>
            ) : paginatedDesigns.length === 0 ? (
                <div className="bg-white dark:bg-[#1a1c23] rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] p-6 py-20 text-center flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center border border-slate-100 dark:border-slate-800 mb-2 shadow-sm">
                        <Images size={32} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-extrabold text-slate-800 dark:text-white mb-1">
                            {searchQuery ? 'No matching media' : 'No media found'}
                        </h3>
                        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 max-w-[250px] mx-auto">
                            {searchQuery ? 'Try another title or select a different category.' : 'There are no media assets in this category yet.'}
                        </p>
                    </div>
                    {searchQuery ? (
                        <button onClick={() => setSearchQuery('')} className="mt-2 px-5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[13px] font-bold transition-colors">
                            Clear Search
                        </button>
                    ) : (
                        <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-[13px] font-bold transition-colors flex items-center gap-2">
                            <Plus size={16} /> Add Media
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {viewMode === 'list' ? (
                        /* --- LIST VIEW (Independent Cards) --- */
                        <div className="space-y-4">
                            {paginatedDesigns.map((item) => {
                                const { date, time } = formatDate(item.createdAt);
                                const isFeatured = item.isFeatured || item.category === "LOGO DESIGN"; 
                                const fileName = item.src.split('/').pop() || 'image.png';

                                return (
                                    <div 
                                        key={item._id} 
                                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                                        className="group bg-white dark:bg-[#1a1c23] rounded-[20px] border border-slate-200/60 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.99] transition-all duration-300 cursor-pointer overflow-hidden relative flex flex-col md:flex-row items-stretch"
                                    >
                                        {/* Left accent line on hover */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

                                        {/* Image Area */}
                                        <div className="relative w-full md:w-[220px] shrink-0 bg-slate-50 dark:bg-[#0f1115] aspect-video md:aspect-auto">
                                            {item.src ? (
                                                <Image src={item.src} alt={item.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <ImageIcon size={28} className="text-slate-300 dark:text-slate-700" />
                                                </div>
                                            )}
                                            {isFeatured && (
                                                <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wide bg-blue-600/90 backdrop-blur-sm text-white shadow-sm flex items-center gap-1 z-10">
                                                    <span>★</span> Featured
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-1 p-5 md:p-6 flex flex-col justify-center min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                                <div className="min-w-0">
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white text-[16px] md:text-[18px] mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {item.title}
                                                    </h4>
                                                    <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                                                        <span className="truncate max-w-[200px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold" title={fileName}>{fileName}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0"></span>
                                                        <span>{formatBytes(item.size)}</span>
                                                        {item.dimensions && (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0"></span>
                                                                <span>{item.dimensions}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Meta Info (Desktop Right Aligned) */}
                                                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1 shrink-0">
                                                    <span className="px-3 py-1.5 rounded-lg text-[12px] font-bold tracking-wide bg-blue-50/50 dark:bg-blue-500/10 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-500/20 group-hover:border-blue-100 dark:group-hover:border-blue-500/30 transition-colors">
                                                        {item.category || 'Unknown'}
                                                    </span>
                                                    <div className="text-right hidden md:block">
                                                        <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 block">{date}</span>
                                                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">{time}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hover Actions (Absolute on Desktop, Inline on Mobile) */}
                                            <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0" onClick={(e) => e.stopPropagation()}>
                                                <div className="bg-white/90 dark:bg-[#1a1c23]/90 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1">
                                                    <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-all" title="Edit">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => confirmDelete(item._id)} className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all" title="Delete">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Mobile Actions */}
                                            <div className="flex md:hidden items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                                                    <Edit2 size={16} /> Edit
                                                </button>
                                                <button onClick={() => confirmDelete(item._id)} className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* --- GRID VIEW --- */
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <AnimatePresence mode="popLayout">
                                {paginatedDesigns.map((item) => {
                                    const isFeatured = item.isFeatured || item.category === "LOGO DESIGN"; 
                                    const fileName = item.src.split('/').pop() || 'image.png';

                                    return (
                                        <motion.div 
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                                            transition={{ duration: 0.4 }}
                                            key={item._id} 
                                            className={`group [perspective:1000px] h-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${deletingId === item._id ? 'opacity-0 scale-90 blur-md pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}
                                        >
                                            <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] relative ${deleteConfirmId === item._id ? '[transform:rotateY(180deg)]' : ''}`}>
                                            
                                            {/* FRONT FACE */}
                                            <div className="w-full h-full bg-white dark:bg-[#1a1c23] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden [backface-visibility:hidden]">
                                                {/* Image Area */}
                                                <div className="relative w-full aspect-[4/3] bg-slate-50 dark:bg-[#0f1115] overflow-hidden">
                                                    {item.src ? (
                                                        <Image src={item.src} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <ImageIcon size={32} className="text-slate-300 dark:text-slate-700" />
                                                        </div>
                                                    )}
                                                    
                                                    {/* Featured Badge Overlay */}
                                                    {isFeatured && (
                                                        <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-blue-600/90 backdrop-blur-sm text-white shadow-sm flex items-center gap-1">
                                                            <span>★</span> Featured
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Card Info Area */}
                                                <div className="p-4 flex flex-col flex-1">
                                                    <div className="flex items-start justify-between gap-3 mb-1">
                                                        <h4 className="font-extrabold text-slate-900 dark:text-white text-[15px] truncate" title={item.title}>
                                                            {item.title}
                                                        </h4>
                                                        <button className="w-6 h-6 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0f1115] rounded-md transition-colors shrink-0">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                                                        </button>
                                                    </div>

                                                    <div className="text-[12px] font-medium text-slate-500 dark:text-slate-400 mb-0.5 truncate" title={fileName}>
                                                        {fileName} <span className="mx-1">·</span> {formatBytes(item.size)}
                                                    </div>
                                                    
                                                    {item.dimensions && (
                                                        <div className="text-[12px] font-medium text-slate-400 dark:text-slate-500 mb-4">
                                                            {item.dimensions}
                                                        </div>
                                                    )}
                                                    
                                                    {!item.dimensions && <div className="mb-4"></div>}

                                                    {/* Footer Area */}
                                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                                                            {item.category || 'Unknown'}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0f1115] border border-transparent transition-all" title="Edit">
                                                                <Edit2 size={13} />
                                                            </button>
                                                            <button onClick={() => confirmDelete(item._id)} className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent transition-all" title="Delete">
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* BACK FACE (Delete Confirmation) */}
                                            <div className="absolute inset-0 w-full h-full bg-white dark:bg-[#1a1c23] rounded-2xl border border-red-200 dark:border-red-900/30 flex flex-col items-center justify-center p-6 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
                                                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                                                    <Trash2 size={24} />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Media?</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This action cannot be undone. This media asset will be permanently removed.</p>
                                                <div className="flex items-center gap-3 w-full">
                                                    <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#2a2d35] dark:hover:bg-[#333742] text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-colors">Cancel</button>
                                                    <button onClick={() => executeDelete(item._id)} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-[0_4px_12px_rgba(220,38,38,0.3)] transition-all hover:-translate-y-0.5">Delete</button>
                                                </div>
                                            </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            )}

            {/* Pagination Container (Shared for both views) */}
            {filteredAndSortedDesigns.length > 0 && !loading && (
                <div className="px-6 py-4 border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a1c23] rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                    <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                        Showing <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredAndSortedDesigns.length)}</span> of <span className="font-bold text-slate-800 dark:text-white">{filteredAndSortedDesigns.length}</span> results
                    </div>
                    
                    <div className="flex items-center p-1.5 bg-slate-50 dark:bg-[#0f1115] border border-slate-200/60 dark:border-slate-800 rounded-full">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-[#1a1c23] hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        
                        <div className="flex items-center px-1 gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded-full text-[13px] font-bold transition-all ${
                                        currentPage === page 
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm' 
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-[#1a1c23] hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <DesignFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingItem={editingItem}
            />
        </div>
    );
}
