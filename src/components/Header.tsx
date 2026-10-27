"use client";
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { useTheme } from 'next-themes';

import { usePathname } from 'next/navigation';
import { usePersona } from './PersonaContext';

const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { persona } = usePersona();
  const isDesigner = persona === 'designer';
  const navClass = isMobile ? 'mobile-nav' : 'desktop-nav';
  const [activeSection, setActiveSection] = useState('home');
  
  const navItems = isDesigner ? [
    { href: '#home', icon: 'fa-solid fa-house', label: 'Home' },
    { href: '#about', icon: 'fa-solid fa-user', label: 'About' },
    { href: '#work', icon: 'fa-solid fa-palette', label: 'Work' },
    { href: '#contact', icon: 'fa-solid fa-handshake', label: 'Hire Me' },
  ] : [
    { href: '#home', icon: 'fa-solid fa-house', label: 'Home' },
    { href: '#about', icon: 'fa-solid fa-user', label: 'About' },
    { href: '#skills', icon: 'fa-solid fa-cogs', label: 'Skills' },
    { href: '#projects', icon: 'fa-solid fa-briefcase', label: 'Projects' },
    { href: '#contact', icon: 'fa-solid fa-envelope', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // offset for header + some margin
      let current = 'home';
      
      navItems.forEach((item) => {
        const targetId = item.href.substring(1);
        const element = document.getElementById(targetId);
        
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            current = targetId;
          }
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <ul className={navClass}>
      {navItems.map((item, index) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={activeSection === item.href.substring(1) ? 'active' : ''}
            style={{ '--navAni': index + 1 } as React.CSSProperties}
            data-tooltip={item.label}
            onClick={(e) => {
              // If on the same page, use custom smooth scroll with exact 80px offset
              if (window.location.pathname === '/' || window.location.pathname === '') {
                e.preventDefault();
                const targetId = item.href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                  const headerOffset = (targetId === 'contact' || targetId === 'home') ? 0 : 80;
                  
                  // Compute dynamic padding to account for sections like Skills/Projects that have huge padding-top
                  const computedStyle = window.getComputedStyle(targetElement);
                  const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
                  
                  const elementPosition = targetElement.getBoundingClientRect().top;
                  // Add paddingTop so we scroll exactly to where the content (heading) begins inside the section
                  const offsetPosition = elementPosition + window.pageYOffset + paddingTop - headerOffset;
                  
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                  window.history.pushState(null, '', item.href);
                }
              }
            }}
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
  const [showProTip, setShowProTip] = useState(false);

  useEffect(() => {
    const hasSeenTip = localStorage.getItem('hasSeenThemeTip');
    if (!hasSeenTip) {
      const timer = setTimeout(() => {
        setShowProTip(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissTip = () => {
    setShowProTip(false);
    localStorage.setItem('hasSeenThemeTip', 'true');
  };
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

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
    try {
      localStorage.setItem('hd_custom_user_theme', 'true');
    } catch (e) {}

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
        dismissTip();
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
      dismissTip();
      window.location.href = '#home'; // Manually navigate for short clicks
    }
    // If longPressTimer.current is null, it means the long press action already fired, so do nothing.
  };


  return (
    <>
      <header>
        <div className="page-header">
          <div 
            className={`logo ${showProTip ? 'hide-tooltip' : ''}`}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onClick={handleClick}
            data-tooltip="Long press to toggle theme"
          >
            <Image src="/Logos/hd_logo.png" alt="Logo" width={60} height={60} data-ai-hint="logo monogram" />
            
            {showProTip && (
              <div className="pro-tip-popup">
                <div className="pro-tip-arrow"></div>
                <div className="pro-tip-content">
                  <span className="pro-tip-icon"><i className="fa-solid fa-lightbulb"></i></span>
                  <div className="pro-tip-text">
                    <strong>Pro Tip!</strong>
                    <span>Long press logo to switch theme</span>
                  </div>
                  <button className="pro-tip-close" onClick={(e) => { e.stopPropagation(); dismissTip(); }}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            )}
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
              handleClick(e);
              dismissTip();
            }}
            data-tooltip="Long press to toggle theme"
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
