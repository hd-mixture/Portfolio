"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { initialTestimonials } from './Testimonials';
import { getHackathonDateAndDurationDisplay } from '@/lib/hackathonUtils';

const AnimatedCounter = ({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) => {
    const [count, setCount] = useState("0");
    const nodeRef = useRef<HTMLSpanElement>(null);
    const inView = useInView(nodeRef, { once: true, amount: "some" });
    const isFloat = !Number.isInteger(value);

    useEffect(() => {
        if (inView) {
            const duration = 2000;
            const startTime = performance.now();
            
            const updateCounter = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                
                const currentVal = easeProgress * value;
                setCount(isFloat ? currentVal.toFixed(1) : Math.floor(currentVal).toString());
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    setCount(isFloat ? value.toFixed(1) : value.toString());
                }
            };
            requestAnimationFrame(updateCounter);
        }
    }, [inView, value, isFloat]);

    return <span ref={nodeRef}>{prefix}{count}{suffix}</span>;
};

export const getYearsOfExperience = () => {
    const startYear = 2022;
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
}

const masteredTechs = [
    { name: 'React', icon: <i className="fa-brands fa-react" style={{color: '#61DAFB'}}></i> },
    { name: 'JavaScript', icon: <i className="fa-brands fa-js" style={{color: '#F7DF1E'}}></i> },
    { name: 'Node.js', icon: <i className="fa-brands fa-node-js" style={{color: '#339933'}}></i> },
    { name: 'Tailwind', icon: <i className="fa-solid fa-wind" style={{color: '#06B6D4'}}></i> },
    { name: 'MongoDB', icon: <i className="fa-solid fa-database" style={{color: '#47A248'}}></i> },
    { name: 'Figma', icon: <i className="fa-brands fa-figma" style={{color: '#F24E1E'}}></i> },
    { name: 'Photoshop', icon: <i className="fa-solid fa-image" style={{color: '#31A8FF'}}></i> },
    { name: 'Illustrator', icon: <i className="fa-solid fa-pen-nib" style={{color: '#FF9A00'}}></i> },
    { name: 'CorelDraw', icon: <i className="fa-solid fa-vector-square" style={{color: '#1AAB5A'}}></i> },
    { name: 'Canva', icon: <i className="fa-solid fa-palette" style={{color: '#00C4CC'}}></i> },
    { name: 'HTML5', icon: <i className="fa-brands fa-html5" style={{color: '#E34F26'}}></i> },
    { name: 'CSS3', icon: <i className="fa-brands fa-css3-alt" style={{color: '#1572B6'}}></i> },
    { name: 'Sass', icon: <i className="fa-brands fa-sass" style={{color: '#CC6699'}}></i> },
    { name: 'Next.js', icon: <i className="fa-solid fa-bolt" style={{color: 'var(--foreground)'}}></i> },
    { name: 'Git', icon: <i className="fa-brands fa-git-alt" style={{color: '#F05032'}}></i> },
    { name: 'Express.js', icon: <i className="fa-solid fa-server" style={{color: 'var(--foreground)'}}></i> },
    { name: 'Postman', icon: <i className="fa-solid fa-rocket" style={{color: '#FF6C37'}}></i> },
    { name: 'Firebase', icon: <i className="fa-solid fa-fire" style={{color: '#FFCA28'}}></i> },
    { name: 'VS Code', icon: <i className="fa-solid fa-code" style={{color: '#007ACC'}}></i> },
    { name: 'NPM', icon: <i className="fa-brands fa-npm" style={{color: '#CB3837'}}></i> }
];

// We will fetch certificates from backend now, but keep this as a fallback type reference
const fallbackCertificatesList: any[] = [];

