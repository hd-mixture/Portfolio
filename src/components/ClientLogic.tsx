"use client";

import React, { useEffect } from 'react';
import BackToTopButton from './BackToTopButton';

export default function ClientLogic({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    // --- Nav highlighting on scroll ---
    const desktopNavLinks = document.querySelectorAll('.desktop-nav li a');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav li a');
    const allLinks = [...desktopNavLinks, ...mobileNavLinks];
    const sections = Array.from(document.querySelectorAll('section[id]'));
    
    let isClickScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const onScroll = () => {
      if (isClickScrolling) return;

      let currentSectionId = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          currentSectionId = section.getAttribute('id') || '';
        }
      });
      
      allLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    };
    
    allLinks.forEach(link => {
      link.addEventListener('click', () => {
        isClickScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isClickScrolling = false;
        }, 1000);
        
        allLinks.forEach(l => l.classList.remove('active'));
        // Find the corresponding link in the other nav and add active class
        document.querySelectorAll(`a[href="${link.getAttribute('href')}"]`).forEach(l => l.classList.add('active'));
      });
    });

    // --- Mobile nav auto-hide ---
    const mobileNav = document.querySelector('.mobile-nav') as HTMLElement;
    let lastScrollY = window.scrollY;
    let hideNavTimeout: NodeJS.Timeout;

    const handleMobileNavScroll = () => {
        if (window.innerWidth > 600 || !mobileNav) return;
        
        if (window.scrollY > lastScrollY) {
            mobileNav.classList.add('nav-hidden');
        } else {
            mobileNav.classList.remove('nav-hidden');
        }
        lastScrollY = window.scrollY;
        
        clearTimeout(hideNavTimeout);
        hideNavTimeout = setTimeout(() => {
            if (mobileNav) mobileNav.classList.add('nav-hidden');
        }, 5000);
    };

    // --- Section reveal on scroll ---
    const revealElements = document.querySelectorAll('.section-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    window.addEventListener('scroll', onScroll);
    window.addEventListener('scroll', handleMobileNavScroll);
    
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', handleMobileNavScroll);
      revealElements.forEach(el => observer.unobserve(el));
      allLinks.forEach(link => link.replaceWith(link.cloneNode(true))); // cheap way to remove listeners
    };
  }, []);

  return (
    <>
        {children}
        <BackToTopButton/>
    </>
  );
}
