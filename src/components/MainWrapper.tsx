"use client";

import { usePathname } from 'next/navigation';
import React from 'react';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname.startsWith('/admin')) {
    return <main className="flex-grow">{children}</main>;
  }

  return <main className="container flex-grow">{children}</main>;
}
