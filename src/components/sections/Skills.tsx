"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { techSkills } from './TechStack';
import { getYearsOfExperience } from './Achievements';

const skillsLeft = [
  { id: 0, name: 'Problem Solving', icon: 'fa-solid fa-lightbulb', color: 'blue-purple', description: 'Identifying complex problems and devising effective solutions.', yOffset: '-20px' },
  { id: 4, name: 'Team Collaboration', icon: 'fa-solid fa-users', color: 'green-blue', description: 'Working effectively with teams to achieve common goals.', yOffset: '0' },
  { id: 5, name: 'Time Management', icon: 'fa-solid fa-clock', color: 'orange-pink', description: 'Organizing and planning how to divide your time between activities.', yOffset: '20px' }
];

const skillsRight = [
  { id: 3, name: 'UI/UX Design', icon: 'fa-solid fa-object-group', color: 'purple-pink', description: 'Creating intuitive and visually appealing user interfaces.', yOffset: '-20px' },
  { id: 2, name: 'Frontend Development', icon: 'fa-solid fa-code', color: 'green-blue', description: 'Building responsive and interactive web frontends.', yOffset: '0' },
  { id: 1, name: 'Critical Thinking', icon: 'fa-solid fa-brain', color: 'orange-pink', description: 'Analyzing information objectively and making reasoned judgments.', yOffset: '20px' }
];

const centerStates = [
  {
    id: 0,
    icon: 'fa-solid fa-lightbulb',
    title: 'Problem Solving',
    subtitle: 'Analytical & logical approach to complex challenges.',
    ringColor: 'ring-blue-purple'
  },
  {
    id: 1,
    icon: 'fa-solid fa-brain',
    title: 'Critical Thinking',
    subtitle: 'Objective analysis and reasoned judgments.',
    ringColor: 'ring-orange-pink'
  },
  {
    id: 2,
    icon: 'fa-solid fa-code',
    title: 'Frontend Development',
    subtitle: 'Modern React, Next.js & fluid animations.',
    ringColor: 'ring-green-blue'
  },
  {
    id: 3,
    icon: 'fa-solid fa-object-group',
    title: 'UI/UX Design',
    subtitle: 'Pixel-perfect, user-centric interfaces.',
    ringColor: 'ring-purple-pink'
  },
  {
    id: 4,
    icon: 'fa-solid fa-users',
    title: 'Team Collaboration',
    subtitle: 'Effective communication and seamless teamwork.',
    ringColor: 'ring-green-blue'
  },
  {
    id: 5,
    icon: 'fa-solid fa-clock',
    title: 'Time Management',
    subtitle: 'Efficient planning & on-time delivery.',
    ringColor: 'ring-orange-pink'
  }
];

export default function Skills() {
  const [activeState, setActiveState] = useState(0); // Start with first state
  const [isPaused, setIsPaused] = useState(false);
  const [projectCount, setProjectCount] = useState(5);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length) {
          setProjectCount(data.length);
        }
      })
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    if (isPaused) return;
    
    const cycleSequence = [0, 4, 5, 3, 2, 1];
    
    const interval = setInterval(() => {
      setActiveState((prev) => {
        const currentIndex = cycleSequence.indexOf(prev);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % cycleSequence.length;
        return cycleSequence[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Framer motion variants for center circle transition
  const centerVariants = {
    initial: { opacity: 0, scale: 0.9, rotate: -8 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0, 
      transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      rotate: 8, 
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  const handleCardHover = (id: number) => {
    setActiveState(id);
    setIsPaused(true);
  };

  const activeContent = centerStates[activeState];

  return (
    <motion.section 
      id="skills" 
      className="orbit-skills-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
      }}
    >
      <div className="orbit-bg-particles">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
      </div>

      <div className="skills-main-container">
        <div className="skills-header-side">
          <div className="skills-title-wrapper">
            <span className="skills-title-line"></span>
            <h2>Skills</h2>
          </div>
          <p className="skills-desc">
            A blend of technical expertise and<br/>soft skills that drive impactful<br/>solutions.
          </p>
          <div className="skills-header-underline"></div>
        </div>

        <div className="orbit-layout">
          <div className="skills-column left-column">
            {skillsLeft.map((skill, index) => (
              <motion.div 
                key={skill.id} 
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.4 } }
                }}
                className={`orbit-skill-card ${activeState === skill.id ? 'active-glow' : ''} ${skill.color} left-card-${index}`}
                style={{ transform: `translateY(${skill.yOffset})` }}
                onMouseEnter={() => handleCardHover(skill.id)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="icon-wrapper">
                  <i className={skill.icon}></i>
                </div>
                <div className="skill-card-content">
                  <h3>{skill.name}</h3>
                  <p>{skill.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="orbit-center"
            variants={{
              hidden: { opacity: 0, scale: 0.5 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.8, type: "spring", bounce: 0.5 } }
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="orbit-track">
              {/* Static colored dots on the orbit */}
              <div className="orbit-dot dot-l-top"></div>
              <div className="orbit-dot dot-l-mid"></div>
              <div className="orbit-dot dot-l-bot"></div>
              <div className="orbit-dot dot-r-top"></div>
              <div className="orbit-dot dot-r-mid"></div>
              <div className="orbit-dot dot-r-bot"></div>
            </div>
          
          <div className={`orbit-center-glass ${activeContent.ringColor}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeState}
                variants={centerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="orbit-center-content"
              >
                <div className="center-icon interactive-glow">
                  <i className={activeContent.icon}></i>
                </div>
                <h3 className="center-title">{activeContent.title}</h3>
                <p className="center-subtitle">{activeContent.subtitle}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="skills-column right-column">
          {skillsRight.map((skill, index) => (
            <motion.div 
              key={skill.id} 
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.4 } }
              }}
              className={`orbit-skill-card ${activeState === skill.id ? 'active-glow' : ''} ${skill.color} right-card-${index}`}
              style={{ transform: `translateY(${skill.yOffset})` }}
              onMouseEnter={() => handleCardHover(skill.id)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="icon-wrapper">
                <i className={skill.icon}></i>
              </div>
              <div className="skill-card-content">
                <h3>{skill.name}</h3>
                <p>{skill.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </div>

      <div className="skills-bottom-stats">
        <div className="stat-box">
          <div className="stat-icon-wrapper purple-glow">
            <i className="fa-solid fa-trophy"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{techSkills.length}+</div>
            <div className="stat-label">Skills Mastered</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon-wrapper green-glow">
            <i className="fa-solid fa-briefcase"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{projectCount}+</div>
            <div className="stat-label">Projects Delivered</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon-wrapper orange-glow">
            <i className="fa-solid fa-rocket"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{getYearsOfExperience()}+</div>
            <div className="stat-label">Years of Learning</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon-wrapper blue-glow">
            <i className="fa-solid fa-bullseye"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">100%</div>
            <div className="stat-label">Dedication</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
