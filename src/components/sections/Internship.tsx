"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Info, ChevronRight, ChevronLeft, FileText, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const experiences = [
  {
    id: 'digiteq',
    role: "Web Developer",
    company: "Digiteq Solution",
    type: "Internship",
    location: "Ankleshwar, Gujarat, India",
    date: "Jun 2025 – Present",
    status: "current",
    description: "Developing responsive web applications using the MERN stack. Focused on creating user-centric interfaces and integrating Firebase services for real-time functionality.",
    skills: ["MERN Stack", "Firebase", "React", "UI/UX", "Git"],
    logo: "https://static.wixstatic.com/media/8daa46_6ca56cecc3a143c78f1453d2f2b71293~mv2.png/v1/fill/w_68,h_68,q_85,usm_0.66_1.00_0.01/8daa46_6ca56cecc3a143c78f1453d2f2b71293~mv2.png",
    color: "#4CAF50",
    gapToNext: "Concurrent Experience",
    gapWeight: 0.3,
    letter: null
  },
  {
    id: 'jio',
    role: "Digital Repair Specialist Executive",
    company: "Reliance Jio Infocomm Limited",
    type: "Job",
    location: "Ahmedabad, Gujarat",
    date: "Sep 2025 – Mar 2026",
    status: "completed",
    description: "Managed end-to-end service operations including CRM, installation scheduling, and technician coordination. Specialized in SAP data management and troubleshooting for Jio AirFiber.",
    skills: ["CRM", "SAP", "Operations", "Customer Handling", "Coordination"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Reliance_Jio_Logo.svg",
    color: "#52489C",
    gapToNext: "Sequential Transition",
    gapWeight: 0.4,
    letter: "/Experience/Reliance Jio Infocomm limited Exp Letter.pdf"
  },
  {
    id: 'md-enterprise',
    role: "Technician",
    company: "M D Enterprise",
    type: "Job",
    location: "Valia, Bharuch, Gujarat",
    date: "Jan 2025 – Aug 2025",
    status: "completed",
    description: "Worked as a Technician handling repair, maintenance, and technical support tasks. Known for dedication, sincerity, and professional attitude.",
    skills: ["Electrical Work", "Repairing", "Maintenance", "Technical Support", "Field Work"],
    logo: "/md_logo_placeholder.png", 
    isCustomLogo: true,
    color: "#333",
    gapToNext: "1.3 Years Gap",
    gapWeight: 1.3,
    letter: "/Experience/MD Enterprise Exp Letter.pdf"
  },
  {
    id: 'riseup',
    role: "Android Developer",
    company: "RiseUp Infotech",
    type: "Internship",
    location: "Surat, Gujarat",
    date: "Aug 2022 – Sep 2023",
    status: "completed",
    description: "Developed and maintained Android applications. Collaborated with teams to implement mobile features and optimized app performance using Java and SQLite.",
    skills: ["Android Studio", "Java", "XML", "SQLite"],
    logo: "https://media.licdn.com/dms/image/v2/C4D0BAQFFrMKiwR45wg/company-logo_200_200/company-logo_200_200/0/1658907156557/riseupinfotech_logo?e=2147483647&v=beta&t=k4tRyTKDAokJD3mEbcQntQB6n6BSsMNYwKtsKtsbD4A",
    color: "#FF5722",
    gapToNext: "1.1 Years Gap",
    gapWeight: 1.1,
    letter: "/Experience/RiseUp Infotech Intern Letter.pdf"
  },
  {
    id: 'narmada',
    role: "Executive Supervisor",
    company: "Narmada Clean Tech",
    type: "Job",
    location: "Ankleshwar, Gujarat",
    date: "Apr 2020 – Jun 2021",
    status: "completed",
    description: "Managed daily operations, supervising staff, and ensuring workflow efficiency in an industrial setting. Focused on operational excellence and team management.",
    skills: ["Supervision", "Operations", "Team Handling", "Industrial Workflow", "Management"],
    logo: "https://www.nctc.co.in/images/logo.png",
    color: "#0056b3",
    gapWeight: 0,
    letter: "/Experience/Narmada Exp Letter.pdf"
  }
];

