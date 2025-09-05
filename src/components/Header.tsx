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
          <span className="portfolio-title">PORTFOLIO</span>
        </div>
      </header>
      <NavLinks isMobile={true} />
    </>
  );
}
