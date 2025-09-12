"use client";
import React, { useState, useEffect } from 'react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Initial check

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      id="backToTop"
      onClick={scrollToTop}
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      title="Jump to Top"
    >
      <i className="fa-solid fa-arrow-up"></i>
      <span className="tooltip">Jump to Top</span>
    </button>
  );
}
