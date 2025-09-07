"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Share2 } from 'lucide-react';

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
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Portfolio link copied to clipboard!');
    }
  };

  return (
    <>
      <header>
        <div className="page-header">
          <div className="logo">
            <Link href="#home">
              <Image src="/logos/hd_logo.png" alt="Logo" width={60} height={60} data-ai-hint="logo monogram" />
            </Link>
          </div>
          <NavLinks />
        </div>
        <div className="mobile-header mobile-only">
           <Image src="/logos/hd_logo.png" alt="Logo" width={40} height={40} className="mobile-header-logo" data-ai-hint="logo monogram" />
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
