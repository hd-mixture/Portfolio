"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// ==========================================
// 1. MODERN CUSTOM DATE PICKER
// ==========================================
interface ModernDatePickerProps {
    value?: string; // "YYYY-MM-DD"
    onChange: (date: string) => void;
    minDate?: string; // "YYYY-MM-DD"
    placeholder?: string;
    label?: string;
    hasError?: boolean;
    id?: string;
    align?: 'left' | 'right';
}

export function ModernDatePicker({
    value = '',
    onChange,
    minDate,
    placeholder = 'Select date',
    label,
    hasError = false,
    id,
    align = 'left'
}: ModernDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial view year & month based on current value or today
    const parsedDate = value ? new Date(value + 'T00:00:00') : new Date();
    const [viewYear, setViewYear] = useState(parsedDate.getFullYear() || new Date().getFullYear());
    const [viewMonth, setViewMonth] = useState(parsedDate.getMonth() || new Date().getMonth());

    useEffect(() => {
        if (value) {
            const d = new Date(value + 'T00:00:00');
            if (!isNaN(d.getTime())) {
                setViewYear(d.getFullYear());
                setViewMonth(d.getMonth());
            }
        }
    }, [value]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Generate Calendar Grid
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(v => v - 1);
        } else {
            setViewMonth(v => v - 1);
        }
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(v => v + 1);
        } else {
            setViewMonth(v => v + 1);
        }
    };

    const handleSelectDay = (day: number) => {
        const mm = String(viewMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const formatted = `${viewYear}-${mm}-${dd}`;
        onChange(formatted);
        setIsOpen(false);
    };

    const handleSetToday = (e: React.MouseEvent) => {
        e.stopPropagation();
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formatted = `${yyyy}-${mm}-${dd}`;
        setViewYear(yyyy);
        setViewMonth(today.getMonth());
        onChange(formatted);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setIsOpen(false);
    };

    // Format display date
    const formatDisplay = (val: string) => {
        if (!val) return '';
        const match = val.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match) return val;
        const [_, y, m, d] = match;
        const monthShort = MONTH_NAMES[parseInt(m, 10) - 1]?.slice(0, 3) || m;
        return `${d} ${monthShort} ${y}`;
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === viewMonth &&
            today.getFullYear() === viewYear
        );
    };

    const isSelected = (day: number) => {
        if (!value) return false;
        const [y, m, d] = value.split('-').map(Number);
        return y === viewYear && m === viewMonth + 1 && d === day;
    };

    const isDisabled = (day: number) => {
        if (!minDate) return false;
        const mm = String(viewMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const current = `${viewYear}-${mm}-${dd}`;
        return current < minDate;
    };

    return (
        <div ref={containerRef} className={`relative w-full ${isOpen ? 'z-50' : 'z-10'}`} id={id}>
            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen); }}
                className={`w-full p-3 rounded-2xl bg-white dark:bg-[#1a1e2c] border transition-all cursor-pointer select-none flex items-center justify-between group ${
                    hasError 
                        ? 'border-red-500 ring-2 ring-red-500/20' 
                        : isOpen 
                            ? 'border-amber-500 ring-2 ring-amber-500/20 dark:border-amber-500' 
                            : 'border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20'
                    }`}>
                        <CalendarIcon size={15} />
                    </div>
                    <div className="min-w-0 text-left">
                        {label && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400 block leading-none mb-1">
                                {label}
                            </span>
                        )}
                        <span className={`text-xs sm:text-sm font-bold block truncate leading-none ${
                            value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 font-normal'
                        }`}>
                            {value ? formatDisplay(value) : placeholder}
                        </span>
                    </div>
                </div>

                <div className="text-slate-400 dark:text-gray-400 group-hover:text-amber-500 transition-colors flex items-center">
                    <ChevronRight size={15} className={`transition-transform duration-200 ${isOpen ? 'rotate-90 text-amber-500' : ''}`} />
                </div>
            </div>

            {/* Custom Modern Dropdown Popover */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 6 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className={`absolute top-full z-[100] w-full min-w-[280px] sm:min-w-[310px] max-w-[340px] bg-white dark:bg-[#121522] rounded-2xl shadow-2xl border border-slate-200 dark:border-amber-500/30 p-4 backdrop-blur-xl ${
                            align === 'right' ? 'right-0 left-auto' : 'left-0'
                        }`}
                    >
                        {/* Header: Month & Year Navigator */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-white/10">
                            <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 text-slate-600 dark:text-gray-300 flex items-center justify-center transition-all cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div className="text-center">
                                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                    {MONTH_NAMES[viewMonth]} {viewYear}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleNextMonth}
                                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 text-slate-600 dark:text-gray-300 flex items-center justify-center transition-all cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Days of Week Header */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                            {DAYS_SHORT.map((d, i) => (
                                <span key={i} className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-400 py-1">
                                    {d}
                                </span>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Prev Month Days */}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => {
                                const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
                                return (
                                    <div key={`prev-${i}`} className="h-8 flex items-center justify-center text-[11px] font-medium text-slate-300 dark:text-gray-400 select-none">
                                        {dayNum}
                                    </div>
                                );
                            })}

                            {/* Current Month Days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const selected = isSelected(day);
                                const today = isToday(day);
                                const disabled = isDisabled(day);

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => handleSelectDay(day)}
                                        className={`h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer select-none relative ${
                                            disabled 
                                                ? 'opacity-20 cursor-not-allowed text-slate-400' 
                                                : selected 
                                                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black shadow-md shadow-amber-500/30 scale-105' 
                                                    : today 
                                                        ? 'border border-amber-500 text-amber-600 dark:text-amber-400 font-black hover:bg-amber-500/10' 
                                                        : 'text-slate-700 dark:text-slate-200 hover:bg-amber-500/15 hover:text-amber-600 dark:hover:text-amber-400'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer Controls */}
                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-white/10">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-[11px] font-bold text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={handleSetToday}
                                className="text-[11px] font-black text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                            >
                                Today
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ==========================================
// 2. RADIAL CLOCK DIAL TIME PICKER (DRAGGABLE HAND)
// ==========================================
interface ModernTimePickerProps {
    value?: string; // "HH:mm" in 24h format (e.g. "07:00" or "19:00")
    onChange: (time: string) => void;
    placeholder?: string;
    label?: string;
    hasError?: boolean;
    id?: string;
    align?: 'left' | 'right';
}

export function ModernTimePicker({
    value = '',
    onChange,
    placeholder = 'Select time',
    label,
    hasError = false,
    id,
    align = 'left'
}: ModernTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'hour' | 'minute'>('hour');
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dialRef = useRef<HTMLDivElement>(null);

    // Parse incoming value "HH:mm"
    let initHour12 = 7;
    let initMinute = 0;
    let initPeriod = 'AM';

    if (value) {
        const [hStr, mStr] = value.split(':');
        const h24 = parseInt(hStr, 10);
        const m = parseInt(mStr, 10);
        if (!isNaN(h24) && !isNaN(m)) {
            initPeriod = h24 >= 12 ? 'PM' : 'AM';
            initHour12 = h24 % 12 === 0 ? 12 : h24 % 12;
            initMinute = m;
        }
    }

    const [selectedHour, setSelectedHour] = useState(initHour12);
    const [selectedMinute, setSelectedMinute] = useState(initMinute);
    const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(initPeriod as any);

    useEffect(() => {
        if (value) {
            const [hStr, mStr] = value.split(':');
            const h24 = parseInt(hStr, 10);
            const m = parseInt(mStr, 10);
            if (!isNaN(h24) && !isNaN(m)) {
                setSelectedPeriod(h24 >= 12 ? 'PM' : 'AM');
                setSelectedHour(h24 % 12 === 0 ? 12 : h24 % 12);
                setSelectedMinute(m);
            }
        }
    }, [value]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const formatDisplay = (val: string) => {
        if (!val) return '';
        const [hStr, mStr] = val.split(':');
        const h24 = parseInt(hStr, 10);
        const m = parseInt(mStr, 10);
        if (isNaN(h24) || isNaN(m)) return val;
        const period = h24 >= 12 ? 'PM' : 'AM';
        const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
        return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
    };

    const applyTime = (h12: number, min: number, period: 'AM' | 'PM') => {
        let h24 = h12;
        if (period === 'AM') {
            if (h12 === 12) h24 = 0;
        } else {
            if (h12 < 12) h24 = h12 + 12;
        }
        const formatted = `${String(h24).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        onChange(formatted);
    };

    // Calculate angle and update time from pointer coordinates
    const updateTimeFromPointer = (clientX: number, clientY: number, isRelease = false) => {
        if (!dialRef.current) return;
        const rect = dialRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        // Angle in degrees from top (12 o'clock = 0 deg)
        const angleRad = Math.atan2(deltaY, deltaX);
        const angleDeg = (angleRad * (180 / Math.PI) + 90 + 360) % 360;

        if (mode === 'hour') {
            let hour = Math.round(angleDeg / 30) % 12;
            if (hour === 0) hour = 12;
            setSelectedHour(hour);
            applyTime(hour, selectedMinute, selectedPeriod);
            if (isRelease) {
                setTimeout(() => setMode('minute'), 200);
            }
        } else {
            const minute = Math.round(angleDeg / 6) % 60;
            setSelectedMinute(minute);
            applyTime(selectedHour, minute, selectedPeriod);
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        try {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        } catch (_) {}
        setIsDragging(true);
        updateTimeFromPointer(e.clientX, e.clientY, false);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        updateTimeFromPointer(e.clientX, e.clientY, false);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (isDragging) {
            setIsDragging(false);
            updateTimeFromPointer(e.clientX, e.clientY, true);
        }
    };

    const handlePeriodClick = (p: 'AM' | 'PM') => {
        setSelectedPeriod(p);
        applyTime(selectedHour, selectedMinute, p);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setIsOpen(false);
    };

    const handleSetNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        const now = new Date();
        const h24 = now.getHours();
        const m = now.getMinutes();
        const period = h24 >= 12 ? 'PM' : 'AM';
        const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
        setSelectedHour(h12);
        setSelectedMinute(m);
        setSelectedPeriod(period);
        applyTime(h12, m, period);
        setIsOpen(false);
    };

    // Calculate angle for clock hand
    const clockHandAngle = mode === 'hour'
        ? (selectedHour % 12) * 30
        : (selectedMinute / 60) * 360;

    const HOURS_NUMS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const MINUTES_NUMS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    // Dial dimension
    const DIAL_RADIUS = 84; // px from center

    return (
        <div ref={containerRef} className={`relative w-full ${isOpen ? 'z-50' : 'z-10'}`} id={id}>
            {/* Trigger Button */}
            <div
                onClick={() => {
                    setIsOpen(!isOpen);
                    setMode('hour');
                }}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen); }}
                className={`w-full p-3 rounded-2xl bg-white dark:bg-[#1a1e2c] border transition-all cursor-pointer select-none flex items-center justify-between group ${
                    hasError 
                        ? 'border-red-500 ring-2 ring-red-500/20' 
                        : isOpen 
                            ? 'border-amber-500 ring-2 ring-amber-500/20 dark:border-amber-500' 
                            : 'border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20'
                    }`}>
                        <Clock size={15} />
                    </div>
                    <div className="min-w-0 text-left">
                        {label && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400 block leading-none mb-1">
                                {label}
                            </span>
                        )}
                        <span className={`text-xs sm:text-sm font-bold block truncate leading-none ${
                            value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 font-normal'
                        }`}>
                            {value ? formatDisplay(value) : placeholder}
                        </span>
                    </div>
                </div>

                <div className="text-slate-400 dark:text-gray-400 group-hover:text-amber-500 transition-colors flex items-center">
                    <ChevronRight size={15} className={`transition-transform duration-200 ${isOpen ? 'rotate-90 text-amber-500' : ''}`} />
                </div>
            </div>

            {/* Radial Clock Dropdown Popover */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 6 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className={`absolute top-full z-[100] w-full min-w-[280px] sm:min-w-[310px] max-w-[330px] bg-white dark:bg-[#121522] rounded-3xl shadow-2xl border border-slate-200 dark:border-amber-500/30 p-4 sm:p-5 backdrop-blur-xl select-none ${
                            align === 'right' ? 'right-0 left-auto' : 'left-0'
                        }`}
                    >
                        {/* 1. DIGITAL TIME HEADER DISPLAY */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                            {/* Hours Box */}
                            <button
                                type="button"
                                onClick={() => setMode('hour')}
                                className={`px-4 py-2.5 rounded-2xl text-2xl sm:text-3xl font-black transition-all cursor-pointer ${
                                    mode === 'hour'
                                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-xs'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                                }`}
                            >
                                {String(selectedHour).padStart(2, '0')}
                            </button>

                            <span className="text-2xl font-black text-slate-400 dark:text-slate-500 animate-pulse">:</span>

                            {/* Minutes Box */}
                            <button
                                type="button"
                                onClick={() => setMode('minute')}
                                className={`px-4 py-2.5 rounded-2xl text-2xl sm:text-3xl font-black transition-all cursor-pointer ${
                                    mode === 'minute'
                                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-xs'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                                }`}
                            >
                                {String(selectedMinute).padStart(2, '0')}
                            </button>

                            {/* AM / PM Toggle */}
                            <div className="flex flex-col ml-1 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-0.5">
                                <button
                                    type="button"
                                    onClick={() => handlePeriodClick('AM')}
                                    className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                                        selectedPeriod === 'AM'
                                            ? 'bg-amber-500 text-white shadow-xs'
                                            : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    AM
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePeriodClick('PM')}
                                    className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                                        selectedPeriod === 'PM'
                                            ? 'bg-amber-500 text-white shadow-xs'
                                            : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    PM
                                </button>
                            </div>
                        </div>

                        {/* 2. DRAGGABLE RADIAL CLOCK FACE */}
                        <div className="flex justify-center my-2">
                            <div
                                ref={dialRef}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                className={`relative w-56 h-56 rounded-full bg-slate-100 dark:bg-[#191c2b] border border-slate-200/80 dark:border-white/5 flex items-center justify-center shadow-inner touch-none select-none ${
                                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                                }`}
                            >
                                {/* Center Pivot Dot */}
                                <div className="absolute w-2.5 h-2.5 rounded-full bg-amber-500 z-30 shadow-xs pointer-events-none" />

                                {/* Clock Pointer Hand */}
                                <div
                                    className={`absolute w-0.5 bg-amber-500 origin-bottom pointer-events-none ${
                                        isDragging ? 'transition-none' : 'transition-transform duration-200 ease-out'
                                    } z-20`}
                                    style={{
                                        height: `${DIAL_RADIUS}px`,
                                        bottom: '50%',
                                        left: 'calc(50% - 1px)',
                                        transform: `rotate(${clockHandAngle}deg)`
                                    }}
                                >
                                    {/* Selection Bulb Knob */}
                                    <div className={`absolute -top-3.5 -left-3.5 w-7 h-7 rounded-full bg-amber-500 shadow-md shadow-amber-500/40 flex items-center justify-center text-white text-xs font-black select-none transition-transform ${
                                        isDragging ? 'scale-110 ring-4 ring-amber-500/30' : ''
                                    }`}>
                                        {mode === 'hour' ? selectedHour : String(selectedMinute).padStart(2, '0')}
                                    </div>
                                </div>

                                {/* Numbers on Dial */}
                                {mode === 'hour' && (
                                    <>
                                        {HOURS_NUMS.map((h) => {
                                            const angleDeg = (h % 12) * 30 - 90;
                                            const angleRad = (angleDeg * Math.PI) / 180;
                                            const x = Math.round(DIAL_RADIUS * Math.cos(angleRad));
                                            const y = Math.round(DIAL_RADIUS * Math.sin(angleRad));
                                            const isCurr = selectedHour === h;

                                            return (
                                                <div
                                                    key={`h-${h}`}
                                                    style={{
                                                        transform: `translate(${x}px, ${y}px)`
                                                    }}
                                                    className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold pointer-events-none z-10 ${
                                                        isCurr
                                                            ? 'text-transparent'
                                                            : 'text-slate-700 dark:text-slate-300 font-semibold'
                                                    }`}
                                                >
                                                    {h}
                                                </div>
                                            );
                                        })}
                                    </>
                                )}

                                {mode === 'minute' && (
                                    <>
                                        {MINUTES_NUMS.map((m) => {
                                            const angleDeg = (m / 60) * 360 - 90;
                                            const angleRad = (angleDeg * Math.PI) / 180;
                                            const x = Math.round(DIAL_RADIUS * Math.cos(angleRad));
                                            const y = Math.round(DIAL_RADIUS * Math.sin(angleRad));
                                            const isCurr = selectedMinute === m;

                                            return (
                                                <div
                                                    key={`m-${m}`}
                                                    style={{
                                                        transform: `translate(${x}px, ${y}px)`
                                                    }}
                                                    className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold pointer-events-none z-10 ${
                                                        isCurr
                                                            ? 'text-transparent'
                                                            : 'text-slate-700 dark:text-slate-300 font-semibold'
                                                    }`}
                                                >
                                                    {String(m).padStart(2, '0')}
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 3. FOOTER ACTIONS */}
                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-white/10">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-xs font-bold text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                            >
                                Clear
                            </button>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleSetNow}
                                    className="text-xs font-bold text-slate-500 dark:text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
                                >
                                    Now
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
