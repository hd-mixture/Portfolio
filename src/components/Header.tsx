"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { useTheme } from 'next-themes';

const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
  const navClass = isMobile ? 'mobile-nav' : 'desktop-nav';
  const navItems = [
    { href: '#home', icon: 'fa-solid fa-house', label: 'Home' },
    { href: '#about', icon: 'fa-solid fa-user', label: 'About' },
    { href: '#skills', icon: 'fa-solid fa-cogs', label: 'Skills' },
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
  const { theme, setTheme } = useTheme();
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Darshan Prajapati - Portfolio',
          text: 'Check out Darshan Prajapati\'s creative developer and graphic designer portfolio!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Portfolio link copied to clipboard!');
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // @ts-ignore
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }
    
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--x', `5vw`);
    document.documentElement.style.setProperty('--y', `5vh`);

    // @ts-ignore
    document.startViewTransition(() => {
        window.scrollTo(0, scrollY);
        setTheme(newTheme);
    });
  }

  const handlePressStart = () => {
    longPressTimer.current = setTimeout(() => {
        handleThemeToggle();
        longPressTimer.current = null; // Prevent click after long press
    }, 800); // 800ms for long press
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // A normal click (not a long press)
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    } else {
      // This is to prevent navigation if the timer was cleared by handlePressEnd but the click event still fires.
      // A null timer indicates a long press has already occurred.
      if (e.currentTarget.className.includes('logo')) {
          // It's the desktop logo, allow navigation or other click actions
          window.location.href = '#home';
      }
    }
  };


  return (
    <>
      <header>
        <div className="page-header">
          <div 
            className="logo"
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onClick={handleClick}
            title="Long press to toggle theme"
          >
            <Link href="#home">
              <Image src="/Logos/hd_logo.png" alt="Logo" width={60} height={60} data-ai-hint="logo monogram" />
            </Link>
          </div>
          <NavLinks />
        </div>
        <div className="mobile-header mobile-only">
          <div
            className="flex items-center"
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onClick={(e) => {
              if (longPressTimer.current) {
                e.preventDefault();
                clearTimeout(longPressTimer.current);
                longPressTimer.current = null;
              }
            }}
            title="Long press to toggle theme"
          >
            <Image src="/Logos/hd_logo.png" alt="Logo" width={40} height={40} className="mobile-header-logo" data-ai-hint="logo monogram" />
          </div>
          <span className="portfolio-title">PORTFOLIO</span>
          <button onClick={handleShare} className="share-button" aria-label="Share portfolio">
            <Share2 size={20} />
          </button>
        </div>
      </header>
      <NavLinks isMobile={true} />
    </>
  );
}
