"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Info, ChevronRight } from 'lucide-react';

const experiences = [
  {
    id: 'digiteq',
    role: "Web Developer",
    company: "Digiteq Solution",
    type: "Internship",
    location: "Anklesvar, Gujarat, India",
    date: "Jun 2025 – Present",
    status: "current",
    description: "Developing responsive web applications using the MERN stack. Focused on creating user-centric interfaces and integrating Firebase services for real-time functionality.",
    skills: ["MERN Stack", "Firebase", "React", "UI/UX", "Git"],
    logo: "https://static.wixstatic.com/media/8daa46_6ca56cecc3a143c78f1453d2f2b71293~mv2.png/v1/fill/w_68,h_68,q_85,usm_0.66_1.00_0.01/8daa46_6ca56cecc3a143c78f1453d2f2b71293~mv2.png",
    color: "#4CAF50"
  },
  {
    id: 'jio',
    role: "Digital Repair Specialist Executive",
    company: "Reliance Jio Infocomm limited",
    type: "Job",
    location: "Ahmedabad, Gujarat",
    date: "Sep 2025 – Mar 2026",
    status: "completed",
    description: "Managed end-to-end service operations including CRM, installation scheduling, and technician coordination. Specialized in SAP data management and troubleshooting for Jio AirFiber.",
    skills: ["CRM", "SAP", "Operations", "Customer Handling", "Coordination"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Reliance_Jio_Logo.svg",
    color: "#52489C"
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
    color: "#FF5722"
  }
];

export default function Internship() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeExp = experiences[activeIndex];

  return (
    <section id="internship" className="experience-section section-reveal">
      <h2>Internship & Job</h2>
      
      <div className="career-timeline-container">
        {/* Timeline Navigation */}
        <div className="timeline-nav">
          <div className="timeline-line">
            <motion.div 
              className="timeline-progress"
              animate={{ height: `${(activeIndex / (experiences.length - 1)) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
          
          <div className="timeline-dots">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="dot-wrapper">
                <button
                  onClick={() => setActiveIndex(index)}
                  className={`timeline-dot-interactive ${index === activeIndex ? 'active' : ''} ${exp.status === 'current' ? 'live' : ''}`}
                >
                  <span className="dot-inner"></span>
                </button>
                
                <div className="dot-tooltip">
                  <p className="tooltip-company">{exp.company}</p>
                  <p className="tooltip-role">{exp.role}</p>
                  <p className="tooltip-date">{exp.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Focused Card Display */}
        <div className="experience-display">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeExp.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="experience-focus-card"
            >
              <div className="exp-card-header">
                <div className="exp-logo-container">
                  <Image 
                    src={activeExp.logo} 
                    alt={activeExp.company} 
                    width={80} 
                    height={80} 
                    className="exp-logo"
                    data-ai-hint="company logo"
                  />
                  {activeExp.status === 'current' && (
                    <div className="live-badge-container">
                      <span className="live-pulse"></span>
                      <span className="live-text">Currently Working</span>
                    </div>
                  )}
                </div>
                
                <div className="exp-title-info">
                  <div className="exp-type-row">
                    <span className="exp-type-badge">{activeExp.type}</span>
                    <span className={`exp-status-pill ${activeExp.status}`}>
                      {activeExp.status === 'current' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  <h3 className="exp-role-title">{activeExp.role}</h3>
                  <h4 className="exp-company-name">{activeExp.company}</h4>
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

              {activeIndex < experiences.length - 1 && (
                <button 
                  className="next-exp-btn"
                  onClick={() => setActiveIndex(activeIndex + 1)}
                >
                  Next Experience <ChevronRight size={18} />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
