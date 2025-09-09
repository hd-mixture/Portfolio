"use client";

import React, { useEffect } from 'react';

export default function ContentProtection({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable text selection and copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Disable drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // Block keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'u' || (e.shiftKey && e.key === 'i'))) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('keydown', handleKeyDown);

    // Apply no-select class to body
    document.body.classList.add('no-select');

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('no-select');
    };
  }, []);

  return (
    <>
      {children}
    </>
  );
}
