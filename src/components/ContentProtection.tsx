"use client";

import React, { useEffect } from 'react';

export default function ContentProtection({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    // Protection logic has been disabled
  }, []);

  return (
    <>
      {children}
    </>
  );
}
