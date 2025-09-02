"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
  const navClass = isMobile ? 'mobile-nav' : 'desktop-nav';
  const navItems = [
    { href: '#home', icon: 'fa-solid fa-house', label: 'Home' },
    { href: '#about', icon: 'fa-solid fa-user', label: 'About' },
    { href: '#skills', icon: 'fa-solid fa-code', label: 'Skills' },
    { href: '#projects', icon: 'fa-solid fa-briefcase', label: 'Projects' },
    { href: '#contact', icon: 'fa-solid fa-envelope', label: 'Contact' },
  ];

  return (
    <ul className={navClass}>
      {navItems.map((item, index) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={index === 0 ? 'active' : ''}
            style={{ '--navAni': index + 1 } as React.CSSProperties}
            data-tooltip={item.label}
          >
            <i className={item.icon}></i>
            {!isMobile && <span>{item.label}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeSaved = localStorage.getItem('darkMode') === 'enabled';
    if(darkModeSaved) {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newState = !prev;
      if (newState) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
      }
      return newState;
    });
  };

  return (
    <>
      <header>
        <div className="page-header">
          <div className="logo">
            <Link href="#home">
              <Image src="/img.png" alt="Logo" width={60} height={60} data-ai-hint="logo monogram" />
            </Link>
          </div>
          <label className="mode floating-toggle mobile-only">
            <input 
              type="checkbox" 
              id="darkModeToggle" 
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <i className={isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
          </label>
          <NavLinks />
        </div>
        <div className="mobile-header mobile-only">
          <span className="portfolio-title">PORTFOLIO</span>
        </div>
      </header>
      <NavLinks isMobile={true} />
    </>
  );
}
