"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Lock, Globe, Share2, Palette, Shield, Key, 
    Save, Eye, EyeOff, Check, AlertCircle, Copy, ExternalLink, 
    Download, RefreshCw, Sparkles, Moon, Sun, Monitor, 
    Laptop, Brush, CheckCircle2, ChevronRight, Info, Mail, Phone,
    Github, Linkedin, Instagram, Twitter, MessageSquare, Award,
    Camera, Upload
} from 'lucide-react';
import { authService, AdminUser } from '@/lib/auth';
import { useTheme } from 'next-themes';

type SettingsTab = 'account' | 'security' | 'seo' | 'social' | 'preferences';

export default function SettingsAdmin() {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');
    const [loading, setLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Admin Profile State
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [profileForm, setProfileForm] = useState({
        name: '',
        username: '',
        email: '',
        avatar: '',
    });
    const [initialProfileForm, setInitialProfileForm] = useState({
        name: '',
        username: '',
        email: '',
        avatar: '',
    });

    // Password State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // Site Settings State (SEO, Socials, Preferences)
    const [settingsForm, setSettingsForm] = useState({
        siteTitle: 'Darshan Prajapati - Creative Developer & Graphic Designer',
        metaDescription: 'Explore the portfolio of Darshan Prajapati, a creative developer and graphic designer specializing in building innovative web/mobile apps and stunning visual designs.',
        keywords: 'Darshan Prajapati, Creative Developer, Graphic Designer, Full Stack, UI/UX, Portfolio',
        canonicalUrl: 'https://darshan-prajapati.com',
        ogImage: '/Logos/favicon.png',
        robotsIndex: true,
        
        // Socials
        githubUrl: 'https://github.com/hdmix',
        linkedinUrl: 'https://linkedin.com/in/hdmixture',
        instagramUrl: 'https://instagram.com/hdmixture',
        twitterUrl: 'https://twitter.com/hdmixture',
        behanceUrl: 'https://behance.net/hdmixture',
        dribbbleUrl: '',
        emailAddress: 'hdmixture@gmail.com',
        whatsappNumber: '+919876543210',

        // Appearance & Preferences
        defaultTheme: 'system',
        defaultPersona: 'developer',
        maintenanceMode: false,
        announcementBanner: {
            enabled: false,
            text: '🚀 Currently open for exciting freelance & full-time opportunities!'
        }
    });

    const [initialSettingsForm, setInitialSettingsForm] = useState<any>(null);

    // Dirty state calculations
    const isProfileDirty = React.useMemo(() => {
        return JSON.stringify(profileForm) !== JSON.stringify(initialProfileForm);
    }, [profileForm, initialProfileForm]);

    const isPasswordDirty = React.useMemo(() => {
        return passwordForm.currentPassword.trim().length > 0 && 
               passwordForm.newPassword.length >= 6 && 
               passwordForm.confirmPassword.length >= 6 &&
               passwordForm.newPassword === passwordForm.confirmPassword;
    }, [passwordForm]);

    const isSeoDirty = React.useMemo(() => {
        if (!initialSettingsForm) return false;
        return settingsForm.siteTitle !== initialSettingsForm.siteTitle ||
               settingsForm.metaDescription !== initialSettingsForm.metaDescription ||
               settingsForm.keywords !== initialSettingsForm.keywords ||
               settingsForm.canonicalUrl !== initialSettingsForm.canonicalUrl ||
               settingsForm.ogImage !== initialSettingsForm.ogImage ||
               settingsForm.robotsIndex !== initialSettingsForm.robotsIndex;
    }, [settingsForm, initialSettingsForm]);

    const isSocialDirty = React.useMemo(() => {
        if (!initialSettingsForm) return false;
        return settingsForm.githubUrl !== initialSettingsForm.githubUrl ||
               settingsForm.linkedinUrl !== initialSettingsForm.linkedinUrl ||
               settingsForm.instagramUrl !== initialSettingsForm.instagramUrl ||
               settingsForm.twitterUrl !== initialSettingsForm.twitterUrl ||
               settingsForm.behanceUrl !== initialSettingsForm.behanceUrl ||
               settingsForm.dribbbleUrl !== initialSettingsForm.dribbbleUrl ||
               settingsForm.emailAddress !== initialSettingsForm.emailAddress ||
               settingsForm.whatsappNumber !== initialSettingsForm.whatsappNumber;
    }, [settingsForm, initialSettingsForm]);

    const isPreferencesDirty = React.useMemo(() => {
        if (!initialSettingsForm) return false;
        return settingsForm.defaultTheme !== initialSettingsForm.defaultTheme ||
               settingsForm.defaultPersona !== initialSettingsForm.defaultPersona ||
               settingsForm.maintenanceMode !== initialSettingsForm.maintenanceMode ||
               JSON.stringify(settingsForm.announcementBanner) !== JSON.stringify(initialSettingsForm.announcementBanner);
    }, [settingsForm, initialSettingsForm]);

    // Load initial data
    useEffect(() => {
        const stored = authService.getStoredAdmin();
        if (stored) {
            setAdminUser(stored);
            const initialProf = {
                name: stored.name || 'Darshan Prajapati',
                username: stored.username || 'admin',
                email: stored.email || 'admin@portfolio.com',
                avatar: stored.avatar || '',
            };
            setProfileForm(initialProf);
            setInitialProfileForm(initialProf);
        }

        // Fetch settings from server
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        const loaded = {
                            ...settingsForm,
                            ...data,
                            keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords || settingsForm.keywords,
                            announcementBanner: data.announcementBanner || settingsForm.announcementBanner
                        };
                        setSettingsForm(loaded);
                        setInitialSettingsForm(loaded);
                    }
                } else {
                    setInitialSettingsForm(settingsForm);
                }
            } catch (err) {
                console.log('Using local default settings:', err);
                setInitialSettingsForm(settingsForm);
            }
        };

        fetchSettings();
    }, []);

    // Avatar Upload Handler
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);
        setSaveStatus({ type: null, message: '' });

        try {
            const formData = new FormData();
            formData.append('image', file);

            const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                body: formData
            });

            const uploadData = await uploadRes.json();
            if (uploadRes.ok && uploadData.url) {
                const newAvatarUrl = uploadData.url;
                
                // Immediately save to profile
                const token = authService.getToken();
                const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...profileForm,
                        avatar: newAvatarUrl
                    })
                });

                const profileData = await profileRes.json();
                if (profileRes.ok && profileData.admin) {
                    setAdminUser(profileData.admin);
                    setProfileForm(prev => ({ ...prev, avatar: newAvatarUrl }));
                    localStorage.setItem('hd_portfolio_admin_user', JSON.stringify(profileData.admin));
                    window.dispatchEvent(new Event('storage'));
                    setSaveStatus({ type: 'success', message: 'Profile photo updated successfully!' });
                }
            } else {
                setSaveStatus({ type: 'error', message: uploadData.message || 'Failed to upload photo.' });
            }
        } catch (error) {
            setSaveStatus({ type: 'error', message: 'Error uploading image.' });
        } finally {
            setUploadingAvatar(false);
            if (e.target) e.target.value = '';
        }
    };

    // Clear status message after 4 seconds
    useEffect(() => {
        if (saveStatus.type) {
            const timer = setTimeout(() => {
                setSaveStatus({ type: null, message: '' });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [saveStatus]);

    // Password Strength Meter
    const calculatePasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 6) score += 25;
        if (pass.length >= 10) score += 25;
        if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
        if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
        return score;
    };

    const passwordStrength = calculatePasswordStrength(passwordForm.newPassword);

    // Save Profile Details
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaveStatus({ type: null, message: '' });

        try {
            const token = authService.getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileForm)
            });

            const data = await res.json();
            if (res.ok) {
                if (data.admin) {
                    setAdminUser(data.admin);
                    localStorage.setItem('hd_portfolio_admin_user', JSON.stringify(data.admin));
                    window.dispatchEvent(new Event('storage'));
                }
                setInitialProfileForm(profileForm);
                setSaveStatus({ type: 'success', message: 'Profile details updated successfully!' });
            } else {
                setSaveStatus({ type: 'error', message: data.message || 'Failed to update profile.' });
            }
        } catch (error) {
            setSaveStatus({ type: 'error', message: 'Network error. Please check your backend connection.' });
        } finally {
            setLoading(false);
        }
    };

    // Change Password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setSaveStatus({ type: 'error', message: 'New password and confirmation do not match.' });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setSaveStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
            return;
        }

        setLoading(true);
        setSaveStatus({ type: null, message: '' });

        try {
            const token = authService.getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            const data = await res.json();
            if (res.ok) {
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setSaveStatus({ type: 'success', message: 'Password changed successfully!' });
            } else {
                setSaveStatus({ type: 'error', message: data.message || 'Failed to change password.' });
            }
        } catch (error) {
            setSaveStatus({ type: 'error', message: 'Network error changing password.' });
        } finally {
            setLoading(false);
        }
    };

    // Save Site & SEO & Social Settings
    const handleSaveSettings = async () => {
        setLoading(true);
        setSaveStatus({ type: null, message: '' });

        try {
            const token = authService.getToken();
            const payload = {
                ...settingsForm,
                keywords: typeof settingsForm.keywords === 'string' 
                    ? settingsForm.keywords.split(',').map(k => k.trim()).filter(Boolean)
                    : settingsForm.keywords
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                setInitialSettingsForm(settingsForm);
                setSaveStatus({ type: 'success', message: 'Portfolio settings saved successfully!' });
            } else {
                setSaveStatus({ type: 'error', message: data.message || 'Failed to save settings.' });
            }
        } catch (error) {
            setSaveStatus({ type: 'error', message: 'Network error saving settings.' });
        } finally {
            setLoading(false);
        }
    };

    // JSON Data Backup Export
    const handleExportBackup = async () => {
        try {
            const backupData = {
                exportedAt: new Date().toISOString(),
                admin: adminUser,
                settings: settingsForm,
                note: "Full Portfolio Backup"
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSaveStatus({ type: 'success', message: 'Backup file downloaded successfully!' });
        } catch {
            setSaveStatus({ type: 'error', message: 'Failed to generate backup file.' });
        }
    };

    const tabs = [
        { id: 'account', label: 'Admin Profile', icon: User },
        { id: 'security', label: 'Security & Password', icon: Lock },
        { id: 'seo', label: 'SEO & Meta Tags', icon: Globe },
        { id: 'social', label: 'Social & Contact Hub', icon: Share2 },
        { id: 'preferences', label: 'Appearance & System', icon: Palette },
    ];

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-300">
            {/* Header Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#141724] p-6 sm:p-8 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                            <Key size={20} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            Settings
                        </h1>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xl">
                        Manage your admin credentials, SEO meta tags, social profiles, and portfolio system preferences.
                    </p>
                </div>

                {/* Status Toast Alert */}
                <AnimatePresence>
                    {saveStatus.type && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md relative z-10 ${
                                saveStatus.type === 'success'
                                    ? 'bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300'
                            }`}
                        >
                            {saveStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            <span>{saveStatus.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Subtle Ambient Background Flare */}
                <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Main Tabs Navigation Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as SettingsTab)}
                            className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                                    : 'bg-white dark:bg-[#141724] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Contents */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    
                    {/* TAB 1: ADMIN PROFILE ACCOUNT */}
                    {activeTab === 'account' && (
                        <motion.div
                            key="account"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                        >
                            {/* Profile Info Card */}
                            <div className="lg:col-span-4 bg-white dark:bg-[#141724] p-6 sm:p-7 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs flex flex-col items-center text-center">
                                {/* Interactive Avatar with Hover Upload Overlay */}
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="group relative w-24 h-24 rounded-3xl overflow-hidden cursor-pointer shadow-lg shadow-blue-500/20 mb-4 transition-all duration-300 hover:scale-105"
                                    title="Click to change profile photo"
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleAvatarUpload} 
                                        accept="image/*" 
                                        className="hidden" 
                                    />

                                    {profileForm.avatar ? (
                                        <img 
                                            src={profileForm.avatar} 
                                            alt={profileForm.name || 'Admin'} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black">
                                            {profileForm.name ? profileForm.name.slice(0, 2).toUpperCase() : 'DP'}
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className={`absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white transition-opacity duration-200 ${uploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        {uploadingAvatar ? (
                                            <RefreshCw size={22} className="animate-spin text-white mb-1" />
                                        ) : (
                                            <>
                                                <Camera size={20} className="mb-0.5 text-blue-400" />
                                                <span className="text-[10px] font-bold tracking-tight">Change</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                    {profileForm.name || 'Darshan Prajapati'}
                                </h3>
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                                    @{profileForm.username || 'admin'}
                                </p>
                                
                                <div className="mt-4 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-wider border border-blue-100 dark:border-blue-500/20">
                                    Super Administrator
                                </div>

                                <div className="w-full mt-6 pt-6 border-t border-slate-100 dark:border-white/5 space-y-3 text-left text-xs">
                                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                                        <span className="font-medium">Account Role</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">Admin</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                                        <span className="font-medium">Session Status</span>
                                        <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                                        <span className="font-medium">Security Clearance</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">Full Access</span>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Profile Form */}
                            <div className="lg:col-span-8 bg-white dark:bg-[#141724] p-6 sm:p-8 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs">
                                <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
                                    Edit Admin Details
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    Update your name, primary login username, and notification email.
                                </p>

                                <form onSubmit={handleSaveProfile} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                value={profileForm.username}
                                                onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="Username for login"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profileForm.email}
                                                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="admin@portfolio.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                            Profile Photo URL (or click photo on left to upload)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={profileForm.avatar}
                                                onChange={e => setProfileForm({ ...profileForm, avatar: e.target.value })}
                                                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="https://... or upload by clicking avatar"
                                            />
                                            {profileForm.avatar && (
                                                <button
                                                    type="button"
                                                    onClick={() => setProfileForm({ ...profileForm, avatar: '' })}
                                                    className="px-3.5 py-2.5 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-all cursor-pointer"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!isProfileDirty || loading}
                                            className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                                                isProfileDirty && !loading
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 cursor-pointer active:scale-95'
                                                    : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 shadow-none'
                                            }`}
                                        >
                                            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                                            <span>Save Profile Details</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 2: SECURITY & PASSWORD */}
                    {activeTab === 'security' && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                        >
                            {/* Change Password Form */}
                            <div className="lg:col-span-7 bg-white dark:bg-[#141724] p-6 sm:p-8 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                        <Lock size={17} />
                                    </div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                        Change Password
                                    </h3>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    Ensure your account is protected with a strong password.
                                </p>

                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPass ? 'text' : 'password'}
                                                value={passwordForm.currentPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="Enter current password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPass(!showCurrentPass)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                            >
                                                {showCurrentPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPass ? 'text' : 'password'}
                                                value={passwordForm.newPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="At least 6 characters"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPass(!showNewPass)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                            >
                                                {showNewPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                            </button>
                                        </div>

                                        {/* Real-time Password Strength Meter */}
                                        {passwordForm.newPassword && (
                                            <div className="mt-2.5 space-y-1">
                                                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-300 ${
                                                            passwordStrength <= 25
                                                                ? 'w-1/4 bg-red-500'
                                                                : passwordStrength <= 50
                                                                ? 'w-2/4 bg-amber-500'
                                                                : passwordStrength <= 75
                                                                ? 'w-3/4 bg-blue-500'
                                                                : 'w-full bg-emerald-500'
                                                        }`}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                                    <span>Strength:</span>
                                                    <span className={
                                                        passwordStrength <= 25 ? 'text-red-500' :
                                                        passwordStrength <= 50 ? 'text-amber-500' :
                                                        passwordStrength <= 75 ? 'text-blue-500' : 'text-emerald-500'
                                                    }>
                                                        {passwordStrength <= 25 ? 'Weak' :
                                                         passwordStrength <= 50 ? 'Fair' :
                                                         passwordStrength <= 75 ? 'Good' : 'Strong'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPass ? 'text' : 'password'}
                                                value={passwordForm.confirmPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="Re-type new password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                            >
                                                {showConfirmPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!isPasswordDirty || loading}
                                            className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                                                isPasswordDirty && !loading
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 cursor-pointer active:scale-95'
                                                    : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 shadow-none'
                                            }`}
                                        >
                                            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Shield size={16} />}
                                            <span>Update Password</span>
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Session & Security Info */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="bg-white dark:bg-[#141724] p-6 sm:p-7 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs">
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        <Shield size={16} className="text-emerald-500" />
                                        Session Security
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                        Your admin session uses signed JSON Web Tokens (JWT) encrypted with HMAC SHA-256 for secure transmission.
                                    </p>

                                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200/60 dark:border-white/5 space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Token Duration</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">24h (30d Remembered)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Encryption Standard</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">JWT / Bcrypt-10</span>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <button
                                            type="button"
                                            onClick={() => authService.logout()}
                                            className="w-full py-3 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition-all border border-red-200 dark:border-red-500/20 cursor-pointer"
                                        >
                                            Logout from this Device
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 3: SEO & OPEN GRAPH META */}
                    {activeTab === 'seo' && (
                        <motion.div
                            key="seo"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                        >
                            {/* SEO Configuration Inputs */}
                            <div className="lg:col-span-7 bg-white dark:bg-[#141724] p-6 sm:p-8 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs space-y-5">
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
                                        Search Engine Optimization (SEO)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Configure meta tags, title, description, and keywords to rank on Google & Bing.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        Site Title Tag
                                    </label>
                                    <input
                                        type="text"
                                        value={settingsForm.siteTitle}
                                        onChange={e => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        placeholder="Site title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        Meta Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={settingsForm.metaDescription}
                                        onChange={e => setSettingsForm({ ...settingsForm, metaDescription: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        placeholder="Short summary of your portfolio for search results"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        Keywords (Comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={settingsForm.keywords}
                                        onChange={e => setSettingsForm({ ...settingsForm, keywords: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        placeholder="e.g. Developer, Designer, React, Next.js"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                            Canonical URL
                                        </label>
                                        <input
                                            type="text"
                                            value={settingsForm.canonicalUrl}
                                            onChange={e => setSettingsForm({ ...settingsForm, canonicalUrl: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            placeholder="https://darshan-prajapati.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                            OpenGraph Image Path
                                        </label>
                                        <input
                                            type="text"
                                            value={settingsForm.ogImage}
                                            onChange={e => setSettingsForm({ ...settingsForm, ogImage: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            placeholder="/Logos/favicon.png"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSaveSettings}
                                        disabled={!isSeoDirty || loading}
                                        className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                                            isSeoDirty && !loading
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 cursor-pointer active:scale-95'
                                                : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 shadow-none'
                                        }`}
                                    >
                                        {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                                        <span>Save SEO Settings</span>
                                    </button>
                                </div>
                            </div>

                            {/* Live Social Share Card Preview (WhatsApp/LinkedIn/X) */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="bg-white dark:bg-[#141724] p-6 sm:p-7 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                                        <Share2 size={14} className="text-blue-500" />
                                        Live Social Share Card Preview
                                    </h4>

                                    {/* Mock OpenGraph Card */}
                                    <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-[#1a1d2d] shadow-sm">
                                        <div className="h-36 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white relative">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-mono font-bold text-xl mb-1 border border-white/20">
                                                    &lt;/&gt;
                                                </div>
                                                <span className="text-xs font-black tracking-wider uppercase opacity-90">
                                                    Darshan Prajapati
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                                {settingsForm.canonicalUrl.replace('https://', '') || 'darshan-prajapati.com'}
                                            </span>
                                            <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                                {settingsForm.siteTitle || 'Portfolio Title'}
                                            </h5>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                {settingsForm.metaDescription || 'Portfolio description'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-slate-400 block mt-2.5 text-center">
                                        Previewing OpenGraph meta representation on Twitter/LinkedIn.
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 4: SOCIAL & CONTACT HUB */}
                    {activeTab === 'social' && (
                        <motion.div
                            key="social"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-[#141724] p-6 sm:p-8 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs space-y-6"
                        >
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
                                    Social Media & Contact Links
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    These links are displayed across the hero, footer, contact section, and resume cards.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* GitHub */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        <Github size={15} className="text-slate-700 dark:text-slate-300" />
                                        GitHub URL
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={settingsForm.githubUrl}
                                            onChange={e => setSettingsForm({ ...settingsForm, githubUrl: e.target.value })}
                                            className="w-full px-4 py-3 pr-10 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            placeholder="https://github.com/username"
                                        />
                                        {settingsForm.githubUrl && (
                                            <a href={settingsForm.githubUrl} target="_blank" rel="noreferrer" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* LinkedIn */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        <Linkedin size={15} className="text-blue-600" />
                                        LinkedIn URL
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={settingsForm.linkedinUrl}
                                            onChange={e => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                                            className="w-full px-4 py-3 pr-10 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                        {settingsForm.linkedinUrl && (
                                            <a href={settingsForm.linkedinUrl} target="_blank" rel="noreferrer" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Instagram */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        <Instagram size={15} className="text-pink-500" />
                                        Instagram URL
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={settingsForm.instagramUrl}
                                            onChange={e => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                                            className="w-full px-4 py-3 pr-10 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            placeholder="https://instagram.com/username"
                                        />
                                        {settingsForm.instagramUrl && (
                                            <a href={settingsForm.instagramUrl} target="_blank" rel="noreferrer" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Twitter / X */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        <Twitter size={15} className="text-sky-500" />
                                        Twitter / X URL
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={settingsForm.twitterUrl}
                                            onChange={e => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })}
                                            className="w-full px-4 py-3 pr-10 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            placeholder="https://twitter.com/username"
                                        />
                                        {settingsForm.twitterUrl && (
                                            <a href={settingsForm.twitterUrl} target="_blank" rel="noreferrer" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Direct Email */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        <Mail size={15} className="text-amber-500" />
                                        Contact Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={settingsForm.emailAddress}
                                        onChange={e => setSettingsForm({ ...settingsForm, emailAddress: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        placeholder="hdmixture@gmail.com"
                                    />
                                </div>

                                {/* WhatsApp Number */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        <Phone size={15} className="text-emerald-500" />
                                        WhatsApp / Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={settingsForm.whatsappNumber}
                                        onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d2d] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        placeholder="+919876543210"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSaveSettings}
                                    disabled={!isSocialDirty || loading}
                                    className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                                        isSocialDirty && !loading
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 cursor-pointer active:scale-95'
                                            : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 shadow-none'
                                    }`}
                                >
                                    {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                                    <span>Save Social Links</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 5: APPEARANCE & PREFERENCES & DATA BACKUP */}
                    {activeTab === 'preferences' && (
                        <motion.div
                            key="preferences"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                        >
                            {/* Theme & Persona Preferences */}
                            <div className="lg:col-span-7 bg-white dark:bg-[#141724] p-6 sm:p-8 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs space-y-6">
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
                                        Appearance & System Preferences
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Customize initial site themes, default persona mode, and announcements.
                                    </p>
                                </div>

                                {/* Default Theme Selector */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            Active Admin & Global Theme
                                        </label>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            Applies to this device & sets site default
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'light', label: 'Light', icon: Sun },
                                            { id: 'dark', label: 'Dark', icon: Moon },
                                            { id: 'system', label: 'System', icon: Monitor },
                                        ].map(t => {
                                            const Icon = t.icon;
                                            const isSelected = (settingsForm.defaultTheme || theme) === t.id;
                                            return (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setTheme(t.id);
                                                        setSettingsForm(prev => ({ ...prev, defaultTheme: t.id }));
                                                    }}
                                                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                                                            : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1a1d2d] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                                    }`}
                                                >
                                                    <Icon size={20} />
                                                    <span>{t.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Default Persona Mode */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                                        Default Portfolio Persona Mode
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'developer', label: 'Creative Developer', desc: 'Code, tech stack, hackathons', icon: Laptop },
                                            { id: 'designer', label: 'Graphic Designer', desc: 'Visual arts, branding, posters', icon: Brush },
                                        ].map(p => {
                                            const Icon = p.icon;
                                            const isSelected = settingsForm.defaultPersona === p.id;
                                            return (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => setSettingsForm({ ...settingsForm, defaultPersona: p.id as any })}
                                                    className={`p-4 rounded-2xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                                                            : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1a1d2d] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <Icon size={18} />
                                                        {isSelected && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                                                    </div>
                                                    <span className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                                                        {p.label}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        {p.desc}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSaveSettings}
                                        disabled={!isPreferencesDirty || loading}
                                        className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                                            isPreferencesDirty && !loading
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 cursor-pointer active:scale-95'
                                                : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 shadow-none'
                                        }`}
                                    >
                                        {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                                        <span>Save Preferences</span>
                                    </button>
                                </div>
                            </div>

                            {/* Data Backup & Export */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="bg-white dark:bg-[#141724] p-6 sm:p-7 rounded-[28px] border border-slate-200/80 dark:border-white/5 shadow-xs">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                            <Download size={18} />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                            Data Backup & Export
                                        </h4>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                                        Export your entire portfolio configuration and metadata as a JSON snapshot for offline backup and safekeeping.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleExportBackup}
                                        className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-md hover:opacity-90 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                    >
                                        <Download size={16} />
                                        <span>Download JSON Backup</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
