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

  const handleThemeToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.type.includes('mouse') ? (event as React.MouseEvent).clientX : (event as React.TouchEvent).touches[0].clientX;
    const y = event.type.includes('mouse') ? (event as React.MouseEvent).clientY : (event as React.TouchEvent).touches[0].clientY;

    const newTheme = theme === 'dark' ? 'light' : 'dark';
    const scrollY = window.scrollY;

    // @ts-ignore
    if (!document.startViewTransition) {
      setTheme(newTheme);
      window.scrollTo(0, scrollY);
      return;
    }
    
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);

    // @ts-ignore
    document.startViewTransition(() => {
        window.scrollTo(0, scrollY);
        setTheme(newTheme);
    });
  }

  const handlePressStart = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    // Clone the event object to preserve its properties for the setTimeout
    const eventClone = { ...event };
    longPressTimer.current = setTimeout(() => {
        handleThemeToggle(eventClone);
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
    if (longPressTimer.current) {
      // It's a short click, clear the timer and proceed with click action.
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      window.location.href = '#home'; // Manually navigate for short clicks
    }
    // If longPressTimer.current is null, it means the long press action already fired, so do nothing.
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
            <Image src="/Logos/hd_logo.png" alt="Logo" width={60} height={60} data-ai-hint="logo monogram" />
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
          <div className="portfolio-title">
            {'PORTFOLIO'.split('').map((char, index) => (
              <span key={index}>{char}</span>
            ))}
          </div>
          <button onClick={handleShare} className="share-button" aria-label="Share portfolio">
            <Share2 size={20} />
          </button>
        </div>
      </header>
      <NavLinks isMobile={true} />
    </>
  );
}
