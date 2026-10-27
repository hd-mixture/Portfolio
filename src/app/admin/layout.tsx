"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { authService } from '@/lib/auth';
import AdminLoadingState from '@/components/admin/AdminLoadingState';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }

    const authenticated = authService.isAuthenticated();
    if (!authenticated) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setIsCheckingAuth(false);
    }
  }, [pathname, isLoginPage, router]);

  // If on login page, render child directly with no admin frame
  if (isLoginPage) {
    return <div id="admin-login-root" className="w-full min-h-screen">{children}</div>;
  }

  // Loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8fafc] dark:bg-[#0a0a0a]">
        <AdminLoadingState 
          title="Verifying Admin Session..."
          subtitle="Authenticating secure CMS credentials..."
          minHeight="min-h-screen"
        />
      </div>
    );
  }

  return (
    <div id="admin-root" className="flex h-screen bg-[#f8fafc] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Mobile: Full width, Desktop: Floating Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[312px] lg:mr-4 lg:my-4 bg-[#f8fafc] dark:bg-[#0a0a0a] lg:bg-white lg:dark:bg-[#121212] lg:rounded-[32px] lg:border lg:border-slate-200/80 lg:dark:border-white/5 lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:dark:shadow-none lg:overflow-hidden relative h-screen lg:h-[calc(100vh-32px)]">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main data-lenis-prevent="true" className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors custom-scrollbar">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
