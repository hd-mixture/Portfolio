"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Link as LinkIcon, Code2, Loader2, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectFormModal, { ProjectFormValues } from '@/components/admin/projects/ProjectFormModal';
import AdminLoadingState from '@/components/admin/AdminLoadingState';

interface Project {
    _id: string;
    title: string;
    date: string;
    description: string;
    status: string;
    liveLink: string;
    codeLink: string;
    iconSrc: string;
    timelineIconClass: string;
}

export default function ProjectsAdminPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`);
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: ProjectFormValues, id?: string) => {
        const url = id 
            ? `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/projects/${id}` 
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`;
        
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Failed to save");
        await fetchProjects();
    };

    const confirmDelete = (id: string) => {
        setDeleteConfirmId(id);
    };

    const executeDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/projects/${id}`, { method: 'DELETE' });
            setTimeout(() => {
                setProjects(prev => prev.filter(p => p._id !== id));
                setDeleteConfirmId(null);
                setDeletingId(null);
            }, 500);
        } catch (error) {
            console.error(error);
            setDeleteConfirmId(null);
            setDeletingId(null);
        }
    };

    const openModal = (project?: Project) => {
        setEditingProject(project || null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight">Projects</h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 font-medium">Manage your portfolio projects and showcase your best work.</p>
                </div>
                
                <button 
                    onClick={() => openModal()} 
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors w-full sm:w-auto"
                >
                    <Plus size={18} /> Add New Project
                </button>
            </div>

            {/* Card Grid Wrapper */}
            {loading ? (
                <div className="bg-white dark:bg-[#141724] rounded-[28px] border border-slate-200/80 dark:border-white/5 p-4 shadow-xs">
                    <AdminLoadingState 
                        title="Loading Projects Catalog..."
                        subtitle="Fetching published showcase projects, live demos & repositories"
                        minHeight="min-h-[400px]"
                    />
                </div>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4 bg-white dark:bg-[#1a1a1a] rounded-[20px] border border-slate-200 dark:border-[#333]">
                    <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-[#222] flex items-center justify-center border border-slate-100 dark:border-[#333]">
                        <FolderOpen size={40} className="text-slate-300 dark:text-gray-500" />
                    </div>
                    <span className="text-lg font-bold text-slate-600 dark:text-gray-300 mt-2">No projects found</span>
                    <span className="text-sm font-medium text-slate-400 dark:text-gray-500">Click the "Add New Project" button to get started.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                    <AnimatePresence mode="popLayout">
                        {projects.map((p) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                                transition={{ duration: 0.4 }}
                                key={p._id} 
                                className={`group [perspective:1000px] h-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${deletingId === p._id ? 'opacity-0 scale-90 blur-md pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}
                            >
                                <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] relative ${deleteConfirmId === p._id ? '[transform:rotateY(180deg)]' : ''}`}>
                                    
                                    {/* FRONT FACE */}
                                    <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] border border-slate-200 dark:border-[#333] p-6 flex flex-col hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 h-full [backface-visibility:hidden]">
                            
                            {/* Top row: Icon & Status */}
                            <div className="flex justify-between items-start mb-5">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-[#222] border border-slate-100 dark:border-[#444] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                    {p.iconSrc ? (
                                        <Image src={p.iconSrc} alt={p.title} width={64} height={64} className="object-cover w-full h-full" />
                                    ) : (
                                        <ImageIcon size={28} className="text-slate-300 dark:text-gray-600" />
                                    )}
                                </div>
                                
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm
                                    ${p.status === 'live' || p.status === 'ongoing' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-slate-50 dark:bg-[#2a2a2a] text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-[#444]'}
                                `}>
                                    {p.status}
                                </span>
                            </div>

                            {/* Title & Description */}
                            <h3 className="font-extrabold text-[19px] text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={p.title}>
                                {p.title}
                            </h3>
                            <p className="text-[13px] text-slate-500 dark:text-gray-400 mb-5 line-clamp-2 flex-1 leading-relaxed">
                                {p.description}
                            </p>
                            
                            {/* Timeline Date */}
                            <div className="flex items-center gap-2.5 mb-6 px-3 py-2 bg-slate-50 dark:bg-[#222] rounded-lg border border-slate-100 dark:border-[#333] w-fit">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-slate-600 dark:text-gray-300">{p.date}</span>
                            </div>

                            {/* Bottom Actions Row */}
                            <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-[#333]">
                                {/* Links */}
                                <div className="flex items-center gap-3">
                                    {p.liveLink ? (
                                        <a href={p.liveLink} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#444] flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow-md" title="Live Preview">
                                            <LinkIcon size={15} strokeWidth={2.5} />
                                        </a>
                                    ) : (
                                        <span className="w-9 h-9 rounded-full bg-slate-50 dark:bg-[#222] border border-slate-100 dark:border-[#333] flex items-center justify-center text-slate-300 dark:text-gray-600 cursor-not-allowed">
                                            <LinkIcon size={15} strokeWidth={2.5} />
                                        </span>
                                    )}
                                    
                                    {p.codeLink ? (
                                        <a href={p.codeLink} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#444] flex items-center justify-center text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#333] hover:border-slate-300 dark:hover:border-gray-500 transition-all shadow-sm hover:shadow-md" title="Source Code">
                                            <Code2 size={15} strokeWidth={2.5} />
                                        </a>
                                    ) : (
                                        <span className="w-9 h-9 rounded-full bg-slate-50 dark:bg-[#222] border border-slate-100 dark:border-[#333] flex items-center justify-center text-slate-300 dark:text-gray-600 cursor-not-allowed">
                                            <Code2 size={15} strokeWidth={2.5} />
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button onClick={() => openModal(p)} className="flex items-center justify-center w-9 h-9 text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all" title="Edit">
                                            <Edit2 size={17} />
                                        </button>
                                        <button onClick={() => confirmDelete(p._id)} className="flex items-center justify-center w-9 h-9 text-slate-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all" title="Delete">
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* BACK FACE (Delete Confirmation) */}
                            <div className="absolute inset-0 flex flex-col bg-white dark:bg-[#151515] rounded-[24px] overflow-hidden border border-red-500/50 shadow-xl shadow-red-500/10 items-center justify-center p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4 border border-red-100 dark:border-red-500/20">
                                    <Trash2 size={24} className="text-red-500" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Delete Project?</h3>
                                <p className="text-xs font-medium text-slate-500 dark:text-gray-400 mb-6 px-2">Are you sure? This cannot be undone.</p>
                                <div className="flex gap-3 w-full">
                                    <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#333]/80 transition-all cursor-pointer">
                                        Cancel
                                    </button>
                                    <button onClick={() => executeDelete(p._id)} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md shadow-red-500/20 cursor-pointer">
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
            <ProjectFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingProject={editingProject}
            />
        </div>
    );
}