export default function Internship() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLetter, setShowLetter] = useState<string | null>(null);
  const activeExp = experiences[activeIndex];

  const progressPercentage = useMemo(() => {
    const totalWeight = experiences.reduce((acc, exp) => acc + (exp.gapWeight || 0), 0);
    if (totalWeight === 0) return 0;
    
    let currentWeight = 0;
    for (let i = 0; i < activeIndex; i++) {
      currentWeight += experiences[i].gapWeight || 0;
    }
    return (currentWeight / totalWeight) * 100;
  }, [activeIndex]);

  const handlePrev = () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : experiences.length - 1));
  const handleNext = () => setActiveIndex((prev) => (prev < experiences.length - 1 ? prev + 1 : 0));

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (showLetter) e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [showLetter]);

  return (
    <TooltipProvider delayDuration={100}>
      <section id="internship" className="experience-section section-reveal">
        <h2 className="text-center w-full mb-10 text-3xl font-bold text-primary">Internship & Job</h2>
        
        <div className="mobile-only-exp-nav">
          {experiences.map((exp, index) => (
            <button
              key={exp.id}
              onClick={() => setActiveIndex(index)}
              className={`mobile-nav-item ${index === activeIndex ? 'active' : ''}`}
              suppressHydrationWarning
            >
              <div className="mobile-nav-logo">
                {exp.isCustomLogo ? (
                  <div className="w-full h-full bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-xs">MD</div>
                ) : (
                  <Image src={exp.logo} alt={exp.company} width={32} height={32} />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="career-timeline-container">
          <div className="timeline-nav desktop-only">
            <div className="timeline-line">
              <motion.div 
                className="timeline-progress"
                animate={{ height: `${progressPercentage}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              />
            </div>
            
            <div className="timeline-dots">
              {experiences.map((exp, index) => (
                <React.Fragment key={exp.id}>
                  <div className="dot-wrapper">
                    <button
                      onClick={() => setActiveIndex(index)}
                      className={`timeline-dot-interactive ${index === activeIndex ? 'active' : ''} ${exp.status === 'current' ? 'live' : ''}`}
                      suppressHydrationWarning
                    >
                      <span className="dot-inner"></span>
                    </button>
                    
                    <div className="dot-tooltip">
                      <p className="tooltip-company">{exp.company}</p>
                      <p className="tooltip-role">{exp.role}</p>
                      <p className="tooltip-date">{exp.date}</p>
                    </div>
                  </div>
                  
                  {index < experiences.length - 1 && (
                    <div 
                      className="timeline-gap-indicator" 
                      data-duration={exp.gapToNext}
                      style={{ minHeight: `${exp.gapWeight * 45}px`, flex: exp.gapWeight }}
                    >
                      <div className="gap-dot"></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="experience-display">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeExp.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="experience-focus-card"
              >
                {activeExp.letter && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className="letter-view-btn" 
                        onClick={() => setShowLetter(activeExp.letter)}
                        aria-label="View Experience Letter"
                        suppressHydrationWarning
                      >
                        <FileText size={20} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>View Experience Letter</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                <div className="exp-card-header">
                  <div className="exp-logo-container">
                    {activeExp.isCustomLogo ? (
                      <div className="w-full h-full bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-inner">MD</div>
                    ) : (
                      <Image 
                        src={activeExp.logo} 
                        alt={activeExp.company} 
                        width={80} 
                        height={80} 
                        className="exp-logo"
                      />
                    )}
                    {activeExp.status === 'current' && (
                      <div className="live-badge-container">
                        <span className="live-pulse"></span>
                        Currently Working
                      </div>
                    )}
                  </div>
                  
                  <div className="exp-title-info">
                    <div className="exp-type-row">
                      <span className="exp-type-badge">{activeExp.type}</span>
                      <span className={`exp-status-pill ${activeExp.status === 'current' ? 'current' : 'completed'}`}>
                        {activeExp.status === 'current' ? 'Active' : 'Completed'}
                      </span>
                    </div>
                    <h3 className="exp-role-title">{activeExp.role}</h3>
                    <h4 className="exp-company-name">{activeExp.company}</h4>
                    
                    {activeExp.status === 'current' && (
                      <div className="live-badge-mobile">
                        <span className="live-pulse"></span>
                        <span>Currently Working</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="exp-meta-grid">
                  <div className="exp-meta-item">
                    <Calendar size={18} className="text-primary" />
                    <span>{activeExp.date}</span>
                  </div>
                  <div className="exp-meta-item">
                    <MapPin size={18} className="text-primary" />
                    <span>{activeExp.location}</span>
                  </div>
                </div>

                <div className="exp-description">
                  <div className="desc-header">
                    <Info size={18} />
                    <span>Summary</span>
                  </div>
                  <p>{activeExp.description}</p>
                </div>

                <div className="exp-skills-section">
                  <p className="skills-label">Core Competencies:</p>
                  <div className="skills-tags">
                    {activeExp.skills.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden md:block">
                  <button 
                    className="next-exp-btn" 
                    onClick={handleNext}
                    aria-label="Next Experience"
                    suppressHydrationWarning
                  >
                    Next Experience <ChevronRight size={18} />
                  </button>
                </div>

                <div className="exp-nav-controls">
                  <button className="nav-ctrl-btn" onClick={handlePrev} suppressHydrationWarning>
                    <ChevronLeft size={20} />
                  </button>
                  <div className="nav-indicator">
                    {experiences.map((_, i) => (
                      <div key={i} className={`nav-dot ${i === activeIndex ? 'active' : ''}`} />
                    ))}
                  </div>
                  <button className="nav-ctrl-btn" onClick={handleNext} suppressHydrationWarning>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {showLetter && (
            <div className="letter-modal-overlay" onClick={() => setShowLetter(null)}>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="letter-modal-content"
                onClick={e => e.stopPropagation()}
              >
                <button className="letter-close-btn" onClick={() => setShowLetter(null)} suppressHydrationWarning>
                  <X size={24} />
                </button>
                <div className="letter-image-wrapper">
                  <div className="letter-watermark">
                    <span className="watermark-text">Official Document - Darshan Prajapati</span>
                  </div>
                  <iframe 
                    src={`${showLetter}#toolbar=0`}
                    className="w-full h-full bg-white"
                    style={{ border: 'none', minHeight: '600px' }}
                    title="Experience Letter"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </TooltipProvider>
  );
}