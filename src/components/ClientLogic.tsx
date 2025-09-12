"use client";

import React, { useEffect } from 'react';
import BackToTopButton from './BackToTopButton';

export default function ClientLogic({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    const header = document.querySelector('header');
    const pageHeader = document.querySelector('.page-header') as HTMLElement;
    const desktopNavLinks = document.querySelectorAll('.desktop-nav li a');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav li a');
    const allLinks = [...desktopNavLinks, ...mobileNavLinks] as HTMLAnchorElement[];
    const sections = Array.from(document.querySelectorAll('section[id]'));
    
    let isClickScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      // Scrolled state for header
      if (pageHeader) {
          if (window.scrollY > 50) {
              pageHeader.classList.add('scrolled');
          } else {
              pageHeader.classList.remove('scrolled');
          }
      }

      if (isClickScrolling) return;

      // Header hide/show
      if (header) {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }
        lastScrollY = window.scrollY;
      }


      let currentSectionId = '';
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop;
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
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = targetId ? document.querySelector(targetId) : null;

        if (targetElement) {
          isClickScrolling = true;
          
          const offsetTop = (targetElement as HTMLElement).offsetTop;
          window.scrollTo({
            top: offsetTop - 80, // Adjust for fixed header
            behavior: 'smooth'
          });
          
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            isClickScrolling = false;
          }, 1000);
          
          allLinks.forEach(l => l.classList.remove('active'));
          document.querySelectorAll(`a[href="${targetId}"]`).forEach(l => l.classList.add('active'));
        }
      });
    });

    const mobileNav = document.querySelector('.mobile-nav') as HTMLElement;
    let hideNavTimeout: NodeJS.Timeout;

    const handleMobileNavScroll = () => {
        if (window.innerWidth > 600 || !mobileNav) return;
        
        if (window.scrollY > lastScrollY) {
            mobileNav.classList.add('nav-hidden');
        } else {
            mobileNav.classList.remove('nav-hidden');
        }
        
        clearTimeout(hideNavTimeout);
        hideNavTimeout = setTimeout(() => {
            if (mobileNav) mobileNav.classList.add('nav-hidden');
        }, 5000);
    };

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
      allLinks.forEach(link => link.replaceWith(link.cloneNode(true)));
    };
  }, []);

  return (
    <>
        {children}
        <BackToTopButton/>
    </>
  );
}
