"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    LayoutDashboard, User, Folder, 
    Layers, Briefcase, MessageSquareQuote, Settings,
    Search, ArrowRight, Sun, Moon, ChevronsLeft, Palette, 
    MessageCircle, Users, BarChart2, FileText, Award, Trophy, Star,
    LogOut, X, CornerDownLeft
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { authService, AdminUser } from '@/lib/auth';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

    // Interactive Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Searchable Index of all Admin Routes & Sections
    const searchableItems = [
        { label: 'Dashboard Overview', category: 'Overview', href: '/admin', icon: LayoutDashboard, keywords: ['home', 'stats', 'analytics', 'overview'] },
        { label: 'Hero Section', category: 'Content', href: '/admin/hero', icon: User, keywords: ['headline', 'title', 'tagline', 'intro', 'greeting'] },
        { label: 'About Me', category: 'Content', href: '/admin/about', icon: User, keywords: ['bio', 'skills', 'education', 'story', 'experience'] },
        { label: 'Projects', category: 'Portfolio', href: '/admin/projects', icon: Folder, keywords: ['apps', 'websites', 'github', 'demo', 'case study', 'work'] },
        { label: 'Internships & Jobs', category: 'Career', href: '/admin/internships', icon: Briefcase, keywords: ['work', 'company', 'role', 'experience', 'jobs'] },
        { label: 'Testimonials', category: 'Reviews', href: '/admin/testimonials', icon: MessageSquareQuote, keywords: ['feedback', 'clients', 'reviews', 'ratings'] },
        { label: 'Project Media & Designs', category: 'Assets', href: '/admin/designs', icon: Palette, keywords: ['graphics', 'photos', 'ui', 'illustrations', 'gallery'] },
        { label: 'Achievements & Hackathons', category: 'Awards', href: '/admin/achievements', icon: Trophy, keywords: ['hackathons', 'certificates', 'wins', 'trophies', 'competitions'] },
        { label: 'Settings: Admin Profile', category: 'Settings', href: '/admin/settings', icon: Settings, keywords: ['name', 'username', 'email', 'avatar', 'photo', 'profile'] },
        { label: 'Settings: Password & Security', category: 'Settings', href: '/admin/settings', icon: Settings, keywords: ['password', 'auth', 'jwt', 'security', 'session'] },
        { label: 'Settings: SEO & Meta Tags', category: 'Settings', href: '/admin/settings', icon: Settings, keywords: ['seo', 'meta', 'keywords', 'google', 'opengraph', 'social preview'] },
        { label: 'Settings: Social & Contact Hub', category: 'Settings', href: '/admin/settings', icon: Settings, keywords: ['github', 'linkedin', 'instagram', 'twitter', 'whatsapp', 'email'] },
        { label: 'Settings: Appearance & Backup', category: 'Settings', href: '/admin/settings', icon: Settings, keywords: ['theme', 'backup', 'export', 'persona', 'json'] },
    ];

    const filteredItems = searchQuery.trim()
        ? searchableItems.filter(item => 
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : [];

    useEffect(() => {
        setMounted(true);
        const loadUser = () => {
            const user = authService.getStoredAdmin();
            if (user) setAdminUser(user);
        };
        loadUser();

        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, [pathname]);

    // Keyboard shortcut (Ctrl+K or Cmd+K) to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
                setIsSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                searchInputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Click outside to close search dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (filteredItems.length > 0) {
            router.push(filteredItems[0].href);
            setSearchQuery('');
            setIsSearchOpen(false);
            searchInputRef.current?.blur();
        }
    };

    const handleSelectResult = (href: string) => {
        router.push(href);
        setSearchQuery('');
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
    };

    const quickActions = [
        { label: 'Project', icon: Folder, href: '/admin/projects' },
        { label: 'Internship', icon: Briefcase, href: '/admin/internships' },
        { label: 'Testimonial', icon: MessageSquareQuote, href: '/admin/testimonials' },
        { label: 'Media', icon: Palette, href: '/admin/designs' },
    ];

    interface NavItem {
        href: string;
        icon: any;
        label: string;
        exact?: boolean;
        badge?: string;
        count?: number;
        hasDot?: boolean;
    }

    const contentLinks: NavItem[] = [
        { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { href: '/admin/hero', icon: User, label: 'Hero Section' },
        { href: '/admin/about', icon: User, label: 'About Me' },
        { href: '/admin/projects', icon: Folder, label: 'Projects' },
        { href: '/admin/internships', icon: Briefcase, label: 'Internships & Jobs' },
        { href: '/admin/testimonials', icon: MessageSquareQuote, label: 'Testimonials' },
        { href: '/admin/designs', icon: Palette, label: 'Project Media' },
        { href: '/admin/achievements', icon: Trophy, label: 'Achievements' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Floating Sidebar */}
            <aside className={`
                fixed top-4 bottom-4 left-4 z-50 w-[280px] bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-white/5 
                rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none
                flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}
            `}>
                <div 
                    data-lenis-prevent="true" 
                    className="flex-1 overflow-y-auto flex flex-col pt-6 pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {/* Header / Logo */}
                    <div className="flex items-center justify-between px-6 mb-6">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-[12px] bg-black border border-slate-900 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-xs flex-shrink-0">
                                <img 
                                    src="/Logos/hd_logo.png" 
                                    alt="Portfolio CMS Logo" 
                                    className="w-full h-full object-cover scale-105"
                                />
                            </div>
                            <h2 className="text-[17px] font-bold text-slate-900 dark:text-white tracking-tight truncate">Portfolio CMS</h2>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400">
                            <ChevronsLeft size={20} />
                        </button>
                    </div>

                    {/* Interactive Search Bar */}
                    <div ref={searchContainerRef} className="px-6 mb-8 relative z-30">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                            <Search 
                                className={`absolute left-3.5 transition-colors ${isSearchOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} 
                                size={16} 
                            />
                            <input 
                                ref={searchInputRef}
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsSearchOpen(true);
                                }}
                                onFocus={() => setIsSearchOpen(true)}
                                placeholder="Search sections, pages..." 
                                className="w-full pl-10 pr-16 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-[#1a1d2d] text-slate-900 dark:text-white transition-all placeholder:text-slate-400 shadow-2xs"
                            />

                            {/* Clear query OR Ctrl+K badge */}
                            <div className="absolute right-2 flex items-center gap-1">
                                {searchQuery ? (
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            searchInputRef.current?.focus();
                                        }}
                                        className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                                    >
                                        <X size={13} />
                                    </button>
                                ) : (
                                    <span className="hidden sm:inline-flex text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-white/10 px-1.5 py-0.5 rounded-md border border-slate-300/40 dark:border-white/10 select-none">
                                        ⌘K
                                    </span>
                                )}

                                <button 
                                    type="submit" 
                                    className="w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white transition-colors shadow-2xs cursor-pointer"
                                    title="Quick Go"
                                >
                                    <ArrowRight size={13} />
                                </button>
                            </div>
                        </form>

                        {/* Live Search Results Dropdown Flyout */}
                        {isSearchOpen && searchQuery.trim().length > 0 && (
                            <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-[#1a1d2e] rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.55)] p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 max-h-[300px] overflow-y-auto">
                                <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5 mb-1">
                                    <span>Search Results ({filteredItems.length})</span>
                                    <span className="flex items-center gap-1 font-normal lowercase text-[9px]">
                                        <span>press</span>
                                        <CornerDownLeft size={10} />
                                        <span>to open</span>
                                    </span>
                                </div>

                                {filteredItems.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredItems.map((item, idx) => {
                                            const Icon = item.icon;
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => handleSelectResult(item.href)}
                                                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all group cursor-pointer ${
                                                        idx === 0 
                                                            ? 'bg-blue-50/80 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' 
                                                            : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                            idx === 0 
                                                                ? 'bg-blue-600 text-white shadow-xs' 
                                                                : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600'
                                                        }`}>
                                                            <Icon size={14} />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-xs font-bold truncate">
                                                                {item.label}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                                                                {item.category}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <ArrowRight size={13} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center">
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No matching sections</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Try searching for projects, hero, about, or settings</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions (2x2 Grid) */}
                    <div className="px-6 mb-8">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-3 tracking-widest uppercase">Quick Actions</p>
                        <div className="grid grid-cols-2 gap-2.5">
                            {quickActions.map((act, i) => (
                                <Link key={i} href={act.href} className="flex flex-col items-center justify-center gap-2 p-3 bg-white dark:bg-[#121212] border border-slate-100 dark:border-white/5 rounded-2xl hover:border-slate-200 dark:hover:border-white/10 hover:shadow-sm transition-all group">
                                    <act.icon size={18} strokeWidth={1.5} className="text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{act.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Main Navigation */}
                    <div className="px-3">
                        <nav className="space-y-1">
                            {contentLinks.map((link) => {
                                const isActive = link.exact 
                                    ? pathname === link.href 
                                    : pathname.startsWith(link.href);
                                
                                return (
                                    <Link key={link.label} href={link.href}
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group
                                            ${isActive 
                                                ? 'bg-transparent' 
                                                : 'hover:bg-slate-50 dark:hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <link.icon 
                                                size={18} 
                                                strokeWidth={isActive ? 2 : 1.5}
                                                className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'} 
                                            />
                                            <span className={`text-[13.5px] ${isActive ? 'font-bold text-blue-600 dark:text-blue-400' : 'font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>
                                                {link.label}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            {link.count && (
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                                                    {link.count}
                                                </span>
                                            )}
                                            {link.hasDot && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></div>
                                            )}
                                            {link.badge && (
                                                <span className="text-[9px] font-black text-white bg-blue-600 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                    {link.badge}
                                                </span>
                                            )}
                                            {!isActive && !link.badge && !link.hasDot && (
                                                <ChevronRightIcon className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>



                    {/* Settings */}
                    <div className="px-3 mt-auto mb-2">
                        <nav className="space-y-1">
                            <Link 
                                href="/admin/settings" 
                                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                                    pathname === '/admin/settings' 
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold' 
                                        : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-medium'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Settings 
                                        size={18} 
                                        strokeWidth={pathname === '/admin/settings' ? 2 : 1.5} 
                                        className={pathname === '/admin/settings' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'} 
                                    />
                                    <span className="text-[13.5px]">Settings</span>
                                </div>
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Footer Profile, Theme Toggle & Logout */}
                <div className="p-3 mx-4 mb-4 mt-2 rounded-[20px] bg-slate-50 dark:bg-[#1a1a1a] border border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                    <Link href="/admin/settings" className="flex items-center gap-3 min-w-0 flex-1 group">
                        {adminUser?.avatar ? (
                            <img 
                                src={adminUser.avatar} 
                                alt={adminUser.name || 'Admin'} 
                                className="w-10 h-10 rounded-[12px] object-cover border border-blue-500/20 shadow-xs flex-shrink-0"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-xs">
                                {adminUser?.name ? adminUser.name.slice(0, 2).toUpperCase() : 'DP'}
                            </div>
                        )}
                        <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {adminUser?.name || 'Darshan Prajapati'}
                            </span>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                                @{adminUser?.username || 'admin'}
                            </span>
                        </div>
                    </Link>
                    
                    {/* Action buttons: Theme switch & Logout */}
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button 
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer"
                            title="Toggle theme"
                        >
                            {mounted && (theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />)}
                        </button>

                        <button 
                            onClick={() => authService.logout()}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
                            title="Logout from Admin"
                        >
                            <LogOut size={15} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
}
