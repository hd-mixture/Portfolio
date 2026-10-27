"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Check, Star, Quote, Loader2, Link as LinkIcon, AlertCircle, CheckCircle2, Copy, XCircle, Camera, Upload } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import ImageCropperModal from '@/components/admin/ImageCropperModal';

interface Testimonial {
    _id: string;
    quote: string;
    name: string;
    designation: string;
    src: string;
    designerSrc?: string;
    stars?: number;
    isApproved?: boolean;
    source?: 'manual' | 'link';
}

interface ReviewRequestData {
    _id: string;
    email: string;
    role: string;
    token: string;
    isUsed: boolean;
    createdAt: string;
}

export default function TestimonialsAdmin() {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'testimonials' | 'requests'>('testimonials');
    
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [requests, setRequests] = useState<ReviewRequestData[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [requestEmail, setRequestEmail] = useState('');
    const [requestRole, setRequestRole] = useState('Designer');
    const [sendingRequest, setSendingRequest] = useState(false);

    const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
    const [revokeConfirmId, setRevokeConfirmId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        quote: '', name: '', designation: '', src: '', designerSrc: '', stars: 5
    });
    const [initialFormData, setInitialFormData] = useState({
        quote: '', name: '', designation: '', src: '', designerSrc: '', stars: 5
    });

    const isDirty = React.useMemo(() => {
        if (editingItem) {
            return JSON.stringify(formData) !== JSON.stringify(initialFormData);
        }
        return formData.name.trim().length > 0 && formData.quote.trim().length > 0;
    }, [formData, initialFormData, editingItem]);

    const canSubmit = isDirty && !uploading;

    useEffect(() => {
        setMounted(true);
        fetchTestimonials();
        fetchRequests();
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Lock body scroll and apply cinematic blur & dim to admin root when any modal is active
    useEffect(() => {
        const isAnyModalOpen = isModalOpen || isRequestModalOpen || !!revokeConfirmId || isCropperOpen;
        const adminRoot = typeof document !== 'undefined' ? document.getElementById('admin-root') : null;

        if (isAnyModalOpen) {
            document.body.style.overflow = 'hidden';
            if (adminRoot) {
                adminRoot.style.filter = 'blur(10px) brightness(0.6)';
                adminRoot.style.transition = 'filter 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
                adminRoot.style.pointerEvents = 'none';
                adminRoot.style.userSelect = 'none';
            }
        } else {
            document.body.style.overflow = '';
            if (adminRoot) {
                adminRoot.style.filter = '';
                adminRoot.style.pointerEvents = '';
                adminRoot.style.userSelect = '';
            }
        }
        return () => {
            document.body.style.overflow = '';
            if (adminRoot) {
                adminRoot.style.filter = '';
                adminRoot.style.pointerEvents = '';
                adminRoot.style.userSelect = '';
            }
        };
    }, [isModalOpen, isRequestModalOpen, revokeConfirmId, isCropperOpen]);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials?all=true`);
            const data = await res.json();
            setTestimonials(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials/requests`);
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRevokeRequest = (id: string) => {
        setRevokeConfirmId(id);
    };

    const executeRevoke = async () => {
        if (!revokeConfirmId) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/testimonials/requests/${revokeConfirmId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchRequests();
                setToast({ message: 'Review link revoked successfully!', type: 'success' });
            } else {
                setToast({ message: 'Failed to revoke request', type: 'error' });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setRevokeConfirmId(null);
        }
    };

    const handleCopyLink = (token: string) => {
        const link = `${window.location.origin}/submit-review?token=${token}`;
        navigator.clipboard.writeText(link);
        setToast({ message: 'Review link copied to clipboard!', type: 'success' });
    };

    const toggleApproval = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/testimonials/${id}/approve`, { method: 'PUT' });
            if (res.ok) {
                const updated = await res.json();
                setTestimonials(testimonials.map(t => t._id === id ? updated : t));
            }
        } catch (error) {
            console.error('Error toggling approval', error);
        }
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        
        // 1. Upload original uncropped image for Developer Persona
        setUploading(true);
        const originalData = new FormData();
        originalData.append('image', file);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                body: originalData
            });
            const result = await res.json();
            if (res.ok && result.url) {
                setFormData(prev => ({ 
                    ...prev, 
                    src: result.url,
                    designerSrc: prev.designerSrc || result.url 
                }));
            }
        } catch (err) {
            console.error("Error uploading original image", err);
        } finally {
            setUploading(false);
        }

        // 2. Open Cropper to crop 1:1 Avatar specifically for Designer Persona
        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result as string);
            setIsCropperOpen(true);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        setUploading(true);
        const data = new FormData();
        const file = new File([croppedBlob], `client-avatar-designer-${Date.now()}.webp`, { type: 'image/webp' });
        data.append('image', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (res.ok && result.url) {
                setFormData(prev => ({ ...prev, designerSrc: result.url }));
                setToast({ message: "Designer Avatar cropped and saved successfully!", type: "success" });
            } else {
                setToast({ message: result.message || "Failed to upload cropped image", type: "error" });
            }
        } catch (err) {
            setToast({ message: "Network error while uploading cropped image", type: "error" });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingItem 
                ? `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/testimonials/${editingItem._id}` 
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials`;
            const method = editingItem ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, isApproved: true })
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchTestimonials();
                setToast({ message: editingItem ? 'Testimonial updated!' : 'Testimonial added!', type: 'success' });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteConfirmId(id);
    };

    const executeDelete = async () => {
        if (!deleteConfirmId) return;
        setDeletingId(deleteConfirmId);
        const idToDelete = deleteConfirmId;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/testimonials/${idToDelete}`, { method: 'DELETE' });
            setTimeout(() => {
                setTestimonials(prev => prev.filter(t => t._id !== idToDelete));
                setDeleteConfirmId(null);
                setDeletingId(null);
            }, 500);
        } catch (error) {
            console.error(error);
            setDeleteConfirmId(null);
            setDeletingId(null);
        }
    };

    const handleSendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!requestEmail) return;
        setSendingRequest(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials/request-review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: requestEmail, 
                    role: requestRole.toLowerCase(),
                    baseUrl: window.location.origin 
                })
            });
            if(res.ok) {
                setRequestSuccess(true);
                fetchRequests(); // Refresh tracking list
            } else {
                alert('Failed to send request');
            }
        } catch (error) {
            console.error(error);
            alert('Error sending request');
        } finally {
            setSendingRequest(false);
        }
    };

    const openModal = (item?: Testimonial) => {
        if (item) {
            setEditingItem(item);
            const data = {
                quote: item.quote, 
                name: item.name, 
                designation: item.designation, 
                src: item.src || '', 
                designerSrc: item.designerSrc || '', 
                stars: item.stars || 5
            };
            setFormData(data);
            setInitialFormData(data);
        } else {
            setEditingItem(null);
            const emptyData = { quote: '', name: '', designation: '', src: '', designerSrc: '', stars: 5 };
            setFormData(emptyData);
            setInitialFormData(emptyData);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight">Testimonials</h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 font-medium">Manage what your clients say about you.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => { setRequestSuccess(false); setIsRequestModalOpen(true); }} 
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors"
                    >
                        <LinkIcon size={18} /> Request Review
                    </button>
                    <button 
                        onClick={() => openModal()} 
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors"
                    >
                        <Plus size={18} /> Add Testimonial
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-[#222] mb-6">
                <button 
                    onClick={() => setActiveTab('testimonials')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'testimonials' ? 'border-orange-500 text-orange-600 dark:text-orange-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    Testimonials ({testimonials.length})
                </button>
                <button 
                    onClick={() => setActiveTab('requests')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'requests' ? 'border-orange-500 text-orange-600 dark:text-orange-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    Sent Requests ({requests.length})
                </button>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="bg-white dark:bg-[#141724] rounded-[28px] border border-slate-200/80 dark:border-white/5 p-4 shadow-xs">
                    <AdminLoadingState 
                        title="Loading Testimonials & Client Reviews..."
                        subtitle="Fetching endorsements, ratings & active request tokens"
                        minHeight="min-h-[400px]"
                    />
                </div>
            ) : activeTab === 'testimonials' ? (
                testimonials.length === 0 ? (
                    <div className="bg-white dark:bg-[#151515] rounded-[32px] border border-slate-200 dark:border-[#222] p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Quote size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No testimonials yet</h3>
                        <p className="text-slate-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Request a review from a client or add one manually to get started.</p>
                        <button onClick={() => openModal()} className="px-6 py-2.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-500 font-bold rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
                            Add First Testimonial
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {testimonials.map((item) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.4 }}
                                    key={item._id} 
                                    className={`group h-full [perspective:1000px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${deletingId === item._id ? 'opacity-0 scale-90 blur-md pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}
                                >
                                    <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] relative ${deleteConfirmId === item._id ? '[transform:rotateY(180deg)]' : ''}`}>
                                    
                                    {/* Front Side */}
                                    <div className={`bg-white dark:bg-[#151515] rounded-[32px] border border-slate-200 dark:border-[#222] p-6 hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-900/50 transition-all duration-300 relative flex flex-col h-full [backface-visibility:hidden] ${deleteConfirmId === item._id ? 'pointer-events-none' : ''}`}>
                                        {/* Top Left Badges */}
                                        <div className="absolute top-4 left-4 flex items-center gap-2">
                                            {item.source === 'link' && (
                                                <>
                                                    <div className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-black rounded-full flex items-center gap-1 ${item.isApproved ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                        {item.isApproved ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                        {item.isApproved ? 'Approved' : 'Pending'}
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer" title="Toggle Approval">
                                                        <input type="checkbox" className="sr-only peer" checked={item.isApproved || false} onChange={() => toggleApproval(item._id)} />
                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                                                    </label>
                                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" title="Received from Link">
                                                        <LinkIcon size={12} />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <button onClick={() => openModal(item)} className="p-2 bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 dark:bg-[#222] dark:hover:bg-orange-900/30 dark:text-gray-400 dark:hover:text-orange-500 rounded-xl transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => confirmDelete(item._id)} className="p-2 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 dark:bg-[#222] dark:hover:bg-red-900/30 dark:text-gray-400 dark:hover:text-red-500 rounded-xl transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="flex gap-1 mb-4 mt-8">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} size={14} fill={star <= (item.stars || 5) ? "currentColor" : "none"} className={star <= (item.stars || 5) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'} />
                                            ))}
                                        </div>

                                        <Quote className="text-orange-500/20 mb-3 shrink-0" size={32} />
                                        <p className="text-slate-700 dark:text-gray-300 font-medium text-sm leading-relaxed mb-6 flex-1 italic line-clamp-4">
                                            "{item.quote}"
                                        </p>
                                        
                                        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-[#222] shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-[#333] overflow-hidden relative shrink-0">
                                                {item.src ? (
                                                    <Image src={item.src} alt={item.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                                                        {item.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.name}</h4>
                                                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium truncate">{item.designation}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back Side: Delete Confirmation */}
                                    <div className={`absolute inset-0 flex flex-col bg-white dark:bg-[#151515] rounded-[32px] overflow-hidden border border-red-500/50 shadow-xl shadow-red-500/10 items-center justify-center p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] ${deleteConfirmId === item._id ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                                        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Trash2 size={20} />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Delete Testimonial?</h3>
                                        <p className="text-slate-500 dark:text-gray-400 mb-5 text-xs font-medium">Are you sure? This action cannot be undone.</p>
                                        
                                        <div className="flex gap-2 w-full">
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
                )
            ) : (
                // Sent Requests Tab
                <div className="bg-white dark:bg-[#151515] rounded-[32px] border border-slate-200 dark:border-[#222] overflow-hidden shadow-sm">
                    {requests.length === 0 ? (
                        <div className="p-12 text-center">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No review requests sent</h3>
                            <p className="text-slate-500 dark:text-gray-400 mb-6">Generate your first review link to track it here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-[#333]">
                                        <th className="py-4 px-6 text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Email</th>
                                        <th className="py-4 px-6 text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Role</th>
                                        <th className="py-4 px-6 text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Sent Date</th>
                                        <th className="py-4 px-6 text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="py-4 px-6 text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map(req => (
                                        <tr key={req._id} className="border-b border-slate-100 dark:border-[#222] last:border-0 hover:bg-slate-50/50 dark:hover:bg-[#1a1a1a]/50">
                                            <td className="py-4 px-6 text-sm font-medium text-slate-900 dark:text-white">{req.email}</td>
                                            <td className="py-4 px-6 text-sm text-slate-500 dark:text-gray-400 capitalize">{req.role}</td>
                                            <td className="py-4 px-6 text-sm text-slate-500 dark:text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 px-6">
                                                {req.isUsed ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                        <CheckCircle2 size={12} /> Used
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                        <AlertCircle size={12} /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                {!req.isUsed && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleCopyLink(req.token)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 dark:bg-[#222] dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Copy Link">
                                                            <Copy size={16} />
                                                        </button>
                                                        <button onClick={() => handleRevokeRequest(req._id)} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 dark:bg-[#222] dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Revoke Link">
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Portaled Modals & Overlays (Cover whole screen including Header & Sidebar) */}
            {mounted && createPortal(
                <>
                    {/* Testimonial Modal */}
                    <AnimatePresence>
                        {isModalOpen && (
                            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
                                {/* Backdrop */}
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={closeModal}
                                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl transition-opacity z-[99999]"
                                    style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                                />

                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
                                    className="bg-white dark:bg-[#151515] rounded-[32px] border border-slate-200 dark:border-[#222] shadow-2xl overflow-hidden w-full max-w-2xl relative z-[100000] my-auto"
                                >
                                    <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-[#222]">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
                                        </h2>
                                        <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#222] dark:hover:bg-[#333] rounded-full transition-colors cursor-pointer">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Name</label>
                                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-slate-900 dark:text-white outline-none transition-all" placeholder="Client Name" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Designation</label>
                                                <input required type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-slate-900 dark:text-white outline-none transition-all" placeholder="CEO, Company" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Quote</label>
                                            <textarea required rows={4} value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-slate-900 dark:text-white outline-none transition-all resize-none" placeholder="What did they say?"></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                                            {/* Modern Client Photo Pod */}
                                            <div className="flex flex-col">
                                                <label className="block text-[11px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                                                    <span>Client Photo</span>
                                                    {formData.src && (
                                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold lowercase tracking-normal flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                            uploaded
                                                        </span>
                                                    )}
                                                </label>
                                                
                                                <div className="flex-1 flex items-center justify-between gap-3.5 p-3 rounded-[22px] bg-slate-50/90 dark:bg-[#161822] border border-slate-200/80 dark:border-white/10 hover:border-orange-500/30 transition-all shadow-xs group/pod">
                                                    {/* Interactive Avatar Container */}
                                                    <div className="relative group/avatar shrink-0">
                                                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#0e1017] ring-2 ring-slate-200/80 dark:ring-white/10 group-hover/avatar:ring-orange-500/40 overflow-hidden flex items-center justify-center relative shadow-sm transition-all">
                                                            {formData.designerSrc || formData.src ? (
                                                                <Image 
                                                                    src={formData.designerSrc || formData.src} 
                                                                    alt="Client Preview" 
                                                                    fill 
                                                                    className="object-cover transition-transform group-hover/avatar:scale-105" 
                                                                    unoptimized 
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#202434] dark:to-[#141724] flex items-center justify-center text-slate-400">
                                                                    <Camera size={20} className="text-slate-400 group-hover/avatar:text-orange-500 transition-colors" />
                                                                </div>
                                                            )}

                                                            {/* Hover Overlay with Camera Icon */}
                                                            <label 
                                                                htmlFor="client-photo-upload" 
                                                                className={`absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center text-white transition-all duration-200 cursor-pointer ${
                                                                    uploading ? 'opacity-100' : 'opacity-0 group-hover/avatar:opacity-100'
                                                                }`}
                                                                title="Click to choose & crop photo"
                                                            >
                                                                {uploading ? (
                                                                    <Loader2 className="animate-spin text-orange-400" size={16} />
                                                                ) : (
                                                                    <>
                                                                        <Camera size={15} className="mb-0.5 text-orange-400" />
                                                                        <span className="text-[8px] font-black uppercase tracking-tight">
                                                                            {formData.src ? 'Change' : 'Upload'}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </label>
                                                        </div>
                                                        
                                                        {/* Status Dot */}
                                                        {(formData.designerSrc || formData.src) && (
                                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#161822] shadow-xs" />
                                                        )}
                                                    </div>

                                                    {/* Center Text Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <input 
                                                            type="file" 
                                                            accept="image/*" 
                                                            onChange={handleImageSelect} 
                                                            className="hidden" 
                                                            id="client-photo-upload" 
                                                        />

                                                        {formData.src || formData.designerSrc ? (
                                                            <div>
                                                                <h6 className="text-xs font-black text-slate-800 dark:text-white truncate">
                                                                    Avatar Ready
                                                                </h6>
                                                                <label 
                                                                    htmlFor="client-photo-upload" 
                                                                    className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer block truncate mt-0.5"
                                                                >
                                                                    Click avatar to change
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <label 
                                                                    htmlFor="client-photo-upload" 
                                                                    className="text-xs font-black text-orange-600 dark:text-orange-400 hover:text-orange-700 cursor-pointer block truncate"
                                                                >
                                                                    Upload Portrait
                                                                </label>
                                                                <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate mt-0.5">
                                                                    Auto-crops to 1:1 square
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Button */}
                                                    {(formData.src || formData.designerSrc) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, src: '', designerSrc: '' })}
                                                            className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-500 dark:text-red-400 dark:hover:text-white border border-red-200/60 dark:border-red-500/20 flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-90"
                                                            title="Remove photo"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Modern Rating Pod */}
                                            <div className="flex flex-col">
                                                <label className="block text-[11px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                                                    <span>Client Rating</span>
                                                    <span className="text-[10px] text-amber-500 font-bold">
                                                        {formData.stars}.0 / 5.0
                                                    </span>
                                                </label>
                                                <div className="flex-1 flex items-center justify-between p-3 rounded-[22px] bg-slate-50/90 dark:bg-[#161822] border border-slate-200/80 dark:border-white/10 shadow-xs">
                                                    <div className="flex items-center gap-1.5 w-full justify-around">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setFormData({...formData, stars: star})}
                                                                className={`p-2 rounded-xl transition-all cursor-pointer active:scale-90 ${
                                                                    star <= formData.stars 
                                                                        ? 'bg-amber-400/10 text-amber-400 dark:text-amber-300' 
                                                                        : 'text-slate-300 dark:text-slate-700 hover:text-amber-400/50'
                                                                }`}
                                                            >
                                                                <Star 
                                                                    size={20} 
                                                                    fill={star <= formData.stars ? "currentColor" : "none"} 
                                                                    className="transition-transform hover:scale-110"
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-[#222]">
                                            <button type="button" onClick={closeModal} className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#222] rounded-xl transition-colors cursor-pointer">
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                disabled={!canSubmit} 
                                                className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl flex items-center gap-2 transition-all ${
                                                    canSubmit
                                                        ? 'bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-500/25 cursor-pointer active:scale-95'
                                                        : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-60 shadow-none'
                                                }`}
                                            >
                                                <Check size={18} />
                                                {editingItem ? 'Save Changes' : 'Save Testimonial'}
                                            </button>
                                        </div>
                                    </form>

                                    {/* Client Photo Image Cropper Modal */}
                                    <ImageCropperModal
                                        isOpen={isCropperOpen}
                                        imageSrc={imageToCrop}
                                        onClose={() => {
                                            setIsCropperOpen(false);
                                            setImageToCrop(null);
                                        }}
                                        onCropComplete={handleCropComplete}
                                        title="Crop Client Photo"
                                        description="Zoom, rotate & position the client portrait for testimonials"
                                        aspectRatio={1}
                                        cropShape="round"
                                    />
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Request Review Modal */}
                    <AnimatePresence>
                        {isRequestModalOpen && (
                            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsRequestModalOpen(false)}
                                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl transition-opacity z-[99999]"
                                    style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                                />

                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
                                    className="bg-white dark:bg-[#151515] rounded-[32px] border border-slate-200 dark:border-[#222] shadow-2xl overflow-hidden w-full max-w-md relative z-[100000] my-auto"
                                >
                                    <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-[#222]">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Request a Review</h2>
                                            <p className="text-xs text-slate-500 mt-1">Send a one-time link to a client</p>
                                        </div>
                                        <button onClick={() => setIsRequestModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#222] dark:hover:bg-[#333] rounded-full transition-colors cursor-pointer">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {requestSuccess ? (
                                        <div className="p-8 text-center animate-in slide-in-from-right fade-in duration-500">
                                            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle2 size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Link Sent Successfully!</h3>
                                            <p className="text-slate-500 dark:text-gray-400 mb-6 text-sm">The review request has been emailed to <span className="font-bold">{requestEmail}</span>.</p>
                                            <button onClick={() => { setIsRequestModalOpen(false); setRequestSuccess(false); setRequestEmail(''); }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm cursor-pointer">
                                                Done
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSendRequest} className="p-6 space-y-6">
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Client Email</label>
                                                <input 
                                                    required 
                                                    type="email" 
                                                    value={requestEmail} 
                                                    onChange={e => setRequestEmail(e.target.value)} 
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-900 dark:text-white outline-none transition-all" 
                                                    placeholder="client@example.com" 
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Your Role</label>
                                                <select 
                                                    value={requestRole} 
                                                    onChange={e => setRequestRole(e.target.value)} 
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-900 dark:text-white outline-none transition-all"
                                                >
                                                    <option value="Designer">Designer</option>
                                                    <option value="Developer">Developer</option>
                                                </select>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-[#222]">
                                                <button type="button" onClick={() => setIsRequestModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#222] rounded-xl transition-colors cursor-pointer">
                                                    Cancel
                                                </button>
                                                <button type="submit" disabled={sendingRequest} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors cursor-pointer">
                                                    {sendingRequest ? <Loader2 size={18} className="animate-spin" /> : <LinkIcon size={18} />}
                                                    Generate & Send
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Toast Notification */}
                    {toast && (
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100000] animate-in slide-in-from-bottom-5 fade-in duration-300">
                            <div className={`px-6 py-3 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 ${
                                toast.type === 'success' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-red-500 text-white'
                            }`}>
                                {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                {toast.message}
                            </div>
                        </div>
                    )}

                    {/* Revoke Confirmation Modal */}
                    {revokeConfirmId && (
                        <div 
                            className="fixed inset-0 z-[99999] m-0 p-4 w-full h-full bg-slate-950/60 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-200"
                            style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                        >
                            <div className="bg-white dark:bg-[#151515] rounded-[32px] border border-slate-200 dark:border-[#222] shadow-2xl overflow-hidden w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 mx-auto relative z-[100000]">
                                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <XCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Revoke Link?</h3>
                                <p className="text-slate-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">Are you sure you want to revoke this review link? The client will no longer be able to submit a review.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setRevokeConfirmId(null)} className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-[#222] hover:bg-slate-100 dark:hover:bg-[#333] transition-colors border border-slate-200 dark:border-[#333]">
                                        Cancel
                                    </button>
                                    <button onClick={executeRevoke} className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm">
                                        Revoke
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>,
                document.body
            )}
        </div>
    );
}
