import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, AlertCircle, X, CloudUpload, Link as LinkIcon, Code2, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useFieldArray } from 'react-hook-form';

const PREDEFINED_TECH = {
    'Frontend': [
        { name: 'React', icon: 'fa-brands fa-react' },
        { name: 'Next.js', icon: 'fa-solid fa-n' },
        { name: 'Tailwind', icon: 'fa-solid fa-wind' },
        { name: 'HTML5', icon: 'fa-brands fa-html5' },
        { name: 'CSS3', icon: 'fa-brands fa-css3-alt' },
        { name: 'JavaScript', icon: 'fa-brands fa-js' },
        { name: 'TypeScript', icon: 'fa-solid fa-code' },
    ],
    'Backend': [
        { name: 'Node.js', icon: 'fa-brands fa-node-js' },
        { name: 'Express', icon: 'fa-brands fa-node-js' },
        { name: 'Python', icon: 'fa-brands fa-python' },
        { name: 'Java', icon: 'fa-brands fa-java' },
    ],
    'Database': [
        { name: 'MongoDB', icon: 'fa-solid fa-leaf' },
        { name: 'Firebase', icon: 'fa-solid fa-fire' },
        { name: 'PostgreSQL', icon: 'fa-solid fa-database' },
        { name: 'MySQL', icon: 'fa-solid fa-database' },
    ],
    'Tools': [
        { name: 'Git', icon: 'fa-brands fa-git-alt' },
        { name: 'Docker', icon: 'fa-brands fa-docker' },
        { name: 'AWS', icon: 'fa-brands fa-aws' },
        { name: 'Figma', icon: 'fa-brands fa-figma' },
    ]
};

const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    date: z.string().min(1, "Date/Duration is required"),
    status: z.enum(['completed', 'ongoing', 'live']),
    description: z.string().min(1, "Description is required"),
    liveLink: z.string().optional(),
    codeLink: z.string().optional(),
    iconSrc: z.string().optional(),
    timelineIconClass: z.string().default('fa-solid fa-code'),
    techStack: z.array(z.object({
        name: z.string().min(1, "Name required"),
        icon: z.string().min(1, "Icon required")
    })).optional()
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

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

interface ProjectFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProjectFormValues, id?: string) => Promise<void>;
    editingProject?: any; // The raw project data from the table
}

