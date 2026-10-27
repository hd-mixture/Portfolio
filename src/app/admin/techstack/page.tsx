"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, Layers } from 'lucide-react';
import Image from 'next/image';
import TechFormModal, { TechFormValues } from '@/components/admin/techstack/TechFormModal';

interface TechStack {
    _id: string;
    name: string;
    icon: string;
    category: string;
}

export default function TechStackAdminPage() {
    const [stack, setStack] = useState<TechStack[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TechStack | null>(null);

    useEffect(() => {
        fetchStack();
    }, []);

    const fetchStack = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/techstack`);
            const data = await res.json();
            setStack(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: TechFormValues, id?: string) => {
        const url = id 
            ? `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/techstack/${id}` 
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/techstack`;
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Failed to save");
        await fetchStack();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this technology?')) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/techstack/${id}`, { method: 'DELETE' });
            fetchStack();
        } catch (error) {
            console.error(error);
        }
    };

    const openModal = (item?: TechStack) => {
        setEditingItem(item || null);
        setIsModalOpen(true);
    };

    const getCategoryBadgeColor = (category?: string) => {
        if (!category) return 'bg-slate-100 text-slate-600 border border-slate-200';
        switch (category.toLowerCase()) {
            case 'frontend': return 'bg-blue-50 text-blue-600 border border-blue-200';
            case 'backend': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
            case 'database': return 'bg-purple-50 text-purple-600 border border-purple-200';
            case 'tools': return 'bg-orange-50 text-orange-600 border border-orange-200';
            default: return 'bg-slate-100 text-slate-600 border border-slate-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Tech Stack</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Manage the technologies, languages, and tools you use.</p>
                </div>
                
                <button 
                    onClick={() => openModal()} 
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors w-full sm:w-auto"
                >
                    <Plus size={18} /> Add Technology
                </button>
            </div>

            {/* Data Table Wrapper */}
            <div className="bg-white rounded-[20px] border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Technology</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                                            <Loader2 size={24} className="animate-spin text-blue-500" />
                                            <span className="text-sm font-semibold text-slate-500">Loading technologies...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : stack.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Layers size={32} className="text-slate-300" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">No tech stack found</span>
                                            <span className="text-xs font-medium text-slate-400">Click the button above to add your first technology.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                stack.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                                                    {item.icon ? (
                                                        item.icon.startsWith('http') ? (
                                                            <Image src={item.icon} alt={item.name} width={48} height={48} className="object-cover" />
                                                        ) : (
                                                            <i className={`${item.icon} text-[28px] text-slate-700`}></i>
                                                        )
                                                    ) : (
                                                        <ImageIcon size={20} className="text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeColor(item.category)}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openModal(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <TechFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingItem={editingItem}
            />
        </div>
    );
}
