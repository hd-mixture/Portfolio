"use client";
import React from 'react';
import { motion } from 'framer-motion';

// Official devicon URLs for premium look
export const techSkills = [
  { name: 'HTML5', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5" />, category: 'Frontend', exp: '4+ Years', projects: '20+' },
  { name: 'CSS3', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" alt="CSS3" />, category: 'Frontend', exp: '4+ Years', projects: '20+' },
  { name: 'JavaScript', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JavaScript" />, category: 'Language', exp: '4+ Years', projects: '15+' },
  { name: 'TypeScript', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" alt="TypeScript" />, category: 'Language', exp: '2+ Years', projects: '8+' },
  { name: 'React', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React" />, category: 'Frontend Library', exp: '3+ Years', projects: '12+' },
  { name: 'Next.js', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" alt="Next.js" className="tech-invert-dark" />, category: 'React Framework', exp: '2+ Years', projects: '6+' },
  { name: 'Node.js', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" alt="Node.js" />, category: 'Backend Runtime', exp: '2+ Years', projects: '10+' },
  { name: 'Express.js', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" alt="Express.js" className="tech-invert-dark" />, category: 'Backend Framework', exp: '2+ Years', projects: '10+' },
  { name: 'MongoDB', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" alt="MongoDB" />, category: 'Database', exp: '2+ Years', projects: '8+' },
  { name: 'Firebase', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg" alt="Firebase" />, category: 'BaaS', exp: '2+ Years', projects: '5+' },
  { name: 'Git', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="Git" />, category: 'Version Control', exp: '3+ Years', projects: '20+' },
  { name: 'GitHub', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub" className="tech-invert-dark" />, category: 'Platform', exp: '3+ Years', projects: '20+' },
  { name: 'Docker', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="Docker" />, category: 'Containerization', exp: '1+ Years', projects: '3+' },
  { name: 'Figma', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" alt="Figma" />, category: 'Design Tool', exp: '3+ Years', projects: '15+' },
  { name: 'Tailwind CSS', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" />, category: 'CSS Framework', exp: '2+ Years', projects: '10+' },
  { name: 'VS Code', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" alt="VS Code" />, category: 'Editor', exp: '4+ Years', projects: '20+' },
  { name: 'Postman', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" alt="Postman" />, category: 'API Testing', exp: '2+ Years', projects: '10+' },
  { name: 'Canva', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg" alt="Canva" />, category: 'Graphic Design', exp: '4+ Years', projects: '30+' },
  { name: 'Python', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python" />, category: 'Language', exp: '2+ Years', projects: '5+' },
  { name: 'SQL', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg" alt="SQL" />, category: 'Database', exp: '2+ Years', projects: '8+' },
  { name: 'Blender', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/blender/blender-original.svg" alt="Blender" />, category: '3D Design', exp: '1+ Years', projects: '3+' }
];

export default function TechStack() {
    // Animation variants for stagger
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40, rotateX: -90, scale: 0.8 },
        visible: { 
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 120, damping: 14 }
        }
    };

    return (
        <section id="techstack" className="tech-section">
            {/* Background Decorations */}
            <div className="tech-bg-gradient-1"></div>
            <div className="tech-bg-gradient-2"></div>
            <div className="tech-floating-cube cube-1"></div>
            <div className="tech-floating-cube cube-2"></div>
            <div className="tech-floating-cube cube-3"></div>
            <div className="tech-floating-cube cube-4"></div>
            <div className="tech-particle" style={{ top: '20%', left: '30%' }}></div>
            <div className="tech-particle" style={{ top: '60%', right: '20%', animationDelay: '1s' }}></div>
            {/* Staggered Grid Layout */}
            <motion.div 
                className="tech-grid staggered-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1, margin: "-50px" }}
            >
                {techSkills.map((tech, i) => {
                    // Slight random-looking offset for each card for the floating cloud feel
                    const yOffset = (i % 3 === 0) ? 0 : (i % 3 === 1) ? 15 : -15; 
                    return (
                        <motion.div 
                            key={tech.name} 
                            className="tech-card" 
                            variants={cardVariants}
                            style={{ 
                                perspective: 1000, 
                                marginTop: `${yOffset}px` 
                            }}
                        >
                            <div className="tech-card-inner">
                                <div className="tech-icon-wrapper">
                                    {tech.icon}
                                </div>
                                <div className="tech-name">{tech.name}</div>
                            </div>
                            <div className="tech-drop-line"></div>
                        </motion.div>
                    );
                })}

                {/* Section Header (Embedded in Grid) */}
                <div className="tech-header embedded-header">
                    <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '10px' }}>
                        Tech <span style={{ color: '#6C63FF' }}>Stack & Tools</span>
                    </h2>
                    <p style={{ margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '90%' }}>
                        Technologies that I use to design, develop and deliver modern, scalable and impactful digital experiences.
                    </p>
                    <div className="skills-header-underline" style={{ margin: "20px auto 0 auto" }}></div>
                </div>
            </motion.div>
        </section>
    );
}
