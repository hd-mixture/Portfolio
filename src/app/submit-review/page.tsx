"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, Upload, Loader2, CheckCircle2, Image as ImageIcon, XCircle, User, Briefcase, PenLine, Camera, Send, ShieldCheck, Lock, MessageSquareHeart, Sparkles } from 'lucide-react';
import Image from 'next/image';

const AmbientBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f8fafe] dark:bg-[#0a0a0f]">
        {/* Animated Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-400/20 dark:bg-violet-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        {/* Orbs */}
        <div className="absolute top-[20%] right-[15%] w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 blur-md opacity-40 shadow-[0_0_40px_rgba(96,165,250,0.6)] animate-bounce" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[20%] left-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 blur-xl opacity-30 animate-pulse" style={{ animationDuration: '6s' }}></div>
        {/* Dots pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
    </div>
);

function ReviewForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [role, setRole] = useState('designer');
    const [isValidating, setIsValidating] = useState(true);
    const [invalidMessage, setInvalidMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        quote: '',
        src: '',
        stars: 5,
        token: token || ''
    });

    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // UI states
    const [hoveredStar, setHoveredStar] = useState(0);
    const [formError, setFormError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!token) {
            setInvalidMessage('No review token provided.');
            setIsValidating(false);
            return;
        }

        const validateToken = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/testimonials/validate-token/${token}`);
                const data = await res.json();
                
                if (data.valid) {
                    setRole(data.role);
                } else {
                    setInvalidMessage(data.message || 'Invalid or expired link.');
                }
            } catch (error) {
                setInvalidMessage('Unable to validate link. Please try again later.');
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setFormError('');
        setUploading(true);
        const data = new FormData();
        data.append('image', e.target.files[0]);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (res.ok) {
                setFormData({ ...formData, src: result.url });
            } else {
                setFormError('Photo upload failed. Please try again.');
            }
        } catch (err) {
            setFormError('Photo upload error. Check connection.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Inline Validation
        if (!formData.name.trim()) {
            setFormError('Please enter your name.');
            return;
        }
        if (!formData.quote.trim()) {
            setFormError('Please write a short review.');
            return;
        }
        if (formData.stars === 0) {
            setFormError('Please select a rating.');
            return;
        }
        setFormError('');

        setSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setFormError(data.message || 'Failed to submit testimonial. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setFormError('A network error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (isValidating) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans">
                <style>{`
                    header, footer { display: none !important; }
                    body { padding-top: 0 !important; }
                    main { padding: 0 !important; margin: 0 !important; max-width: none !important; display: flex !important; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
                `}</style>
                <AmbientBackground />
                <div className="bg-white/80 dark:bg-[#151515]/80 backdrop-blur-xl p-10 rounded-[32px] border border-white/50 dark:border-white/5 shadow-2xl flex flex-col items-center animate-in fade-in duration-500">
                    <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
                    <p className="text-slate-600 dark:text-gray-300 font-bold">Validating secure link...</p>
                </div>
            </div>
        );
    }

    if (invalidMessage) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative font-sans">
                <style>{`
                    header, footer { display: none !important; }
                    body { padding-top: 0 !important; }
                    main { padding: 0 !important; margin: 0 !important; max-width: none !important; display: flex !important; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
                `}</style>
                <AmbientBackground />
                <div className="bg-white/90 dark:bg-[#151515]/90 backdrop-blur-xl p-12 rounded-[40px] border border-white/50 dark:border-white/5 text-center max-w-md w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/10">
                        <XCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Link Invalid</h2>
                    <p className="text-slate-500 dark:text-gray-400 font-medium leading-relaxed">{invalidMessage}</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative font-sans">
                <style>{`
                    header, footer { display: none !important; }
                    body { padding-top: 0 !important; }
                    main { padding: 0 !important; margin: 0 !important; max-width: none !important; display: flex !important; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
                `}</style>
                <AmbientBackground />
                <div className="bg-white/90 dark:bg-[#151515]/90 backdrop-blur-xl p-12 rounded-[40px] border border-white/50 dark:border-white/5 text-center max-w-lg w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-700 spring-bounce">
                    <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30 relative">
                        <CheckCircle2 size={56} className="text-white relative z-10" />
                        <Sparkles size={28} className="text-emerald-100 absolute -top-2 -right-2 animate-bounce" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Thank you! 💙</h2>
                    <p className="text-slate-600 dark:text-gray-300 font-medium mb-10 leading-relaxed text-lg">
                        Your review has been submitted successfully. I really appreciate you taking the time to share your experience.
                    </p>
                    <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 font-bold rounded-2xl transition-all shadow-xl hover:-translate-y-1 w-full text-lg flex items-center justify-center gap-2">
                        Back to Portfolio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans relative w-full">
                <style>{`
                    header, footer { display: none !important; }
                    body { padding-top: 0 !important; }
                    main { padding: 0 !important; margin: 0 !important; max-width: none !important; display: flex !important; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
                `}</style>
            <AmbientBackground />
            
            <div className="bg-white/95 dark:bg-[#111]/95 backdrop-blur-2xl rounded-[32px] sm:rounded-[36px] border border-white/60 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] max-w-[1024px] w-full overflow-hidden flex flex-col md:flex-row relative z-10 animate-in fade-in zoom-in-95 duration-500">
                
                {/* ---------------- MOBILE LAYOUT (HIDDEN ON DESKTOP) ---------------- */}
                <div className="flex md:hidden justify-between items-start px-6 pt-6 pb-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/10 relative overflow-hidden shrink-0">
                        <Image src="/Logos/hd_logo.png" alt="HD Mixture" fill className="object-cover" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold shadow-sm border border-blue-100 dark:border-blue-900/30 mt-1">
                        <ShieldCheck size={12} /> Your opinion matters 💙
                    </div>
                </div>

                <div className="flex md:hidden flex-row px-6 pb-6 items-center justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-2">
                            Your feedback <br/>
                            <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent inline-block pb-1">helps me grow!</span>
                        </h1>
                        <p className="text-slate-500 dark:text-gray-400 font-medium text-[11px] leading-relaxed pr-2">
                            I'd love to hear about your experience working together. Your review helps me improve and build trust with future clients.
                        </p>
                    </div>
                    <div className="w-[100px] shrink-0 relative aspect-square pointer-events-none">
                        <div className="absolute top-[20%] left-[5%] w-[90%] h-[40%] bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg transform -rotate-[8deg] flex items-center justify-center gap-0.5 px-2">
                            {[1,2,3,4,5].map(i => <Star key={i} className="text-yellow-400 fill-yellow-400 drop-shadow-sm" size={10} />)}
                        </div>
                        <div className="absolute top-[48%] left-[15%] w-[85%] h-[35%] bg-white dark:bg-[#222] rounded-xl shadow-lg border border-slate-100 dark:border-[#333] transform rotate-[4deg] flex flex-col justify-center px-2.5 gap-1.5">
                            <div className="w-[85%] h-1 bg-slate-100 dark:bg-[#333] rounded-full"></div>
                            <div className="w-[60%] h-1 bg-slate-100 dark:bg-[#333] rounded-full"></div>
                        </div>
                        <div className="absolute bottom-[5%] right-[5%] w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-lg shadow-lg transform rotate-[15deg] flex items-center justify-center">
                            <MessageSquareHeart className="text-white" size={12} />
                        </div>
                        <Sparkles className="absolute top-[10%] right-[10%] text-blue-400 animate-pulse" size={12} />
                        <Sparkles className="absolute bottom-[30%] left-[0%] text-violet-400 animate-pulse" size={10} style={{animationDelay: '1s'}} />
                    </div>
                </div>

                <div className="flex md:hidden px-6 pb-6">
                    <div className="w-full relative z-10 flex items-start gap-3 bg-slate-50/80 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/30 backdrop-blur-sm">
                        <ShieldCheck className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={16} />
                        <div>
                            <p className="text-[11px] font-bold text-slate-800 dark:text-gray-200">Your review is safe and secure.</p>
                            <p className="text-[10px] font-medium text-slate-500 dark:text-gray-400 mt-0.5 leading-relaxed">It will be used only with your permission.</p>
                        </div>
                    </div>
                </div>
                {/* ------------------------------------------------------------------- */}

                {/* LEFT SIDE - BRAND PANEL (DESKTOP ONLY) */}
                <div className="hidden md:flex w-full md:w-[38%] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent p-6 sm:p-10 border-r border-slate-100 dark:border-[#222] flex-col relative overflow-hidden">
                    
                    {/* Logo */}
                    <div className="w-14 h-14 bg-black rounded-[18px] flex items-center justify-center mb-8 shadow-xl shadow-black/10 relative z-10 overflow-hidden shrink-0">
                        <Image src="/Logos/hd_logo.png" alt="HD Mixture" fill className="object-cover" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-4 relative z-10">
                        Your feedback <br/>
                        <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent inline-block pb-1">helps me grow!</span>
                    </h1>
                    
                    {/* Supporting Text */}
                    <p className="text-slate-500 dark:text-gray-400 font-medium text-sm leading-relaxed mb-8 relative z-10">
                        I'd love to hear about your experience working together. Your review helps me improve and build trust with future clients.
                    </p>

                    {/* Illustration Composition */}
                    <div className="relative w-full aspect-square max-w-[220px] mx-auto mb-10 z-10 pointer-events-none mt-auto">
                        {/* Base Star Card */}
                        <div className="absolute top-[20%] left-[5%] w-[85%] h-[40%] bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[20px] shadow-2xl shadow-blue-600/30 transform -rotate-[8deg] flex items-center justify-center gap-1 sm:gap-1.5 px-5">
                            {[1,2,3,4,5].map(i => <Star key={i} className="text-yellow-400 fill-yellow-400 drop-shadow-md" size={24} />)}
                        </div>
                        {/* Comment Card */}
                        <div className="absolute top-[48%] left-[15%] w-[80%] h-[35%] bg-white dark:bg-[#222] rounded-[20px] shadow-2xl shadow-black/5 border border-slate-100 dark:border-[#333] transform rotate-[4deg] flex flex-col justify-center px-5 gap-2.5">
                            <div className="w-[85%] h-2 bg-slate-100 dark:bg-[#333] rounded-full"></div>
                            <div className="w-[60%] h-2 bg-slate-100 dark:bg-[#333] rounded-full"></div>
                        </div>
                        {/* Floating Icon */}
                        <div className="absolute bottom-[10%] right-[10%] w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-[14px] shadow-xl shadow-violet-500/30 transform rotate-[15deg] flex items-center justify-center">
                            <MessageSquareHeart className="text-white" size={20} />
                        </div>
                        {/* Floating Sparkles */}
                        <Sparkles className="absolute top-[10%] right-[15%] text-blue-400 animate-pulse" size={16} />
                        <Sparkles className="absolute bottom-[35%] left-[5%] text-violet-400 animate-pulse" size={14} style={{animationDelay: '1s'}} />
                    </div>

                    {/* Trust Message */}
                    <div className="mt-auto relative z-10 flex items-start gap-3 bg-blue-50/80 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 backdrop-blur-sm">
                        <ShieldCheck className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-gray-200">Your review is safe and secure.</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-gray-400 mt-0.5 leading-relaxed">It will be used only with your permission.</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - FORM PANEL */}
                <div className="w-full md:w-[62%] px-6 pb-6 pt-0 md:p-10 relative flex flex-col">
                    
                    {/* Mobile Error Toast */}
                    <div className="flex md:hidden w-full mb-4 empty:hidden">
                        {formError && (
                            <div className="w-full inline-flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-xs font-bold animate-in fade-in slide-in-from-left-4 duration-300">
                                <XCircle size={14} className="shrink-0" /> {formError}
                            </div>
                        )}
                    </div>

                    {/* Desktop Badge & Error Area (Hidden on Mobile) */}
                    <div className="hidden md:flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 min-h-[32px]">
                        <div className="flex-1 w-full">
                            {formError && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm font-bold animate-in fade-in slide-in-from-left-4 duration-300">
                                    <XCircle size={14} /> {formError}
                                </div>
                            )}
                        </div>
                        <div className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-sm border border-blue-100 dark:border-blue-900/30 ml-auto">
                            <ShieldCheck size={14} /> Your opinion matters 💙
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
                        
                        {/* Personal Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Name */}
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-2 pl-1 tracking-wide">Your Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={formData.name} 
                                        onChange={e => {setFormData({...formData, name: e.target.value}); setFormError('');}} 
                                        className="w-full pl-11 pr-4 py-3 rounded-[14px] bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] hover:border-slate-300 dark:hover:border-[#444] focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-900 dark:text-white font-semibold outline-none transition-all shadow-sm" 
                                        placeholder="John Doe" 
                                    />
                                </div>
                            </div>
                            
                            {/* Designation */}
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-2 pl-1 tracking-wide">Designation / Company</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Briefcase size={18} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={formData.designation} 
                                        onChange={e => {setFormData({...formData, designation: e.target.value}); setFormError('');}} 
                                        className="w-full pl-11 pr-4 py-3 rounded-[14px] bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] hover:border-slate-300 dark:hover:border-[#444] focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-900 dark:text-white font-semibold outline-none transition-all shadow-sm" 
                                        placeholder={`e.g. CEO at TechCorp`} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Review Textarea */}
                        <div className="group flex-1 flex flex-col">
                            <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-2 pl-1 tracking-wide">Your Review</label>
                            <div className="relative flex-1 flex flex-col">
                                <div className="absolute top-3.5 left-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
                                    <PenLine size={18} />
                                </div>
                                <textarea 
                                    value={formData.quote} 
                                    maxLength={500}
                                    onChange={e => {setFormData({...formData, quote: e.target.value}); setFormError('');}} 
                                    className="w-full h-full min-h-[100px] pl-11 pr-4 py-3.5 rounded-[16px] bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] hover:border-slate-300 dark:hover:border-[#444] focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-900 dark:text-white font-medium outline-none transition-all shadow-sm resize-none" 
                                    placeholder="What was your experience like?"
                                ></textarea>
                                <div className="absolute bottom-3 right-4 text-[10px] font-bold text-slate-400">
                                    {formData.quote.length} / 500
                                </div>
                            </div>
                        </div>

                        {/* Photo & Rating Grid */}
                        <div className="grid grid-cols-2 gap-3 md:gap-5 items-stretch">
                            
                            {/* Photo Upload Card */}
                            <div className="bg-slate-50/50 dark:bg-[#1a1a1a]/50 p-3 md:p-4 rounded-[20px] border border-slate-200 dark:border-[#333] flex flex-col group transition-colors hover:bg-slate-50 dark:hover:bg-[#1e1e1e]">
                                <label className="block text-[9px] md:text-[11px] font-bold text-slate-700 dark:text-gray-300 mb-2 md:mb-3 tracking-wide uppercase">Your Photo (Optional)</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
                                >
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-[14px] bg-white dark:bg-[#222] border border-slate-200 dark:border-[#444] shadow-sm flex items-center justify-center relative overflow-hidden group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-colors shrink-0">
                                        {formData.src ? (
                                            <Image src={formData.src} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                                                <Camera size={14} className="md:w-4 md:h-4" />
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm">
                                                <Loader2 className="animate-spin text-blue-500" size={14} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full mt-1 md:mt-0">
                                        <p className="text-[10px] md:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Choose Photo</p>
                                        <p className="text-[8px] md:text-[10px] font-medium text-slate-500 mt-0.5 truncate px-1">JPG, PNG up to 5MB</p>
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </div>
                                </div>
                            </div>

                            {/* Rating Card */}
                            <div className="bg-slate-50/50 dark:bg-[#1a1a1a]/50 p-3 md:p-4 rounded-[20px] border border-slate-200 dark:border-[#333] flex flex-col group">
                                <label className="block text-[9px] md:text-[11px] font-bold text-slate-700 dark:text-gray-300 mb-2 md:mb-1 tracking-wide uppercase">Rating</label>
                                <div className="flex-1 flex flex-col items-center justify-center text-center mt-2 md:mt-0">
                                    <p className="text-[9px] md:text-[10px] font-medium text-slate-500 mb-2 md:mb-3">How would you rate my work?</p>
                                    
                                    <div className="flex items-center gap-0.5 md:gap-1.5 justify-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => {setFormData({...formData, stars: star}); setFormError('');}}
                                                onMouseEnter={() => setHoveredStar(star)}
                                                onMouseLeave={() => setHoveredStar(0)}
                                                className="relative focus:outline-none focus-visible:ring-2 ring-blue-500 rounded-full p-0.5 transition-transform hover:scale-110 active:scale-95"
                                            >
                                                <Star 
                                                    size={18} 
                                                    className={`transition-all duration-200 md:w-6 md:h-6 ${
                                                        (hoveredStar ? star <= hoveredStar : star <= formData.stars) 
                                                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_2px_8px_rgba(250,204,21,0.4)]' 
                                                            : 'text-slate-300 dark:text-slate-600'
                                                    }`} 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit CTA */}
                        <div className="pt-1">
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full py-3.5 px-6 rounded-[16px] text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 active:translate-y-0 active:shadow-sm flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed group relative overflow-hidden"
                            >
                                {/* Button Shine Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                                
                                {submitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        <span>Submit Review</span>
                                    </>
                                )}
                            </button>
                            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                <Lock size={10} /> Thank you! Your feedback means a lot.
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default function SubmitReviewPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8fafe] dark:bg-[#0a0a0f]"><Loader2 className="animate-spin text-blue-500" size={40} /></div>}>
            <ReviewForm />
        </Suspense>
    );
}
