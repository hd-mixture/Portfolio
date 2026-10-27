"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenTool, FileText, MonitorPlay, Image as ImageIcon, Layout, Scissors } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function DesignerAboutServices() {
  const [aboutData, setAboutData] = useState({
    description: "I'm a passionate Graphic Designer with a love for clean design, bold ideas and creative storytelling. I help brands stand out with unique visuals, strong identities and impactful designs that connect.",
    services: [
      {
        title: "Brand Identity",
        desc: "Logos, Guidelines, Brand Identity Design",
        iconName: "PenTool"
      },
      {
        title: "Print Design",
        desc: "Brochures, Flyers, Posters, Business Cards",
        iconName: "FileText"
      },
      {
        title: "Social Media Design",
        desc: "Creatives, Banners, Posts, Ads",
        iconName: "Layout"
      },
      {
        title: "UI / Visual Design",
        desc: "Web Banners, UI Elements, Presentation Design",
        iconName: "MonitorPlay"
      },
      {
        title: "Illustration",
        desc: "Vector Art, Icons, Custom Illustrations",
        iconName: "ImageIcon"
      },
      {
        title: "Photo Editing",
        desc: "Retouching, Color Grading, Manipulation",
        iconName: "Scissors"
      }
    ]
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/about?persona=designer`)
      .then(res => res.json())
      .then(data => {
        if (data && data.services) {
          setAboutData({
            description: data.description || aboutData.description,
            services: data.services.length > 0 ? data.services : aboutData.services
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const renderIcon = (iconName: string) => {
    // Dynamically render icon or fallback
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Layout;
    return <IconComponent className="w-6 h-6 text-pink-500" />;
  };

  return (
    <section id="about" className="relative py-12 px-4 md:px-8 max-w-[1400px] mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-50 dark:border-[#333] flex flex-col lg:flex-row gap-12"
      >
        
        {/* Left Column: About Me */}
        <div className="lg:w-1/3 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Me</h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8 whitespace-pre-wrap">
            {aboutData.description}
          </p>
          
          <div className="mt-auto">
            <div className="font-['Outfit'] italic text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 opacity-80"
                 style={{ fontFamily: "'Clicker Script', cursive" /* Fallback to a cursive feel */ }}>
              Darshan Prajapati
            </div>
          </div>
        </div>

        {/* Vertical Divider (Desktop) */}
        <div className="hidden lg:block w-px bg-gray-100 dark:bg-gray-800 self-stretch"></div>

        {/* Right Column: What I Do */}
        <div className="lg:w-2/3 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What I Do</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {aboutData.services.map((service, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="flex items-start gap-4 group cursor-pointer"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center transition-colors group-hover:bg-pink-100 dark:group-hover:bg-pink-900/50">
                  {renderIcon(service.iconName)}
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-bold mb-1">{service.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>
    </section>
  );
}
