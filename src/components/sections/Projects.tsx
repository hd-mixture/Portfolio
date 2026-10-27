"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, ExternalLink, Github, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

export type ProjectStatus = 'completed' | 'ongoing' | 'live';

export interface TechStackItem {
  icon: string;
  name: string;
}

export interface ProjectData {
  _id?: string;
  date: string;
  title: string;
  description: string;
  liveLink: string | null;
  codeLink: string | null;
  portfolioLink?: boolean;
  behanceLink?: string;
  iconSrc?: string;
  iconClass?: string;
  timelineIconClass: string;
  status: ProjectStatus;
  techStack: TechStackItem[];
}

export interface DesignItem {
  _id?: string;
  category: string;
  src: string;
  title: string;
}

const FullImageSlider = ({ images, startIndex, onClose }: { images: {src: string, title: string}[], startIndex: number, onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const goToPrev = () => setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    const goToNext = () => setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goToPrev();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [images, onClose, goToPrev, goToNext]);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrev();
        }
        setTouchStart(null);
        setTouchEnd(null);
    };


    return (
        <div 
          className="full-image-modal" 
          style={{display: 'flex'}} 
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
            <div className="full-image-content" onClick={e => e.stopPropagation()}>
                <button className="slider-nav prev-btn" onClick={goToPrev}><ChevronLeft /></button>
                <div className="slider-container">
                    {images.map((img, index) => (
                        <div key={index} className={`slider-item ${index === currentIndex ? 'active' : ''}`} style={{ transform: `translateX(${(index - currentIndex) * 100}%)`}}>
                            <Image src={img.src} alt={img.title} width={1200} height={800} style={{ objectFit: 'contain' }} data-ai-hint="graphic design" />
                            <div className="image-caption">{img.title}</div>
                        </div>
                    ))}
                </div>
                <button className="slider-nav next-btn" onClick={goToNext}><ChevronRight /></button>
                <button className="close-full-image" onClick={onClose} aria-label="Close full view"><X /></button>
            </div>
        </div>
    );
};

