"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Shield, Mail, Lock, Eye, EyeOff, ArrowRight,
    Loader2, AlertCircle, CheckCircle2, Trophy,
    Folder, BarChart2, Sun, Moon, Info, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { authService } from '@/lib/auth';

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/admin';

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Form state
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    // Validation & Status state
    const [errors, setErrors] = useState<{ emailOrUsername?: string; password?: string; form?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);

    useEffect(() => {
        setMounted(true);
        // If already logged in, redirect straight to admin
        if (authService.isAuthenticated()) {
            router.replace(redirectUrl);
        }
    }, [redirectUrl, router]);

    const validateForm = () => {
        const newErrors: { emailOrUsername?: string; password?: string } = {};

        if (!emailOrUsername.trim()) {
            newErrors.emailOrUsername = 'Email or Username is required.';
        }

        if (!password) {
            newErrors.password = 'Password is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const res = await authService.login(emailOrUsername.trim(), password, rememberMe);

            if (res.success) {
                setLoginSuccess(true);
                setTimeout(() => {
                    router.push(redirectUrl);
                }, 700);
            } else {
                setErrors({
                    form: res.message || 'Invalid email or password.'
                });
            }
        } catch (err) {
            setErrors({
                form: 'Unable to connect to server. Please check your network and try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#090b10] text-slate-900 dark:text-white flex flex-col justify-between relative overflow-hidden transition-colors selection:bg-blue-500 selection:text-white">
            {/* Ambient Background Glows & Dot Matrix Patterns */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Subtle Grid Dot Matrix (Background) */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Top Bar with Brand & Theme Toggle (Full Width) */}
            <header className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-6 sm:pt-8 flex items-center justify-between relative z-20">
                {/* Brand Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-mono font-bold text-base">
                        &lt;/&gt;
                    </div>
                    <div>
                        <h1 className="text-base font-black tracking-tight leading-none text-slate-900 dark:text-white">
                            Portfolio
                        </h1>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-400 block mt-0.5">
                            ADMIN PANEL
                        </span>
                    </div>
                </div>

                {/* Theme Switcher Button */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-10 h-10 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-all shadow-xs cursor-pointer"
                    aria-label="Toggle dark mode"
                    title="Toggle Theme"
                >
                    {mounted && (theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />)}
                </button>
            </header>

            {/* Main Content Area (Full Width Two Columns Layout) */}
            <main className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-4 sm:pt-6 pb-0 flex-1 flex items-center relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-20 items-center w-full">

                    {/* LEFT COLUMN: Welcome, Feature Cards & Workspace Illustration (Bottom Flush & Balanced Offset) */}
                    <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between h-full self-stretch">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-3 sm:space-y-4 pt-2"
                        >
                            {/* Main Welcome Heading */}
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                                Welcome Back, <br />
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Admin
                                </span>
                            </h2>

                            {/* Subtitle */}
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">
                                Sign in to access your portfolio dashboard and manage your hackathons, projects and achievements.
                            </p>
                        </motion.div>

                        {/* Workspace Illustration with Floating Glass Feature Cards (Elevated & Non-Overlapping) */}
                        <div className="pt-6 sm:pt-8 mt-auto relative w-full max-w-[540px] -ml-3 sm:-ml-6 lg:-ml-8 -mb-6 sm:-mb-9 md:-mb-10 lg:-mb-16">
                            {/* Subtle Decorative Dot Matrix in top right (Elevated High) */}
                            <div className="absolute -top-28 sm:-top-32 right-4 sm:right-8 opacity-40 dark:opacity-25 pointer-events-none z-0">
                                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                                    {[...Array(24)].map((_, i) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-300" />
                                    ))}
                                </div>
                            </div>

                            {/* Floating Card 1: Hackathons (Top-Left, Elevated) */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="absolute -top-8 sm:-top-10 left-0 sm:left-2 z-20 bg-white/95 dark:bg-[#141724]/95 backdrop-blur-md rounded-[16px] px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.35)] border border-slate-100/90 dark:border-white/10 flex items-center gap-2 hover:-translate-y-1 transition-all duration-300 group select-none"
                            >
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                                    <Trophy size={14} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white leading-tight">Hackathons</h4>
                                    <span className="text-[9px] sm:text-[9.5px] text-slate-400 dark:text-slate-400 font-medium block mt-0.5">View & manage</span>
                                </div>
                            </motion.div>

                            {/* Floating Card 2: Projects (Top-Center, Lifted Higher) */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="absolute -top-18 sm:-top-20 left-[33%] sm:left-[36%] z-20 bg-white/95 dark:bg-[#141724]/95 backdrop-blur-md rounded-[16px] px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.35)] border border-slate-100/90 dark:border-white/10 flex items-center gap-2 hover:-translate-y-1 transition-all duration-300 group select-none"
                            >
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                                    <Folder size={14} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white leading-tight">Projects</h4>
                                    <span className="text-[9px] sm:text-[9.5px] text-slate-400 dark:text-slate-400 font-medium block mt-0.5">Add / Edit</span>
                                </div>
                            </motion.div>

                            {/* Floating Card 3: Achievements (Top-Right, Lifted High Above Lamp) */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="absolute -top-9 sm:-top-11 right-0 sm:right-2 z-20 bg-white/95 dark:bg-[#141724]/95 backdrop-blur-md rounded-[16px] px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.35)] border border-slate-100/90 dark:border-white/10 flex items-center gap-2 hover:-translate-y-1 transition-all duration-300 group select-none"
                            >
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                                    <BarChart2 size={14} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white leading-tight">Achievements</h4>
                                    <span className="text-[9px] sm:text-[9.5px] text-slate-400 dark:text-slate-400 font-medium block mt-0.5">Track progress</span>
                                </div>
                            </motion.div>

                            {/* Developer Workspace Illustration (With Defined, Clean 3D Grounding & Drop Shadow) */}
                            <div className="relative z-10 flex items-end justify-start">
                                {/* Realistic Ground Floor Shadow under desk legs (Sharp contact + soft spread) */}
                                <div className="absolute -bottom-1 left-[8%] right-[8%] h-5 bg-slate-900/22 dark:bg-black/75 blur-sm rounded-full pointer-events-none z-0" />
                                <div className="absolute -bottom-3 left-[4%] right-[4%] h-8 bg-slate-900/14 dark:bg-black/50 blur-lg rounded-full pointer-events-none z-0" />

                                <img
                                    src="/images/admin_workspace_desk.png"
                                    alt="Developer Workspace"
                                    style={{
                                        filter: mounted && theme === 'dark'
                                            ? 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.7)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.5))'
                                            : 'drop-shadow(0 16px 20px rgba(15, 23, 42, 0.16)) drop-shadow(0 6px 8px rgba(15, 23, 42, 0.1))'
                                    }}
                                    className="w-full h-auto max-h-[340px] sm:max-h-[370px] object-contain object-left-bottom select-none pointer-events-none block -mb-1 relative z-10 transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Floating Login Card */}
                    <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="w-full max-w-[480px] bg-white dark:bg-[#12141e] rounded-[32px] sm:rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-white/5 p-7 sm:p-9 md:p-10 relative overflow-hidden backdrop-blur-xl"
                        >
                            {/* Top Shield Container */}
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4 shadow-xs">
                                <Shield size={26} strokeWidth={2.2} />
                            </div>

                            {/* Card Heading */}
                            <div className="text-center mb-6">
                                <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                    Admin Login
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 dark:text-gray-400 mt-1 font-medium">
                                    Enter your credentials to continue
                                </p>
                            </div>

                            {/* Server/Form Error Banner */}
                            {errors.form && (
                                <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
                                    <AlertCircle size={16} className="flex-shrink-0" />
                                    <span>{errors.form}</span>
                                </div>
                            )}

                            {/* Success Banner */}
                            {loginSuccess && (
                                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
                                    <CheckCircle2 size={16} className="flex-shrink-0" />
                                    <span>Authentication successful! Redirecting...</span>
                                </div>
                            )}

                            {/* Login Form */}
                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                {/* Email / Username Field */}
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                                        Email or Username
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="admin-login-username"
                                            autoComplete="username"
                                            value={emailOrUsername}
                                            onChange={(e) => {
                                                setEmailOrUsername(e.target.value);
                                                if (errors.emailOrUsername) setErrors({ ...errors, emailOrUsername: undefined });
                                            }}
                                            placeholder="Enter your email or username"
                                            className={`w-full px-4 py-3.5 pl-11 rounded-2xl bg-slate-50/80 dark:bg-white/5 border text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all ${errors.emailOrUsername
                                                ? 'border-red-500 ring-2 ring-red-500/10'
                                                : 'border-slate-200/90 dark:border-white/10 focus:bg-white dark:focus:bg-[#161926] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                                }`}
                                        />
                                        <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                    {errors.emailOrUsername && (
                                        <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.emailOrUsername}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="admin-login-password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (errors.password) setErrors({ ...errors, password: undefined });
                                            }}
                                            placeholder="Enter your password"
                                            className={`w-full px-4 py-3.5 pl-11 pr-11 rounded-2xl bg-slate-50/80 dark:bg-white/5 border text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all ${errors.password
                                                ? 'border-red-500 ring-2 ring-red-500/10'
                                                : 'border-slate-200/90 dark:border-white/10 focus:bg-white dark:focus:bg-[#161926] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                                }`}
                                        />
                                        <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer p-1"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password Row */}
                                <div className="flex items-center justify-between pt-1 text-xs">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-gray-600 cursor-pointer accent-blue-600"
                                        />
                                        <span className="font-bold text-slate-600 dark:text-slate-300">Remember me</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(true)}
                                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Primary Login Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || loginSuccess}
                                    className="w-full mt-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Signing In...</span>
                                        </>
                                    ) : loginSuccess ? (
                                        <>
                                            <CheckCircle2 size={18} />
                                            <span>Authenticated!</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight size={17} />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Subtle Divider */}
                            <div className="relative my-6 text-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200/80 dark:border-white/5" />
                                </div>
                                <span className="relative bg-white dark:bg-[#12141e] px-3 text-[11px] font-black uppercase tracking-widest text-slate-300 dark:text-gray-600">
                                    OR
                                </span>
                            </div>

                            {/* Security Notice Box */}
                            <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                    <Shield size={16} />
                                </div>
                                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium leading-tight">
                                    This is a secure admin area. Unauthorized access is strictly prohibited.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </main>

            {/* Bottom Footer */}
            <footer className="w-full py-2.5 sm:py-3 text-center text-xs font-semibold text-slate-400 dark:text-gray-500 relative z-20 flex items-center justify-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                    <Shield size={13} className="text-blue-500" />
                    Secure Access
                </span>
                <span>•</span>
                <span>Portfolio Management</span>
                <span>•</span>
                <span>Admin Dashboard</span>
            </footer>

            {/* Forgot Password Information Modal */}
            <AnimatePresence>
                {showForgotModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-[#151722] rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                                    <Info size={18} />
                                    <span>Password Recovery</span>
                                </div>
                                <button
                                    onClick={() => setShowForgotModal(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                To reset your admin password, please access your server environment configuration (<code className="bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 text-xs">server/.env</code>) or contact the system administrator.
                            </p>

                            <div className="pt-2">
                                <button
                                    onClick={() => setShowForgotModal(false)}
                                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                                >
                                    Got It
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
