"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function DesignerFooter() {
  const currentYear = new Date().getFullYear();

  const toolPairs = [
    [
        { name: "Photoshop", icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg" },
        { name: "After Effects", icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg" }
    ],
    [
        { name: "Illustrator", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg" },
        { name: "Premiere Pro", icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg" }
    ],
    [
        { name: "Figma", icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
        { name: "Lightroom", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg" }
    ],
    [
        { name: "Blender", icon: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg" },
        { name: "CorelDraw", icon: "https://cdn.simpleicons.org/coreldraw/19448E" }
    ],
    [
        { name: "Canva", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg" },
        { name: "Sketch", icon: "https://cdn.simpleicons.org/sketch/F7B500" }
    ]
  ];

  const [activeIndices, setActiveIndices] = useState([0, 0, 0, 0, 0]);
  const hoveredIndexRef = useRef<number | null>(null);

  useEffect(() => {
      // Symmetrical pair pattern: Outermost, Inner, Center
      const pattern = [[0, 4], [1, 3], [2]];
      let tick = 0;
      
      const interval = setInterval(() => {
          const slotsToUpdate = pattern[tick % pattern.length];
          
          setActiveIndices(prev => {
              const next = [...prev];
              slotsToUpdate.forEach(slot => {
                  // Only update if not hovered
                  if (hoveredIndexRef.current !== slot) {
                      next[slot] = next[slot] === 0 ? 1 : 0;
                  }
              });
              return next;
          });
          
          tick++;
      }, 1500); // Every 1.5 seconds, the next group changes

      return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-[#FAFAFC] dark:bg-[#121212] py-8 md:py-12 px-2 md:px-4 lg:px-6 flex justify-center items-center overflow-hidden">
      
      {/* Main Container - Exact match to reference image rounded rectangle */}
      <div className="w-full max-w-[1800px] bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-gray-800 relative flex flex-col xl:flex-row items-stretch overflow-hidden min-h-[320px]">
        
        {/* Left Edge Graphic (Cup & Splashes) */}
        <div className="absolute -left-16 bottom-0 top-0 w-[30%] pointer-events-none z-0 hidden xl:block opacity-100 -translate-y-4">
            <div className="absolute top-1/4 -left-10 w-[300px] h-[300px] bg-pink-500/20 blur-[70px] rounded-full mix-blend-multiply dark:mix-blend-screen z-[-1]"></div>
            <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-orange-400/20 blur-[60px] rounded-full mix-blend-multiply dark:mix-blend-screen z-[-1]"></div>
            <div className="absolute top-1/2 left-32 w-[200px] h-[200px] bg-purple-500/15 blur-[60px] rounded-full mix-blend-multiply dark:mix-blend-screen z-[-1]"></div>
            <Image 
              src="/Designer/Footer/colorful_splashes.png" 
              alt="Art Supplies" 
              fill 
              className="object-contain object-left-bottom scale-[1.05]" 
            />
        </div>

        {/* --- LEFT SECTION: Typography --- */}
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full xl:w-1/2 pt-12 xl:pt-8 pb-10 px-8 xl:pl-[20%] xl:pr-12 relative">
          
          <div className="font-['Brittany_Signature',_cursive] text-4xl md:text-[3.25rem] font-medium mb-0 py-4 leading-relaxed bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent transform -rotate-2">
            Thanks for Exploring
          </div>
          <h2 className="text-4xl md:text-[3.25rem] font-extrabold text-[#0D1530] dark:text-white mb-6 tracking-tight leading-tight">
            My Creative World
          </h2>
          <div className="flex flex-col space-y-1.5 text-gray-600 dark:text-gray-400 font-medium text-lg tracking-wide">
            <p>Creating brands.</p>
            <p>Designing experiences.</p>
            <p>Telling stories.</p>
          </div>

        </div>

        {/* --- VERTICAL DIVIDER --- */}
        <div className="hidden xl:flex items-center justify-center z-10 py-10">
          <div className="w-px h-full min-h-[200px] bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="xl:hidden w-[80%] mx-auto h-px bg-gray-200 dark:bg-gray-700 z-10"></div>

        {/* --- RIGHT SECTION: Icons & Tools --- */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 w-full xl:w-1/2 pt-8 pb-16 px-8 xl:pr-[20%] xl:pl-12 gap-8">
          
          {/* Let's Connect Row */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-pink-600 dark:text-pink-500 font-bold mb-5 text-sm md:text-base tracking-wide">Let's Connect</h3>
            <div className="flex items-center justify-center w-full relative">
              {[
                { icon: 'fa-behance', label: 'Behance', link: 'https://behance.net' },
                { icon: 'fa-dribbble', label: 'Dribbble', link: 'https://dribbble.com' },
                { icon: 'fa-instagram', label: 'Instagram', link: 'https://instagram.com' },
                { icon: 'fa-linkedin-in', label: 'LinkedIn', link: 'https://linkedin.com' },
                { isContact: true, icon: 'fa-paper-plane', label: 'Contact', link: '#contact' },
              ].map((social, idx, arr) => (
                <React.Fragment key={idx}>
                  <motion.a
                    href={social.link}
                    target={social.isContact ? "_self" : "_blank"}
                    rel={social.isContact ? "" : "noopener noreferrer"}
                    whileHover={{ y: -3 }}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer px-3 md:px-5"
                  >
                    <div className="flex items-center justify-center transition-transform">
                      <i className={`${social.isContact ? 'fa-regular' : 'fa-brands'} ${social.icon} text-2xl md:text-3xl text-gray-800 dark:text-gray-200 group-hover:text-pink-500 transition-colors`}></i>
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-pink-500 transition-colors">{social.label}</span>
                  </motion.a>
                  {idx < arr.length - 1 && <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Featured Tools Row */}
          <div className="flex flex-col items-center w-full">
            <h3 className="text-pink-600 dark:text-pink-500 font-bold mb-5 text-sm md:text-base tracking-wide">Featured Tools</h3>
            <div className="flex items-center justify-center gap-3 md:gap-4 w-full h-16">
              {toolPairs.map((pair, idx) => (
                  <ToolSlot 
                    key={idx} 
                    tools={pair} 
                    activeIndex={activeIndices[idx]}
                    onHoverChange={(isHovered) => {
                        if (isHovered) hoveredIndexRef.current = idx;
                        else if (hoveredIndexRef.current === idx) hoveredIndexRef.current = null;
                    }}
                  />
              ))}
            </div>
          </div>

        </div>

        {/* Right Edge Graphic (Watercolor Tray) */}
        <div className="absolute -right-8 bottom-0 top-0 w-[25%] pointer-events-none z-0 hidden xl:block opacity-100 -translate-y-8">
           <div className="absolute bottom-5 -right-5 w-[250px] h-[250px] bg-pink-500/20 blur-[60px] rounded-full mix-blend-multiply dark:mix-blend-screen z-[-1]"></div>
           <div className="absolute top-10 right-10 w-[200px] h-[200px] bg-blue-500/15 blur-[60px] rounded-full mix-blend-multiply dark:mix-blend-screen z-[-1]"></div>
           <Image 
             src="/Designer/Footer/palette_brush.png" 
             alt="Watercolor Palette" 
             fill 
             className="object-contain object-right-bottom scale-[1.05]" 
           />
        </div>

        {/* Copyright Text (Centered at the absolute bottom of the container) */}
        <div className="absolute bottom-4 left-0 w-full text-center text-gray-500 dark:text-gray-400 text-sm font-medium z-10">
          &copy; {currentYear} HD_Mixture Studio • All Rights Reserved
        </div>

      </div>
    </footer>
  );
}

const ToolSlot = ({ tools, activeIndex, onHoverChange }: { tools: any[], activeIndex: number, onHoverChange: (isHovered: boolean) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const activeTool = tools[activeIndex];

  return (
      <div 
          className="relative flex items-center justify-center"
          onMouseEnter={() => { setIsHovered(true); onHoverChange(true); }}
          onMouseLeave={() => { setIsHovered(false); onHoverChange(false); }}
      >
          {/* Custom Tooltip */}
          <AnimatePresence>
              {isHovered && (
                  <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.9 }}
                      className="absolute -top-12 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none"
                  >
                      {activeTool.name}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45"></div>
                  </motion.div>
              )}
          </AnimatePresence>

          <motion.div
              whileHover={{ y: -5, scale: 1.05 }}
              className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.3)] border border-gray-50 dark:border-gray-700 z-20 cursor-pointer overflow-hidden relative"
          >
              <AnimatePresence mode="wait">
                  <motion.img
                      key={activeTool.name}
                      src={activeTool.icon}
                      alt={activeTool.name}
                      initial={{ opacity: 0, filter: 'blur(5px)', scale: 0.8 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                      exit={{ opacity: 0, filter: 'blur(5px)', scale: 1.2 }}
                      transition={{ duration: 0.4 }}
                      className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] object-contain absolute"
                  />
              </AnimatePresence>
          </motion.div>
      </div>
  );
};
