
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HoverCluster = ({ type }: { type: 'creative' | 'frontend' | 'backend' }) => {
    let icons: {name: string, src: string, class: string, invertInDark?: boolean}[] = [];
    let layoutClass = "";

    if (type === "creative") {
        layoutClass = "cluster-creative";
        icons = [
            { name: "Figma", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg", class: "glow-orange" },
            { name: "Photoshop", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg", class: "glow-blue" },
            { name: "Illustrator", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-plain.svg", class: "glow-orange", invertInDark: true },
            { name: "VS Code", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg", class: "glow-blue" },
            { name: "GitHub", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", class: "glow-white", invertInDark: true },
            { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", class: "glow-blue" }
        ];
    } else if (type === "frontend") {
        layoutClass = "cluster-frontend";
        icons = [
            { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", class: "glow-blue" },
            { name: "Next.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", class: "glow-white", invertInDark: true },
            { name: "HTML5", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", class: "glow-orange" },
            { name: "CSS3", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg", class: "glow-blue" },
            { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", class: "glow-yellow" }
        ];
    } else if (type === "backend") {
        layoutClass = "cluster-backend";
        icons = [
            { name: "Express", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", class: "glow-white", invertInDark: true },
            { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", class: "glow-green" },
            { name: "MongoDB", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg", class: "glow-green" },
            { name: "Firebase", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg", class: "glow-orange" }
        ];
    }

    const dockVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.9 },
        show: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { 
                type: "spring", stiffness: 400, damping: 25,
                staggerChildren: 0.08
            } 
        },
        exit: { opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.2 } }
    };

    const iconVariants = {
        hidden: { opacity: 0, scale: 0.5, y: 10 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 20 } }
    };

    return (
        <motion.div 
            className={`tech-cluster-wrapper ${layoutClass}`}
            variants={dockVariants}
            initial="hidden"
            animate="show"
            exit="exit"
        >
            <div className="unified-cluster-box">
                {icons.map((icon, index) => (
                    <React.Fragment key={icon.name}>
                        <motion.div variants={iconVariants} className="cluster-icon-wrapper" data-tooltip={icon.name}>
                            <img src={icon.src} alt={icon.name} className={`cluster-icon-img ${icon.invertInDark ? 'invert-on-dark' : ''}`} />
                        </motion.div>
                        {index < icons.length - 1 && <motion.div variants={iconVariants} className="cluster-divider"></motion.div>}
                    </React.Fragment>
                ))}
            </div>
        </motion.div>
    );
};



const getYearsOfExperience = () => {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
}

const StatCounter = ({ target, suffix }: { target: number, suffix: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const element = ref.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let start = 0;
                    const duration = 1500;
                    if (target === 0) {
                        setCount(0);
                        return;
                    }
                    const stepTime = Math.abs(Math.floor(duration / target));

                    const timer = setInterval(() => {
                        start += 1;
                        setCount(start);
                        if (start === target) {
                            clearInterval(timer);
                        }
                    }, stepTime);
                }
            },
            { threshold: 0.5 }
        );

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [target]);

    return (
        <span ref={ref} className="stat-number">{count}{suffix}</span>
    );
};

export default function About() {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [projectsCount, setProjectsCount] = React.useState(0);
  const [experience, setExperience] = React.useState(0);
  const [hoveredKeyword, setHoveredKeyword] = useState<'creative' | 'frontend' | 'backend' | null>(null);

  // New state for About Data
  const [aboutData, setAboutData] = useState({
    tagline: "Unleash Your Imagination – Transform Ideas into Vision.",
    description: "I am a <span class=\"keyword-badge creative\">Creative Developer</span> with hands-on experience in building mobile and web applications, skilled in both <span class=\"keyword-badge frontend\">front-end</span> and <span class=\"keyword-badge backend\">back-end</span> technologies. My strong graphic design skills enable me to create appealing user-centric interfaces with projects that improve usability and efficiency.",
    resumeUrl: "/Darshan%20Prajapati_Resume_8d3ff4d89fa4d8988cba31337f895c82.pdf",
    illustrationImage: "/About/3D-rendered_illustration.png"
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`)
      .then(res => res.json())
      .then(data => setProjectsCount(data.length))
      .catch(err => console.error(err));

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/about?persona=developer`)
      .then(res => res.json())
      .then(data => {
          if (data) {
              setAboutData({
                  tagline: data.tagline || aboutData.tagline,
                  description: data.description || aboutData.description,
                  resumeUrl: data.resumeUrl || aboutData.resumeUrl,
                  illustrationImage: data.illustrationImage || aboutData.illustrationImage
              });
          }
      })
      .catch(err => console.error(err));

    setExperience(getYearsOfExperience());
  }, []);

  const handleDownloadClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isDownloading) return;
    
    setIsDownloading(true);

    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Determine filename
      let filename = 'Darshan_Prajapati_Resume.pdf';
      try {
          const urlParts = resumeUrl.split('/');
          const lastPart = urlParts[urlParts.length - 1];
          if (lastPart && lastPart.includes('.')) {
              filename = decodeURIComponent(lastPart);
          }
      } catch(e) {}

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed via fetch, fallback to blank tab:', error);
      // Fallback: just open in new tab if fetch fails due to CORS or other network issues
      window.open(resumeUrl, '_blank');
    }

    setTimeout(() => {
      setIsDownloading(false);
    }, 1200);
  };

  const handleKeywordInteraction = (keyword: 'creative' | 'frontend' | 'backend') => {
    setHoveredKeyword(hoveredKeyword === keyword ? null : keyword);
  };

  const resumeUrl = aboutData.resumeUrl;

  // Helper to safely render description if it contains HTML (though we have react components mixed in)
  // For the sake of preserving the exact HoverCluster behavior, we'll keep the static structure
  // but allow the text to be replaced if we wanted. Since the user said "wahi content hona chaaiye" 
  // and "kuch nhi change hona chaaiye", and the original text had complex JSX:
  // We'll just render the description as raw text for now, but to keep the hover clusters working,
  // we would ideally need a rich text parser or just keep the structure if the text matches exactly.
  // Actually, the user's description in the db is plain text: "I am a Creative Developer..."
  // If we just render plain text, we lose the hover badges. Let's see how we can inject it.
  
  return (
    <motion.section 
      id="about" 
      className="about-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
      }}
    >
      <div className="about-accent"></div>
      <div style={{ width: '100%', maxWidth: '1500px', alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0 20px' }}>
        <motion.div 
          className="skills-header-side"
          style={{ width: '100%', maxWidth: '100%', textAlign: 'left', marginBottom: '40px', marginTop: '0' }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
        >
          <div className="skills-title-wrapper" style={{ justifyContent: 'flex-start' }}>
            <span className="skills-title-line"></span>
            <h2 style={{ borderLeft: 'none', margin: 0, paddingLeft: 0, letterSpacing: 'normal' }}>About Me</h2>
          </div>
          <p className="skills-desc" style={{ maxWidth: '600px', marginTop: '15px' }}>
            Discover the person behind the code — a creative developer<br />passionate about building modern,<br />user-focused digital experiences.
          </p>
          <div className="skills-header-underline"></div>
        </motion.div>
      </div>
      <div className="about-content">
        <motion.div 
          className="about-text"
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
        >
          <div className="about-tagline">“{aboutData.tagline}”</div>
          <div className="about-description">
            I am a <span 
              className="keyword-badge creative" 
              onMouseEnter={() => setHoveredKeyword('creative')}
              onMouseLeave={() => setHoveredKeyword(null)}
              onClick={() => handleKeywordInteraction('creative')}
            >
              Creative Developer
              <AnimatePresence>
                {hoveredKeyword === 'creative' && <HoverCluster type="creative" />}
              </AnimatePresence>
            </span> with hands-on experience in building mobile and web applications, skilled in both <span 
              className="keyword-badge frontend" 
              onMouseEnter={() => setHoveredKeyword('frontend')}
              onMouseLeave={() => setHoveredKeyword(null)}
              onClick={() => handleKeywordInteraction('frontend')}
            >
              front-end
              <AnimatePresence>
                {hoveredKeyword === 'frontend' && <HoverCluster type="frontend" />}
              </AnimatePresence>
            </span> and <span 
              className="keyword-badge backend" 
              onMouseEnter={() => setHoveredKeyword('backend')}
              onMouseLeave={() => setHoveredKeyword(null)}
              onClick={() => handleKeywordInteraction('backend')}
            >
              back-end
              <AnimatePresence>
                {hoveredKeyword === 'backend' && <HoverCluster type="backend" />}
              </AnimatePresence>
            </span> technologies. My strong graphic design skills enable me to create appealing user-centric interfaces with projects that improve usability and efficiency.
          </div>
          
          <div className="quick-stats">
            <div className="stat-item">
              <StatCounter target={experience} suffix="+" />
              <span className="stat-label">Years Exp.</span>
            </div>
            <div className="stat-item">
              <StatCounter target={projectsCount} suffix="+" />
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number static">Web+App</span>
              <span className="stat-label">Development</span>
            </div>
          </div>

          <div className="about-download-btn">
            <a 
              className={`premium-download-btn ${isDownloading ? 'success' : ''}`}
              href={resumeUrl} 
              download 
              aria-label="Download Resume"
              onClick={handleDownloadClick}
              suppressHydrationWarning
            >
              <div className="btn-glow-bg"></div>
              <span className="btn-content">
                <i className={`fa-solid ${isDownloading ? 'fa-check' : 'fa-download'}`}></i>
                {isDownloading ? (
                  <span>Downloaded!</span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25em' }}>
                    <span>Download</span>
                    <span className="flip-wrapper">
                      <span className="flip-words-inner">
                        <span className="flip-word">Resume</span>
                        <span className="flip-word">CV</span>
                        <span className="flip-word">Resume</span>
                      </span>
                    </span>
                  </span>
                )}
              </span>
            </a>
          </div>
        </motion.div>
        <motion.div 
          className="about-icon"
          variants={{
            hidden: { opacity: 0, scale: 0.8, rotate: -5 },
            visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1, type: "spring", bounce: 0.4 } }
          }}
        >
          <div className="illustration-container">
            <div className="illustration-bg-circle"></div>
            <div className="illustration-glow"></div>
            <img 
              src={aboutData.illustrationImage} 
              alt="3D Illustration" 
              className="main-illustration" 
            />
            
            {/* Floating Tech Logos */}
            <img src="/About/java_logo.png" alt="Java" className="floating-logo logo-java" />
            <img src="/About/react_logo.png" alt="React" className="floating-logo logo-react" />
            <img src="/About/node.js_logo.png" alt="Node.js" className="floating-logo logo-node" />
            <img src="/About/html_logo.png" alt="HTML5" className="floating-logo logo-html" />
            <img src="/About/next.js_logo.png" alt="Next.js" className="floating-logo logo-next" />
            <img src="/About/js_logo.png" alt="JavaScript" className="floating-logo logo-js" />
            <img src="/About/firebase_logo.png" alt="Firebase" className="floating-logo logo-firebase" />
            <img src="/About/photoshop_logo.png" alt="Photoshop" className="floating-logo logo-ps" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
