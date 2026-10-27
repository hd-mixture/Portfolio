"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { usePersona } from './PersonaContext';
import BackToTopButton from './BackToTopButton';
import { Sparkles, X } from 'lucide-react';

export default function ClientLogic({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const { setPersona } = usePersona();
  const [announcement, setAnnouncement] = useState<{ enabled: boolean; text: string } | null>(null);
  const [showBanner, setShowBanner] = useState(true);

  // Sync Global Settings (Default Theme, Default Persona, Announcement Banner)
  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
        if (res.ok) {
          const settings = await res.json();
          if (settings) {
            // Apply default global theme if not manually overridden by visitor
            const hasCustomTheme = localStorage.getItem('hd_custom_user_theme');
            if (!hasCustomTheme && settings.defaultTheme) {
              setTheme(settings.defaultTheme);
            }

            // Apply default persona if not manually chosen
            const hasCustomPersona = localStorage.getItem('portfolio-persona');
            if (!hasCustomPersona && settings.defaultPersona) {
              setPersona(settings.defaultPersona);
            }

            // Announcement banner
            if (settings.announcementBanner?.enabled && settings.announcementBanner?.text) {
              setAnnouncement(settings.announcementBanner);
            }
          }
        }
      } catch (err) {
        console.debug('Global settings fallback');
      }
    };

    fetchGlobalSettings();
  }, [setTheme, setPersona]);
  
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
      // Scrolled state for header (transparent when expanded at top, background when shrunk/scrolled)
      if (pageHeader) {
          if (window.scrollY > 40) {
              pageHeader.classList.add('scrolled');
          } else {
              pageHeader.classList.remove('scrolled');
          }
      }

      const mobileHeader = document.querySelector('.mobile-header') as HTMLElement;
      if (mobileHeader) {
          if (window.scrollY > 20) {
              mobileHeader.classList.add('scrolled');
          } else {
              mobileHeader.classList.remove('scrolled');
          }
      }

      if (isClickScrolling) return;

      // Check if we are inside a sticky scroll container
      const stickyContainers = Array.from(document.querySelectorAll('.sticky-scroll-section, .journey-scroll-container'));
      const isInSticky = stickyContainers.some(container => {
          const rect = container.getBoundingClientRect();
          // We are "inside" the sticky container if its top is above the viewport AND its bottom is below the viewport
          return rect.top <= 0 && rect.bottom >= window.innerHeight;
      });

      if (isInSticky) {
          document.body.classList.add('in-sticky-scroll');
      } else {
          document.body.classList.remove('in-sticky-scroll');
      }

      // Header hide/show
      if (header) {
        if (document.body.classList.contains('in-sticky-scroll')) {
          header.classList.add('header-hidden');
        } else if (window.scrollY > lastScrollY && window.scrollY > 100) {
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
        {announcement?.enabled && showBanner && announcement.text && (
          <div className="relative z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-2 shadow-sm">
            <Sparkles size={14} className="animate-pulse shrink-0" />
            <span className="truncate max-w-[85vw]">{announcement.text}</span>
            <button 
              onClick={() => setShowBanner(false)} 
              className="ml-2 hover:bg-white/20 p-1 rounded-full transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X size={12} />
            </button>
          </div>
        )}
        {children}
        <BackToTopButton/>
    </>
  );
}
