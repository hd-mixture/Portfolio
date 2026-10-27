import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, CloudUpload, Image as ImageIcon, Save, AlertCircle } from 'lucide-react';
import Image from 'next/image';

const techSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.enum(['Frontend', 'Backend', 'Database', 'Tools', 'Other']),
    icon: z.string().min(1, "Icon class or URL is required"),
});

export type TechFormValues = z.infer<typeof techSchema>;

interface TechFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: TechFormValues, id?: string) => Promise<void>;
    editingItem?: any;
}

export default function TechFormModal({ isOpen, onClose, onSave, editingItem }: TechFormModalProps) {
    const [uploading, setUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<TechFormValues>({
        resolver: zodResolver(techSchema),
        defaultValues: {
            name: '',
            category: 'Frontend',
            icon: ''
        }
    });

    const iconValue = watch('icon');

    useEffect(() => {
        if (isOpen) {
            if (editingItem) {
                reset({
                    name: editingItem.name || '',
                    category: editingItem.category || 'Frontend',
                    icon: editingItem.icon || ''
                });
            } else {
                reset({
                    name: '',
                    category: 'Frontend',
                    icon: ''
                });
            }
        }
    }, [isOpen, editingItem, reset]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('image', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (res.ok) {
                setValue('icon', result.url, { shouldValidate: true });
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            alert('Upload error');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: TechFormValues) => {
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
                
                {/* Header */}
                <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 bg-white">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">{editingItem ? 'Edit Technology' : 'Add Technology'}</h2>
                        <p className="text-xs font-semibold text-slate-500 mt-1">Configure tech stack details and logos.</p>
                    </div>
                    <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                        <X size={18} />
                    </button>
                </div>
                
                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
                    <form id="tech-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Technology Name *</label>
                                    <input type="text" {...register("name")} className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} text-sm focus:ring-2 outline-none shadow-sm transition-all`} />
                                    {errors.name && <p className="text-red-500 text-[10px] mt-1 font-semibold flex items-center gap-1"><AlertCircle size={10} />{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Category *</label>
                                    <div className="relative">
                                        <select {...register("category")} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all appearance-none bg-white font-medium text-slate-700 cursor-pointer">
                                            <option value="Frontend">Frontend</option>
                                            <option value="Backend">Backend</option>
                                            <option value="Database">Database</option>
                                            <option value="Tools">Tools</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Icon / Logo *</label>
                                <p className="text-xs text-slate-500 mb-4">Provide a FontAwesome/Devicon class name OR upload an image logo.</p>
                                
                                <div className="flex flex-col sm:flex-row gap-6 items-center">
                                    <div className="w-20 h-20 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        {iconValue ? (
                                            iconValue.startsWith('http') ? (
                                                <Image src={iconValue} alt="Preview" width={48} height={48} className="object-cover" />
                                            ) : (
                                                <i className={`${iconValue} text-4xl text-slate-700`}></i>
                                            )
                                        ) : (
                                            <ImageIcon size={28} className="text-slate-300" />
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 w-full space-y-3">
                                        <input 
                                            type="text" 
                                            {...register("icon")} 
                                            placeholder="e.g. devicon-react-original" 
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.icon ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} text-sm focus:ring-2 outline-none shadow-sm transition-all`} 
                                        />
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-px bg-slate-200"></div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">OR Upload Image</span>
                                            <div className="flex-1 h-px bg-slate-200"></div>
                                        </div>
                                        
                                        <div className="relative">
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            <div className="border border-dashed border-slate-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                                                <CloudUpload size={16} className="text-blue-500" />
                                                <span className="text-sm font-semibold text-slate-700">{uploading ? 'Uploading...' : 'Upload Image Logo'}</span>
                                            </div>
                                        </div>
                                        {errors.icon && <p className="text-red-500 text-[10px] font-semibold flex items-center gap-1"><AlertCircle size={10} />{errors.icon.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
                
                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-[24px]">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                        Cancel
                    </button>
                    <button type="submit" form="tech-form" disabled={isSaving || uploading} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
                        {isSaving ? (
                            <span>Saving...</span>
                        ) : (
                            <>
                                <Save size={16} /> Save Technology
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
