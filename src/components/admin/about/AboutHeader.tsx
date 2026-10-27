import React from 'react';
import { Eye, Save, CheckCircle2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export default function AboutHeader({ isSaving }: { isSaving: boolean }) {
    const { formState: { isDirty } } = useFormContext();
    const canSave = isDirty && !isSaving;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
                <h1 className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight">About Me</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Manage your professional biography, resume, and profile animation.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                
                <div className="flex items-center gap-2 mr-2">
                    {isDirty ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Unsaved changes</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">All changes saved</span>
                        </>
                    )}
                </div>

                <a 
                    href="/#about"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl shadow-xs transition-colors w-full sm:w-auto"
                >
                    <Eye size={16} /> Preview
                </a>
                
                <button 
                    type="submit"
                    disabled={!canSave}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl shadow-xs transition-all w-full sm:w-auto ${
                        canSave 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-blue-500/25 active:scale-95' 
                            : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                >
                    <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