const DesignGalleryModal = ({ onClose }: { onClose: () => void }) => {
    const [category, setCategory] = useState('all');
    const [allDesigns, setAllDesigns] = useState<DesignItem[]>([]);
    const [images, setImages] = useState<DesignItem[]>([]);
    const [fullImage, setFullImage] = useState<{images: {src: string, title: string}[], index: number} | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/designs`)
            .then(res => res.json())
            .then(data => {
                setAllDesigns(data);
                setImages(data);
                const uniqueCategories = Array.from(new Set(data.map((item: DesignItem) => item.category))) as string[];
                setCategories(uniqueCategories);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleFilter = (cat: string) => {
        setCategory(cat);
        if (cat === 'all') {
            setImages(allDesigns);
        } else {
            setImages(allDesigns.filter(d => d.category === cat));
        }
    };
    
    return (
        <>
            <div className="design-modal" style={{display: 'block'}}>
                <div className="design-modal-content">
                    <button className="design-modal-close" onClick={onClose} aria-label="Close gallery"><X /></button>
                    <div className="design-categories">
                        <button className={`category-btn ${category === 'all' ? 'active' : ''}`} onClick={() => handleFilter('all')}>All</button>
                        {categories.map(cat => (
                            <button key={cat} className={`category-btn ${category === cat ? 'active' : ''}`} onClick={() => handleFilter(cat)}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="design-gallery-container">
                      <div className="design-gallery">
                          {loading ? <p>Loading designs...</p> : images.map((design, index) => (
                              <div key={index} className="design-item" onClick={() => setFullImage({images: images, index: index})}>
                                  <Image src={design.src} alt={design.title} width={400} height={300} data-ai-hint="graphic design"/>
                                  <div className="design-item-overlay"><h4>{design.title}</h4></div>
                              </div>
                          ))}
                      </div>
                    </div>
                </div>
            </div>
            {fullImage && <FullImageSlider images={fullImage.images} startIndex={fullImage.index} onClose={() => setFullImage(null)} />}
        </>
    );
};



const getBrandColor = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('react')) return { light: '#3b82f6', dark: '#60a5fa' };
    if (lowerName.includes('node')) return { light: '#22c55e', dark: '#4ade80' };
    if (lowerName.includes('express')) return { light: '#475569', dark: '#94a3b8' };
    if (lowerName.includes('mongo')) return { light: '#16a34a', dark: '#4ade80' };
    if (lowerName.includes('firebase')) return { light: '#f59e0b', dark: '#fbbf24' };
    if (lowerName.includes('tailwind')) return { light: '#0ea5e9', dark: '#38bdf8' };
    if (lowerName.includes('next')) return { light: '#000000', dark: '#ffffff' };
    if (lowerName.includes('typescript')) return { light: '#2563eb', dark: '#60a5fa' };
    if (lowerName.includes('javascript')) return { light: '#eab308', dark: '#fde047' };
    if (lowerName.includes('python')) return { light: '#3b82f6', dark: '#60a5fa' };
    if (lowerName.includes('html')) return { light: '#ea580c', dark: '#fb923c' };
    if (lowerName.includes('css')) return { light: '#2563eb', dark: '#60a5fa' };
    return { light: '#6C63FF', dark: '#818cf8' };
};

const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

const PremiumProjectCard = ({ project, index, openDesignModal, activeIndex, setActiveIndex }: { project: ProjectData, index: number, openDesignModal: any, activeIndex: number | null, setActiveIndex: (i: number) => void }) => {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { margin: "-40% 0px -40% 0px" });
    const side = index % 2 === 0 ? 'right' : 'left';
    
    useEffect(() => {
        if (isInView) {
            setActiveIndex(index);
        }
    }, [isInView, index, setActiveIndex]);

    const isActive = activeIndex === index;
    const isPrev = activeIndex !== null && index === activeIndex - 1;
    const isNext = activeIndex !== null && index === activeIndex + 1;

    const nodeTranslateY = isPrev ? 4 : isNext ? -4 : 0;
    
    const containerVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.7, 
                ease: "easeOut",
                staggerChildren: 0.1,
                delayChildren: 0.3
            } 
        }
    };

    const getAutomaticIcon = (project: ProjectData) => {
        const titleStr = project.title?.toLowerCase() || '';
        const descStr = project.description?.toLowerCase() || '';
        const techStr = project.techStack?.map(t => t.name.toLowerCase()).join(' ') || '';
        const fullStr = `${titleStr} ${descStr} ${techStr}`;

        if (fullStr.includes('e-commerce') || fullStr.includes('shop') || fullStr.includes('cart') || fullStr.includes('store')) return 'fa-solid fa-cart-shopping';
        if (fullStr.includes('dashboard') || fullStr.includes('admin') || fullStr.includes('analytics')) return 'fa-solid fa-chart-line';
        if (fullStr.includes('portfolio') || fullStr.includes('personal website') || fullStr.includes('resume')) return 'fa-solid fa-user-tie';
        if (fullStr.includes('blog') || fullStr.includes('article') || fullStr.includes('content')) return 'fa-solid fa-blog';
        if (fullStr.includes('social') || fullStr.includes('chat') || fullStr.includes('messaging') || fullStr.includes('connect')) return 'fa-solid fa-comments';
        if (fullStr.includes('mobile') || fullStr.includes('app') || fullStr.includes('android') || fullStr.includes('ios')) return 'fa-solid fa-mobile-screen-button';
        if (fullStr.includes('game') || fullStr.includes('gaming') || fullStr.includes('play')) return 'fa-solid fa-gamepad';
        if (fullStr.includes('ai') || fullStr.includes('machine learning') || fullStr.includes('bot') || fullStr.includes('artificial intelligence')) return 'fa-solid fa-robot';
        if (fullStr.includes('design') || fullStr.includes('ui/ux') || fullStr.includes('figma')) return 'fa-solid fa-pen-nib';
        
        return 'fa-solid fa-code'; // default fallback
    };

    const renderIcon = (proj: ProjectData) => {
        // Use explicitly defined icons first
        if (proj.timelineIconClass && proj.timelineIconClass !== 'fa-solid fa-code') {
            return <i className={proj.timelineIconClass}></i>;
        }
        if (proj.iconClass && proj.iconClass !== 'fa-solid fa-code') {
            return <i className={proj.iconClass}></i>;
        }
        
        // Use automatic detection logic
        return <i className={getAutomaticIcon(proj)}></i>;
    };

    const parts = project.description.split('. ');
    const subtitle = parts.length > 1 ? parts[0] + '.' : 'Development Project';
    const descBody = parts.length > 1 ? parts.slice(1).join('. ') : project.description;

    return (
        <div className={`premium-timeline-row ${side} ${isActive ? 'magnetic-active' : ''} ${isPrev ? 'magnetic-prev' : ''} ${isNext ? 'magnetic-next' : ''}`}>
            {/* Left/Right Card Area */}
            <div className="premium-timeline-col content-col">
                <motion.div 
                    ref={cardRef}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.1, margin: "-10%" }}
                    whileHover={{ y: -10, rotateX: 2, rotateY: -2, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                    style={{ perspective: 1000 }}
                    className={`premium-project-card new-style ${isActive ? 'focused' : 'unfocused'} ${side === 'left' ? 'flipped' : ''}`}
                >
                    {project.iconSrc && (
                        <div className="project-corner-logo">
                            <img src={project.iconSrc} alt={`${project.title} logo`} />
                        </div>
                    )}
                    <div className="card-top-badges">
                        {index === 0 && <div className="featured-badge"><i className="fa-solid fa-star"></i></div>}
                        <div className={`status-badge ${project.status}`}>
                            <span className="status-dot"></span>
                            {project.status === 'live' || project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                        </div>
                    </div>

                    <div className="card-content-split">
                        {project.liveLink ? (
                            <div className="card-browser-preview">
                                <div className="browser-header">
                                    <div className="mac-dots"><span></span><span></span><span></span></div>
                                    <div className="address-bar"><i className="fa-solid fa-lock"></i> {project.title.toLowerCase().replace(/\s/g, '')}.com</div>
                                </div>
                                <div className="browser-content">
                                    <iframe src={project.liveLink} className="live-preview-iframe" tabIndex={-1} scrolling="no" />
                                </div>
                            </div>
                        ) : (
                            <div className="card-browser-preview internal-mode">
                                <div className="browser-header">
                                    <div className="mac-dots"><span></span><span></span><span></span></div>
                                    <div className="address-bar"><i className="fa-solid fa-lock"></i> internal-project.local</div>
                                </div>
                                <div className="browser-content internal-content">
                                    <div className="glass-lock-container">
                                        <div className="glass-lock-icon">
                                            <i className="fa-solid fa-laptop-code"></i>
                                        </div>
                                        <h4 className="glass-lock-title">Preview Coming Soon</h4>
                                        <p className="glass-lock-desc">The deployment environment is currently being configured. Please check back later.</p>
                                    </div>
                                    <div className="glass-ambient-blob blob-1"></div>
                                    <div className="glass-ambient-blob blob-2"></div>
                                </div>
                            </div>
                        )}
                        
                        <div className="card-project-info">
                            <div className="info-main">
                                <h3>{project.title}</h3>
                                <h4>{subtitle}</h4>
                                <p className="description">{descBody}</p>
                            </div>
                            
                            <div className="info-divider"></div>
                            
                            {project.techStack && project.techStack.length > 0 && (
                                <motion.div 
                                    className="tech-stack-badges"
                                    animate={isActive ? "visible" : "hidden"}
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
                                    }}
                                >
                                    {project.techStack.map((tech: TechStackItem, i: number) => {
                                        const color = getBrandColor(tech.name);
                                        const rgbLight = hexToRgb(color.light);
                                        const rgbDark = hexToRgb(color.dark);
                                        return (
                                            <motion.div 
                                                key={i} 
                                                className="tech-badge" 
                                                data-tooltip={tech.name}
                                                variants={{
                                                    hidden: { opacity: 0, y: 15 },
                                                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
                                                }}
                                                style={{
                                                    '--badge-color-light': color.light,
                                                    '--badge-color-dark': color.dark,
                                                    '--badge-bg-light': `rgba(${rgbLight}, 0.08)`,
                                                    '--badge-bg-dark': `rgba(${rgbDark}, 0.15)`,
                                                    '--badge-border-light': `rgba(${rgbLight}, 0.2)`,
                                                    '--badge-border-dark': `rgba(${rgbDark}, 0.3)`
                                                } as React.CSSProperties}
                                            >
                                                <i className={tech.icon} style={{ flexShrink: 0 }}></i> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tech.name}</span>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}

                            <motion.div 
                                className="card-actions"
                                animate={isActive ? "visible" : "hidden"}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
                                }}
                            >
                                <div className="primary-actions">
                                    <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } } }}>
                                        {project.liveLink ? (
                                            <Link href={project.liveLink} className="premium-btn primary" target="_blank" rel="noopener noreferrer">
                                                <i className="fa-solid fa-globe"></i> <span>Live Demo</span>
                                                <ArrowRight size={16} className="btn-arrow" />
                                            </Link>
                                        ) : (
                                            <span className="premium-btn primary disabled" style={{ cursor: 'not-allowed', opacity: 0.5 }}>
                                                <i className="fa-solid fa-globe"></i> <span>Live Demo</span>
                                            </span>
                                        )}
                                    </motion.div>
                                    <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } } }}>
                                        {project.codeLink ? (
                                            <Link href={project.codeLink} className="premium-btn secondary-btn" target="_blank" rel="noopener noreferrer">
                                                <i className="fa-brands fa-github"></i> <span>GitHub</span>
                                            </Link>
                                        ) : (
                                            <span className="premium-btn secondary-btn disabled" style={{ cursor: 'not-allowed', opacity: 0.5 }}>
                                                <i className="fa-brands fa-github"></i> <span>GitHub</span>
                                            </span>
                                        )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            {/* Center Node Area */}
            <div className="premium-timeline-col center-col">
                <div className="timeline-connector"></div>
                <div className={`premium-timeline-node ${isActive ? 'active' : 'idle'} group relative`}>
                    <div className="node-glass-ring"></div>
                    
                    {isActive && (
                        <>
                            <div className="magnetic-field-glow"></div>
                            <div className="magnetic-particles">
                                <div className="particle p1"></div>
                                <div className="particle p2"></div>
                                <div className="particle p3"></div>
                            </div>
                        </>
                    )}

                    {project.status === 'live' && (
                        <>
                            <div className="live-ripple-1"></div>
                            <div className="live-ripple-2"></div>
                        </>
                    )}
                    
                    <div className="node-white-circle">
                        {renderIcon(project)}
                    </div>
                    
                    {/* Hover Tooltip for Date */}
                    <div className={`date-tooltip ${side === 'left' ? 'right' : 'left'}`}>
                        <div className="tooltip-arrow"></div>
                        <i className="fa-regular fa-calendar mr-1"></i> {project.date}
                    </div>
                </div>
            </div>

            {/* Empty space for alternating layout */}
            <div className="premium-timeline-col empty-col"></div>
        </div>
    );
};

const AnimatedCounter = ({ value, suffix = "+", kFormat = false }: { value: number, suffix?: string, kFormat?: boolean }) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef<HTMLSpanElement>(null);
    const inView = useInView(nodeRef, { once: false, amount: "all" });

    useEffect(() => {
        if (inView) {
            let start = 0;
            const duration = 2000;
            const startTime = performance.now();
            
            const updateCounter = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                setCount(Math.floor(easeProgress * value));
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    setCount(value);
                }
            };
            requestAnimationFrame(updateCounter);
        }
    }, [inView, value]);

    return <span ref={nodeRef} className="stat-val">{count}{kFormat ? 'K' : ''}{suffix}</span>;
};

export default function Projects() {
    const [showDesignModal, setShowDesignModal] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    const timelineRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`)
            .then(res => res.json())
            .then(data => {
                setProjectsData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching projects:", err);
                setLoading(false);
            });
    }, []);

    const openDesignModal = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowDesignModal(true);
    }
    
    const sortedProjects = [...projectsData].sort((a, b) => {
        const getSortableDate = (dateStr: string) => {
            const datePart = dateStr.split(' - ')[0];
            if (datePart.toLowerCase().includes('ongoing') || datePart.toLowerCase().includes('present')) {
                return new Date(8640000000000000); 
            }
            return new Date(datePart);
        };
        const dateA = getSortableDate(a.date);
        const dateB = getSortableDate(b.date);
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <>
            <section id="projects" className="premium-projects-section">
                {/* Background elements */}
                <div className="premium-bg-elements">
                    <div className="bg-blob blob-1"></div>
                    <div className="bg-blob blob-2"></div>
                    <div className="bg-particles"></div>
                    <div className="bg-dotted-pattern"></div>
                </div>

                <div className="projects-container">
                    <div className="premium-projects-header-wrapper" style={{ textAlign: 'left', marginBottom: '80px', maxWidth: '600px' }}>
                        <div className="skills-title-wrapper">
                            <span className="skills-title-line"></span>
                            <h2>Projects</h2>
                        </div>
                        <p className="skills-desc">
                            A timeline of projects that reflect my<br/>skills, creativity and passion for<br/>building digital experiences.
                        </p>
                        <div className="skills-header-underline"></div>
                    </div>

                    {loading ? (
                        <div className="loading-state">Loading premium experience...</div>
                    ) : (
                        <div className="premium-timeline-container" ref={timelineRef}>
                            <div className="timeline-line-background"></div>
                            <motion.div 
                                className="timeline-line-foreground"
                                style={{ scaleY, x: "-50%", transformOrigin: "top" }}
                            >
                                {/* Animated Particle inside foreground line */}
                                <div className="timeline-particle"></div>
                            </motion.div>

                            <div className="timeline-rows">
                                {sortedProjects.map((project, index) => (
                                    <PremiumProjectCard 
                                        key={index} 
                                        project={project} 
                                        index={index} 
                                        openDesignModal={openDesignModal} 
                                        activeIndex={activeIndex}
                                        setActiveIndex={setActiveIndex}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Bottom Statistics Card */}
                    {!loading && (
                        <div className="journey-stats-container">
                            <div className="journey-stats-card">
                                <div className="j-stat-item">
                                    <div className="stat-icon purple"><i className="fa-solid fa-rocket"></i></div>
                                    <div className="stat-info">
                                        <AnimatedCounter value={sortedProjects.length} suffix="+" />
                                        <span className="stat-label">Projects Completed</span>
                                    </div>
                                </div>
                                <div className="j-stat-divider"></div>
                                <div className="j-stat-item">
                                    <div className="stat-icon green"><i className="fa-solid fa-code"></i></div>
                                    <div className="stat-info">
                                        <AnimatedCounter value={15} suffix="+" kFormat />
                                        <span className="stat-label">Lines of Code</span>
                                    </div>
                                </div>
                                <div className="j-stat-divider"></div>
                                <div className="j-stat-item">
                                    <div className="stat-icon orange"><i className="fa-solid fa-layer-group"></i></div>
                                    <div className="stat-info">
                                        <AnimatedCounter value={new Set(projectsData.flatMap(p => p.techStack.map(t => t.name))).size} suffix="+" />
                                        <span className="stat-label">Technologies Used</span>
                                    </div>
                                </div>
                                <div className="j-stat-divider"></div>
                                <div className="j-stat-item">
                                    <div className="stat-icon blue"><i className="fa-solid fa-trophy"></i></div>
                                    <div className="stat-info">
                                        <AnimatedCounter value={100} suffix="%" />
                                        <span className="stat-label">Dedication</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            {showDesignModal && <DesignGalleryModal onClose={() => setShowDesignModal(false)} />}
        </>
    );
}
