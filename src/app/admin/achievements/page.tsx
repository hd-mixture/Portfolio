"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    Plus, Edit2, Trash2, X, Image as ImageIcon, Check, Trophy, 
    Loader2, Link as LinkIcon, Award, Medal, Upload, Eye, 
    ChevronRight, User, Users, Sparkles, Gift, Code, Briefcase, 
    AlertCircle, Layers, Star, Calendar, Clock, Globe, Github,
    Lightbulb, ListPlus, ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    calculateHackathonDuration, 
    formatHackathonDate, 
    getHackathonDateAndDurationDisplay 
} from '@/lib/hackathonUtils';
import { ModernDatePicker, ModernTimePicker } from '@/components/ui/ModernDateTimePickers';
import AdminLoadingState from '@/components/admin/AdminLoadingState';

interface TeamMember {
    name: string;
    role?: string;
}

interface Achievement {
    _id: string;
    category: 'Hackathon' | 'Certificate';
    title: string;
    organization: string;
    organizationUrl?: string;
    date: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    calculatedDuration?: string;
    description: string;
    link: string;
    order: number;
    image?: string;
    isWinner?: boolean;
    participationType?: 'individual' | 'team';
    achievement?: string;
    projectName?: string;
    role?: string;
    teamName?: string;
    teamMembers?: TeamMember[];
    problem?: string;
    solution?: string;
    technologies?: string[];
    keyFeatures?: string[];
    prize?: string;
    githubUrl?: string;
    liveDemoUrl?: string;
    hackathonUrl?: string;
}

const ACHIEVEMENT_OPTIONS = [
    "None",
    "🥇 Winner / 1st Place",
    "🥈 Runner-up / 2nd Place",
    "🥉 3rd Place",
    "⭐ Finalist",
    "🏅 Shortlisted Team",
    "🏆 Special Award",
    "🎖️ Other"
];

const initialFormState = {
    category: 'Hackathon' as 'Hackathon' | 'Certificate',
    title: '',
    organization: '',
    organizationUrl: '',
    date: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    calculatedDuration: '',
    description: '',
    image: '',
    link: '',
    order: 0,
    isWinner: false,
    participationType: 'individual' as 'individual' | 'team',
    achievement: 'None',
    customAchievement: '',
    projectName: '',
    role: '',
    teamName: '',
    teamMembers: [] as TeamMember[],
    problem: '',
    solution: '',
    technologies: [] as string[],
    keyFeatures: [] as string[],
    prize: '',
    githubUrl: '',
    liveDemoUrl: '',
    hackathonUrl: ''
};

