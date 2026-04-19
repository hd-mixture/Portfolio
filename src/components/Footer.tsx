"use client";

import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <span>&copy; {year} Darshan Prajapati. All rights reserved.</span>
      </div>
    </footer>
  );
}
