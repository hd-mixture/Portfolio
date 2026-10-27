"use client";

import React, { useEffect, useState } from 'react';
import { Bell, Menu, ChevronRight, CheckCircle2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
    setSidebarOpen: (val: boolean) => void;
}

interface Notification {
    _id: string;
    type: string;
    message: string;
    isRead: boolean;
    link?: string;
    createdAt: string;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchNotifications();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications`);
            const data = await res.json();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/notifications/${id}/read`, { method: 'PUT' });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark read');
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/notifications/read-all`, { method: 'PUT' });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all read');
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Simple breadcrumb logic
    const pathParts = pathname.split('/').filter(p => p !== '');
    const currentPage = pathParts.length > 1 
        ? pathParts[pathParts.length - 1].charAt(0).toUpperCase() + pathParts[pathParts.length - 1].slice(1) 
        : 'Dashboard';

    return (
        <header className="h-16 bg-transparent flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors backdrop-blur-md">
            <div className="flex items-center gap-4 flex-1">
                <button 
                    onClick={() => setSidebarOpen(true)} 
                    className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    <Menu size={24} />
                </button>
                
                {/* Breadcrumbs */}
                <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
                    <span className="text-slate-400">Admin</span>
                    <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
                    <span className="text-slate-900 dark:text-white">{currentPage}</span>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5 relative">
                <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors bg-white dark:bg-[#121212] p-2 rounded-full border border-slate-200 dark:border-white/5 shadow-sm"
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#121212]">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Notifications Dropdown */}
                {showDropdown && (
                    <div className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-[#151515] rounded-[24px] shadow-2xl border border-slate-200/60 dark:border-[#333] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-slate-100 dark:border-[#222] flex justify-between items-center bg-slate-50/50 dark:bg-[#1a1a1a]/50">
                            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-xs font-bold text-blue-600 hover:text-blue-700">Mark all read</button>
                            )}
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-slate-500 text-sm font-medium">No notifications yet.</div>
                            ) : (
                                notifications.map(notif => (
                                    <div 
                                        key={notif._id} 
                                        className={`p-4 border-b border-slate-50 dark:border-[#222] transition-colors ${notif.isRead ? 'opacity-60' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}
                                        onClick={() => markAsRead(notif._id)}
                                    >
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 text-blue-500"><Bell size={16} /></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-800 dark:text-gray-200 leading-snug">
                                                    {notif.message}
                                                </p>
                                                {notif.link && (
                                                    <Link href={notif.link} className="text-xs font-bold text-blue-600 mt-2 inline-block">
                                                        View Details
                                                    </Link>
                                                )}
                                            </div>
                                            {!notif.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
