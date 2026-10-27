"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DesignerStatsTestimonial from './DesignerStatsTestimonial';

export default function DesignerFeaturedWork() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [dbDesigns, setDbDesigns] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/designs`)
      .then(res => res.json())
      .then(data => setDbDesigns(data))
      .catch(err => console.error(err));
  }, []);

  const baseProjects = [
    {
      title: "LOGO DESIGN",
      category: "Brand Identity",
      image: "/Designer/Graphic Designs/LOGO DESIGN.png",
      bgClass: "bg-gray-100",
      images: []
    },
    {
      title: "POSTER DESIGN",
      category: "Print Design",
      image: "/Designer/Graphic Designs/POSTER DESIGN.png",
      bgClass: "bg-orange-100",
      images: []
    },
    {
      title: "WEB UI DESIGN",
      category: "Web UI/UX",
      image: "/Designer/Graphic Designs/WEB UI DESIGN.png",
      bgClass: "bg-blue-50",
      images: []
    },
    {
      title: "APP UI DESIGN",
      category: "Mobile UI/UX",
      image: "/Designer/Graphic Designs/APP UI DESIGN.png",
      bgClass: "bg-amber-50",
      images: []
    },
    {
      title: "BANNER DESIGN",
      category: "Digital Advertising",
      image: "/Designer/Graphic Designs/BANNER DESIGN.png",
      bgClass: "bg-indigo-900",
      images: []
    }
  ];

  const projects = baseProjects.map(p => ({
    ...p,
    images: dbDesigns.filter(d => d.category === p.title).map(d => d.src)
  }));

  const handleOpenGallery = (project: any) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const handleCloseGallery = () => {
    setSelectedProject(null);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
    }
  };

  const handleOpenMasterGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    const allImages = projects.flatMap(p => p.images);
    setSelectedProject({
      title: "ALL FEATURED WORKS",
      images: allImages
    });
    setCurrentImageIndex(0);
  };

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedProject(null);
        } else if (e.key === 'ArrowRight') {
          setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
        } else if (e.key === 'ArrowLeft') {
          setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [selectedProject]);

  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Smooth spread as the user scrolls through the sticky section
  const spreadProgress = useTransform(scrollYProgress, [0.08, 0.75], [0, 1]);
  const textOpacity = useTransform(spreadProgress, [0, 0.25], [1, 0]);
  const cardRotateY = useTransform(spreadProgress, [0, 1], [-45, 0]);
  const cardScale = useTransform(spreadProgress, [0, 1], [1, 1.35]);
  const cardTranslateY = useTransform(spreadProgress, [0, 1], [0, -12]); // Slight lift on spread

  const cardLefts = [
    useTransform(spreadProgress, [0, 1], [0 * 28, 56 + (0 - 2) * 175]),
    useTransform(spreadProgress, [0, 1], [1 * 28, 56 + (1 - 2) * 175]),
    useTransform(spreadProgress, [0, 1], [2 * 28, 56 + (2 - 2) * 175]),
    useTransform(spreadProgress, [0, 1], [3 * 28, 56 + (3 - 2) * 175]),
    useTransform(spreadProgress, [0, 1], [4 * 28, 56 + (4 - 2) * 175]),
  ];

  const cardTranslateZs = [
    useTransform(spreadProgress, [0, 1], [-0 * 10, 0]),
    useTransform(spreadProgress, [0, 1], [-1 * 10, 0]),
    useTransform(spreadProgress, [0, 1], [-2 * 10, 0]),
    useTransform(spreadProgress, [0, 1], [-3 * 10, 0]),
    useTransform(spreadProgress, [0, 1], [-4 * 10, 0]),
  ];

  return (
    <section id="work" ref={sectionRef} className="relative h-auto lg:h-[230vh] py-0">
      <div className="relative lg:sticky lg:top-24 pt-4 pb-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-50 dark:border-[#333] flex flex-col justify-between h-full w-full mx-auto relative"
            >
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Featured Work</h2>
          </div>
          <Link href="/portfolio" className="group flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-50 dark:bg-[#222] px-4 py-2 rounded-full border border-gray-100 dark:border-white/5">
            View All Works
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Desktop 3D Cards Container (lg and up) */}
        <div className="hidden lg:flex w-full justify-center gap-8 xl:gap-12 items-center h-[210px] xl:h-[230px] relative my-3" style={{ perspective: '3000px' }}>
            
            {/* Left Text (Right Aligned) */}
            <motion.div style={{ opacity: textOpacity }} className="w-[150px] xl:w-[180px] z-10 shrink-0 text-right translate-x-4 xl:translate-x-6 pointer-events-none">
                <h3 className="text-xl xl:text-3xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-2">
                    Create <br/> Impact<span className="text-pink-500">.</span>
                </h3>
                <p className="text-slate-500 dark:text-gray-400 font-medium text-[9px] xl:text-[10px] leading-relaxed ml-auto">
                    Explore our featured design<br/>
                    projects across different<br/>
                    categories.
                </p>
            </motion.div>

            {/* Cards */}
            <div className="flex items-center justify-center relative w-[180px] xl:w-[220px] h-full" style={{ transformStyle: 'preserve-3d' }}>
                {projects.map((project, idx) => {
                    const zIndex = 50 - idx; 
                    return (
                        <motion.div
                            key={idx}
                            onClick={() => handleOpenGallery(project)}
                            className="w-[100px] xl:w-[110px] aspect-[1/1.45] rounded-[1rem] group cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col shrink-0 absolute backdrop-blur-md bg-white/20 dark:bg-black/20 border-[1.5px] border-white/60 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),_inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),_inset_0_2px_4px_rgba(255,255,255,0.2),_inset_0_-2px_4px_rgba(0,0,0,0.3)] p-1.5"
                            style={{
                                left: cardLefts[idx],
                                zIndex: zIndex,
                                rotateY: cardRotateY,
                                rotateX: 0,
                                rotateZ: 0,
                                z: cardTranslateZs[idx],
                                y: cardTranslateY,
                                scale: cardScale,
                                transformOrigin: 'center center'
                            }}
                        >
                            {/* Glass Reflection Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 dark:via-white/5 pointer-events-none z-20 mix-blend-overlay rounded-[1rem]"></div>

                            {/* Card Image */}
                            <div className={`relative w-full h-[60%] rounded-t-[10px] rounded-b-[4px] overflow-hidden ${project.bgClass}`}>
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("${project.image}")` }}></div>
                            </div>
                            
                            {/* Card Content */}
                            <div className="px-1 pt-2 pb-1 flex flex-col justify-between flex-1 relative z-10 border-t border-white/40 dark:border-white/10 mt-1.5">
                                <div>
                                    <h4 className="font-extrabold text-gray-900 dark:text-white text-[7px] xl:text-[8px] mb-0.5 uppercase tracking-wide leading-tight truncate drop-shadow-sm">{project.title}</h4>
                                    <p className="text-gray-500 dark:text-gray-300 text-[6px] xl:text-[7px] truncate font-medium">{project.category}</p>
                                </div>
                                
                                <div className="w-7 h-3.5 mt-1.5 rounded-full border-[0.5px] border-white/50 dark:border-white/20 bg-white dark:bg-white/90 flex items-center justify-center text-slate-800 transition-all shadow-[0_2px_6px_rgba(0,0,0,0.06),_inset_0_1px_2px_rgba(255,255,255,1)] group-hover:scale-105 group-hover:shadow-[0_4px_10px_rgba(0,0,0,0.1),_inset_0_1px_2px_rgba(255,255,255,1)]">
                                    <ArrowRight className="w-2.5 h-2.5" strokeWidth={2.5} />
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Right Text (Left Aligned) */}
            <motion.div style={{ opacity: textOpacity }} className="w-[150px] xl:w-[180px] z-10 shrink-0 text-left -translate-x-4 xl:-translate-x-6 pointer-events-none">
                <h3 className="text-lg xl:text-xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-2">
                    Design <br/> Beyond <br/> Limits<span className="text-pink-500">.</span>
                </h3>
                <p className="text-slate-500 dark:text-gray-400 font-medium text-[9px] xl:text-[10px] leading-relaxed">
                    Crafted with creativity.<br/>
                    Delivered with purpose.<br/>
                    Made to inspire.
                </p>
            </motion.div>
        </div>

        {/* Mobile / Tablet Scrollable Row (hidden on lg and up) */}
        <div className="lg:hidden flex overflow-x-auto pb-4 pt-2 gap-4 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 md:-mx-8 md:px-8">
            {projects.map((project, idx) => (
                <motion.div 
                    key={idx}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenGallery(project)}
                    className="min-w-[160px] aspect-[1/1.7] rounded-[1.25rem] group cursor-pointer flex flex-col snap-center shrink-0 relative backdrop-blur-md bg-white/20 dark:bg-black/20 border-[1.5px] border-white/60 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),_inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),_inset_0_2px_4px_rgba(255,255,255,0.2),_inset_0_-2px_4px_rgba(0,0,0,0.3)] p-2"
                >
                    {/* Glass Reflection Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 dark:via-white/5 pointer-events-none z-20 mix-blend-overlay rounded-[1.25rem]"></div>

                    {/* Image */}
                    <div className={`relative w-full h-[58%] rounded-t-[14px] rounded-b-[6px] overflow-hidden ${project.bgClass}`}>
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${project.image}")` }}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="px-2 pt-3 pb-2 flex flex-col justify-between flex-1 relative z-10 border-t border-white/40 dark:border-white/10 mt-2">
                        <div>
                            <h4 className="font-extrabold text-gray-900 dark:text-white text-[13px] mb-1 uppercase tracking-wide drop-shadow-sm">{project.title}</h4>
                            <p className="text-gray-500 dark:text-gray-300 text-[11px] font-medium">{project.category}</p>
                        </div>
                        <div className="w-12 h-6 rounded-full border-[0.5px] border-white/50 dark:border-white/20 bg-white dark:bg-white/90 flex items-center justify-center text-slate-800 mt-2 shadow-[0_2px_6px_rgba(0,0,0,0.06),_inset_0_1px_2px_rgba(255,255,255,1)] group-hover:scale-105 transition-transform">
                            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Bottom CTA Area to fill space */}
        <div className="mt-4">
          <div className="bg-gray-50 dark:bg-[#222] rounded-[1.25rem] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-100 dark:border-white/5 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-4 z-10">
              <div className="relative shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 dark:bg-pink-500/20 rounded-full flex items-center justify-center text-pink-500 shadow-inner">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-0.5">Available for new projects</h4>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">Let's create something visually stunning together.</p>
              </div>
            </div>
            
            <Link href="#contact" className="group z-10 shrink-0 px-6 py-2.5 md:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-xl shadow-gray-900/10 dark:shadow-white/10 flex items-center gap-2">
              Hire Me 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

      </motion.div>
          </div>
          <div className="xl:col-span-1">
            <DesignerStatsTestimonial />
          </div>
        </div>
      </div>

      {/* Lightbox Gallery Modal using Portal to escape stacking contexts */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
              style={{ zIndex: 9999999 }}
              onClick={handleCloseGallery}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-50"
                onClick={handleCloseGallery}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Gallery Content */}
              <div className="relative w-full max-w-6xl h-full max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                
                {/* Prev Button */}
                <button 
                  className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-50"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Main Image */}
                <div className="relative w-full h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Image 
                        src={selectedProject.images[currentImageIndex]} 
                        alt={`${selectedProject.title} ${currentImageIndex + 1}`}
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Next Button */}
                <button 
                  className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-50"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Counter & Title */}
                <div className="absolute -bottom-12 left-0 right-0 flex justify-between items-center text-white/70">
                  <h3 className="font-medium tracking-wider">{selectedProject.title}</h3>
                  <p>{currentImageIndex + 1} / {selectedProject.images.length}</p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