export default function AchievementsAdmin() {
    const [activeTab, setActiveTab] = useState<'Hackathon' | 'Certificate'>('Hackathon');
    
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Achievement | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    
    const [techInput, setTechInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [formData, setFormData] = useState(initialFormState);
    const [initialFormData, setInitialFormData] = useState(initialFormState);

    const isDirty = useMemo(() => {
        if (editingItem) {
            return JSON.stringify(formData) !== JSON.stringify(initialFormData);
        }
        return formData.title.trim().length > 0 && formData.organization.trim().length > 0;
    }, [formData, initialFormData, editingItem]);

    const canSubmit = isDirty && !uploading && !uploadingPdf;

    // Helper to clear specific field error
    const clearFieldError = (field: string) => {
        if (fieldErrors[field]) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
        if (formError) setFormError(null);
    };

    // Live calculated duration preview for Hackathons
    const calculatedDurationPreview = useMemo(() => {
        if (formData.category !== 'Hackathon') return { duration: '', isValid: false };
        return calculateHackathonDuration(
            formData.startDate,
            formData.endDate,
            formData.startTime,
            formData.endTime
        );
    }, [formData.category, formData.startDate, formData.endDate, formData.startTime, formData.endTime]);

    useEffect(() => {
        fetchAchievements();
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isModalOpen]);

    const fetchAchievements = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/achievements`);
            const data = await res.json();
            setAchievements(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingPdf(true);
        const data = new FormData();
        data.append('image', e.target.files[0]);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, link: result.url }));
                clearFieldError('link');
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            alert('Upload error');
        } finally {
            setUploadingPdf(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
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
                setFormData(prev => ({ ...prev, image: result.url }));
                clearFieldError('image');
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            alert('Upload error');
        } finally {
            setUploading(false);
        }
    };

    // Team members helpers
    const handleAddMember = () => {
        setFormData(prev => ({
            ...prev,
            teamMembers: [...prev.teamMembers, { name: '', role: '' }]
        }));
        clearFieldError('teamMembers');
    };

    const handleRemoveMember = (index: number) => {
        setFormData(prev => ({
            ...prev,
            teamMembers: prev.teamMembers.filter((_, i) => i !== index)
        }));
    };

    const handleMemberChange = (index: number, field: 'name' | 'role', value: string) => {
        setFormData(prev => ({
            ...prev,
            teamMembers: prev.teamMembers.map((member, i) => 
                i === index ? { ...member, [field]: value } : member
            )
        }));
        clearFieldError('teamMembers');
    };

    // Technology tag helpers
    const handleAddTech = (e?: React.KeyboardEvent | React.MouseEvent) => {
        if (e && 'key' in e && e.key !== 'Enter') return;
        if (e && 'preventDefault' in e) e.preventDefault();
        
        const trimmed = techInput.trim();
        if (trimmed && !formData.technologies.includes(trimmed)) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, trimmed]
            }));
            setTechInput('');
        }
    };

    const handleRemoveTech = (techToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== techToRemove)
        }));
    };

    // Key Feature tag helpers
    const handleAddFeature = (e?: React.KeyboardEvent | React.MouseEvent) => {
        if (e && 'key' in e && e.key !== 'Enter') return;
        if (e && 'preventDefault' in e) e.preventDefault();
        
        const trimmed = featureInput.trim();
        if (trimmed && !formData.keyFeatures.includes(trimmed)) {
            setFormData(prev => ({
                ...prev,
                keyFeatures: [...prev.keyFeatures, trimmed]
            }));
            setFeatureInput('');
        }
    };

    const handleRemoveFeature = (featToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            keyFeatures: prev.keyFeatures.filter(f => f !== featToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        const errors: Record<string, string> = {};

        // Validation for Certificate Date
        if (formData.category === 'Certificate') {
            if (!formData.date || !formData.date.trim()) {
                errors.date = 'Please enter an Issue Date.';
            }
        }

        // Validation for Hackathon Dates
        if (formData.category === 'Hackathon') {
            if (!formData.startDate) {
                errors.startDate = 'Please select a Start Date.';
            }
            if (!formData.endDate) {
                errors.endDate = 'Please select an End Date.';
            }
            if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
                errors.endDate = 'End Date cannot be before Start Date.';
            }

            if (formData.startDate && formData.endDate && !errors.startDate && !errors.endDate) {
                const durationResult = calculateHackathonDuration(
                    formData.startDate,
                    formData.endDate,
                    formData.startTime,
                    formData.endTime
                );
                if (durationResult.error) {
                    errors.endTime = durationResult.error;
                }
            }

            // Your Role is required for Hackathon projects
            if (!formData.role || !formData.role.trim()) {
                errors.role = 'Please specify Your Role in the project.';
            }

            // Project Name is required for Hackathon projects
            if (!formData.projectName || !formData.projectName.trim()) {
                errors.projectName = 'Please enter the Project Name.';
            }

            // Team Project Validation
            if (formData.participationType === 'team') {
                if (!formData.teamName || !formData.teamName.trim()) {
                    errors.teamName = 'Please specify the Team Name.';
                }
                const validMembers = formData.teamMembers.filter(m => m.name.trim() !== '');
                if (validMembers.length === 0) {
                    errors.teamMembers = 'Please add at least one Team Member with a valid name.';
                }
            }

            // Winning Hackathon Validation: If Winning = ON -> Achievement is required and cannot be "None"
            if (formData.isWinner) {
                const effectiveAch = formData.achievement === '🎖️ Other' ? formData.customAchievement.trim() : formData.achievement;
                if (!effectiveAch || effectiveAch === 'None') {
                    errors.achievement = 'Please select a winning achievement position.';
                }
            }
        }

        // Common required fields
        if (!formData.title || !formData.title.trim()) {
            errors.title = 'Please enter a Title / Event Name.';
        }
        if (!formData.organization || !formData.organization.trim()) {
            errors.organization = 'Please enter an Organization / Issuer.';
        }
        if (!formData.description || !formData.description.trim()) {
            errors.description = 'Please enter a Description.';
        }

        // If validation errors exist -> focus & scroll to first invalid field
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setFormError('Please fill in all required fields marked below.');
            const firstField = Object.keys(errors)[0];
            setTimeout(() => {
                const el = document.getElementById(`field-${firstField}`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.focus();
                }
            }, 50);
            return;
        }

        let finalDate = formData.date;
        let finalCalculatedDuration = formData.calculatedDuration;

        if (formData.category === 'Hackathon') {
            const durationResult = calculateHackathonDuration(
                formData.startDate,
                formData.endDate,
                formData.startTime,
                formData.endTime
            );
            finalCalculatedDuration = durationResult.duration;
            const formattedStart = formatHackathonDate(formData.startDate);
            finalDate = finalCalculatedDuration ? `${formattedStart} · ${finalCalculatedDuration}` : formattedStart;
        }

        // Determine final achievement string
        let finalAchievement = formData.achievement;
        if (formData.achievement === '🎖️ Other' && formData.customAchievement.trim()) {
            finalAchievement = formData.customAchievement.trim();
        }

        try {
            const url = editingItem 
                ? `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/achievements/${editingItem._id}` 
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/achievements`;
            const method = editingItem ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                date: finalDate,
                calculatedDuration: finalCalculatedDuration,
                achievement: finalAchievement,
                teamName: formData.participationType === 'team' ? formData.teamName : '',
                teamMembers: formData.participationType === 'team'
                    ? formData.teamMembers.filter(m => m.name.trim() !== '')
                    : []
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchAchievements();
            } else {
                const err = await res.json();
                setFormError(err.message || 'Failed to save achievement');
            }
        } catch (error) {
            console.error(error);
            setFormError('A server error occurred while saving.');
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
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/achievements/${idToDelete}`, { method: 'DELETE' });
            setTimeout(() => {
                setAchievements(prev => prev.filter(a => a._id !== idToDelete));
                setDeleteConfirmId(null);
                setDeletingId(null);
            }, 500);
        } catch (error) {
            console.error(error);
            setDeleteConfirmId(null);
            setDeletingId(null);
        }
    };

    const openModal = (item?: Achievement) => {
        setFormError(null);
        setFieldErrors({});
        setTechInput('');
        setFeatureInput('');
        if (item) {
            setEditingItem(item);
            const isStandardAch = item.achievement ? ACHIEVEMENT_OPTIONS.includes(item.achievement) : true;
            const itemData = {
                category: item.category,
                title: item.title || '',
                organization: item.organization || '',
                organizationUrl: item.organizationUrl || '',
                date: item.date || '',
                startDate: item.startDate || '',
                endDate: item.endDate || '',
                startTime: item.startTime || '',
                endTime: item.endTime || '',
                calculatedDuration: item.calculatedDuration || '',
                description: item.description || '',
                image: item.image || '',
                link: item.link || '',
                order: item.order || 0,
                isWinner: item.isWinner || false,
                participationType: item.participationType || 'individual',
                achievement: item.achievement 
                    ? (isStandardAch ? item.achievement : '🎖️ Other') 
                    : (item.isWinner ? '🥇 Winner / 1st Place' : 'None'),
                customAchievement: !isStandardAch && item.achievement ? item.achievement : '',
                projectName: item.projectName || '',
                role: item.role || '',
                teamName: item.teamName || '',
                teamMembers: Array.isArray(item.teamMembers) && item.teamMembers.length > 0 
                    ? item.teamMembers 
                    : (item.participationType === 'team' ? [{ name: '', role: '' }] : []),
                problem: item.problem || '',
                solution: item.solution || '',
                technologies: Array.isArray(item.technologies) ? item.technologies : [],
                keyFeatures: Array.isArray(item.keyFeatures) ? item.keyFeatures : [],
                prize: item.prize || '',
                githubUrl: item.githubUrl || '',
                liveDemoUrl: item.liveDemoUrl || '',
                hackathonUrl: item.hackathonUrl || ''
            };
            setFormData(itemData);
            setInitialFormData(itemData);
        } else {
            setEditingItem(null);
            const freshData = {
                ...initialFormState,
                category: activeTab,
                teamMembers: activeTab === 'Hackathon' ? [{ name: '', role: '' }] : []
            };
            setFormData(freshData);
            setInitialFormData(freshData);
        }
        setIsModalOpen(true);
    };

    const filteredAchievements = achievements.filter(a => a.category === activeTab);

    return (
        <div className="p-6 sm:p-10 max-w-[1600px] mx-auto min-h-screen">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span className="p-2.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-2xl border border-yellow-500/20 shadow-xs">
                            <Trophy size={24} />
                        </span>
                        Achievements & Certifications
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
                        Manage your hackathons, awards, verified certificates, and participation records.
                    </p>
                </div>
                
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-yellow-500/20 transition-all cursor-pointer"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    <span>Add {activeTab}</span>
                </button>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-[20px] border border-slate-200 dark:border-[#333] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center flex-shrink-0 text-yellow-600 dark:text-yellow-400">
                        <Trophy size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Total Hackathons</p>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                            {achievements.filter(a => a.category === 'Hackathon').length}
                        </h4>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-[20px] border border-slate-200 dark:border-[#333] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400">
                        <Star size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Winning Finishes</p>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                            {achievements.filter(a => a.category === 'Hackathon' && a.isWinner).length}
                        </h4>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-[20px] border border-slate-200 dark:border-[#333] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                        <Award size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Certificates</p>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                            {achievements.filter(a => a.category === 'Certificate').length}
                        </h4>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-[20px] border border-slate-200 dark:border-[#333] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                        <Medal size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Platforms</p>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                            {new Set(achievements.filter(a => a.category === 'Certificate').map(a => a.organization)).size}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-[#222] mb-6">
                <button 
                    onClick={() => setActiveTab('Hackathon')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'Hackathon' ? 'border-yellow-500 text-yellow-600 dark:text-yellow-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    <div className="flex items-center gap-2">
                        <Trophy size={16} /> Hackathons
                    </div>
                </button>
                <button 
                    onClick={() => setActiveTab('Certificate')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'Certificate' ? 'border-yellow-500 text-yellow-600 dark:text-yellow-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    <div className="flex items-center gap-2">
                        <Award size={16} /> Certificates
                    </div>
                </button>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="bg-white dark:bg-[#141724] rounded-[28px] border border-slate-200/80 dark:border-white/5 p-4 shadow-xs">
                    <AdminLoadingState 
                        title={`Loading ${activeTab} Records...`}
                        subtitle={`Fetching award details, team credits & certificates`}
                        minHeight="min-h-[400px]"
                    />
                </div>
            ) : filteredAchievements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4 bg-white dark:bg-[#1a1a1a] rounded-[24px] border border-slate-200 dark:border-[#333]">
                    <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-[#222] flex items-center justify-center border border-slate-100 dark:border-[#333]">
                        {activeTab === 'Hackathon' ? <Trophy size={32} className="text-slate-300 dark:text-slate-600" /> : <Award size={32} className="text-slate-300 dark:text-slate-600" />}
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No {activeTab.toLowerCase()}s added yet</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Click the button above to add your first {activeTab.toLowerCase()}.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredAchievements.map((item) => (
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
                                    <div className={`flex flex-col bg-white dark:bg-[#151515] rounded-[24px] overflow-hidden border border-slate-200/60 dark:border-[#222] hover:border-yellow-500/30 dark:hover:border-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/5 transition-all duration-300 relative h-full [backface-visibility:hidden] ${deleteConfirmId === item._id ? 'pointer-events-none' : ''}`}>
                                        
                                        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal(item)} className="w-8 h-8 rounded-full bg-white dark:bg-[#222] text-slate-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center shadow-sm border border-slate-200 dark:border-[#333] transition-colors cursor-pointer"><Edit2 size={14} /></button>
                                            <button onClick={() => confirmDelete(item._id)} className="w-8 h-8 rounded-full bg-white dark:bg-[#222] text-slate-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center shadow-sm border border-slate-200 dark:border-[#333] transition-colors cursor-pointer"><Trash2 size={14} /></button>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-[#333] bg-slate-50 dark:bg-[#222] flex-shrink-0 relative">
                                                    {item.image ? (
                                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                    ) : (
                                                        item.category === 'Hackathon' ? <Trophy className="text-slate-400" /> : <Award className="text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                                    {item.category === 'Hackathon' && (
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                                            {item.participationType === 'team' ? <Users size={11} /> : <User size={11} />}
                                                            {item.participationType === 'team' ? 'Team' : 'Solo'}
                                                        </span>
                                                    )}
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.category === 'Hackathon' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                {item.isWinner && (
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/30 flex items-center gap-1">
                                                        <Trophy size={10} /> {item.achievement || 'Winner'}
                                                    </span>
                                                )}
                                                {!item.isWinner && item.achievement && item.achievement !== 'None' && (
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                                                        {item.achievement}
                                                    </span>
                                                )}
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white line-clamp-2 leading-tight">{item.title}</h3>
                                            </div>
                                            <p className="text-[13px] font-bold text-slate-600 dark:text-gray-300 mb-4">{item.organization}</p>
                                            
                                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-[#222] rounded-lg text-xs font-bold text-slate-600 dark:text-gray-300 flex items-center gap-1">
                                                    <Calendar size={11} className="text-yellow-500" />
                                                    {getHackathonDateAndDurationDisplay(item)}
                                                </span>
                                                {item.projectName && (
                                                    <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold truncate max-w-[130px]">
                                                        {item.projectName}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-[12px] font-medium text-slate-500 dark:text-gray-400 line-clamp-2 mb-6">
                                                {item.description}
                                            </p>

                                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-[#222] flex items-center justify-between">
                                                {item.link ? (
                                                    <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors group">
                                                        <LinkIcon size={14} /> Certificate
                                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                                                    </a>
                                                ) : (
                                                    <span className="text-[12px] font-bold text-slate-400 dark:text-slate-600">No certificate</span>
                                                )}

                                                {item.githubUrl && (
                                                    <a href={item.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="GitHub Repository">
                                                        <Github size={15} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back Side: Delete Confirmation */}
                                    <div className={`absolute inset-0 flex flex-col bg-white dark:bg-[#151515] rounded-[24px] overflow-hidden border border-red-500/50 shadow-xl shadow-red-500/10 items-center justify-center p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] ${deleteConfirmId === item._id ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                                        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4 border border-red-100 dark:border-red-500/20">
                                            <Trash2 size={24} className="text-red-500" />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Delete {item.category}?</h3>
                                        <p className="text-xs font-medium text-slate-500 dark:text-gray-400 mb-6 px-2">Are you sure? This cannot be undone.</p>
                                        <div className="flex gap-3 w-full">
                                            <button type="button" onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#333]/80 transition-all cursor-pointer">
                                                Cancel
                                            </button>
                                            <button type="button" onClick={executeDelete} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md shadow-red-500/20 cursor-pointer">
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
            <dialog ref={dialogRef} className="m-auto rounded-3xl bg-transparent p-0 backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95 duration-200">
                <div className="w-[92vw] max-w-[720px] bg-white dark:bg-[#121212] rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 dark:border-[#222]">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#222]">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <Trophy size={20} className="text-yellow-500" />
                                {editingItem ? 'Edit' : 'Add'} {formData.category}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Fill in the complete project and event details below.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-[#222] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto max-h-[75vh] custom-scrollbar">
                        
                        {/* Error Alert */}
                        {formError && (
                            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-xs font-bold flex items-center gap-3 animate-in fade-in">
                                <AlertCircle size={18} className="flex-shrink-0" />
                                <span>{formError}</span>
                            </div>
                        )}

                        <form id="achievement-form" onSubmit={handleSubmit} noValidate className="space-y-6">
                            
                            {/* SECTION 1: BASIC INFORMATION */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#222]">
                                    <Layers size={14} className="text-yellow-500" />
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400">1. Basic Information</span>
                                </div>

                                {/* Certificate Date / Duration Field */}
                                {formData.category === 'Certificate' && (
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Issue Date / Duration *</label>
                                        <input 
                                            id="field-date"
                                            type="text" 
                                            value={formData.date} 
                                            onChange={e => {
                                                setFormData({...formData, date: e.target.value});
                                                clearFieldError('date');
                                            }} 
                                            placeholder="e.g. Sep 2024" 
                                            className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border text-sm font-bold text-slate-900 dark:text-white outline-none transition-all ${
                                                fieldErrors.date 
                                                    ? 'border-red-500 ring-2 ring-red-500/20 dark:border-red-500' 
                                                    : 'border-slate-200 dark:border-[#333] focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500'
                                            }`}
                                        />
                                        {fieldErrors.date && (
                                            <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                                <AlertCircle size={12} /> {fieldErrors.date}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Title / Event Name */}
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Title / Event Name *</label>
                                    <input 
                                        id="field-title"
                                        type="text" 
                                        value={formData.title} 
                                        onChange={e => {
                                            setFormData({...formData, title: e.target.value});
                                            clearFieldError('title');
                                        }} 
                                        placeholder={formData.category === 'Hackathon' ? "Tic-Tech-Toe ’24" : "AWS Certified Developer"} 
                                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border text-sm font-bold text-slate-900 dark:text-white outline-none transition-all ${
                                            fieldErrors.title 
                                                ? 'border-red-500 ring-2 ring-red-500/20 dark:border-red-500' 
                                                : 'border-slate-200 dark:border-[#333] focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500'
                                        }`}
                                    />
                                    {fieldErrors.title && (
                                        <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                            <AlertCircle size={12} /> {fieldErrors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Organization / Issuer */}
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Organization / Issuer *</label>
                                    <input 
                                        id="field-organization"
                                        type="text" 
                                        value={formData.organization} 
                                        onChange={e => {
                                            setFormData({...formData, organization: e.target.value});
                                            clearFieldError('organization');
                                        }} 
                                        placeholder={formData.category === 'Hackathon' ? "IEEE SB DA-IICT" : "Amazon Web Services"} 
                                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border text-sm font-bold text-slate-900 dark:text-white outline-none transition-all ${
                                            fieldErrors.organization 
                                                ? 'border-red-500 ring-2 ring-red-500/20 dark:border-red-500' 
                                                : 'border-slate-200 dark:border-[#333] focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500'
                                        }`}
                                    />
                                    {fieldErrors.organization && (
                                        <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                            <AlertCircle size={12} /> {fieldErrors.organization}
                                        </p>
                                    )}
                                </div>

                                {/* Organization / Issuer Website Link */}
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                                        <span>Organization / Issuer Website (Optional)</span>
                                        <span className="text-[10px] lowercase text-slate-400 font-normal">e.g. https://ieeedaiict.in</span>
                                    </label>
                                    <div className="relative">
                                        <input 
                                            id="field-organizationUrl"
                                            type="url" 
                                            value={formData.organizationUrl} 
                                            onChange={e => setFormData({...formData, organizationUrl: e.target.value})} 
                                            placeholder="https://..." 
                                            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                                        />
                                        <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>

                                {/* Description (Event / Hackathon details) */}
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Description (About Event) *</label>
                                    <textarea 
                                        id="field-description"
                                        rows={3} 
                                        value={formData.description} 
                                        onChange={e => {
                                            setFormData({...formData, description: e.target.value});
                                            clearFieldError('description');
                                        }} 
                                        placeholder="Brief details about the hackathon/competition itself..." 
                                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border text-sm font-medium text-slate-900 dark:text-white outline-none transition-all resize-none ${
                                            fieldErrors.description 
                                                ? 'border-red-500 ring-2 ring-red-500/20 dark:border-red-500' 
                                                : 'border-slate-200 dark:border-[#333] focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500'
                                        }`}
                                    />
                                    {fieldErrors.description && (
                                        <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                            <AlertCircle size={12} /> {fieldErrors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* SECTION 2: HACKATHON DATE & DURATION SYSTEM */}
                            {formData.category === 'Hackathon' && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#222]">
                                        <Calendar size={14} className="text-yellow-500" />
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400">2. Date & Duration</span>
                                    </div>

                                    {/* Date Pickers Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <ModernDatePicker
                                                id="field-startDate"
                                                label="Start Date *"
                                                value={formData.startDate}
                                                align="left"
                                                onChange={val => {
                                                    setFormData({ ...formData, startDate: val });
                                                    clearFieldError('startDate');
                                                    clearFieldError('endDate');
                                                }}
                                                hasError={!!fieldErrors.startDate}
                                                placeholder="Select start date"
                                            />
                                            {fieldErrors.startDate && (
                                                <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                                    <AlertCircle size={12} /> {fieldErrors.startDate}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <ModernDatePicker
                                                id="field-endDate"
                                                label="End Date *"
                                                value={formData.endDate}
                                                align="right"
                                                minDate={formData.startDate}
                                                onChange={val => {
                                                    setFormData({ ...formData, endDate: val });
                                                    clearFieldError('endDate');
                                                }}
                                                hasError={!!fieldErrors.endDate}
                                                placeholder="Select end date"
                                            />
                                            {fieldErrors.endDate && (
                                                <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                                    <AlertCircle size={12} /> {fieldErrors.endDate}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Time Pickers Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <ModernTimePicker
                                                id="field-startTime"
                                                label="Start Time (Optional)"
                                                value={formData.startTime}
                                                align="left"
                                                onChange={val => {
                                                    setFormData({ ...formData, startTime: val });
                                                    clearFieldError('startTime');
                                                    clearFieldError('endTime');
                                                }}
                                                placeholder="Select start time"
                                            />
                                        </div>

                                        <div>
                                            <ModernTimePicker
                                                id="field-endTime"
                                                label="End Time (Optional)"
                                                value={formData.endTime}
                                                align="right"
                                                onChange={val => {
                                                    setFormData({ ...formData, endTime: val });
                                                    clearFieldError('endTime');
                                                }}
                                                hasError={!!fieldErrors.endTime}
                                                placeholder="Select end time"
                                            />
                                            {fieldErrors.endTime && (
                                                <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                                    <AlertCircle size={12} /> {fieldErrors.endTime}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Live Duration Summary Footer Banner */}
                                    <div className="p-3 px-4 rounded-2xl bg-white/90 dark:bg-[#1a1e2c] border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                            <span className="text-xs font-bold text-slate-600 dark:text-gray-300">
                                                Calculated Duration:
                                            </span>
                                        </div>
                                        <div className="font-black text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                                            {calculatedDurationPreview.error ? (
                                                <span className="text-red-500 text-xs font-bold flex items-center gap-1">
                                                    <AlertCircle size={12} /> {calculatedDurationPreview.error}
                                                </span>
                                            ) : (
                                                calculatedDurationPreview.duration ? (
                                                    <span className="tracking-wide">⏱ {calculatedDurationPreview.duration}</span>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-500 font-medium text-xs">Select dates to calculate</span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION 3: PARTICIPATION & ROLE */}
                            {formData.category === 'Hackathon' && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#222]">
                                        <Users size={14} className="text-yellow-500" />
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400">3. Participation & Team Information</span>
                                    </div>

                                    {/* Participation Type Segmented Control */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Participation Type</label>
                                        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-[#1a1a1a] rounded-2xl border border-slate-200/80 dark:border-[#333]">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, participationType: 'individual' });
                                                    clearFieldError('teamName');
                                                    clearFieldError('teamMembers');
                                                }}
                                                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                    formData.participationType === 'individual'
                                                        ? 'bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/10'
                                                        : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
                                                }`}
                                            >
                                                <User size={15} className={formData.participationType === 'individual' ? 'text-yellow-500' : ''} />
                                                <span>👤 Individual Project</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        participationType: 'team',
                                                        teamMembers: prev.teamMembers.length === 0 ? [{ name: '', role: '' }] : prev.teamMembers
                                                    }));
                                                }}
                                                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                    formData.participationType === 'team'
                                                        ? 'bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/10'
                                                        : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
                                                }`}
                                            >
                                                <Users size={15} className={formData.participationType === 'team' ? 'text-yellow-500' : ''} />
                                                <span>👥 Team / Group Project</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Your Role (Always visible for both Individual & Team) */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Your Role *</label>
                                        <input
                                            id="field-role"
                                            type="text"
                                            value={formData.role}
                                            onChange={e => {
                                                setFormData({ ...formData, role: e.target.value });
                                                clearFieldError('role');
                                            }}
                                            placeholder="e.g. Frontend Developer & Product Designer"
                                            className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border text-sm font-bold text-slate-900 dark:text-white outline-none transition-all ${
                                                fieldErrors.role 
                                                    ? 'border-red-500 ring-2 ring-red-500/20 dark:border-red-500' 
                                                    : 'border-slate-200 dark:border-[#333] focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500'
                                            }`}
                                        />
                                        {fieldErrors.role && (
                                            <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                                <AlertCircle size={12} /> {fieldErrors.role}
                                            </p>
                                        )}
                                    </div>

                                    {/* CONDITIONAL TEAM INFORMATION SECTION */}
                                    <AnimatePresence>
                                        {formData.participationType === 'team' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-[#181a24] border border-slate-200 dark:border-white/10 space-y-4">
                                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/5">
                                                        <Users size={15} className="text-yellow-500" />
                                                        <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-gray-300">👥 Team Information</span>
                                                    </div>

                                                    {/* Team Name */}
                                                    <div>
                                                        <label className="block text-xs font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest mb-1.5">Team Name *</label>
                                                        <input
                                                            id="field-teamName"
                                                            type="text"
                                                            value={formData.teamName}
                                                            onChange={e => {
                                                                setFormData({ ...formData, teamName: e.target.value });
                                                                clearFieldError('teamName');
                                                            }}
                                                            placeholder="e.g. BitRIX"
                                                            className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#121212] border text-sm font-bold text-slate-900 dark:text-white outline-none transition-all ${
                                                                fieldErrors.teamName 
                                                                    ? 'border-red-500 ring-2 ring-red-500/20' 
                                                                    : 'border-slate-200 dark:border-[#333] focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500'
                                                            }`}
                                                        />
                                                        {fieldErrors.teamName && (
                                                            <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                                                <AlertCircle size={12} /> {fieldErrors.teamName}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Repeatable Dynamic Team Members */}
                                                    <div id="field-teamMembers">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="text-xs font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest">Team Members *</label>
                                                            <button
                                                                type="button"
                                                                onClick={handleAddMember}
                                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:underline cursor-pointer"
                                                            >
                                                                <Plus size={13} /> Add Team Member
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2">
                                                            {formData.teamMembers.map((member, idx) => (
                                                                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#333]">
                                                                    <input
                                                                        type="text"
                                                                        value={member.name}
                                                                        onChange={e => handleMemberChange(idx, 'name', e.target.value)}
                                                                        placeholder="Member Name *"
                                                                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-yellow-500"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={member.role || ''}
                                                                        onChange={e => handleMemberChange(idx, 'role', e.target.value)}
                                                                        placeholder="Role (Optional)"
                                                                        className="w-1/3 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-yellow-500"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveMember(idx)}
                                                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                                                                        title="Remove member"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}

                                                            {formData.teamMembers.length === 0 && (
                                                                <div className={`p-4 rounded-xl border border-dashed text-center ${
                                                                    fieldErrors.teamMembers 
                                                                        ? 'border-red-500 bg-red-500/5' 
                                                                        : 'border-slate-300 dark:border-[#333]'
                                                                }`}>
                                                                    <p className="text-xs text-slate-500 dark:text-gray-400 mb-2">No team members added yet.</p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={handleAddMember}
                                                                        className="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-bold hover:bg-yellow-500/20 transition-colors cursor-pointer"
                                                                    >
                                                                        + Add First Member
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {fieldErrors.teamMembers && (
                                                                <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                                                    <AlertCircle size={12} /> {fieldErrors.teamMembers}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* SECTION 4: ACHIEVEMENT & RECOGNITION */}
                            {formData.category === 'Hackathon' && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#222]">
                                        <Trophy size={14} className="text-yellow-500" />
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400">4. Achievement / Recognition</span>
                                    </div>

                                    {/* Winning Hackathon Toggle */}
                                    <div>
                                        <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 dark:border-[#333] rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] hover:bg-slate-100/80 dark:hover:bg-[#222] transition-colors">
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only" 
                                                    checked={formData.isWinner}
                                                    onChange={e => {
                                                        const isNowWinner = e.target.checked;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            isWinner: isNowWinner,
                                                            achievement: isNowWinner && (prev.achievement === 'None' || !prev.achievement)
                                                                ? '🥇 Winner / 1st Place'
                                                                : prev.achievement
                                                        }));
                                                        clearFieldError('achievement');
                                                    }}
                                                />
                                                <div className={`w-11 h-6 rounded-full transition-colors ${formData.isWinner ? 'bg-yellow-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isWinner ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Winning Hackathon</p>
                                                <p className="text-xs text-slate-500 dark:text-gray-400">
                                                    {formData.isWinner ? 'Marked as top winner finish' : 'Participant / Finalist / Shortlisted record'}
                                                </p>
                                            </div>
                                            <Trophy size={20} className={`ml-auto ${formData.isWinner ? 'text-yellow-500 animate-pulse' : 'text-slate-300 dark:text-slate-600'}`} />
                                        </label>
                                    </div>

                                    {/* Achievement / Position Dropdown (Independent of Winning Toggle) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest mb-1.5">
                                                Achievement / Recognition {formData.isWinner ? '*' : ''}
                                            </label>
                                            <select
                                                id="field-achievement"
                                                value={formData.achievement}
                                                onChange={e => {
                                                    setFormData({ ...formData, achievement: e.target.value });
                                                    clearFieldError('achievement');
                                                }}
                                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border text-sm font-bold text-slate-900 dark:text-white outline-none transition-all cursor-pointer ${
                                                    fieldErrors.achievement 
                                                        ? 'border-red-500 ring-2 ring-red-500/20' 
                                                        : 'border-slate-200 dark:border-[#333] focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500'
                                                }`}
                                            >
                                                {ACHIEVEMENT_OPTIONS.map((opt, idx) => (
                                                    <option key={idx} value={opt}>{opt}</option>
                                                ))}
                                                {formData.achievement && !ACHIEVEMENT_OPTIONS.includes(formData.achievement) && (
                                                    <option value={formData.achievement}>{formData.achievement}</option>
                                                )}
                                            </select>
                                            {fieldErrors.achievement && (
                                                <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                                    <AlertCircle size={12} /> {fieldErrors.achievement}
                                                </p>
                                            )}
                                        </div>

                                        {/* Prize / Award (Optional) */}
                                        <div>
                                            <label className="block text-xs font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest mb-1.5">Prize / Award (Optional)</label>
                                            <div className="relative">
                                                <Gift size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-500" />
                                                <input
                                                    id="field-prize"
                                                    type="text"
                                                    value={formData.prize}
                                                    onChange={e => setFormData({ ...formData, prize: e.target.value })}
                                                    placeholder="e.g. ₹50,000 Cash Prize + Trophy"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Achievement Input if 'Other' selected */}
                                    {formData.achievement === '🎖️ Other' && (
                                        <div>
                                            <label className="block text-xs font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest mb-1.5">Custom Achievement Label *</label>
                                            <input
                                                type="text"
                                                value={formData.customAchievement}
                                                onChange={e => setFormData({ ...formData, customAchievement: e.target.value })}
                                                placeholder="e.g. Best UI/UX Design Award"
                                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-yellow-500/40 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SECTION 5: PROJECT DETAILS */}
                            {formData.category === 'Hackathon' && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#222]">
                                        <Lightbulb size={14} className="text-yellow-500" />
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400">5. 💡 Project Details</span>
                                    </div>

                                    {/* Project Name */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest mb-1.5">Project Name *</label>
                                        <input
                                            id="field-projectName"
                                            type="text"
                                            value={formData.projectName}
                                            onChange={e => {
                                                setFormData({ ...formData, projectName: e.target.value });
                                                clearFieldError('projectName');
                                            }}
                                            placeholder="e.g. Save-Share"
                                            className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border text-sm font-bold text-slate-900 dark:text-white outline-none transition-all ${
                                                fieldErrors.projectName 
                                                    ? 'border-red-500 ring-2 ring-red-500/20' 
                                                    : 'border-slate-200 dark:border-[#333] focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500'
                                            }`}
                                        />
                                        {fieldErrors.projectName && (
                                            <p className="text-[11px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                                                <AlertCircle size={12} /> {fieldErrors.projectName}
                                            </p>
                                        )}
                                    </div>

                                    {/* Problem / Challenge */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest mb-1.5">Problem / Challenge (Optional)</label>
                                        <textarea
                                            id="field-problem"
                                            rows={2}
                                            value={formData.problem}
                                            onChange={e => setFormData({ ...formData, problem: e.target.value })}
                                            placeholder="Describe the real-world problem or challenge statement you solved..."
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 resize-none"
                                        />
                                    </div>

                                    {/* What We Built / Solution */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest mb-1.5">
                                            {formData.participationType === 'team' ? 'What We Built / Solution' : 'What I Built / Solution'}
                                        </label>
                                        <textarea
                                            id="field-solution"
                                            rows={3}
                                            value={formData.solution}
                                            onChange={e => {
                                                setFormData({ ...formData, solution: e.target.value });
                                                clearFieldError('solution');
                                            }}
                                            placeholder="Describe the solution, platform architecture, and core functionality built..."
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 resize-none"
                                        />
                                    </div>

                                    {/* Technologies Used */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest mb-1.5">Technologies Used</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={techInput}
                                                onChange={e => setTechInput(e.target.value)}
                                                onKeyDown={handleAddTech}
                                                placeholder="Type tech (e.g. PHP, Hack, React) and press Enter"
                                                className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddTech}
                                                className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold transition-colors cursor-pointer"
                                            >
                                                Add Tech
                                            </button>
                                        </div>

                                        {formData.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {formData.technologies.map((tech, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/15 border border-yellow-500/30 text-yellow-800 dark:text-yellow-300 text-xs font-bold">
                                                        <Code size={11} /> {tech}
                                                        <button type="button" onClick={() => handleRemoveTech(tech)} className="hover:text-red-500 ml-1 cursor-pointer">
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Key Features */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest mb-1.5">Key Features (Optional)</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={featureInput}
                                                onChange={e => setFeatureInput(e.target.value)}
                                                onKeyDown={handleAddFeature}
                                                placeholder="Type a feature (e.g. Food donation matching) & press Enter"
                                                className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddFeature}
                                                className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold transition-colors cursor-pointer"
                                            >
                                                Add Feature
                                            </button>
                                        </div>

                                        {formData.keyFeatures.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {formData.keyFeatures.map((feat, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-medium">
                                                        <ListPlus size={11} /> {feat}
                                                        <button type="button" onClick={() => handleRemoveFeature(feat)} className="hover:text-red-500 ml-1 cursor-pointer">
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* SECTION 6: PROJECT & EVENT LINKS */}
                            {formData.category === 'Hackathon' && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#222]">
                                        <LinkIcon size={14} className="text-yellow-500" />
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400">6. 🔗 Project & Event Links</span>
                                    </div>

                                    {/* GitHub URL */}
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Project / GitHub URL (Optional)</label>
                                        <div className="relative">
                                            <Github size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                id="field-githubUrl"
                                                type="url"
                                                value={formData.githubUrl}
                                                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                                                placeholder="https://github.com/username/project"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Live Demo URL */}
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Live Demo URL (Optional)</label>
                                            <div className="relative">
                                                <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    id="field-liveDemoUrl"
                                                    type="url"
                                                    value={formData.liveDemoUrl}
                                                    onChange={e => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                                                    placeholder="https://myproject.demo.com"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Hackathon / Event URL */}
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Hackathon URL (Optional)</label>
                                            <div className="relative">
                                                <ExternalLink size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    id="field-hackathonUrl"
                                                    type="url"
                                                    value={formData.hackathonUrl}
                                                    onChange={e => setFormData({ ...formData, hackathonUrl: e.target.value })}
                                                    placeholder="https://devfolio.co/hackathons/..."
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION 7: PROOF & MEDIA */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#222]">
                                    <Sparkles size={14} className="text-yellow-500" />
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400">
                                        {formData.category === 'Hackathon' ? '7. Proof & Media' : '2. Proof & Media'}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Certificate File (PDF/Image) / Link</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            id="field-link"
                                            type="text" 
                                            value={formData.link} 
                                            onChange={e => {
                                                setFormData({...formData, link: e.target.value});
                                                clearFieldError('link');
                                            }} 
                                            placeholder="https:// or upload file..." 
                                            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                                        />
                                        <div className="relative">
                                            <input type="file" accept="application/pdf,image/*" onChange={handlePdfUpload} className="hidden" id="achievement-pdf" />
                                            <label htmlFor="achievement-pdf" className="cursor-pointer h-[42px] px-4 bg-slate-100 hover:bg-slate-200 dark:bg-[#222] dark:hover:bg-[#333] text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[120px]">
                                                {uploadingPdf ? <Loader2 className="animate-spin" size={15} /> : <Upload size={13} />} 
                                                {uploadingPdf ? 'Uploading...' : 'Upload File'}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Image / Badge / Logo / Cover</label>
                                    <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-[#333] rounded-2xl bg-slate-50 dark:bg-[#151515]">
                                        <div className="w-16 h-16 rounded-xl bg-white dark:bg-[#222] border border-slate-200 dark:border-[#333] overflow-hidden flex items-center justify-center relative shadow-sm">
                                            {formData.image ? (
                                                <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                            ) : (
                                                <ImageIcon className="text-slate-400" size={24} />
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
                                                    <Loader2 className="animate-spin text-yellow-500" size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="achievement-image" />
                                            <label htmlFor="achievement-image" className="cursor-pointer px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-2">
                                                <Upload size={14} /> Upload Image
                                            </label>
                                            <p className="text-[10px] font-medium text-slate-500 mt-2">Recommended: Square logo or screenshot (1:1 or 16:9)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>

                    {/* Modal Footer Actions */}
                    <div className="p-6 bg-white dark:bg-[#151515] border-t border-slate-200/60 dark:border-[#222] flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#333]/80 transition-all cursor-pointer">
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            form="achievement-form" 
                            disabled={!canSubmit}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2 ${
                                canSubmit
                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-500/20 cursor-pointer active:scale-95'
                                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-60 shadow-none'
                            }`}
                        >
                            <Check size={18} />
                            {editingItem ? 'Save Changes' : 'Save Hackathon'}
                        </button>
                    </div>
                </div>
            </dialog>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(156, 163, 175, 0.5);
                }
            `}</style>
        </div>
    );
}
