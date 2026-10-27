"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useSpring, AnimatePresence, useInView, useTransform } from 'framer-motion';
import { Calendar, MapPin, Info, FileText, X, MoreVertical, Briefcase, Star, Code, Server, Trophy, Loader2 } from 'lucide-react';



const getTechIcon = (tech: string) => {
    const t = tech.toLowerCase();
    if (t.includes('react')) return 'fa-brands fa-react';
    if (t.includes('node') || t.includes('mern')) return 'fa-brands fa-node-js';
    if (t.includes('firebase')) return 'fa-solid fa-fire';
    if (t.includes('mongo')) return 'fa-solid fa-leaf';
    if (t.includes('js') || t.includes('javascript')) return 'fa-brands fa-js';
    if (t.includes('ui') || t.includes('ux') || t.includes('design')) return 'fa-solid fa-pen-nib';
    if (t.includes('git')) return 'fa-brands fa-git-alt';
    if (t.includes('java')) return 'fa-brands fa-java';
    if (t.includes('xml')) return 'fa-solid fa-code';
    if (t.includes('sql')) return 'fa-solid fa-database';
    if (t.includes('crm') || t.includes('sap')) return 'fa-solid fa-server';
    if (t.includes('support') || t.includes('customer')) return 'fa-solid fa-headset';
    if (t.includes('manage') || t.includes('operation')) return 'fa-solid fa-users-cog';
    if (t.includes('electric') || t.includes('repair')) return 'fa-solid fa-bolt';
    return 'fa-solid fa-check-circle';
};

const getTechColor = (tech: string) => {
    const t = tech.toLowerCase();
    if (t.includes('react')) return { c: '#61DAFB', b: 'rgba(97,218,251,0.2)' };
    if (t.includes('node') || t.includes('mern')) return { c: '#68A063', b: 'rgba(104,160,99,0.2)' };
    if (t.includes('firebase')) return { c: '#FFCA28', b: 'rgba(255,202,40,0.2)' };
    if (t.includes('mongo')) return { c: '#4DB33D', b: 'rgba(77,179,61,0.2)' };
    if (t.includes('ui') || t.includes('ux')) return { c: '#E040FB', b: 'rgba(224,64,251,0.2)' };
    if (t.includes('git')) return { c: '#F1502F', b: 'rgba(241,80,47,0.2)' };
    if (t.includes('java')) return { c: '#F89820', b: 'rgba(248,152,32,0.2)' };
    if (t.includes('sql')) return { c: '#00758F', b: 'rgba(0,117,143,0.2)' };
    if (t.includes('crm') || t.includes('sap')) return { c: '#0081C6', b: 'rgba(0,129,198,0.2)' };
    if (t.includes('support')) return { c: '#4C51BF', b: 'rgba(76,81,191,0.2)' };
    return { c: '#6C63FF', b: 'rgba(108,99,255,0.2)' };
};

const AnimatedCounter = ({ value, suffix = "+" }: { value: number, suffix?: string }) => {
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

    return <span ref={nodeRef} className="stat-val">{count}{suffix}</span>;
};

const getLatestDate = (dateStr: string) => {
    if (!dateStr) return 0;
    if (dateStr.toLowerCase().includes('present')) return Infinity;
    
    let maxTime = 0;
    const subDates = dateStr.split(' & ');
    subDates.forEach(sub => {
        const parts = sub.split(/[-–]/).map(s => s.trim());
        // If it's a range "Start - End", check the End date.
        // If it's a single date "Date", check that date.
        const end = parts.length >= 2 ? parts[1] : parts[0];
        
        if (end && end.toLowerCase() !== 'present') {
            const d = new Date(end + " 1");
            if (!isNaN(d.getTime())) {
                maxTime = Math.max(maxTime, d.getTime());
            }
        }
    });
    return maxTime;
};

const getEarliestStartDate = (dateStr: string) => {
    if (!dateStr) return 0;
    let minTime = Infinity;
    const subDates = dateStr.split(' & ');
    subDates.forEach(sub => {
        const parts = sub.split(/[-–]/).map(s => s.trim());
        if (parts.length >= 1) {
            const start = parts[0];
            if (start && start.toLowerCase() !== 'present') {
                const d = new Date(start + " 1");
                if (!isNaN(d.getTime())) {
                    minTime = Math.min(minTime, d.getTime());
                }
            }
        }
    });
    return minTime === Infinity ? 0 : minTime;
};

