"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, Github, Linkedin, Mail, FileText, Users } from 'lucide-react';
import Link from 'next/link';
import { usePersona } from './PersonaContext';
import DesignerFooter from './designer/DesignerFooter';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);
  const pathname = usePathname();
  const { persona } = usePersona();
  const isDesigner = persona === 'designer';

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  if (isDesigner) {
    return <DesignerFooter />;
  }

  return (
    <footer className="ft-section">
       {/* Background Effects */}
       <div className="ft-bg-radial"></div>
       <div className="ft-cube ft-cube-1"></div>
       <div className="ft-cube ft-cube-2"></div>
       <div className="ft-cube ft-cube-3"></div>
       <div className="ft-cube ft-cube-4"></div>
       <div className="ft-wave ft-wave-left"></div>
       <div className="ft-wave ft-wave-right"></div>
       
       <motion.div 
         initial={{ opacity: 0, y: 40 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
         viewport={{ once: true, amount: 0 }}
         className="ft-glass-container"
       >
         {/* Header Area */}
         <h2 className="ft-heading">
           Let's Build Something <span className="ft-heading-highlight">Amazing</span><br />Together
         </h2>
         
         <p className="ft-subtitle">
           I'd love to hear about your next project.
         </p>
         
         <div className="ft-divider"></div>
         
         {/* Apple Dock Navigation */}
         <div className="ft-dock">
            <a href="#contact" className="ft-dock-item primary">
              <div className="ft-dock-icon"><Send size={16} /></div>
              <span>Contact Me</span>
            </a>
            
            <div className="ft-dock-divider"></div>
            
            <Link href="https://github.com" target="_blank" className="ft-dock-item">
              <div className="ft-dock-icon"><Github size={18} /></div>
              <span>GitHub</span>
            </Link>
            
            <div className="ft-dock-divider"></div>
            
            <Link href="https://linkedin.com" target="_blank" className="ft-dock-item">
              <div className="ft-dock-icon"><Linkedin size={18} /></div>
              <span>LinkedIn</span>
            </Link>
            
            <div className="ft-dock-divider"></div>
            
            <a href="mailto:hello@example.com" className="ft-dock-item">
              <div className="ft-dock-icon"><Mail size={18} /></div>
              <span>Email</span>
            </a>
            
            <div className="ft-dock-divider"></div>
            
            <a href="#" className="ft-dock-item">
              <div className="ft-dock-icon"><FileText size={18} /></div>
              <span>Resume</span>
            </a>
         </div>
         
         {/* Footer Bottom */}
         <div className="ft-bottom">
           &copy; {year || "2026"} HD_Mixture • All Rights Reserved
         </div>
       </motion.div>
    </footer>
  );
}
