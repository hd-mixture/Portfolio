import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, CloudUpload, Image as ImageIcon, Save, AlertCircle, ChevronDown, Check } from 'lucide-react';
import Image from 'next/image';

const designSchema = z.object({
    category: z.string().min(1, "Category is required"),
    title: z.string().min(1, "Title is required"),
    caption: z.string().optional(),
    src: z.string().min(1, "Media asset is required"),
    size: z.number().optional(),
    dimensions: z.string().optional()
});

export type DesignFormValues = z.infer<typeof designSchema>;

interface DesignFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: DesignFormValues, id?: string) => Promise<void>;
    editingItem?: any;
}

const DESIGN_CATEGORIES = [
    "LOGO DESIGN",
    "POSTER DESIGN",
    "WEB UI DESIGN",
    "APP UI DESIGN",
    "BANNER DESIGN",
    "OTHER DESIGN"
];

export default function DesignFormModal({ isOpen, onClose, onSave, editingItem }: DesignFormModalProps) {
    const [uploading, setUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Custom Dropdown State
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    
    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isDirty } } = useForm<DesignFormValues>({
        resolver: zodResolver(designSchema),
        defaultValues: {
            category: 'LOGO DESIGN',
            title: '',
            caption: '',
            src: '',
            size: 0,
            dimensions: ''
        }
    });

    const srcValue = watch('src');
    const titleValue = watch('title');
    const categoryValue = watch('category');

    const isNewValid = (titleValue?.trim().length || 0) > 0 && (srcValue?.trim().length || 0) > 0;
    const canSave = (editingItem ? isDirty : isNewValid) && !isSaving && !uploading;

    useEffect(() => {
        if (isOpen) {
            if (editingItem) {
                reset({
                    category: editingItem.category || 'LOGO DESIGN',
                    title: editingItem.title || '',
                    caption: editingItem.caption || '',
                    src: editingItem.src || '',
                    size: editingItem.size || 0,
                    dimensions: editingItem.dimensions || ''
                });
            } else {
                reset({
                    category: 'LOGO DESIGN',
                    title: '',
                    caption: '',
                    src: '',
                    size: 0,
                    dimensions: ''
                });
            }
        }
    }, [isOpen, editingItem, reset]);

    // Handle Click Outside for Dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setCategoryDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setUploading(true);
        const file = e.target.files[0];
        
        // Extract size and dimensions locally before upload
        setValue('size', file.size);
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
            setValue('dimensions', `${img.width} × ${img.height}`);
            URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;

        const data = new FormData();
        data.append('image', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (res.ok) {
                setValue('src', result.url, { shouldValidate: true });
                // If backend returned size, it will overwrite the local one, but local is fine.
                if (result.size) setValue('size', result.size);
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            alert('Upload error');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: DesignFormValues) => {
        setIsSaving(true);
        try {
            await onSave(data, editingItem?._id);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0f1115] rounded-[20px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
                
                {/* Header */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-sm">
                    <div>
                        <h2 className="text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight">{editingItem ? 'Edit Project Media' : 'Add Project Media'}</h2>
                        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-1">Upload media and associate it with a category.</p>
                    </div>
                    <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-[#1a1c23] text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                        <X size={18} />
                    </button>
                </div>
                
                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#FAFBFC] dark:bg-black">
                    <form id="design-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-[16px] border border-slate-200 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2">Media Title</label>
                                    <input type="text" {...register("title")} placeholder="Enter media title" className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500'} text-sm focus:ring-1 outline-none shadow-sm transition-all bg-white dark:bg-black text-slate-900 dark:text-white`} />
                                    {errors.title && <p className="text-red-500 text-[11px] mt-1.5 font-medium flex items-center gap-1"><AlertCircle size={12} />{errors.title.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                                    <div className="relative" ref={categoryDropdownRef}>
                                        <button 
                                            type="button"
                                            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                            className={`w-full px-4 py-2.5 rounded-xl border ${errors.category ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500'} text-sm flex items-center justify-between shadow-sm transition-all bg-white dark:bg-black text-slate-700 dark:text-slate-200 font-medium`}
                                        >
                                            {categoryValue || "Select Category"}
                                            <ChevronDown size={16} className={`text-slate-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        {categoryDropdownOpen && (
                                            <div className="absolute z-50 top-full left-0 mt-2 w-full bg-white dark:bg-[#1a1c23] border border-slate-100 dark:border-slate-800 rounded-[16px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2">
                                                <div className="p-1.5 flex flex-col gap-0.5">
                                                    {DESIGN_CATEGORIES.map(cat => (
                                                        <div 
                                                            key={cat}
                                                            onClick={() => {
                                                                setValue('category', cat, { shouldValidate: true });
                                                                setCategoryDropdownOpen(false);
                                                            }}
                                                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition-all ${
                                                                categoryValue === cat 
                                                                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#0f1115] hover:text-slate-900 dark:hover:text-slate-200'
                                                            }`}
                                                        >
                                                            {cat}
                                                            {categoryValue === cat && <Check size={14} />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.category && <p className="text-red-500 text-[11px] mt-1.5 font-medium flex items-center gap-1"><AlertCircle size={12} />{errors.category.message}</p>}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-4">Upload Area</label>
                                
                                <div className="flex flex-col sm:flex-row gap-6 items-center">
                                    <div className="w-32 h-32 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center flex-shrink-0 shadow-sm relative group">
                                        {srcValue ? (
                                            <>
                                                <Image src={srcValue} alt="Preview" fill className="object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <span className="text-white text-xs font-semibold">Change</span>
                                                </div>
                                            </>
                                        ) : (
                                            <ImageIcon size={32} className="text-slate-300 dark:text-slate-600" />
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    </div>
                                    
                                    <div className="flex-1 w-full relative">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#F4F7FF] dark:hover:bg-indigo-500/10 hover:border-[#6366F1] dark:hover:border-indigo-500 transition-all duration-300 ${errors.src ? 'border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0f1115]/50'}`}>
                                            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1c23] shadow-sm flex items-center justify-center mb-3">
                                                <CloudUpload size={20} className="text-[#6366F1]" />
                                            </div>
                                            <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{uploading ? 'Uploading...' : 'Drop your media here'}</p>
                                            <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-1">or <span className="text-[#6366F1]">Choose File</span> (JPG, PNG, WEBP)</p>
                                        </div>
                                        {errors.src && <p className="text-red-500 text-[11px] mt-2 font-medium flex items-center justify-center gap-1"><AlertCircle size={12} />{errors.src.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
                
                {/* Footer Actions */}
                <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0f1115] flex justify-end gap-3 rounded-b-[20px]">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1a1c23] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="design-form" 
                        disabled={!canSave} 
                        className={`px-6 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all flex items-center gap-2 ${
                            canSave
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 cursor-pointer active:scale-95'
                                : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 shadow-none'
                        }`}
                    >
                        {isSaving ? (
                            <span>Saving...</span>
                        ) : (
                            <>
                                <Save size={16} /> {editingItem ? 'Save Changes' : 'Add Media'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