export default function ProjectFormModal({ isOpen, onClose, onSave, editingProject }: ProjectFormModalProps) {
    const [uploading, setUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isOngoing, setIsOngoing] = useState(false);
    const [pickerOpen, setPickerOpen] = useState<'start' | 'end' | null>(null);
    const [pickerYear, setPickerYear] = useState<number>(new Date().getFullYear());

    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const handleMonthSelect = (type: 'start' | 'end', monthIndex: number) => {
        const val = `${pickerYear}-${(monthIndex + 1).toString().padStart(2, '0')}`;
        if (type === 'start') {
            setStartDate(val);
            setPickerOpen(null);
        } else {
            setEndDate(val);
            setPickerOpen(null);
        }
    };
    
    const formatDisplay = (val: string) => {
        if (!val || val.length < 7) return 'Select Date';
        const [y, m] = val.split('-');
        const monthIndex = parseInt(m, 10) - 1;
        if (monthIndex < 0 || monthIndex > 11) return 'Select Date';
        return `${MONTHS[monthIndex]} ${y}`;
    };
    
    const { register, control, handleSubmit, setValue, watch, reset, formState: { errors, isDirty } } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            date: '',
            status: 'completed',
            description: '',
            liveLink: '',
            codeLink: '',
            iconSrc: '',
            timelineIconClass: 'fa-solid fa-code',
            techStack: []
        }
    });

    const watchedTitle = watch('title');
    const watchedDesc = watch('description');
    const isNewValid = (watchedTitle?.trim().length || 0) > 0 && (watchedDesc?.trim().length || 0) > 0;
    const canSave = (editingProject ? isDirty : isNewValid) && !isSaving && !uploading;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "techStack"
    });

    const iconSrc = watch('iconSrc');
    const currentTechStack = watch('techStack') || [];

    const toggleTech = (tech: { name: string, icon: string }) => {
        const existingIndex = currentTechStack.findIndex((t: any) => t.name === tech.name);
        if (existingIndex >= 0) {
            remove(existingIndex);
        } else {
            append(tech);
        }
    };

    const dialogRef = React.useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
            // Scroll form to top when opened
            const formContainer = document.getElementById('project-form-container');
            if (formContainer) formContainer.scrollTop = 0;
            
            if (editingProject) {
                reset({
                    title: editingProject.title || '',
                    date: editingProject.date || '',
                    status: editingProject.status || 'completed',
                    description: editingProject.description || '',
                    liveLink: editingProject.liveLink || '',
                    codeLink: editingProject.codeLink || '',
                    iconSrc: editingProject.iconSrc || '',
                    timelineIconClass: editingProject.timelineIconClass || 'fa-solid fa-code',
                    techStack: editingProject.techStack || []
                });
                
                if (editingProject.date) {
                    const parts = editingProject.date.split(' - ');
                    if (parts.length === 2) {
                        setStartDate(parseStringToDateInput(parts[0]));
                        if (parts[1].toLowerCase() === 'present') {
                            setIsOngoing(true);
                            setEndDate('');
                        } else {
                            setIsOngoing(false);
                            setEndDate(parseStringToDateInput(parts[1]));
                        }
                    } else {
                        setStartDate(parseStringToDateInput(editingProject.date));
                        setIsOngoing(false);
                        setEndDate('');
                    }
                } else {
                    setStartDate('');
                    setEndDate('');
                    setIsOngoing(false);
                }
            } else {
                reset({
                    title: '',
                    date: '',
                    status: 'completed',
                    description: '',
                    liveLink: '',
                    codeLink: '',
                    iconSrc: '',
                    timelineIconClass: 'fa-solid fa-code',
                    techStack: []
                });
                setStartDate('');
                setEndDate('');
                setIsOngoing(false);
            }
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen, editingProject, reset]);

    useEffect(() => {
        if (!isOpen) return;
        const s = formatMonthYear(startDate);
        const e = isOngoing ? 'Present' : formatMonthYear(endDate);
        
        if (s && e && !isOngoing && s === e) {
             setValue('date', s, { shouldValidate: true });
        } else if (s && e) {
            setValue('date', `${s} - ${e}`, { shouldValidate: true });
        } else if (s) {
            setValue('date', s, { shouldValidate: true });
        } else {
            setValue('date', '', { shouldValidate: true });
        }
    }, [startDate, endDate, isOngoing, setValue, isOpen]);

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
                setValue('iconSrc', result.url, { shouldValidate: true });
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            alert('Upload error');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: ProjectFormValues) => {
        setIsSaving(true);
        try {
            await onSave(data, editingProject?._id);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <dialog 
            ref={dialogRef}
            onClose={onClose}
            className="backdrop:bg-slate-900/60 backdrop:backdrop-blur-md bg-transparent border-none w-full max-w-4xl h-full max-h-[90vh] p-4 sm:p-6 m-auto outline-none"
        >
            <div className="bg-white dark:bg-[#0f0f0f] rounded-[32px] shadow-2xl w-full h-full flex flex-col overflow-hidden border border-slate-200/60 dark:border-[#222]">
                
                {/* Header */}
                <div className="flex justify-between items-center px-8 py-6 bg-slate-50/50 dark:bg-[#151515] border-b border-slate-200/60 dark:border-[#222] relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{editingProject ? 'Edit Project' : 'Launch New Project'}</h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-1">Configure project details and media.</p>
                    </div>
                    <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#222] text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-[#333] hover:text-slate-800 dark:hover:text-white transition-all shadow-sm border border-slate-200 dark:border-[#333]">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Body */}
                <div id="project-form-container" className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-slate-50/30 dark:bg-[#0f0f0f]">
                    <form id="project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
                        
                        {/* Section: Project Identity */}
                        <div className="bg-white dark:bg-[#151515] p-6 sm:p-8 rounded-[24px] border border-slate-200/60 dark:border-[#222] shadow-sm space-y-6">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Core Identity
                            </h3>
                            
                            {/* Project Title - Full Width */}
                            <div>
                                <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-2">Project Title</label>
                                <input type="text" {...register("title")} className={`w-full px-5 py-4 rounded-2xl bg-slate-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md border ${errors.title ? 'border-red-400 focus:ring-red-500' : 'border-slate-200/60 dark:border-[#333]/50 focus:border-blue-500 focus:ring-blue-500/20'} text-base text-slate-900 dark:text-white font-bold focus:ring-4 outline-none transition-all shadow-sm hover:bg-slate-100/50 dark:hover:bg-[#222]/50`} placeholder="e.g. CyberAegis" />
                                {errors.title && <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1"><AlertCircle size={12} />{errors.title.message}</p>}
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Project Status Box */}
                                <div className="bg-slate-50/50 dark:bg-[#1a1a1a]/50 p-6 rounded-[24px] border border-slate-200/60 dark:border-[#333] shadow-sm relative z-10 flex flex-col justify-center">
                                    <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-5">Project Status</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['completed', 'ongoing', 'live'].map((statusOpt) => {
                                            const isSelected = watch("status") === statusOpt;
                                            return (
                                                <button
                                                    key={statusOpt}
                                                    type="button"
                                                    onClick={() => setValue("status", statusOpt as any)}
                                                    className={`flex-1 min-w-[90px] px-4 py-3.5 rounded-xl text-sm font-bold capitalize transition-all border ${
                                                        isSelected 
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-4 ring-blue-600/20' 
                                                        : 'bg-white dark:bg-[#222] text-slate-600 dark:text-gray-300 border-slate-200 dark:border-[#444] hover:border-slate-300 dark:hover:border-[#555] hover:bg-slate-50 dark:hover:bg-[#333]'
                                                    }`}
                                                >
                                                    {statusOpt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Timeline Box */}
                                <div className="bg-slate-50/50 dark:bg-[#1a1a1a]/50 p-6 rounded-[24px] border border-slate-200/60 dark:border-[#333] shadow-sm relative z-20">
                                    <div className="flex justify-between items-center mb-5">
                                        <label className="block text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Timeline *</label>
                                        
                                        {/* Sleek Toggle Switch for Ongoing */}
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Ongoing Project</span>
                                            <div className="relative flex items-center">
                                                <input type="checkbox" checked={isOngoing} onChange={(e) => { setIsOngoing(e.target.checked); setPickerOpen(null); }} className="peer sr-only" />
                                                <div className="w-9 h-5 bg-slate-200 dark:bg-[#333] rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 shadow-inner"></div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 items-center relative">
                                        {/* Click outside overlay for custom picker */}
                                        {pickerOpen && (
                                            <div className="fixed inset-0 z-40" onClick={() => setPickerOpen(null)}></div>
                                        )}

                                        {/* Start Date Custom Picker */}
                                        <div className="relative w-full">
                                            <div 
                                                onClick={() => { setPickerOpen(pickerOpen === 'start' ? null : 'start'); setPickerYear(startDate ? parseInt(startDate.split('-')[0]) : new Date().getFullYear()); }}
                                                className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-[#222] border ${pickerOpen === 'start' ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-slate-200 dark:border-[#444]'} text-sm text-slate-900 dark:text-white font-bold cursor-pointer transition-all flex items-center shadow-sm hover:border-blue-400`}
                                            >
                                                <div className="absolute left-4 text-blue-500"><Calendar size={18} /></div>
                                                {formatDisplay(startDate)}
                                            </div>

                                            {/* Start Date Dropdown */}
                                            {pickerOpen === 'start' && (
                                                <div className="absolute top-[calc(100%+8px)] left-0 sm:left-auto w-full sm:w-[280px] bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-2xl border border-slate-200 dark:border-[#333] shadow-2xl rounded-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <button type="button" onClick={() => setPickerYear(y => y - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#333] text-slate-500 transition-colors">&lt;</button>
                                                        <span className="font-black text-slate-900 dark:text-white">{pickerYear}</span>
                                                        <button type="button" onClick={() => setPickerYear(y => y + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#333] text-slate-500 transition-colors">&gt;</button>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {MONTHS.map((m, i) => {
                                                            const val = `${pickerYear}-${(i + 1).toString().padStart(2, '0')}`;
                                                            const isSelected = startDate === val;
                                                            return (
                                                                <button 
                                                                    key={m} 
                                                                    type="button" 
                                                                    onClick={() => handleMonthSelect('start', i)}
                                                                    className={`py-2 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-blue-500 text-white shadow-md scale-105' : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#333]'}`}
                                                                >
                                                                    {m}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="w-8 h-[2px] bg-slate-200 dark:bg-[#444] rounded-full hidden sm:block flex-shrink-0"></div>
                                        
                                        {/* End Date Custom Picker */}
                                        <div className="relative w-full">
                                            {isOngoing ? (
                                                <div className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 text-sm text-blue-600 dark:text-blue-400 font-black h-[50px] flex items-center shadow-inner backdrop-blur-md relative overflow-hidden">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 z-10">
                                                        <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                                                    </div>
                                                    Present
                                                </div>
                                            ) : (
                                                <>
                                                    <div 
                                                        onClick={() => { setPickerOpen(pickerOpen === 'end' ? null : 'end'); setPickerYear(endDate ? parseInt(endDate.split('-')[0]) : new Date().getFullYear()); }}
                                                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-[#222] border ${pickerOpen === 'end' ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-slate-200 dark:border-[#444]'} text-sm text-slate-900 dark:text-white font-bold cursor-pointer transition-all flex items-center shadow-sm hover:border-blue-400`}
                                                    >
                                                        <div className="absolute left-4 text-slate-400"><Calendar size={18} /></div>
                                                        {formatDisplay(endDate)}
                                                    </div>

                                                    {/* End Date Dropdown */}
                                                    {pickerOpen === 'end' && (
                                                        <div className="absolute top-[calc(100%+8px)] left-0 sm:left-auto sm:right-0 w-full sm:w-[280px] bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-2xl border border-slate-200 dark:border-[#333] shadow-2xl rounded-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <button type="button" onClick={() => setPickerYear(y => y - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#333] text-slate-500 transition-colors">&lt;</button>
                                                                <span className="font-black text-slate-900 dark:text-white">{pickerYear}</span>
                                                                <button type="button" onClick={() => setPickerYear(y => y + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#333] text-slate-500 transition-colors">&gt;</button>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {MONTHS.map((m, i) => {
                                                                    const val = `${pickerYear}-${(i + 1).toString().padStart(2, '0')}`;
                                                                    const isSelected = endDate === val;
                                                                    return (
                                                                        <button 
                                                                            key={m} 
                                                                            type="button" 
                                                                            onClick={() => handleMonthSelect('end', i)}
                                                                            className={`py-2 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-blue-500 text-white shadow-md scale-105' : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#333]'}`}
                                                                        >
                                                                            {m}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <input type="hidden" {...register("date")} />
                                    {errors.date && <p className="text-red-500 text-xs mt-3 font-semibold flex items-center gap-1"><AlertCircle size={12} />{errors.date.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Description & Thumbnail */}
                        <div className="bg-white dark:bg-[#151515] p-6 sm:p-8 rounded-[24px] border border-slate-200/60 dark:border-[#222] shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Details & Media
                            </h3>
                            
                            <div className="flex flex-col xl:flex-row gap-8">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Overview</label>
                                    <textarea {...register("description")} rows={5} className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border ${errors.description ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 dark:border-[#333] focus:border-purple-500 focus:ring-purple-500/20'} text-sm text-slate-900 dark:text-white font-medium focus:ring-4 outline-none transition-all resize-y min-h-[140px] leading-relaxed`} placeholder="Describe the project..."></textarea>
                                    {errors.description && <p className="text-red-500 text-xs mt-1.5 font-semibold flex items-center gap-1"><AlertCircle size={12} />{errors.description.message}</p>}
                                </div>

                                <div className="xl:w-64 flex flex-col gap-2">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Project Logo</label>
                                    <div className="relative w-full aspect-video sm:aspect-auto sm:flex-1 rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#1a1a1a] overflow-hidden group hover:border-purple-400 dark:hover:border-purple-500 transition-colors flex flex-col items-center justify-center text-center p-4">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                        
                                        {iconSrc ? (
                                            <>
                                                <Image src={iconSrc} alt="Preview" fill className="object-contain p-4 opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                                    <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/60 rounded-lg backdrop-blur-sm">Change Logo</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <CloudUpload size={28} className="text-purple-400 mb-2 group-hover:-translate-y-1 transition-transform" />
                                                <span className="text-sm font-bold text-slate-700 dark:text-gray-300">Upload Logo</span>
                                                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Max 5MB</span>
                                            </>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Uploading...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Section: Links */}
                        <div className="bg-white dark:bg-[#151515] p-6 sm:p-8 rounded-[24px] border border-slate-200/60 dark:border-[#222] shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                Project Links
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Live Demo URL</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><LinkIcon size={16} /></div>
                                        <input type="url" {...register("liveLink")} placeholder="https://" className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 text-sm text-slate-900 dark:text-white font-medium outline-none transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Source Code URL</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Code2 size={16} /></div>
                                        <input type="url" {...register("codeLink")} placeholder="https://" className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 text-sm text-slate-900 dark:text-white font-medium outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
                
                {/* Footer */}
                <div className="p-6 bg-white dark:bg-[#151515] border-t border-slate-200/60 dark:border-[#222] flex justify-end gap-3 z-10">
                    <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-gray-300 bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#333]/80 transition-all cursor-pointer">
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="project-form" 
                        disabled={!canSave} 
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg ${
                            canSave
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 cursor-pointer active:scale-95'
                                : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 shadow-none'
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} /> {editingProject ? 'Save Changes' : 'Save Project'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </dialog>
    );
}