const calculateTotalMonths = (exps: any[]) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let total = 0;
    exps.forEach(exp => {
        if (!exp.date) return;
        const subDates = exp.date.split(' & ');
        subDates.forEach((subDate: string) => {
            const parts = subDate.split(/[-–]/).map(s => s.trim());
            if (parts.length === 2) {
                const startParts = parts[0].split(" ");
                const endParts = parts[1].split(" ");
                
                if (startParts.length === 2) {
                    const startM = monthNames.indexOf(startParts[0]);
                    const startY = parseInt(startParts[1]);
                    let endM, endY;
                    
                    if (parts[1].toLowerCase() === "present") {
                        const now = new Date();
                        endM = now.getMonth();
                        endY = now.getFullYear();
                    } else if (endParts.length === 2) {
                        endM = monthNames.indexOf(endParts[0]);
                        endY = parseInt(endParts[1]);
                    }
                    
                    if (startM !== -1 && endM !== undefined && !isNaN(startY) && !isNaN(endY!)) {
                        const diff = (endY - startY) * 12 + (endM - startM);
                        total += Math.max(1, diff);
                    }
                }
            }
        });
    });
    return total;
};

export default function Internship() {
    const [experiences, setExperiences] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/internships`)
            .then(res => res.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.warn("Expected array from /api/internships, received:", data);
                    setExperiences([]);
                    setIsLoading(false);
                    return;
                }

                // Auto-Sort
                const sorted = data.sort((a: any, b: any) => {
                    const latestA = getLatestDate(a.date);
                    const latestB = getLatestDate(b.date);
                    return latestB - latestA;
                });

                // Calculate gaps
                const processed = sorted.map((exp: any, i: number, arr: any[]) => {
                    if (i === arr.length - 1) return exp;
                    
                    const nextJob = arr[i + 1];
                    const gapStart = getLatestDate(nextJob.date); 
                    const gapEnd = getEarliestStartDate(exp.date);
                    
                    if (gapStart > 0 && gapEnd > 0 && gapStart !== Infinity && gapEnd !== Infinity) {
                        const diffMonths = Math.round((gapEnd - gapStart) / (1000 * 60 * 60 * 24 * 30.44));
                        if (diffMonths <= 1) {
                            exp.computedGap = 'Sequential Transition';
                        } else if (diffMonths < 12) {
                            exp.computedGap = `${diffMonths} Months Gap`;
                        } else {
                            exp.computedGap = `${(diffMonths / 12).toFixed(1)} Years Gap`;
                        }
                    }
                    return exp;
                });

                setExperiences(processed);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);
    const [showLetter, setShowLetter] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isFocused, setIsFocused] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"] 
    });

    const mapping = React.useMemo(() => {
        const inputs = [];
        const outputs = [];
        const n = experiences.length;
        
        if (n > 1) {
            for (let i = 0; i <= n; i++) {
                inputs.push(i / n);
                if (i < n) {
                    outputs.push(i / (n - 1));
                } else {
                    outputs.push(1);
                }
            }
        } else {
            inputs.push(0, 1);
            outputs.push(1, 1);
        }
        return { inputs, outputs };
    }, [experiences.length]);

    const rawScaleY = useTransform(scrollYProgress, mapping.inputs, mapping.outputs);

    const scaleY = useSpring(rawScaleY, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (experiences.length === 0) return;
        const unsubscribe = scrollYProgress.on("change", (v) => {
            let newIndex = Math.floor(v * experiences.length);
            if (newIndex >= experiences.length) newIndex = experiences.length - 1;
            setActiveIndex(newIndex);
        });
        return () => unsubscribe();
    }, [scrollYProgress, experiences]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showLetter) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };
    }, [showLetter]);

    // Track window focus for anti-snipping security
    useEffect(() => {
        const onFocus = () => setIsFocused(true);
        const onBlur = () => setIsFocused(false);
        
        window.addEventListener('focus', onFocus);
        window.addEventListener('blur', onBlur);
        
        return () => {
            window.removeEventListener('focus', onFocus);
            window.removeEventListener('blur', onBlur);
        };
    }, []);

    const handleNodeClick = (index: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const containerTop = rect.top + scrollTop;
            // Scroll to the exact position representing this index
            // The scroll range is (experiences.length * window.innerHeight) minus 1 window.innerHeight for the sticky container itself
            // Each section is essentially 100vh of scrolling
            const targetScroll = containerTop + (index * window.innerHeight * 1.8);
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
    };

    const activeExp = experiences.length > 0 ? experiences[activeIndex] : null;
    
    // Dynamic Stats Calculations
    const totalExperiences = experiences.length;
    const totalMonths = calculateTotalMonths(experiences);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f] flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
        );
    }

    if (experiences.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f] flex items-center justify-center">
                <p className="text-slate-500">No experiences found.</p>
            </div>
        );
    }
    const uniqueSkills = new Set(experiences.flatMap(exp => exp.skills));
    const totalTechnologies = uniqueSkills.size;

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.96 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275], staggerChildren: 0.08 }
        },
        exit: { opacity: 0, y: -40, scale: 0.96, transition: { duration: 0.3 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
    };

    return (
        <section id="internship" className="journey-section">
            
            <div className="journey-header">
                <div className="journey-badge">
                    <Star size={14} className="badge-icon" /> <span>My Professional Journey</span>
                </div>
                <h2>Internship & <span className="gradient-text">Job Experience</span></h2>
                <p className="journey-desc">
                    A journey through internships, professional roles and experiences<br/>that shaped my skills and career.
                </p>
                <div className="skills-header-underline" style={{ margin: "20px auto 0 auto" }}></div>
            </div>

            <div className="journey-scroll-container" ref={containerRef} style={{ height: experiences.length > 1 ? `${experiences.length * 180}vh` : '100vh' }}>
                
                <div className="journey-sticky-viewport">
                    
                    <div className="journey-bg-elements">
                        <div className="j-blob blob-1"></div>
                        <div className="j-blob blob-2"></div>
                    </div>

                    <div className="journey-split-layout">
                        
                        {/* LEFT SIDE: Timeline & Logo */}
                        <div className="journey-left-col">
                            <div className="timeline-track">
                                <div className="timeline-bg"></div>
                                <motion.div className="timeline-fg" style={{ scaleY: experiences.length === 1 ? 1 : scaleY, x: "-50%", transformOrigin: "top" }} />
                                
                                {experiences.map((exp, idx) => {
                                    let label = exp.computedGap === 'Sequential Transition' ? 'CONCURRENT' : 'PAST';
                                    let labelClass = exp.status === 'current' ? 'present' : label.toLowerCase();
                                    
                                    // Handle logic based on number of internships
                                    const topPercent = experiences.length === 1 
                                        ? 50 
                                        : (idx / (experiences.length - 1)) * 100;
                                    
                                    const topPosition = `${topPercent}%`;
                                    
                                    let middlePosition = '';
                                    if (idx < experiences.length - 1) {
                                        const nextPercent = experiences.length === 1 ? 50 : ((idx + 1) / (experiences.length - 1)) * 100;
                                        middlePosition = `${(topPercent + nextPercent) / 2}%`;
                                    }
                                    
                                    const isActive = idx === activeIndex;
                                    const isHovered = hoveredIndex === idx;
                                    
                                    return (
                                        <React.Fragment key={exp.id || exp._id || idx}>
                                            <div 
                                                className={`timeline-node-item ${isActive ? 'active' : ''}`} 
                                                style={{ top: topPosition }} 
                                                onMouseEnter={() => setHoveredIndex(idx)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                                onClick={() => handleNodeClick(idx)}
                                            >
                                                <div className={`timeline-label ${labelClass}`}>
                                                    {exp.status === 'current' ? (
                                                        <span className="live-indicator-wrapper">
                                                            <span className="live-dot"></span> PRESENT
                                                        </span>
                                                    ) : label}
                                                </div>
                                                <div className="timeline-node-circle">
                                                    <div className="node-glow"></div>
                                                    <div className="node-icon">
                                                        {exp.type === 'Internship' ? <Code size={16} /> : <Briefcase size={16} />}
                                                    </div>
                                                    <div className="node-ripple"></div>
                                                </div>

                                                {/* Preview Tooltip */}
                                                <AnimatePresence>
                                                    {isHovered && !isActive && (
                                                        <motion.div 
                                                            className="node-preview-tooltip"
                                                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                                            exit={{ opacity: 0, x: 10, scale: 0.95 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <div className="preview-header">
                                                                <div className="preview-status">
                                                                    <span className={`pulse-dot ${exp.status === 'current' ? 'green' : 'gray'}`}></span>
                                                                    {exp.company}
                                                                </div>
                                                                <span className="preview-type">{exp.type}</span>
                                                            </div>
                                                            <div className="preview-role">{exp.role}</div>
                                                            <div className="preview-date"><Calendar size={12}/> {exp.date}</div>
                                                            <div className="preview-skills">
                                                                {exp.skills.slice(0, 2).map((skill: string, i: number) => (
                                                                    <span key={i} className="preview-chip">
                                                                        <i className={getTechIcon(skill)} style={{ color: getTechColor(skill).c }}></i> {skill}
                                                                    </span>
                                                                ))}
                                                                {exp.skills.length > 2 && <span className="preview-chip more">+{exp.skills.length - 2}</span>}
                                                            </div>
                                                            <div className="preview-action">Click to view <i className="fa-solid fa-arrow-right"></i></div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            
                                            {/* Computed Gap Indicator - Full Segment Hover Area */}
                                            {exp.computedGap && idx < experiences.length - 1 && exp.computedGap !== 'Sequential Transition' && (
                                                <div 
                                                    className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center cursor-pointer group" 
                                                    style={{ 
                                                        top: topPosition, 
                                                        height: `${experiences.length > 1 ? (((idx + 1) / (experiences.length - 1)) * 100 - topPercent) : 0}%`,
                                                        width: '60px' // Wide enough to catch mouse hover easily
                                                    }}
                                                >
                                                    {/* Expanded Circular Design (Hover State) */}
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75px] h-[75px] rounded-full bg-[#1c1c1c] border-2 border-[#333] flex flex-col items-center justify-center opacity-0 scale-50 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-2xl overflow-hidden backdrop-blur-xl">
                                                        {exp.computedGap.split(' ').map((word: string, i: number) => (
                                                            <span key={i} className={`font-black uppercase tracking-widest leading-tight ${i === 0 ? 'text-[14px] text-emerald-400' : 'text-[9px] text-slate-400'}`}>
                                                                {word}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            <div className="company-logo-morph">
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={activeExp.id}
                                        initial={{ opacity: 0, scale: 0.8, rotate: -15, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, scale: 0.8, rotate: 15, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.5, type: "spring" }}
                                        className="large-morph-logo"
                                    >
                                        {activeExp.isCustomLogo ? 
                                            <div className="jc-custom-logo large">MD</div> :
                                            <img src={activeExp.logo} alt={activeExp.company} />
                                        }
                                        <div className="logo-halo"></div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                        
                        {/* RIGHT SIDE: Pinned Experience Card */}
                        <div className="journey-right-col">
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    className="journey-sticky-card"
                                    key={activeExp.id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <div className="jc-header">
                                        <motion.div variants={itemVariants} className="jc-role-tags">
                                            <span className="jc-tag type">{activeExp.type}</span>
                                            <span className={`jc-tag status ${activeExp.status === 'current' ? 'active' : 'completed'}`}>
                                                {activeExp.status === 'current' ? 'Active' : 'Completed'}
                                            </span>
                                        </motion.div>
                                        
                                        <div className="jc-actions">
                                            {activeExp.letter && (
                                                <motion.button variants={itemVariants} className="jc-view-btn" onClick={() => setShowLetter(activeExp.letter)}>
                                                    <FileText size={16} /> <span>View Certificate</span>
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>

                                    <motion.h3 variants={itemVariants} className="jc-title">{activeExp.role}</motion.h3>
                                    
                                    {activeExp.companyUrl ? (
                                        <motion.a variants={itemVariants} href={activeExp.companyUrl} target="_blank" rel="noopener noreferrer" className="jc-company" onClick={e => e.stopPropagation()}>
                                            {activeExp.company} <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-xs"></i>
                                        </motion.a>
                                    ) : (
                                        <motion.div variants={itemVariants} className="jc-company" style={{ cursor: 'default' }}>
                                            {activeExp.company}
                                        </motion.div>
                                    )}
                                    
                                    <motion.div variants={itemVariants} className="jc-info-strip">
                                        <div className="jc-info-item">
                                            <Calendar size={14} className="j-info-icon" /> <span>{activeExp.date}</span>
                                        </div>
                                        <div className="jc-info-item">
                                            <MapPin size={14} className="j-info-icon" /> <span>{activeExp.location}</span>
                                        </div>
                                        <div className="jc-info-item">
                                            <Briefcase size={14} className="j-info-icon" /> <span>{activeExp.type}</span>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div variants={itemVariants} className="jc-summary">
                                        <p>{activeExp.description}</p>
                                    </motion.div>
                                    
                                    <motion.div variants={itemVariants} className="jc-skills">
                                        <div className="jc-chips">
                                            {activeExp.skills.map((skill: string, i: number) => {
                                                const tc = getTechColor(skill);
                                                return (
                                                    <div key={i} className="tech-chip" style={{ '--chip-color': tc.c, '--chip-bg': tc.b } as any}>
                                                        <i className={getTechIcon(skill)} style={{ color: tc.c }}></i>
                                                        <span>{skill}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <div className="journey-stats-container">
                <div className="journey-stats-card">
                    <div className="j-stat-item">
                        <div className="stat-icon purple"><Briefcase size={28} /></div>
                        <div className="stat-info">
                            <AnimatedCounter value={totalExperiences} suffix="+" />
                            <span className="stat-label">Experiences</span>
                        </div>
                    </div>
                    <div className="j-stat-divider"></div>
                    <div className="j-stat-item">
                        <div className="stat-icon green"><Calendar size={28} /></div>
                        <div className="stat-info">
                            <AnimatedCounter value={totalMonths} suffix="+" />
                            <span className="stat-label">Months</span>
                        </div>
                    </div>
                    <div className="j-stat-divider"></div>
                    <div className="j-stat-item">
                        <div className="stat-icon orange"><Server size={28} /></div>
                        <div className="stat-info">
                            <AnimatedCounter value={totalTechnologies} suffix="+" />
                            <span className="stat-label">Technologies</span>
                        </div>
                    </div>
                    <div className="j-stat-divider"></div>
                    <div className="j-stat-item">
                        <div className="stat-icon blue"><Trophy size={28} /></div>
                        <div className="stat-info">
                            <AnimatedCounter value={100} suffix="%" />
                            <span className="stat-label">Dedication</span>
                        </div>
                    </div>
                </div>
            <div className="end-journey-msg">
                <Star size={16} /> <span>The Journey Continues...</span>
            </div>
        </div>

        {typeof document !== 'undefined' && createPortal(
            <AnimatePresence>
                {showLetter && (
                    <div 
                        className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md secure-viewer-modal"
                        data-lenis-prevent="true"
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <style>{`
                            @media print {
                                body {
                                    display: none !important;
                                }
                            }
                            .secure-viewer-modal {
                                user-select: none;
                                -webkit-user-select: none;
                            }
                        `}</style>
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-[#111111] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col ring-1 ring-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Polished Header */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md z-20 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm">
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base leading-tight tracking-tight">Experience Certificate</h3>
                                        <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">Verified Document • Darshan Prajapati</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-500/20 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 flex items-center justify-center transition-colors shadow-sm"
                                        onClick={() => setShowLetter(null)}
                                        aria-label="Close Viewer"
                                    >
                                        <X size={16} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>

                            {/* Viewer Body (Hidden Scrollbar but Scrollable) */}
                            <div className="flex-1 w-full bg-[#f8f9fa] dark:bg-[#050505] relative flex flex-col p-2 md:p-6 overflow-hidden">
                                {/* Subtle Background Watermark */}
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-[0.02] dark:opacity-[0.015] select-none overflow-hidden">
                                    <span className="text-6xl md:text-8xl font-black rotate-[-30deg] whitespace-nowrap tracking-[0.2em] uppercase">HD MIXTURE</span>
                                </div>
                                
                                {/* Document Container - Crops out the native scrollbar */}
                                <div className="w-full max-w-4xl mx-auto flex-1 rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden relative z-10 bg-white">
                                    
                                    {/* Security Blur Overlay (Triggers when window loses focus e.g. Snipping Tool) */}
                                    {!isFocused && (
                                        <div className="absolute inset-0 bg-[#0a0a0a] z-[9999] flex items-center justify-center backdrop-blur-xl">
                                            <div className="text-white text-center p-6 flex flex-col items-center">
                                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-5 border border-red-500/20">
                                                    <Info size={28} />
                                                </div>
                                                <h3 className="font-bold text-xl md:text-2xl mb-2 tracking-tight">Security Lock Enabled</h3>
                                                <p className="text-gray-400 text-sm md:text-base max-w-sm">
                                                    Screenshots and background capturing are restricted to protect this official document. Please return focus to the window.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Foreground Heavy Watermark */}
                                    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden flex flex-wrap gap-x-8 gap-y-16 p-8 opacity-[0.06] dark:opacity-[0.04] select-none justify-center items-center mix-blend-difference">
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <div key={i} className="text-2xl md:text-3xl font-black rotate-[-35deg] text-black dark:text-white whitespace-nowrap tracking-widest">
                                                DARSHAN PRAJAPATI
                                            </div>
                                        ))}
                                    </div>

                                    {/* Make inner wrapper wider to push scrollbar off screen right */}
                                    <div style={{ width: 'calc(100% + 22px)', height: '100%' }} className="bg-white">
                                        <iframe 
                                            src={`${showLetter}#toolbar=0&navpanes=0&view=FitH`}
                                            className="w-full h-full"
                                            style={{ border: 'none' }}
                                            title="Experience Certificate Viewer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>,
            document.body
        )}
    </section>
);
}