export default function Achievements() {
    const [projectsCount, setProjectsCount] = useState(0);
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [showAllTech, setShowAllTech] = useState(false);
    const [showAllCerts, setShowAllCerts] = useState(false);
    const [fetchedCertificates, setFetchedCertificates] = useState<any[]>([]);
    const [totalCertificatesCount, setTotalCertificatesCount] = useState(0);
    const [hackathonsCount, setHackathonsCount] = useState(0);
    const [certOffset, setCertOffset] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    
    // Hackathon states
    const [fetchedHackathons, setFetchedHackathons] = useState<any[]>([]);
    const [showHackathonsModal, setShowHackathonsModal] = useState(false);
    const [selectedWinningHackathonIndex, setSelectedWinningHackathonIndex] = useState(0);
    const [showWinningOnly, setShowWinningOnly] = useState(true);

    // Prevent background scrolling when modals are open
    useEffect(() => {
        if (showHackathonsModal || selectedCertificate) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [showHackathonsModal, selectedCertificate]);

    // Keyboard navigation for hackathons modal
    useEffect(() => {
        if (!showHackathonsModal) return;

        const winningItems = fetchedHackathons.filter((h: any) => h.isWinner);
        const activeList = (showWinningOnly && winningItems.length > 0) ? winningItems : fetchedHackathons;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowHackathonsModal(false);
            } else if (e.key === 'ArrowLeft') {
                setSelectedWinningHackathonIndex(prev => Math.max(0, prev - 1));
            } else if (e.key === 'ArrowRight') {
                setSelectedWinningHackathonIndex(prev => Math.min(Math.max(0, activeList.length - 1), prev + 1));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showHackathonsModal, showWinningOnly, fetchedHackathons]);

    useEffect(() => {
        setMounted(true);
        // Fetch projects count
        const fetchProjectsCount = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setProjectsCount(data.length);
                    } else {
                        setProjectsCount(0);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch projects count", error);
            }
        };
        fetchProjectsCount();
        
        // Fetch live testimonials for accurate count and avatars
        const fetchTestimonials = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setTestimonials(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch testimonials for achievements", error);
            }
        };
        fetchTestimonials();
        
        // Fetch Achievements
        const fetchAchievements = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/achievements`);
                if (res.ok) {
                    const data = await res.json();
                    
                    // Hackathons
                    const hackathons = data.filter((a: any) => a.category === 'Hackathon');
                    const sortedHackathons = [...hackathons].sort((a: any, b: any) => {
                        if (a.isWinner && !b.isWinner) return -1;
                        if (!a.isWinner && b.isWinner) return 1;
                        return (a.order || 0) - (b.order || 0);
                    });
                    setHackathonsCount(sortedHackathons.length > 0 ? sortedHackathons.length : 10);
                    setFetchedHackathons(sortedHackathons);
                    
                    // Certificates
                    const certs = data.filter((a: any) => a.category === 'Certificate');
                    setTotalCertificatesCount(certs.length);
                    
                    // Group by organization
                    const grouped: Record<string, any> = {};
                    certs.forEach((c: any) => {
                        if (!grouped[c.organization]) {
                            grouped[c.organization] = {
                                name: c.organization,
                                img: c.image,
                                count: 0,
                                invert: c.organization === 'OPSWAT Academy', // Special case for invert
                                link: c.link || ''
                            };
                        } else if (c.link && !grouped[c.organization].link) {
                            grouped[c.organization].link = c.link;
                        }
                        grouped[c.organization].count += 1;
                    });
                    
                    if (Object.keys(grouped).length > 0) {
                        setFetchedCertificates(Object.values(grouped));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch achievements", error);
            }
        };
        fetchAchievements();
    }, []);
  
  const visibleTechCount = 15;
  const visibleTechs = showAllTech ? masteredTechs : masteredTechs.slice(0, visibleTechCount);
  const hiddenCount = masteredTechs.length - visibleTechCount;

  const visibleCertCount = 6;
  const activeCertList = fetchedCertificates.length > 0 ? fetchedCertificates : fallbackCertificatesList;
  
  // Auto cycling logic for certificates
  useEffect(() => {
      if (activeCertList.length > visibleCertCount && !showAllCerts && !isHovered) {
          const interval = setInterval(() => {
              setCertOffset(prev => (prev + 1) % activeCertList.length);
          }, 4000);
          return () => clearInterval(interval);
      }
  }, [activeCertList.length, showAllCerts, isHovered]);

  // Compute visible certs with wrap-around
  let visibleCerts = [];
  if (showAllCerts || activeCertList.length <= visibleCertCount) {
      visibleCerts = activeCertList;
  } else {
      for (let i = 0; i < visibleCertCount; i++) {
          visibleCerts.push(activeCertList[(certOffset + i) % activeCertList.length]);
      }
  }

  const [githubMetrics, setGithubMetrics] = useState({
    contributions: 1.2,
    loc: 5,
    commits: 120,
    repos: 18
  });

  useEffect(() => {
    fetch('https://api.github.com/users/hd-mixture/repos?per_page=100')
      .then(res => res.json())
      .then(repos => {
        if (Array.isArray(repos)) {
          let totalSize = 0;
          repos.forEach(repo => {
            totalSize += repo.size;
          });
          
          const locK = (totalSize * 20 / 1000).toFixed(1);
          const estimatedCommits = repos.length * 12 + Math.floor(totalSize / 50);
          const estimatedContributions = (repos.length * 35 + estimatedCommits) / 1000;
          
          setGithubMetrics({
            contributions: parseFloat(estimatedContributions.toFixed(1)) || 1.2,
            loc: parseFloat(locK) || 5,
            commits: estimatedCommits || 120,
            repos: repos.length || 18
          });
        }
      })
      .catch(err => console.error('Failed to fetch github stats', err));
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`)
      .then(res => res.json())
      .then(data => {
          if (data && data.length > 0) {
              setProjectsCount(data.length);
          }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <motion.section 
        id="achievements" 
        className="achievements-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1, margin: "-50px" }}
        variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
    >
        {/* Background Decorations */}
        <div className="ach-bg-blob blob-1"></div>
        <div className="ach-bg-blob blob-2"></div>
        <div className="ach-particles"></div>

        <div className="achievements-header">
            <div className="achievements-badge">
                <i className="fa-solid fa-trophy"></i> My Achievements
            </div>
            <h2>Achieve<span>ments</span></h2>
            <p>A collection of milestones, accomplishments & impact<br/>that define my journey.</p>
            <div className="skills-header-underline" style={{ margin: "20px auto 0 auto" }}></div>
        </div>

        <motion.div 
            className="ach-bento-grid"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
        >
            
            {/* Card 1: Projects Completed */}
            <motion.div 
                className="ach-card"
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
                }}
            >
                <div className="ach-card-header">
                    <div className="ach-card-icon ach-icon-purple">
                        <i className="fa-solid fa-rocket"></i>
                    </div>
                </div>
                <div className="ach-val"><AnimatedCounter value={projectsCount} suffix="+" /></div>
                <div className="ach-title">Projects Completed</div>
                <div className="ach-desc">Successfully designed and developed web & mobile applications that solve real world problems.</div>
                
                <div className="ach-graph-container">
                    <svg className="ach-graph-svg" viewBox="0 0 200 40" preserveAspectRatio="none">
                        <motion.path 
                            className="ach-graph-line"
                            d="M0,30 Q20,10 40,20 T80,10 T120,25 T160,5 T200,15"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            viewport={{ once: false, amount: 0.5 }}
                        />
                    </svg>
                </div>
            </motion.div>

            {/* Card 2: Years of Experience */}
            <motion.div 
                className="ach-card"
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
                }}
            >
                <div className="ach-card-header">
                    <div className="ach-card-icon ach-icon-blue">
                        <i className="fa-solid fa-briefcase"></i>
                    </div>
                </div>
                <div className="ach-val"><AnimatedCounter value={6} suffix="+" /></div>
                <div className="ach-title">Years of Experience</div>
                <div className="ach-desc">Hands-on experience in development, design and problem solving.</div>
                
                <div className="ach-progress-container">
                    <div className="ach-progress-track">
                        <motion.div 
                            className="ach-progress-fill" 
                            initial={{ width: '0%' }}
                            whileInView={{ width: '90%' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            viewport={{ once: false, amount: 0.5 }}
                        ></motion.div>
                    </div>
                    <div className="ach-progress-val">
                        <AnimatedCounter value={90} suffix="%" />
                    </div>
                </div>
            </motion.div>

            {/* Card 3: Technologies Mastered */}
            <motion.div 
                className="ach-card ach-card-tall"
                variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4 } }
                }}
            >
                <div className="ach-card-header">
                    <div className="ach-card-icon ach-icon-green">
                        <i className="fa-solid fa-code"></i>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <div className="ach-val" style={{ marginBottom: 0, fontSize: '2.5rem' }}>
                            <AnimatedCounter value={20} suffix="+" />
                        </div>
                    </div>
                </div>
                <div className="ach-title">Technologies Mastered</div>
                <div className="ach-desc">Worked with a wide range of technologies and tools across the stack.</div>
                
                <div className="ach-tech-grid">
                    <AnimatePresence mode="popLayout">
                        {visibleTechs.map((skill, index) => (
                            <motion.div 
                                key={skill.name}
                                initial={{ opacity: 0, scale: 0.3, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.3, y: 20 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 20,
                                    delay: index >= 15 ? (index - 15) * 0.02 : 0 
                                }}
                                className="ach-tech-item" 
                                title={skill.name}
                            >
                                {skill.icon}
                            </motion.div>
                        ))}

                        {!showAllTech && hiddenCount > 0 && (
                            <motion.div 
                                key="stacked-banner"
                                className="ach-stacked-banner" 
                                onClick={() => setShowAllTech(true)}
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            >
                                <div className="ach-stack-card">
                                    {masteredTechs[15]?.icon}
                                </div>
                                <div className="ach-stack-card">
                                    {masteredTechs[16]?.icon}
                                </div>
                                <div className="ach-stack-card">
                                    +{hiddenCount}
                                </div>
                            </motion.div>
                        )}
                        {showAllTech && (
                            <motion.div 
                                key="show-less"
                                className="ach-tech-item ach-tech-more" 
                                style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                onClick={() => setShowAllTech(false)}
                                initial={{ opacity: 0, scale: 0.3, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.3, y: 20 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 20,
                                    delay: 0.1 
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                Less
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Card 4: Happy Clients */}
            <motion.div 
                className="ach-card"
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
                }}
            >
                <div className="ach-card-header">
                    <div className="ach-card-icon ach-icon-pink" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                        <i className="fa-solid fa-heart" style={{ fontSize: '20px' }}></i>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <div className="ach-val" style={{ marginBottom: 0, fontSize: '2rem', color: '#EC4899' }}>
                            <AnimatedCounter value={testimonials.length} suffix="+" />
                        </div>
                    </div>
                </div>
                <div className="ach-title">Happy Clients</div>
                <div className="ach-desc" style={{ fontSize: '0.8rem' }}>Trusted by amazing people and teams around the world.</div>
                
                <div className="ach-clients-row">
                    <div className="ach-avatar-stack">
                        {testimonials.slice(0, 4).map((t, idx) => (
                            <div key={idx} className="ach-avatar">
                                <img src={t.src} alt={t.name} />
                            </div>
                        ))}
                    </div>
                    {testimonials.length > 4 && (
                        <div className="ach-clients-plus">+{testimonials.length - 4}</div>
                    )}
                </div>
            </motion.div>

            {/* Card 5: Hackathons */}
            {(() => {
                const hasWinningHackathons = fetchedHackathons.some(h => h.isWinner);
                return (
                    <div className="ach-card relative overflow-hidden flex flex-col justify-between !p-4 sm:!p-5">
                        
                        {/* Subtle background effects matching the image */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/5 rounded-full blur-[60px] pointer-events-none"></div>
                        <div className="absolute right-[-20px] top-[10%] opacity-[0.03] dark:opacity-[0.03] pointer-events-none transform -rotate-12">
                            <i className="fa-solid fa-trophy text-[180px] text-slate-900 dark:text-white"></i>
                        </div>
                        {/* Particle dots */}
                        <div className="absolute right-[25%] top-[25%] w-1 h-1 bg-orange-400 rounded-full blur-[1px]"></div>
                        <div className="absolute right-[15%] bottom-[35%] w-1.5 h-1.5 bg-orange-300 rounded-full blur-[1px]"></div>
                        <div className="absolute left-[10%] top-[40%] w-0.5 h-0.5 bg-orange-500 rounded-full"></div>
                        
                        <div className="relative z-10 w-full">
                            {/* Top Row: Icon & Count */}
                            <div className="flex justify-between items-start w-full mb-0 relative z-20">
                                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] bg-gradient-to-br from-orange-400 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)] text-white relative z-10">
                                    <i className="fa-solid fa-trophy text-xl sm:text-2xl"></i>
                                </div>
                                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-300 to-orange-500 drop-shadow-md">
                                    <AnimatedCounter value={hackathonsCount || 10} suffix="+" />
                                </div>
                            </div>
                            
                            {/* Middle Content */}
                            <div className="flex flex-col items-center text-center w-full -mt-8 sm:-mt-12 mb-3 relative z-10">
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Hackathons Participated</h3>
                                
                                <div className="flex items-center justify-center w-full max-w-[80%] mx-auto gap-3 mb-1.5">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-orange-500/80"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)] hidden sm:block"></div>
                                    <div className="text-orange-500 font-black text-sm tracking-widest">&lt;/&gt;</div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)] hidden sm:block"></div>
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-orange-500/30 to-orange-500/80"></div>
                                </div>
                                
                                <p className="text-slate-500 dark:text-[#94a3b8] text-sm sm:text-base font-medium max-w-[90%] mx-auto leading-snug">
                                    Participated and built innovative solutions<br className="hidden sm:block"/> in competitive hackathons.
                                </p>
                            </div>
                        </div>

                        {/* Bottom Stats/Buttons Row */}
                        <div className="relative z-10 mt-auto flex items-center justify-between gap-3 sm:gap-4 w-full">
                            
                            {/* Left pill */}
                            <div className={`flex items-center justify-center bg-white dark:bg-[#0a0a0a] border border-orange-200 dark:border-orange-500/40 rounded-2xl p-2 sm:p-2.5 sm:px-4 gap-2 sm:gap-3 text-[9px] sm:text-[11px] md:text-[12px] font-bold text-slate-600 dark:text-gray-400 shadow-[0_0_15px_rgba(249,115,22,0.05)] dark:shadow-[0_0_15px_rgba(249,115,22,0.15)] whitespace-nowrap relative z-30 ${hasWinningHackathons ? 'w-auto' : 'w-full justify-between'}`}>
                                
                                <div className="group/tt relative flex items-center justify-center gap-1 sm:gap-1.5 hover:text-orange-500 dark:hover:text-orange-400 transition-colors cursor-help">
                                    <i className="fa-regular fa-lightbulb text-orange-500 text-sm sm:text-base"></i>
                                    {!hasWinningHackathons && <span>Innovate</span>}
                                    {hasWinningHackathons && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover/tt:opacity-100 group-hover/tt:visible transition-all duration-200 shadow-xl border border-white/10 whitespace-nowrap z-50">
                                            Innovate
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-800 dark:border-t-black"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="w-[1px] h-3 sm:h-4 bg-slate-300 dark:bg-white/10"></div>
                                
                                <div className="group/tt relative flex items-center justify-center gap-1 sm:gap-1.5 hover:text-orange-500 dark:hover:text-orange-400 transition-colors cursor-help">
                                    <span className="text-orange-500 font-black text-sm sm:text-base">&lt;/&gt;</span>
                                    {!hasWinningHackathons && <span>Build</span>}
                                    {hasWinningHackathons && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover/tt:opacity-100 group-hover/tt:visible transition-all duration-200 shadow-xl border border-white/10 whitespace-nowrap z-50">
                                            Build
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-800 dark:border-t-black"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="w-[1px] h-3 sm:h-4 bg-slate-300 dark:bg-white/10"></div>
                                
                                <div className="group/tt relative flex items-center justify-center gap-1 sm:gap-1.5 hover:text-orange-500 dark:hover:text-orange-400 transition-colors cursor-help">
                                    <i className="fa-solid fa-users text-orange-500 text-sm sm:text-base"></i>
                                    {!hasWinningHackathons && <span>Collaborate</span>}
                                    {hasWinningHackathons && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover/tt:opacity-100 group-hover/tt:visible transition-all duration-200 shadow-xl border border-white/10 whitespace-nowrap z-50">
                                            Collaborate
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-800 dark:border-t-black"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="w-[1px] h-3 sm:h-4 bg-slate-300 dark:bg-white/10"></div>
                                
                                <div className="group/tt relative flex items-center justify-center gap-1 sm:gap-1.5 hover:text-orange-500 dark:hover:text-orange-400 transition-colors cursor-help">
                                    <i className="fa-solid fa-trophy text-orange-500 text-sm sm:text-base"></i>
                                    {!hasWinningHackathons && <span>Compete</span>}
                                    {hasWinningHackathons && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover/tt:opacity-100 group-hover/tt:visible transition-all duration-200 shadow-xl border border-white/10 whitespace-nowrap z-50">
                                            Compete
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-800 dark:border-t-black"></div>
                                        </div>
                                    )}
                                </div>
                                
                            </div>

                            {/* Right Win Button (Conditional) */}
                            {hasWinningHackathons && (
                                <div 
                                    className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-[#0a0a0a] border border-orange-200 dark:border-orange-500/40 rounded-2xl p-1.5 sm:p-2 px-2.5 sm:px-3 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all group/win shadow-[0_0_15px_rgba(249,115,22,0.05)] dark:shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] dark:hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] w-auto"
                                    onClick={() => {
                                        setShowWinningOnly(true);
                                        setSelectedWinningHackathonIndex(0);
                                        setShowHackathonsModal(true);
                                    }}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)] relative">
                                            <i className="fa-solid fa-medal text-white text-sm sm:text-base"></i>
                                            <div className="absolute inset-0 rounded-full bg-orange-400 blur-sm opacity-50"></div>
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-slate-900 dark:text-white font-bold text-[11px] sm:text-[13px] leading-tight">Winning Hackathons</span>
                                            <span className="text-slate-500 dark:text-gray-400 text-[9px] sm:text-[10px]">View Hackathons</span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center justify-center text-orange-500 ml-1 group-hover/win:text-orange-600 dark:group-hover/win:text-orange-400 transition-colors pr-1">
                                        <i className="fa-solid fa-chevron-right text-[10px] sm:text-[12px]"></i>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                );
            })()}

            {/* Bottom Row Wrapper for Card 6 and 7 */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {/* Card 6: Certificates Earned (Featured) */}
                <div className="ach-card featured" style={{ flex: '1.1 1 48%', minWidth: '400px' }}>
                <div className="ach-feat-content" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div style={{ flex: 1 }}>
                            <div className="ach-feat-header">
                                <div className="ach-feat-icon"><i className="fa-solid fa-certificate"></i></div>
                                <div className="ach-feat-title">Certificates Earned</div>
                            </div>
                            
                            <div className="ach-feat-val"><AnimatedCounter value={totalCertificatesCount || 9} suffix="+" /></div>
                            <div className="ach-feat-desc" style={{ maxWidth: '90%', marginBottom: 0 }}>Continuous learning through online courses,<br />workshops and industry recognized programs.</div>
                        </div>
                        <div className="ach-feat-visual" style={{ position: 'relative', width: '200px', top: 'auto', right: 'auto', padding: 0 }}>
                            <img src="https://cdn-icons-png.flaticon.com/512/9338/9338276.png" alt="Certificate" className="ach-cert-ill" style={{ width: '180px' }} />
                        </div>
                    </div>
                    
                    <div 
                        className="ach-feat-partners" 
                        style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '32px', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <AnimatePresence mode="popLayout">
                            {visibleCerts.map((cert, i) => (
                                <motion.div 
                                    key={`cert-${cert.name}`}
                                    layout
                                    title={cert.name}
                                    onClick={() => cert.link ? setSelectedCertificate(cert) : null}
                                    className={`transition-colors duration-300 ${cert.link ? 'cursor-pointer hover:border-yellow-500/50 hover:bg-white/5' : 'cursor-default'}`}
                                    initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ 
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        width: '80px', height: '80px', 
                                        background: 'rgba(255, 255, 255, 0.03)', 
                                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                                        borderRadius: '16px',
                                        padding: '12px 8px',
                                        gap: '8px'
                                    }}
                                >
                                    <img 
                                        src={cert.img} 
                                        alt={cert.name} 
                                        style={{ 
                                            height: '24px', 
                                            maxWidth: '100%', 
                                            objectFit: 'contain',
                                            filter: cert.invert ? 'brightness(0) invert(1)' : 'none'
                                        }}
                                    />
                                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: '1.2' }}>
                                        {cert.name}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

                {/* Card 7: Dedication & Passion */}
                <div className="ach-card" style={{ flex: '1 1 48%', minWidth: '280px' }}>
                <div className="ach-dedication-content">
                    <div className="ach-card-icon ach-icon-blue" style={{ width: '40px', height: '40px', position: 'absolute', top: '24px', left: '24px' }}>
                        <i className="fa-solid fa-users" style={{ fontSize: '16px' }}></i>
                    </div>
                    
                    <div className="ach-circle-wrap">
                        <svg width="120" height="120" viewBox="0 0 120 120">
                            <circle className="ach-circle-bg" cx="60" cy="60" r="50"></circle>
                            <motion.circle 
                                className="ach-circle-prog" 
                                cx="60" cy="60" r="50"
                                initial={{ strokeDasharray: "314", strokeDashoffset: "314" }}
                                whileInView={{ strokeDashoffset: "0" }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                viewport={{ once: false, amount: 0.5 }}
                            ></motion.circle>
                        </svg>
                        <div className="ach-circle-val">
                            <i className="fa-solid fa-heart" style={{ color: '#00cfe8', fontSize: '24px' }}></i>
                        </div>
                    </div>
                    
                    <div className="ach-val" style={{ fontSize: '2rem' }}>
                        <AnimatedCounter value={100} suffix="%" />
                    </div>
                    <div className="ach-title">Dedication & Passion</div>
                    <div className="ach-desc" style={{ fontSize: '0.85rem' }}>Fully dedicated to creating impactful solutions and delivering excellence.</div>
                </div>
            </div>
            </div>
        </motion.div>

        {/* Bottom Metrics Panel */}
        <div className="ach-bottom-panel">
            <div className="ach-panel-left">
                <div className="ach-panel-icon"><i className="fa-solid fa-arrow-trend-up"></i></div>
                <div className="ach-panel-left-content">
                    <h4>Consistent Growth</h4>
                    <p>Always learning, always improving and pushing boundaries.</p>
                </div>
            </div>
            
            <div className="ach-panel-metrics">
                <div className="ach-metric">
                    <div className="ach-m-top">
                        <i className="fa-brands fa-github ach-m-icon"></i>
                        <span className="ach-m-val"><AnimatedCounter value={githubMetrics.contributions} suffix="K+" /></span>
                    </div>
                    <div className="ach-m-label">GitHub Contributions</div>
                    <div className="ach-m-line"></div>
                </div>
                
                <div className="ach-metric">
                    <div className="ach-m-top">
                        <i className="fa-solid fa-code ach-m-icon"></i>
                        <span className="ach-m-val"><AnimatedCounter value={githubMetrics.loc} suffix="K+" /></span>
                    </div>
                    <div className="ach-m-label">Lines of Code</div>
                    <div className="ach-m-line"></div>
                </div>
                
                <div className="ach-metric">
                    <div className="ach-m-top">
                        <i className="fa-solid fa-layer-group ach-m-icon"></i>
                        <span className="ach-m-val"><AnimatedCounter value={githubMetrics.repos} suffix="+" /></span>
                    </div>
                    <div className="ach-m-label">Public Repositories</div>
                    <div className="ach-m-line"></div>
                </div>

                <div className="ach-metric">
                    <div className="ach-m-top">
                        <i className="fa-solid fa-code-commit ach-m-icon"></i>
                        <span className="ach-m-val"><AnimatedCounter value={githubMetrics.commits} suffix="+" /></span>
                    </div>
                    <div className="ach-m-label">Commits</div>
                    <div className="ach-m-line"></div>
                </div>

                <div className="ach-metric">
                    <div className="ach-m-top">
                        <i className="fa-solid fa-star ach-m-icon"></i>
                        <span className="ach-m-val"><AnimatedCounter value={95} suffix="%" /></span>
                    </div>
                    <div className="ach-m-label">Client Satisfaction</div>
                    <div className="ach-m-line"></div>
                </div>
            </div>
        </div>

        <div className="ach-footer">
            <p><i>✨</i> <b>Every achievement is a step towards a bigger impact.</b></p>
        </div>

        {/* Hackathons Viewer Modal */}
        {mounted && createPortal(
            <AnimatePresence>
                {showHackathonsModal && (() => {
                    const winningItems = fetchedHackathons.filter((h: any) => h.isWinner);
                    const activeList = (showWinningOnly && winningItems.length > 0)
                        ? winningItems 
                        : fetchedHackathons;
                    const activeIndex = Math.min(Math.max(0, selectedWinningHackathonIndex), Math.max(0, activeList.length - 1));
                    const selectedItem = activeList[activeIndex] || null;

                    // Helper for 3 visual status states (Winning, Recognized, Participant)
                    const getStatusInfo = (item: any) => {
                        if (!item) return null;
                        const isWinner = Boolean(item.isWinner);
                        const rawAch = item.achievement?.trim();
                        const hasAch = Boolean(rawAch && rawAch !== 'None' && rawAch !== 'none');

                        if (isWinner) {
                            // 1. WINNING TREATMENT (Gold / Amber Accent)
                            const achLabel = hasAch ? rawAch : 'Winner / 1st Place';
                            let iconClass = 'fa-trophy';
                            if (achLabel.includes('3rd') || achLabel.includes('3RD') || achLabel.includes('🥉')) {
                                iconClass = 'fa-medal';
                            } else if (achLabel.includes('2nd') || achLabel.includes('2ND') || achLabel.includes('🥈') || achLabel.includes('Runner-up')) {
                                iconClass = 'fa-medal';
                            }
                            return {
                                type: 'winning' as const,
                                statusBadgeText: achLabel.toUpperCase(),
                                sidebarPillText: achLabel.toUpperCase(),
                                achievementCardText: achLabel,
                                iconClass,
                                iconSymbol: '🏆',
                                sidebarCardBg: 'bg-amber-500/[0.08] dark:bg-amber-500/10 hover:bg-amber-500/[0.13]',
                                sidebarBorder: 'border-amber-400/40 dark:border-amber-500/30',
                                selectedRing: 'border-amber-500 ring-2 ring-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-amber-500/15 dark:bg-amber-500/15',
                                pillBg: 'bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300',
                                accentText: 'text-amber-600 dark:text-amber-400',
                                iconBoxBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
                                watermarkIcon: 'fa-trophy',
                                watermarkColor: 'text-amber-500'
                            };
                        } else if (hasAch) {
                            // 2. RECOGNIZED TREATMENT (Blue / Purple Accent: Finalist, Shortlisted, Special Award)
                            const achLabel = rawAch;
                            let iconClass = 'fa-bookmark';
                            let iconSymbol = '🔖';
                            if (achLabel.toLowerCase().includes('finalist') || achLabel.includes('⭐')) {
                                iconClass = 'fa-star';
                                iconSymbol = '⭐';
                            } else if (achLabel.toLowerCase().includes('special') || achLabel.toLowerCase().includes('award') || achLabel.includes('🏅')) {
                                iconClass = 'fa-award';
                                iconSymbol = '🏅';
                            }
                            return {
                                type: 'recognized' as const,
                                statusBadgeText: (item.participationType === 'team' && !achLabel.toLowerCase().includes('team')) 
                                    ? `${achLabel.toUpperCase()} TEAM` 
                                    : achLabel.toUpperCase(),
                                sidebarPillText: achLabel.toUpperCase(),
                                achievementCardText: achLabel,
                                iconClass,
                                iconSymbol,
                                sidebarCardBg: 'bg-blue-50/70 dark:bg-blue-500/[0.08] hover:bg-blue-50/90 dark:hover:bg-blue-500/12',
                                sidebarBorder: 'border-blue-200 dark:border-blue-500/25',
                                selectedRing: 'border-blue-500 ring-2 ring-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-blue-50 dark:bg-blue-500/15',
                                pillBg: 'bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-300',
                                accentText: 'text-blue-600 dark:text-blue-400',
                                iconBoxBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
                                watermarkIcon: 'fa-bookmark',
                                watermarkColor: 'text-blue-500'
                            };
                        } else {
                            // 3. PARTICIPANT TREATMENT (Neutral Gray / Slate)
                            return {
                                type: 'participant' as const,
                                statusBadgeText: 'PARTICIPANT',
                                sidebarPillText: 'PARTICIPANT',
                                achievementCardText: 'Participant',
                                iconClass: 'fa-user',
                                iconSymbol: '👤',
                                sidebarCardBg: 'bg-slate-50/80 dark:bg-[#131622] hover:bg-slate-100/80 dark:hover:bg-[#181b2a]',
                                sidebarBorder: 'border-slate-200 dark:border-white/5',
                                selectedRing: 'border-slate-400 dark:border-slate-500 ring-2 ring-slate-400/20 bg-slate-100/90 dark:bg-white/10',
                                pillBg: 'bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300',
                                accentText: 'text-slate-600 dark:text-slate-400',
                                iconBoxBg: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300',
                                watermarkIcon: 'fa-award',
                                watermarkColor: 'text-slate-400'
                            };
                        }
                    };

                    const currentStatus = getStatusInfo(selectedItem);

                    // Technology pastel color helper
                    const getTechChipColor = (techName: string, idx: number) => {
                        const t = techName.toLowerCase();
                        if (t.includes('php')) return 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/40';
                        if (t.includes('html')) return 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200/60 dark:border-orange-800/40';
                        if (t.includes('css')) return 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40';
                        if (t.includes('javascript') || t.includes('js') || t.includes('node')) return 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40';
                        if (t.includes('hack')) return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10';
                        if (t.includes('react') || t.includes('next') || t.includes('vue')) return 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/40';
                        if (t.includes('python') || t.includes('django') || t.includes('flask')) return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40';
                        const colors = [
                            'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/40',
                            'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200/60 dark:border-orange-800/40',
                            'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40',
                            'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
                            'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                        ];
                        return colors[idx % colors.length];
                    };

                    return (
                        <div data-lenis-prevent="true" className="fixed inset-0 flex items-center justify-center p-3 sm:p-5 md:p-7 overflow-hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999999 }}>
                            {/* Backdrop */}
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }} 
                                className="absolute inset-0 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md"
                                onClick={() => setShowHackathonsModal(false)}
                            />

                            {/* Modal Window */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                                transition={{ duration: 0.22, ease: "easeOut" }}
                                className="relative w-full max-w-[1160px] bg-white dark:bg-[#0c0e17] rounded-[28px] sm:rounded-[32px] shadow-2xl border border-slate-200/90 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh] z-10"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 sm:px-7 sm:py-4.5 border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-[#0f121d] backdrop-blur-sm flex-shrink-0">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,158,11,0.35)] relative flex-shrink-0">
                                            <i className="fa-solid fa-trophy text-base sm:text-lg"></i>
                                            <div className="absolute inset-0 rounded-2xl bg-amber-400 blur-sm opacity-25 pointer-events-none"></div>
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight leading-none">Hackathons & Competitions</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">A showcase of hackathons, competitions and achievements.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setShowHackathonsModal(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer"
                                        aria-label="Close modal"
                                    >
                                        <i className="fa-solid fa-xmark text-sm"></i>
                                    </button>
                                </div>

                                {/* Main Body Area */}
                                <div className="flex-1 overflow-hidden p-4 sm:p-6 min-h-0 flex flex-col">
                                    {activeList.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
                                            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-3xl mb-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                                                <i className="fa-solid fa-trophy"></i>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                                {showWinningOnly ? 'No winning hackathons yet' : 'No hackathons yet'}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                                                {showWinningOnly ? 'Try viewing all hackathons.' : 'Your competitions and achievements will appear here.'}
                                            </p>
                                            {showWinningOnly && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowWinningOnly(false)}
                                                    className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-colors"
                                                >
                                                    View All Hackathons
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch lg:h-full overflow-hidden">
                                            
                                            {/* LEFT SIDEBAR */}
                                            <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-3 lg:h-full lg:overflow-hidden flex-shrink-0">
                                                {/* Header Row */}
                                                <div className="flex items-center justify-between px-1">
                                                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                                        <i className="fa-solid fa-trophy text-amber-500 text-xs"></i> 
                                                        <span>{showWinningOnly ? 'WINNING HACKATHONS' : 'ALL HACKATHONS'}</span>
                                                    </div>
                                                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-white/5">
                                                        {activeList.length}
                                                    </span>
                                                </div>

                                                {/* Cards List */}
                                                <div className="space-y-3 max-h-[340px] lg:max-h-none lg:flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
                                                    {activeList.map((item: any, idx: number) => {
                                                        const isSelected = idx === activeIndex;
                                                        const itemStatus = getStatusInfo(item);
                                                        if (!itemStatus) return null;

                                                        return (
                                                            <div 
                                                                key={idx}
                                                                onClick={() => setSelectedWinningHackathonIndex(idx)}
                                                                className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-center gap-3 ${
                                                                    isSelected 
                                                                        ? itemStatus.selectedRing
                                                                        : `${itemStatus.sidebarBorder} ${itemStatus.sidebarCardBg}`
                                                                }`}
                                                            >
                                                                {/* Top Right Bookmark Icon for Recognized Items */}
                                                                {itemStatus.type === 'recognized' && (
                                                                    <div className="absolute top-3 right-3 text-blue-500 text-xs opacity-90">
                                                                        <i className="fa-solid fa-bookmark"></i>
                                                                    </div>
                                                                )}

                                                                {/* Item Thumbnail (Fixed Sized Container) */}
                                                                <div className="w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-xl bg-white dark:bg-[#1a1d2e] border border-slate-200/80 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 relative shadow-xs p-1">
                                                                    {item.image ? (
                                                                        <img src={item.image} alt={item.projectName || item.title} className="w-full h-full object-contain rounded-lg" />
                                                                    ) : (
                                                                        <span className="text-lg">{itemStatus.iconSymbol}</span>
                                                                    )}
                                                                </div>

                                                                {/* Item Text Details */}
                                                                <div className="flex-1 min-w-0 pr-4">
                                                                    <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 dark:text-white truncate leading-tight">
                                                                        {item.title}
                                                                    </h4>
                                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                                                                        {item.organization} · {getHackathonDateAndDurationDisplay(item)}
                                                                    </p>
                                                                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 leading-none ${itemStatus.pillBg}`}>
                                                                            <i className={`fa-solid ${itemStatus.iconClass} text-[9px]`}></i>
                                                                            {itemStatus.sidebarPillText}
                                                                        </span>
                                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-gray-300 leading-none">
                                                                            {item.participationType === 'team' ? 'Team' : 'Individual'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Bottom Toggle Filter Button */}
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        setShowWinningOnly(!showWinningOnly);
                                                        setSelectedWinningHackathonIndex(0);
                                                    }}
                                                    className="mt-1 p-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50 hover:bg-slate-100/80 dark:bg-[#131622] dark:hover:bg-[#181c2c] text-slate-700 dark:text-gray-200 text-xs font-bold transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-amber-500">🏆</span>
                                                        <span>{showWinningOnly ? '← View All Hackathons' : 'View Winning Only'}</span>
                                                    </div>
                                                    <i className={`fa-solid ${showWinningOnly ? 'fa-arrow-left' : 'fa-arrow-right'} text-[11px] text-slate-400 group-hover:text-amber-500 transition-colors`}></i>
                                                </button>
                                            </div>

                                            {/* RIGHT DETAIL PANEL */}
                                            {selectedItem && currentStatus && (
                                                <div className="lg:col-span-8 xl:col-span-8 rounded-[24px] bg-slate-50/80 dark:bg-[#12141c]/95 border border-slate-200/90 dark:border-white/10 relative overflow-hidden shadow-sm lg:max-h-[calc(90vh-140px)] min-w-0 flex flex-col">
                                                    {/* Decorative Subtle Background Watermark */}
                                                    <div className={`absolute right-[-10px] top-[4%] opacity-[0.03] dark:opacity-[0.04] pointer-events-none text-[220px] ${currentStatus.watermarkColor} transform -rotate-12 select-none`}>
                                                        <i className={`fa-solid ${currentStatus.watermarkIcon}`}></i>
                                                    </div>

                                                    {/* Scrollable Inner Content Area */}
                                                    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:p-6 pr-2.5 sm:pr-4 flex flex-col justify-between relative z-10">
                                                        <div>
                                                            {/* Top Status Badge & Date Row */}
                                                            <div className="flex items-center justify-between gap-3 flex-wrap relative z-10 mb-3.5">
                                                                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs ${currentStatus.pillBg}`}>
                                                                    <i className={`fa-solid ${currentStatus.iconClass} text-xs`}></i>
                                                                    {currentStatus.statusBadgeText}
                                                                </span>

                                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-gray-300 bg-white dark:bg-white/5 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-white/5 shadow-xs">
                                                                    <i className="fa-regular fa-calendar text-amber-500 text-xs"></i>
                                                                    <span>{getHackathonDateAndDurationDisplay(selectedItem)}</span>
                                                                </div>
                                                            </div>

                                                            {/* TOP HEADER BENTO: Matches Left Logo Card Height with Right Content */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 mb-5 relative z-10 items-stretch">
                                                                {/* Left: Full-Height Logo / Cover Card */}
                                                                <div className="sm:col-span-4 lg:col-span-4 rounded-2xl bg-white dark:bg-[#171a26] border border-slate-200/80 dark:border-white/5 p-4 flex flex-col items-center justify-center text-center shadow-xs relative overflow-hidden group min-h-[140px]">
                                                                    <div className="flex-1 flex items-center justify-center w-full min-h-[90px] p-1">
                                                                        {selectedItem.image ? (
                                                                            <img 
                                                                                src={selectedItem.image} 
                                                                                alt={selectedItem.projectName || selectedItem.title} 
                                                                                className="max-h-[110px] max-w-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-105" 
                                                                            />
                                                                        ) : (
                                                                            <span className="text-4xl">{currentStatus.iconSymbol}</span>
                                                                        )}
                                                                    </div>
                                                                    {selectedItem.projectName && (
                                                                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5 w-full">
                                                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400 block truncate">
                                                                                {selectedItem.projectName}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Right: Title, Organization with Link & Description */}
                                                                <div className="sm:col-span-8 lg:col-span-8 rounded-2xl bg-white dark:bg-[#171a26] border border-slate-200/80 dark:border-white/5 p-4 sm:p-5 flex flex-col justify-center shadow-xs">
                                                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                                                        {selectedItem.title}
                                                                    </h3>
                                                                    
                                                                    {/* Organization / Issuer (Clickable with ↗ if organizationUrl exists) */}
                                                                    <div className="mt-1">
                                                                        {selectedItem.organizationUrl ? (
                                                                            <a 
                                                                                href={selectedItem.organizationUrl} 
                                                                                target="_blank" 
                                                                                rel="noopener noreferrer" 
                                                                                className={`inline-flex items-center gap-1.5 font-bold text-sm transition-all hover:underline group cursor-pointer ${
                                                                                    currentStatus.type === 'winning' 
                                                                                        ? 'text-amber-600 dark:text-amber-400' 
                                                                                        : 'text-blue-600 dark:text-blue-400'
                                                                                }`}
                                                                            >
                                                                                <span>{selectedItem.organization}</span>
                                                                                <i className="fa-solid fa-arrow-up-right-from-square text-[11px] opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
                                                                            </a>
                                                                        ) : (
                                                                            <p className={`text-sm font-black ${currentStatus.type === 'winning' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                                                                {selectedItem.organization}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
                                                                        {selectedItem.description}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Achievement & Participation 2x2 Information Grid */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#171a26] border border-slate-200/80 dark:border-white/5 mb-5 shadow-xs relative z-10">
                                                                {/* Card 1: Achievement */}
                                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 min-w-0">
                                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${currentStatus.iconBoxBg}`}>
                                                                        <i className={`fa-solid ${currentStatus.iconClass} text-sm`}></i>
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <span className="text-[10px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-wider block leading-tight">ACHIEVEMENT</span>
                                                                        <span className={`text-xs font-black leading-snug break-words block mt-0.5 ${currentStatus.accentText}`}>
                                                                            {currentStatus.iconSymbol} {currentStatus.achievementCardText}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Card 2: My Role */}
                                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 min-w-0">
                                                                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                                                        <i className="fa-solid fa-user text-sm"></i>
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <span className="text-[10px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-wider block leading-tight">MY ROLE</span>
                                                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug break-words block mt-0.5">
                                                                            {selectedItem.role || 'Developer'}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Card 3: Team / Participation */}
                                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 min-w-0">
                                                                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                                                                        <i className={`fa-solid ${selectedItem.participationType === 'team' ? 'fa-users' : 'fa-user'} text-sm`}></i>
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <span className="text-[10px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-wider block leading-tight">
                                                                            {selectedItem.participationType === 'team' ? 'TEAM' : 'PARTICIPATION'}
                                                                        </span>
                                                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug break-words block mt-0.5">
                                                                            {selectedItem.participationType === 'team' 
                                                                                ? `${selectedItem.teamName || 'Team Project'} · ${selectedItem.teamMembers?.length || 1} Members`
                                                                                : '👤 Individual Project'
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Card 4: Team Members / Solo Details */}
                                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 min-w-0">
                                                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                                                                        <i className={`fa-solid ${selectedItem.participationType === 'team' ? 'fa-user-group' : 'fa-lightbulb'} text-sm`}></i>
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <span className="text-[10px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-wider block leading-tight">
                                                                            {selectedItem.participationType === 'team' ? 'TEAM MEMBERS' : 'PROJECT TYPE'}
                                                                        </span>
                                                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug break-words block mt-0.5">
                                                                            {selectedItem.participationType === 'team' 
                                                                                ? `${selectedItem.teamMembers?.length || 1} Members`
                                                                                : 'Solo Project'
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Team Members List (Clean Chips if Team) */}
                                                            {selectedItem.participationType === 'team' && Array.isArray(selectedItem.teamMembers) && selectedItem.teamMembers.length > 0 && (
                                                                <div className="mb-5 p-3 rounded-2xl bg-white/70 dark:bg-[#171a26]/70 border border-slate-200/80 dark:border-white/5">
                                                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400 block mb-1.5">
                                                                        TEAM ROSTER ({selectedItem.teamMembers.length})
                                                                    </span>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {selectedItem.teamMembers.map((m: any, mi: number) => (
                                                                            <span key={mi} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1a1d2e] text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-white/5">
                                                                                👤 {m.name}{m.role ? ` (${m.role})` : ''}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* PROJECT DETAILS SECTION */}
                                                            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#171a26] border border-slate-200/80 dark:border-white/5 mb-4 relative z-10 space-y-3.5">
                                                                {/* Project Name */}
                                                                <div>
                                                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400 block mb-0.5">PROJECT NAME</span>
                                                                    <p className="text-base font-black text-blue-600 dark:text-blue-400">
                                                                        {selectedItem.projectName || selectedItem.title}
                                                                    </p>
                                                                </div>

                                                                {/* Problem / The Challenge */}
                                                                {selectedItem.problem && (
                                                                    <div>
                                                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400 block mb-0.5">
                                                                            THE CHALLENGE
                                                                        </span>
                                                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                                                            {selectedItem.problem}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {/* What We Built / Solution */}
                                                                <div>
                                                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400 block mb-0.5">
                                                                        {selectedItem.participationType === 'team' ? 'WHAT WE BUILT / SOLUTION' : 'WHAT I BUILT / SOLUTION'}
                                                                    </span>
                                                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                                                        {selectedItem.solution || selectedItem.description}
                                                                    </p>
                                                                </div>

                                                                {/* Technologies Used */}
                                                                {Array.isArray(selectedItem.technologies) && selectedItem.technologies.length > 0 && (
                                                                    <div>
                                                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400 block mb-1.5">TECHNOLOGIES USED</span>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {selectedItem.technologies.map((t: string, ti: number) => (
                                                                                <span key={ti} className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border shadow-2xs ${getTechChipColor(t, ti)}`}>
                                                                                    {t}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Key Features */}
                                                                {Array.isArray(selectedItem.keyFeatures) && selectedItem.keyFeatures.length > 0 && (
                                                                    <div>
                                                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400 block mb-1.5">KEY FEATURES</span>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {selectedItem.keyFeatures.map((f: string, fi: number) => (
                                                                                <span key={fi} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                                                                                    ✓ {f}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Prize / Award */}
                                                                {selectedItem.prize && (
                                                                    <div>
                                                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-400 block mb-0.5">PRIZE / AWARD</span>
                                                                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                                                            <i className="fa-solid fa-gift text-amber-500"></i> {selectedItem.prize}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-white/10 relative z-10">
                                                            {/* Certificate Button */}
                                                            {selectedItem.link ? (
                                                                <a 
                                                                    href={selectedItem.link} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="py-2.5 px-4 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                                                                >
                                                                    <i className="fa-solid fa-certificate"></i> View Certificate
                                                                </a>
                                                            ) : (
                                                                <button 
                                                                    disabled 
                                                                    className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                                                                >
                                                                    <i className="fa-solid fa-certificate"></i> No Certificate
                                                                </button>
                                                            )}

                                                            {/* Right Side: GitHub & Project Links Split */}
                                                            {(() => {
                                                                const hasGithub = Boolean(selectedItem.githubUrl);
                                                                const hasLive = Boolean(selectedItem.liveDemoUrl || selectedItem.hackathonUrl);
                                                                const liveUrl = selectedItem.liveDemoUrl || selectedItem.hackathonUrl;

                                                                if (hasGithub && hasLive) {
                                                                    return (
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            {/* GitHub Button */}
                                                                            <a 
                                                                                href={selectedItem.githubUrl} 
                                                                                target="_blank" 
                                                                                rel="noopener noreferrer" 
                                                                                className="py-2.5 px-2.5 sm:px-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer truncate"
                                                                            >
                                                                                <i className="fa-brands fa-github text-sm"></i>
                                                                                <span>GitHub</span>
                                                                                <i className="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-70"></i>
                                                                            </a>

                                                                            {/* View Project Button */}
                                                                            <a 
                                                                                href={liveUrl} 
                                                                                target="_blank" 
                                                                                rel="noopener noreferrer" 
                                                                                className="py-2.5 px-2.5 sm:px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer truncate"
                                                                            >
                                                                                <span>View Project</span>
                                                                                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                                                            </a>
                                                                        </div>
                                                                    );
                                                                }

                                                                if (hasGithub) {
                                                                    return (
                                                                        <a 
                                                                            href={selectedItem.githubUrl} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer" 
                                                                            className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                                                        >
                                                                            <i className="fa-brands fa-github text-sm"></i>
                                                                            <span>View GitHub Repo</span>
                                                                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
                                                                        </a>
                                                                    );
                                                                }

                                                                if (hasLive) {
                                                                    return (
                                                                        <a 
                                                                            href={liveUrl} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer" 
                                                                            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
                                                                        >
                                                                            <span>View Project</span>
                                                                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                                                        </a>
                                                                    );
                                                                }

                                                                return (
                                                                    <button 
                                                                        disabled 
                                                                        className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                                                                    >
                                                                        <span>Project Link N/A</span>
                                                                    </button>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Navigation (Only show if more than 1 item in active list) */}
                                {activeList.length > 1 && (
                                    <div className="flex items-center justify-center gap-4 py-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-[#0c0e17] flex-shrink-0">
                                        <button 
                                            onClick={() => setSelectedWinningHackathonIndex(prev => Math.max(0, prev - 1))}
                                            disabled={activeIndex === 0}
                                            className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:border-amber-500 hover:text-amber-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-white dark:bg-white/5"
                                            aria-label="Previous hackathon"
                                        >
                                            <i className="fa-solid fa-chevron-left text-xs"></i>
                                        </button>
                                        
                                        <span className="text-xs font-black text-slate-600 dark:text-gray-400">
                                            {activeIndex + 1} of {activeList.length}
                                        </span>

                                        <button 
                                            onClick={() => setSelectedWinningHackathonIndex(prev => Math.min(activeList.length - 1, prev + 1))}
                                            disabled={activeIndex === activeList.length - 1}
                                            className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:border-amber-500 hover:text-amber-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-white dark:bg-white/5"
                                            aria-label="Next hackathon"
                                        >
                                            <i className="fa-solid fa-chevron-right text-xs"></i>
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    );
                })()}
            </AnimatePresence>,
            document.body
        )}

        {/* Certificate Viewer Modal */}
        {mounted && createPortal(
            <AnimatePresence>
                {selectedCertificate && (
                    <div data-lenis-prevent="true" className="fixed inset-0 flex items-center justify-center p-4 sm:p-8" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999999 }}>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setSelectedCertificate(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-white dark:bg-[#151515] rounded-[24px] shadow-2xl border border-slate-200 dark:border-[#333] overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-[#222]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-[#333] flex items-center justify-center">
                                        <img src={selectedCertificate.img} alt={selectedCertificate.name} className="max-w-[24px] max-h-[24px] object-contain" style={{ filter: selectedCertificate.invert ? 'brightness(0) invert(1)' : 'none' }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-none">{selectedCertificate.name}</h3>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">Verified Certificate</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedCertificate(null)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#222] dark:hover:bg-[#333] text-slate-500 transition-colors"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            
                            <div className="flex-1 bg-slate-50 dark:bg-[#0a0a0a] relative flex items-center justify-center p-4 min-h-[300px] overflow-hidden">
                                {!selectedCertificate.link ? (
                                    <div className="text-center text-slate-400">
                                        <i className="fa-solid fa-file-circle-check text-4xl mb-3 opacity-50"></i>
                                        <p className="font-medium">Certificate verified, but no viewable file attached.</p>
                                    </div>
                                ) : selectedCertificate.link.toLowerCase().endsWith('.pdf') ? (
                                    <iframe 
                                        src={selectedCertificate.link} 
                                        className="w-full h-[60vh] rounded-xl border border-slate-200 dark:border-[#222] bg-white"
                                        title={`${selectedCertificate.name} Certificate`}
                                    />
                                ) : /\.(jpeg|jpg|gif|png|webp)$/i.test(selectedCertificate.link) || (selectedCertificate.link.includes('res.cloudinary.com') && !selectedCertificate.link.toLowerCase().endsWith('.pdf')) ? (
                                    <img 
                                        src={selectedCertificate.link} 
                                        alt={selectedCertificate.name}
                                        className="w-full h-auto max-h-[70vh] object-contain rounded-xl border border-slate-200 dark:border-[#222]" 
                                    />
                                ) : (
                                    <div className="text-center">
                                        <i className="fa-solid fa-arrow-up-right-from-square text-4xl mb-4 text-yellow-500"></i>
                                        <p className="text-slate-600 dark:text-slate-300 font-medium mb-6">This certificate is hosted externally.</p>
                                        <a 
                                            href={selectedCertificate.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl shadow-sm transition-colors"
                                        >
                                            View Certificate <i className="fa-solid fa-external-link-alt text-xs"></i>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        , document.body)}

    </motion.section>
  );
}
