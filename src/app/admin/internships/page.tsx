"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Check, Briefcase, Calendar, MapPin, Loader2, Link as LinkIcon, Upload, FileText, ChevronDown, CloudUpload, Building2, ExternalLink, Lightbulb, Moon, Eye, ChevronRight, FileOutput } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoadingState from '@/components/admin/AdminLoadingState';

interface Internship {
    _id: string;
    role: string;
    company: string;
    type: string;
    location: string;
    date: string;
    status: string;
    description: string;
    logo: string;
    companyUrl?: string;
    color?: string;
    skills?: string[];
    letter?: string;
    gapToNext?: string;
    isCustomLogo?: boolean;
    order?: number;
}

export default function InternshipsAdmin() {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Internship | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingLetter, setUploadingLetter] = useState(false);
    
    // Toggle state for logo input mode
    const [logoMode, setLogoMode] = useState<'link' | 'upload'>('upload');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    const [durations, setDurations] = useState<{ start: string, end: string, isOngoing: boolean }[]>([
        { start: '', end: '', isOngoing: false }
    ]);
    const [pickerOpen, setPickerOpen] = useState<{ index: number, type: 'start' | 'end' } | null>(null);
    const [pickerYear, setPickerYear] = useState<number>(new Date().getFullYear());
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formatMonthYear = (val: string) => {
        if (!val) return '';
        const date = new Date(val + '-01');
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const parseStringToDateInput = (str: string) => {
        if (!str || str.toLowerCase() === 'present') return '';
        const d = new Date(str + ' 1');
        if (isNaN(d.getTime())) return '';
        const m = (d.getMonth() + 1).toString().padStart(2, '0');
        return `${d.getFullYear()}-${m}`;
    };

    const handleMonthSelect = (index: number, type: 'start' | 'end', monthIndex: number) => {
        const val = `${pickerYear}-${(monthIndex + 1).toString().padStart(2, '0')}`;
        const newDurations = [...durations];
        newDurations[index][type] = val;
        setDurations(newDurations);
        setPickerOpen(null);
    };

    const formatDisplay = (val: string) => {
        if (!val || val.length < 7) return 'Select Date';
        const [y, m] = val.split('-');
        const monthIndex = parseInt(m, 10) - 1;
        if (monthIndex < 0 || monthIndex > 11) return 'Select Date';
        return `${MONTHS[monthIndex]} ${y}`;
    };

    const [formData, setFormData] = useState({
        role: '', company: '', companyUrl: '', type: 'Internship', location: '', status: 'current', 
        description: '', logo: '', color: '#4CAF50', skills: '', letter: '', isCustomLogo: false, order: 0
    });

    const [initialFormData, setInitialFormData] = useState(formData);
    const [initialDurations, setInitialDurations] = useState(durations);

    const hasChanges = React.useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(initialFormData) || 
               JSON.stringify(durations) !== JSON.stringify(initialDurations);
    }, [formData, initialFormData, durations, initialDurations]);

    useEffect(() => {
        fetchInternships();
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isModalOpen]);

    const fetchInternships = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/internships`);
            const data = await res.json();
            setInternships(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'letter') => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        if (field === 'logo') setUploadingLogo(true);
        if (field === 'letter') setUploadingLetter(true);
        
        const data = new FormData();
        data.append('image', e.target.files[0]); // assuming the upload endpoint handles any file as 'image' field for generic upload

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, [field]: result.url }));
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            alert('Upload error');
        } finally {
            if (field === 'logo') setUploadingLogo(false);
            if (field === 'letter') setUploadingLetter(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingItem 
                ? `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/internships/${editingItem._id}` 
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/internships`;
            const method = editingItem ? 'PUT' : 'POST';

            const dateStr = durations.map(d => {
                const s = formatMonthYear(d.start);
                const e = d.isOngoing ? 'Present' : formatMonthYear(d.end);
                if (s && e && s === e && !d.isOngoing) return s;
                if (s && e) return `${s} - ${e}`;
                if (s) return s;
                return '';
            }).filter(Boolean).join(' & ');

            // Convert comma-separated string back to array before saving
            const payload = {
                ...formData,
                date: dateStr,
                skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : []
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchInternships();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const confirmDelete = (id: string) => setDeleteConfirmId(id);

    const executeDelete = async () => {
        if (!deleteConfirmId) return;
        setDeletingId(deleteConfirmId);
        const idToDelete = deleteConfirmId;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/internships/${idToDelete}`, { method: 'DELETE' });
            
            setTimeout(() => {
                setInternships(prev => prev.filter(i => i._id !== idToDelete));
                setDeleteConfirmId(null);
                setDeletingId(null);
            }, 500);
        } catch (error) {
            console.error(error);
            setDeleteConfirmId(null);
            setDeletingId(null);
        }
    };

    const openModal = (item?: Internship) => {
        let newFormData, newDurations;
        
        if (item) {
            setEditingItem(item);
            newFormData = {
                role: item.role || '', 
                company: item.company || '', 
                companyUrl: item.companyUrl || '',
                type: item.type || 'Internship',
                location: item.location || '', 
                status: item.status || 'current',
                description: item.description || '', 
                logo: item.logo || '',
                color: item.color || '#4CAF50',
                skills: item.skills ? item.skills.join(', ') : '',
                letter: item.letter || '',
                isCustomLogo: item.isCustomLogo || false,
                order: item.order || 0
            };
            setFormData(newFormData);
            
            // If it's a URL but doesn't look like an uploaded generic image, it might be an external link
            setLogoMode(item.logo && (item.logo.includes('http') && !item.logo.includes('res.cloudinary')) ? 'link' : 'upload');

            if (item.date) {
                newDurations = item.date.split(' & ').map(part => {
                    const [start, end] = part.split(/[-–]/).map(s => s.trim());
                    const startInput = parseStringToDateInput(start);
                    if (!end) return { start: startInput, end: '', isOngoing: false };
                    if (end.toLowerCase() === 'present') return { start: startInput, end: '', isOngoing: true };
                    return { start: startInput, end: parseStringToDateInput(end), isOngoing: false };
                });
                setDurations(newDurations);
            } else {
                newDurations = [{ start: '', end: '', isOngoing: false }];
                setDurations(newDurations);
            }
        } else {
            setEditingItem(null);
            newFormData = { 
                role: '', company: '', companyUrl: '', type: 'Internship', location: '',  
                status: 'current', description: '', logo: '', color: '#4CAF50', 
                skills: '', letter: '', isCustomLogo: false, order: 0 
            };
            setFormData(newFormData);
            newDurations = [{ start: '', end: '', isOngoing: false }];
            setDurations(newDurations);
            setLogoMode('upload');
        }
        
        setInitialFormData(newFormData);
        setInitialDurations(newDurations);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight">Internships & Jobs</h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 font-medium">Manage your professional experience history.</p>
                </div>
                
                <button 
                    onClick={() => openModal()} 
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors w-full sm:w-auto"
                >
                    <Plus size={18} /> Add Entry
                </button>
            </div>

            {/* Grid Wrapper */}
            {loading ? (
                <div className="bg-white dark:bg-[#141724] rounded-[28px] border border-slate-200/80 dark:border-white/5 p-4 shadow-xs">
                    <AdminLoadingState 
                        title="Loading Experience Records..."
                        subtitle="Fetching internships, roles, tenure durations & certificates"
                        minHeight="min-h-[400px]"
                    />
                </div>
            ) : internships.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4 bg-white dark:bg-[#1a1a1a] rounded-[24px] border border-slate-200 dark:border-[#333]">
                    <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-[#222] flex items-center justify-center border border-slate-100 dark:border-[#333]">
                        <Briefcase size={32} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No experience added yet</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Click the button above to add your first role.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {internships.map((item) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                                transition={{ duration: 0.4 }}
                                key={item._id} 
                                className={`group relative h-full [perspective:1000px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${deletingId === item._id ? 'opacity-0 scale-90 blur-md pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}
                            >
                                <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] relative ${deleteConfirmId === item._id ? '[transform:rotateY(180deg)]' : ''}`}>
                                
                                {/* Front Side */}
                                <div className={`flex flex-col bg-white dark:bg-[#151515] rounded-[24px] overflow-hidden border border-slate-200/60 dark:border-[#222] hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 relative h-full [backface-visibility:hidden] ${deleteConfirmId === item._id ? 'pointer-events-none' : ''}`}>
                                    
                                    <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal(item)} className="w-8 h-8 rounded-full bg-white dark:bg-[#222] text-slate-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center shadow-sm border border-slate-200 dark:border-[#333] transition-colors"><Edit2 size={14} /></button>
                                        <button onClick={() => confirmDelete(item._id)} className="w-8 h-8 rounded-full bg-white dark:bg-[#222] text-slate-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center shadow-sm border border-slate-200 dark:border-[#333] transition-colors"><Trash2 size={14} /></button>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-[#333] ${item.isCustomLogo ? 'bg-slate-900' : 'bg-white dark:bg-white'}`}>
                                                {item.logo ? (
                                                    <Image src={item.logo} alt={item.company} width={48} height={48} className={`object-cover w-full h-full ${!item.isCustomLogo ? 'p-1' : ''}`} />
                                                ) : (
                                                    <Briefcase className="text-slate-400" />
                                                )}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.type === 'Internship' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                                {item.type}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">{item.role}</h3>
                                        <p className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-4">{item.company}</p>
                                        
                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                <Calendar size={14} /> <span>{item.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                <MapPin size={14} /> <span>{item.location}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-[#222] pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${item.status === 'current' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{item.status}</span>
                                            </div>
                                            {(item.skills && item.skills.length > 0) && (
                                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">+{item.skills.length} skills</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Back Side: Delete Confirmation */}
                                <div className={`absolute inset-0 flex flex-col bg-white dark:bg-[#151515] rounded-[24px] overflow-hidden border border-red-500/50 shadow-xl shadow-red-500/10 items-center justify-center p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] ${deleteConfirmId === item._id ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                                    <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4 border border-red-100 dark:border-red-500/20">
                                        <Trash2 size={24} className="text-red-500" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Delete Entry?</h3>
                                    <p className="text-xs font-medium text-slate-500 dark:text-gray-400 mb-6 px-2">Are you sure? This cannot be undone.</p>
                                    <div className="flex gap-3 w-full relative z-50">
                                        <button type="button" onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#333]/80 transition-all cursor-pointer">
                                            Cancel
                                        </button>
                                        <button type="button" onClick={() => executeDelete()} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 cursor-pointer">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            )}

            {/* Modal */}
            <dialog 
                ref={dialogRef}
                onClose={closeModal}
                className="backdrop:bg-slate-900/60 backdrop:backdrop-blur-md bg-transparent border-none w-full max-w-4xl h-full max-h-[90vh] p-4 sm:p-6 m-auto outline-none"
            >
                <div className="bg-white dark:bg-[#0f0f0f] rounded-[32px] shadow-2xl w-full h-full flex flex-col overflow-hidden border border-slate-200/60 dark:border-[#222]">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center px-8 py-6 bg-slate-50/50 dark:bg-[#151515] border-b border-slate-200/60 dark:border-[#222] relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{editingItem ? 'Edit Experience' : 'Add Experience'}</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-1">Configure job role, dates, and documentation.</p>
                        </div>
                        <button type="button" onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#222] text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-[#333] hover:text-slate-800 dark:hover:text-white transition-all shadow-sm border border-slate-200 dark:border-[#333]">
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-slate-50/30 dark:bg-[#0f0f0f]">
                        <form id="exp-form" onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
                            
                            {/* Role Identity */}
                            <div className="bg-white dark:bg-[#151515] p-6 sm:p-8 rounded-[24px] border border-slate-200/60 dark:border-[#222] shadow-sm space-y-6">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Role Details
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Role / Title</label>
                                        <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md border border-slate-200/60 dark:border-[#333]/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-base text-slate-900 dark:text-white font-bold outline-none transition-all hover:bg-slate-100/50 dark:hover:bg-[#222]/50" placeholder="e.g. Frontend Developer" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Company</label>
                                        <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md border border-slate-200/60 dark:border-[#333]/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-base text-slate-900 dark:text-white font-bold outline-none transition-all hover:bg-slate-100/50 dark:hover:bg-[#222]/50" placeholder="e.g. Google" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Company Website URL</label>
                                        <input type="url" value={formData.companyUrl || ''} onChange={e => setFormData({...formData, companyUrl: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md border border-slate-200/60 dark:border-[#333]/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-base text-slate-900 dark:text-white font-bold outline-none transition-all hover:bg-slate-100/50 dark:hover:bg-[#222]/50" placeholder="https://example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Type</label>
                                        <div className="relative">
                                            <button 
                                                type="button" 
                                                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)} 
                                                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl bg-slate-50/50 dark:bg-[#1a1a1a]/50 border-2 text-sm text-slate-900 dark:text-white font-bold outline-none transition-all cursor-pointer shadow-sm ${isTypeDropdownOpen ? 'border-emerald-500 bg-white dark:bg-[#222]' : 'border-transparent hover:border-slate-300 dark:border-[#333]/50 dark:hover:border-[#444]'}`}
                                            >
                                                <span>{formData.type}</span>
                                                <ChevronDown size={16} strokeWidth={3} className={`text-slate-600 dark:text-slate-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            
                                            {isTypeDropdownOpen && (
                                                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#444] rounded-xl shadow-xl z-50 overflow-hidden">
                                                    {['Internship', 'Job', 'Freelance'].map(option => (
                                                        <button 
                                                            key={option}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({...formData, type: option});
                                                                setIsTypeDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${formData.type === option ? 'bg-[#1a66ff] text-white' : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#333]'}`}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Location</label>
                                        <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md border border-slate-200/60 dark:border-[#333]/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-base text-slate-900 dark:text-white font-bold outline-none transition-all hover:bg-slate-100/50 dark:hover:bg-[#222]/50" placeholder="e.g. Remote, India" />
                                    </div>
                                </div>
                            </div>

                            {/* Timeline & Progress */}
                            <div className="bg-white dark:bg-[#151515] p-6 sm:p-8 rounded-[24px] border border-slate-200/60 dark:border-[#222] shadow-sm space-y-6">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    Timeline & Info
                                </h3>
                                
                                <div className="space-y-4">
                                    {durations.map((duration, index) => (
                                        <div key={index} className="flex flex-col md:flex-row items-center gap-6 p-5 rounded-2xl bg-white dark:bg-[#1a1a1a]/50 border border-slate-200 dark:border-[#333] shadow-sm">
                                            
                                            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <label className="block text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Start Date</label>
                                                    <button type="button" onClick={() => setPickerOpen({ index, type: 'start' })} className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#222] border border-slate-200 dark:border-[#444] text-sm font-bold text-slate-700 dark:text-gray-300 flex items-center justify-between transition-colors hover:border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-left">
                                                        <span>{formatDisplay(duration.start)}</span>
                                                        <Calendar size={16} className="text-slate-400" />
                                                    </button>
                                                    
                                                    {pickerOpen?.index === index && pickerOpen.type === 'start' && (
                                                        <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#444] rounded-xl shadow-xl z-50 w-64">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <button type="button" onClick={() => setPickerYear(y => y - 1)} className="px-2 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold">{"<"}</button>
                                                                <span className="font-bold text-slate-900 dark:text-white">{pickerYear}</span>
                                                                <button type="button" onClick={() => setPickerYear(y => y + 1)} className="px-2 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold">{">"}</button>
                                                            </div>
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {MONTHS.map((m, i) => (
                                                                    <button type="button" key={m} onClick={() => handleMonthSelect(index, 'start', i)} className="py-2 text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#333] hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors">
                                                                        {m}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="relative">
                                                    <label className="block text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">End Date</label>
                                                    <button type="button" onClick={() => !duration.isOngoing && setPickerOpen({ index, type: 'end' })} disabled={duration.isOngoing} className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#222] border border-slate-200 dark:border-[#444] text-sm font-bold flex items-center justify-between transition-colors text-left ${duration.isOngoing ? 'opacity-50 cursor-not-allowed text-slate-400' : 'text-slate-700 dark:text-gray-300 hover:border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'}`}>
                                                        <span>{duration.isOngoing ? 'Present' : formatDisplay(duration.end)}</span>
                                                        <Calendar size={16} className="text-slate-400" />
                                                    </button>
                                                    
                                                    {pickerOpen?.index === index && pickerOpen.type === 'end' && !duration.isOngoing && (
                                                        <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#444] rounded-xl shadow-xl z-50 w-64">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <button type="button" onClick={() => setPickerYear(y => y - 1)} className="px-2 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold">{"<"}</button>
                                                                <span className="font-bold text-slate-900 dark:text-white">{pickerYear}</span>
                                                                <button type="button" onClick={() => setPickerYear(y => y + 1)} className="px-2 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold">{">"}</button>
                                                            </div>
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {MONTHS.map((m, i) => (
                                                                    <button type="button" key={m} onClick={() => handleMonthSelect(index, 'end', i)} className="py-2 text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#333] hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors">
                                                                        {m}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-row md:flex-col items-center md:items-start justify-between w-full md:w-24 gap-3 pt-4 md:pt-6">
                                                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => {
                                                    const newDurations = [...durations];
                                                    newDurations[index].isOngoing = !duration.isOngoing;
                                                    if(!duration.isOngoing) newDurations[index].end = '';
                                                    setDurations(newDurations);
                                                }}>
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${duration.isOngoing ? 'bg-emerald-500 border-emerald-500' : 'bg-white dark:bg-[#222] border-slate-300 dark:border-[#555] group-hover:border-emerald-400'}`}>
                                                        {duration.isOngoing && <Check size={12} className="text-white" />}
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-600 dark:text-gray-400 uppercase tracking-widest select-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Ongoing</span>
                                                </div>
                                                
                                                {durations.length > 1 && (
                                                    <button type="button" onClick={() => setDurations(durations.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-600 text-xs font-bold transition-colors">Remove</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <button type="button" onClick={() => setDurations([...durations, { start: '', end: '', isOngoing: false }])} className="text-xs font-black text-emerald-500 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-1 transition-colors px-2 py-1">
                                        <Plus size={14} /> Add Duration
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Status</label>
                                        <div className="relative">
                                            <button 
                                                type="button" 
                                                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)} 
                                                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl bg-slate-50/50 dark:bg-[#1a1a1a]/50 border-2 text-sm text-slate-900 dark:text-white font-bold outline-none transition-all cursor-pointer shadow-sm ${isStatusDropdownOpen ? 'border-emerald-500 bg-white dark:bg-[#222]' : 'border-transparent hover:border-slate-300 dark:border-[#333]/50 dark:hover:border-[#444]'}`}
                                            >
                                                <span className="capitalize">{formData.status}</span>
                                                <ChevronDown size={16} strokeWidth={3} className={`text-slate-600 dark:text-slate-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            
                                            {isStatusDropdownOpen && (
                                                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#444] rounded-xl shadow-xl z-50 overflow-hidden">
                                                    {['current', 'completed'].map(option => (
                                                        <button 
                                                            key={option}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({...formData, status: option});
                                                                setIsStatusDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-5 py-3 text-sm font-bold capitalize transition-colors ${formData.status === option ? 'bg-[#1a66ff] text-white' : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#333]'}`}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Skills (Comma Separated)</label>
                                        <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md border border-slate-200/60 dark:border-[#333]/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-sm text-slate-900 dark:text-white font-bold outline-none transition-all hover:bg-slate-100/50 dark:hover:bg-[#222]/50" placeholder="e.g. React, Node.js, Firebase" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                        <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md border border-slate-200/60 dark:border-[#333]/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-sm text-slate-900 dark:text-white font-medium outline-none transition-all hover:bg-slate-100/50 dark:hover:bg-[#222]/50 resize-none" placeholder="What did you do?"></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Media & Docs (Redesigned) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                                
                                {/* Left Card: Company Logo */}
                                <div className="bg-white dark:bg-[#151515] p-6 sm:p-8 rounded-[24px] border border-slate-200/60 dark:border-[#333] shadow-sm relative flex flex-col h-full gap-6">
                                    
                                    {/* Header */}
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Company Logo</h4>
                                            <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400">Upload your company logo or provide a link</p>
                                        </div>
                                    </div>

                                    {/* Toggle (Pill) */}
                                    <div className="flex bg-slate-50 dark:bg-[#1a1a1a] rounded-[24px] p-1.5 border border-slate-200/60 dark:border-[#333]">
                                        <button 
                                            type="button" 
                                            onClick={() => setLogoMode('link')} 
                                            className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-[20px] text-[13px] font-bold transition-all ${logoMode === 'link' ? 'bg-white dark:bg-[#222] shadow-sm border border-slate-200/50 dark:border-[#444] text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                                        >
                                            <LinkIcon size={16} /> Link
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setLogoMode('upload')} 
                                            className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-[20px] text-[13px] font-bold transition-all ${logoMode === 'upload' ? 'bg-white dark:bg-[#222] shadow-sm border border-slate-200/50 dark:border-[#444] text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                                        >
                                            <CloudUpload size={16} /> Upload
                                        </button>
                                    </div>

                                    <div className="h-px w-full bg-slate-100 dark:bg-[#222]"></div>

                                    {/* Content based on toggle */}
                                    {logoMode === 'link' ? (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-3 items-start">
                                                <LinkIcon size={18} className="text-slate-400 mt-0.5" />
                                                <div>
                                                    <h5 className="text-xs font-black text-slate-700 dark:text-gray-300 uppercase tracking-widest mb-1">Logo Link</h5>
                                                    <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400">Add a direct link to your company logo</p>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input type="text" value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-slate-900 dark:text-white font-medium outline-none transition-all" placeholder="https://media.licdn.com/dms/image/v..." />
                                                {formData.logo && (
                                                    <a href={formData.logo} target="_blank" rel="noreferrer" className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600">
                                                        <ExternalLink size={16} />
                                                    </a>
                                                )}
                                            </div>

                                            <div className="bg-slate-50/50 dark:bg-[#1a1a1a]/50 border border-slate-200/60 dark:border-[#333]/50 rounded-xl p-4 flex gap-4 mt-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0">
                                                    <Lightbulb size={16} />
                                                </div>
                                                <p className="text-[11px] text-slate-600 dark:text-gray-400 font-medium leading-relaxed">
                                                    Use a high-quality logo for the best results. Recommended size: <span className="font-bold text-slate-900 dark:text-white">512x512px</span>
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-3 items-start">
                                                <CloudUpload size={18} className="text-slate-400 mt-0.5" />
                                                <div>
                                                    <h5 className="text-xs font-black text-slate-700 dark:text-gray-300 uppercase tracking-widest mb-1">Upload Logo</h5>
                                                    <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400">Upload a local image file for the logo</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-[#333] rounded-xl">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] overflow-hidden flex items-center justify-center relative shadow-sm">
                                                    {formData.logo ? (
                                                        <Image src={formData.logo} alt="Preview" width={64} height={64} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <ImageIcon className="text-slate-400" size={24} />
                                                    )}
                                                    {uploadingLogo && (
                                                        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
                                                            <Loader2 className="animate-spin text-blue-500" size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} className="hidden" id="logo-upload-new" />
                                                    <label htmlFor="logo-upload-new" className="cursor-pointer px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm text-center flex justify-center items-center gap-2">
                                                        <Upload size={14} /> Upload Image
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="h-px w-full bg-slate-100 dark:bg-[#222]"></div>

                                    {/* Dark mode toggle */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center shrink-0">
                                                <Moon size={18} />
                                            </div>
                                            <div>
                                                <h5 className="text-[11px] font-black text-slate-700 dark:text-gray-300">Invert for Dark Mode (Custom Logo)</h5>
                                                <p className="text-[10px] font-medium text-slate-500 dark:text-gray-400">Adjust logo for dark mode</p>
                                            </div>
                                        </div>
                                        
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={formData.isCustomLogo} onChange={e => setFormData({...formData, isCustomLogo: e.target.checked})} />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-[#333] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Right Card: Experience Letter */}
                                <div className="bg-white dark:bg-[#151515] p-6 sm:p-8 rounded-[24px] border border-slate-200/60 dark:border-[#333] shadow-sm relative flex flex-col h-full gap-6">
                                    
                                    {/* Header */}
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shrink-0">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Experience Letter (PDF)</h4>
                                            <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400">Upload your experience letter in PDF</p>
                                        </div>
                                    </div>

                                    {/* Upload Area */}
                                    <div className="flex-1 border-2 border-dashed border-slate-200 dark:border-[#333] rounded-[24px] bg-slate-50/30 dark:bg-[#1a1a1a]/30 p-8 flex flex-col items-center justify-center text-center gap-4 relative min-h-[200px]">
                                        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center mb-2">
                                            <div className="bg-white dark:bg-[#222] shadow-sm rounded-lg p-2.5 flex flex-col items-center gap-1">
                                                <FileOutput size={24} className="text-red-500" strokeWidth={1.5} />
                                                <div className="bg-red-500 text-white text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded">PDF</div>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="text-[13px] font-bold text-slate-900 dark:text-white mb-1">Upload PDF Document</h5>
                                            <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed max-w-[200px] mx-auto">Drag & drop your PDF here or click the button below</p>
                                        </div>
                                        
                                        <input type="file" accept="application/pdf,image/*" onChange={(e) => handleFileUpload(e, 'letter')} className="hidden" id="pdf-upload-new" />
                                        <label htmlFor="pdf-upload-new" className="cursor-pointer px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-[14px] text-xs font-bold transition-all shadow-md shadow-indigo-500/20 flex justify-center items-center gap-2 mt-2 w-full max-w-[180px]">
                                            {uploadingLetter ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                                            Upload PDF
                                        </label>
                                    </div>

                                    <div className="h-px w-full bg-slate-100 dark:bg-[#222]"></div>

                                    {/* View Document */}
                                    <div className="flex items-center justify-between">
                                        {formData.letter ? (
                                            <a href={formData.letter} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors w-full group">
                                                <Eye size={18} />
                                                <span className="text-xs font-bold">View Document</span>
                                                <ChevronRight size={16} className="ml-auto text-slate-300 group-hover:text-blue-500 transition-colors" />
                                            </a>
                                        ) : (
                                            <div className="flex items-center gap-3 text-slate-400 dark:text-slate-600 w-full cursor-not-allowed">
                                                <Eye size={18} />
                                                <span className="text-xs font-bold">No Document Uploaded</span>
                                                <ChevronRight size={16} className="ml-auto opacity-50" />
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                    
                    {/* Footer */}
                    <div className="p-6 bg-white dark:bg-[#151515] border-t border-slate-200/60 dark:border-[#222] flex justify-end gap-3 z-10">
                        <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#333]/80 transition-all">
                            Cancel
                        </button>
                        <button type="submit" form="exp-form" disabled={!hasChanges} className={`px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg flex items-center gap-2 ${hasChanges ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'}`}>
                            <Check size={18} />
                            {editingItem ? 'Save Changes' : 'Save Entry'}
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}
