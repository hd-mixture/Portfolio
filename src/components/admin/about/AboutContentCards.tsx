import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { FileText, CloudUpload, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

// -------------------------------------------------------------
// BASIC INFO CARD
// -------------------------------------------------------------
export function BasicInfoCard() {
    const { register } = useFormContext();

    return (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[20px] p-6 border border-slate-200 dark:border-[#333] shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Tagline</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">A catchy hook or quote that sits above your biography.</p>
            
            <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-2">Primary Tagline</label>
                <input 
                    {...register("tagline")} 
                    placeholder="e.g. Unleash Your Imagination..."
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#444] bg-white dark:bg-[#222] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
                />
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// BIOGRAPHY CARD
// -------------------------------------------------------------
export function BiographyCard() {
    const { register, watch } = useFormContext();
    const biography = watch('description') || '';

    return (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[20px] p-6 border border-slate-200 dark:border-[#333] shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Detailed Biography</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">Your professional summary and background.</p>
            
            <div className="relative">
                <textarea 
                    {...register("description")} 
                    rows={6}
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-[#444] bg-white dark:bg-[#222] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm resize-y min-h-[150px] leading-relaxed"
                ></textarea>
                <div className="absolute bottom-3 right-3 text-[10px] font-semibold text-slate-400">
                    {biography.length} chars
                </div>
            </div>
        </div>
    );
}

import { createPortal } from 'react-dom';

// -------------------------------------------------------------
// RESUME UPLOAD CARD
// -------------------------------------------------------------
export function ResumeUploadCard() {
    const { register, watch, setValue, formState: { defaultValues } } = useFormContext();
    const [uploading, setUploading] = React.useState(false);
    const [newFileName, setNewFileName] = React.useState<string | null>(null);
    const [viewingPdf, setViewingPdf] = React.useState(false);
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    
    React.useEffect(() => {
        if (viewingPdf) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [viewingPdf]);
    
    const currentResumeUrl = watch("resumeUrl");
    const savedResumeUrl = defaultValues?.resumeUrl;
    const isNewUpload = currentResumeUrl !== savedResumeUrl && currentResumeUrl;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setUploading(true);
        const file = e.target.files[0];
        setNewFileName(file.name);
        
        const data = new FormData();
        data.append('image', file); // API expects 'image' field for all uploads currently

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (res.ok) {
                setValue('resumeUrl', result.url, { shouldValidate: true, shouldDirty: true });
            } else {
                alert('Upload failed: ' + result.message);
                setNewFileName(null);
            }
        } catch (err) {
            alert('Upload error');
            setNewFileName(null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[20px] p-6 border border-slate-200 dark:border-[#333] shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-1">
                <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Resume (CV)</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">Upload your latest PDF resume.</p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-stretch flex-1">
                {/* Upload Zone */}
                <div className="relative flex-1 w-full border-2 border-dashed border-slate-200 dark:border-[#444] rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-[#222] hover:border-blue-400 transition-colors cursor-pointer group min-h-[140px]">
                    <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <CloudUpload size={24} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        {uploading ? 'Uploading...' : 'Click or drag PDF to upload'}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400">PDF only (Max. 5MB)</p>

                    {isNewUpload && (
                        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-800 w-[calc(100%-16px)] z-20">
                            <FileText size={14} className="text-blue-500 flex-shrink-0" />
                            <span className="text-[10px] text-blue-700 dark:text-blue-300 truncate font-medium" title={newFileName || 'New PDF'}>
                                {newFileName || 'New PDF ready'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Preview Zone (Database State) */}
                <div className="w-full sm:w-[180px] bg-slate-50 dark:bg-[#222] border border-slate-100 dark:border-[#444] rounded-xl p-4 flex flex-col items-center justify-center text-center shrink-0">
                    {savedResumeUrl ? (
                        <>
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-3">
                                <FileText size={20} />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 dark:text-gray-300 mb-2">Current Resume</span>
                            <button 
                                type="button"
                                onClick={(e) => { e.preventDefault(); setViewingPdf(true); }}
                                className="text-[10px] font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline z-20 relative cursor-pointer"
                            >
                                View PDF
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-slate-200 dark:bg-[#333] text-slate-400 rounded-full flex items-center justify-center mb-3">
                                <FileText size={20} />
                            </div>
                            <span className="text-[11px] font-medium text-slate-400">No Resume Uploaded</span>
                        </>
                    )}
                </div>
                {/* Hidden input to register the value */}
                <input type="hidden" {...register("resumeUrl")} />
            </div>

            {/* Native HTML5 Dialog for Top Layer Rendering */}
            <dialog 
                ref={dialogRef}
                onClose={() => setViewingPdf(false)}
                className="backdrop:bg-black/60 backdrop:backdrop-blur-sm bg-transparent border-none w-full max-w-5xl h-full max-h-[90vh] p-4 md:p-10 m-auto outline-none"
            >
                {savedResumeUrl && (
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full h-full flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-[#333]">
                        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-[#333]">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileText size={18} className="text-red-500" />
                                Resume Preview
                            </h3>
                            <button 
                                type="button"
                                onClick={() => setViewingPdf(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#333] dark:hover:bg-[#444] text-slate-600 dark:text-gray-300 transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                        <div className="flex-1 w-full bg-slate-100 dark:bg-[#0a0a0a]">
                            <iframe 
                                src={savedResumeUrl} 
                                className="w-full h-full border-none"
                                title="Resume PDF Viewer"
                            ></iframe>
                        </div>
                    </div>
                )}
            </dialog>
        </div>
    );
}

// -------------------------------------------------------------
// ILLUSTRATION CARD
// -------------------------------------------------------------
export function IllustrationCard() {
    const { register, watch, setValue, formState: { defaultValues } } = useFormContext();
    const [uploading, setUploading] = React.useState(false);
    const [newFileName, setNewFileName] = React.useState<string | null>(null);
    
    const currentImageUrl = watch("illustrationImage");
    const savedImageUrl = defaultValues?.illustrationImage;
    const isNewUpload = currentImageUrl !== savedImageUrl && currentImageUrl;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setUploading(true);
        const file = e.target.files[0];
        setNewFileName(file.name);
        
        const data = new FormData();
        data.append('image', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (res.ok) {
                setValue('illustrationImage', result.url, { shouldValidate: true, shouldDirty: true });
            } else {
                alert('Upload failed: ' + result.message);
                setNewFileName(null);
            }
        } catch (err) {
            alert('Upload error');
            setNewFileName(null);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[20px] p-6 border border-slate-200 dark:border-[#333] shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-1">
                <ImageIcon size={18} className="text-pink-600 dark:text-pink-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Illustration</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">Upload your 3D illustration.</p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-stretch flex-1">
                {/* Upload Zone */}
                <div className="relative flex-1 w-full border-2 border-dashed border-slate-200 dark:border-[#444] rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-[#222] hover:border-pink-400 transition-colors cursor-pointer group min-h-[140px] overflow-hidden">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    
                    {isNewUpload ? (
                        <div className="flex flex-col items-center w-full h-full justify-center">
                            <img src={currentImageUrl} alt="New Upload Preview" className="max-h-[80px] object-contain mb-2" />
                            <p className="text-[10px] font-medium text-pink-500 bg-pink-50 dark:bg-pink-900/30 px-2 py-1 rounded-md z-20 truncate w-full max-w-[120px]" title={newFileName || 'New Image'}>
                                {newFileName || 'New Image'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <CloudUpload size={24} className="text-pink-500 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                                {uploading ? 'Uploading...' : 'Click or drag image'}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400">PNG, JPG, WebP</p>
                        </>
                    )}
                </div>

                {/* Preview Zone (Database State) */}
                <div className="w-full sm:w-[180px] bg-slate-50 dark:bg-[#222] border border-slate-100 dark:border-[#444] rounded-xl p-4 flex flex-col items-center justify-center text-center shrink-0 overflow-hidden">
                    {savedImageUrl ? (
                        <>
                            <img src={savedImageUrl} alt="Illustration Preview" className="max-h-[80px] object-contain mb-3" />
                            <span className="text-[11px] font-bold text-slate-700 dark:text-gray-300">Current Image</span>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-slate-200 dark:bg-[#333] text-slate-400 rounded-full flex items-center justify-center mb-3">
                                <ImageIcon size={20} />
                            </div>
                            <span className="text-[11px] font-medium text-slate-400">No Image Uploaded</span>
                        </>
                    )}
                </div>
                {/* Hidden input to register the value */}
                <input type="hidden" {...register("illustrationImage")} />
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// SERVICES CARD (DESIGNER)
// -------------------------------------------------------------
export function ServicesCard() {
    const { register, control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "services"
    });

    return (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[20px] p-6 border border-slate-200 dark:border-[#333] shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">What I Do (Services)</h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400">List of services displayed in the Designer About section.</p>
                </div>
                <button
                    type="button"
                    onClick={() => append({ title: "", desc: "", iconName: "PenTool" })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors"
                >
                    <Plus size={14} /> Add Service
                </button>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-slate-100 dark:border-[#333] bg-slate-50 dark:bg-[#222] rounded-xl relative group">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                                <input 
                                    {...register(`services.${index}.title`)} 
                                    placeholder="e.g. Brand Identity"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#444] bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lucide Icon Name</label>
                                <input 
                                    {...register(`services.${index}.iconName`)} 
                                    placeholder="e.g. PenTool"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#444] bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none" 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                                <input 
                                    {...register(`services.${index}.desc`)} 
                                    placeholder="Logos, Guidelines..."
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#444] bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none" 
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                            title="Remove Service"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {fields.length === 0 && (
                    <div className="text-center py-6 text-slate-500 text-sm italic border-2 border-dashed border-slate-200 dark:border-[#333] rounded-xl">
                        No services added. Click "Add Service" to start.
                    </div>
                )}
            </div>
        </div>
    );
}
