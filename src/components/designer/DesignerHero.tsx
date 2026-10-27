"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { usePersona } from '../PersonaContext';
import Typewriter from '../Typewriter';

interface DesignerHeroProps {
  data?: any;
}

export default function DesignerHero({ data }: DesignerHeroProps) {
  const { persona, togglePersona } = usePersona();

  const typewriterTexts = data?.typewriterTexts?.length > 0
    ? data.typewriterTexts.map((t: any) => t.text)
    : ["Graphic Designer", "Creative Technologist"];
  const speed = data?.typingSpeed || 80;
  const delay = data?.delayBetween || 1500;
  const loop = data?.loopAnimation ?? true;

  const socialLinks = data?.socialLinks?.filter((l: any) => l.visible) || [
    { url: 'https://instagram.com/hd_mixture' },
    { url: 'https://dribbble.com' },
    { url: 'https://behance.net' },
    { url: 'https://linkedin.com/in/hdmixture/' }
  ];

  const profileImage = data?.profileImage || "/Logos/hd_white_image.png";

  const getDomainFromUrl = (url: string) => {
    try {
      if (!url) return '';
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsedUrl.hostname;
    } catch {
      return '';
    }
  };

  return (
    <section id="home" className="relative pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-8 max-w-[1400px] mx-auto">

      {/* ============================================================== */}
      {/* 📱 DEDICATED CUSTOM MOBILE & TABLET HERO (< 1024px)            */}
      {/* ============================================================== */}
      <div className="block lg:hidden w-full max-w-[480px] mx-auto px-4 pt-2 pb-10 overflow-hidden relative z-10">

        {/* Top: Hi I'm + Persona Switcher */}
        <div className="flex flex-col items-center text-center mb-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-1.5">
            Hi I'm
          </span>
          <div className="persona-toggle-container relative z-20 flex mb-2">
            <button
              className="persona-toggle"
              onClick={togglePersona}
              aria-label="Toggle Persona"
            >
              <div className="toggle-slider" style={{ background: '#FF007F', transform: 'translateX(0)' }}></div>
              <span className="toggle-option active"><i className="fa-solid fa-palette"></i> Designer</span>
              <span className="toggle-option"><i className="fa-solid fa-code"></i> Developer</span>
            </button>
          </div>
        </div>

        {/* Center: 3D Designer Portrait Composition */}
        <div className="relative w-full flex items-center justify-center my-2">
          {/* Soft ambient glow */}
          <div
            className="absolute w-[240px] h-[240px] rounded-full blur-[70px] opacity-25 -z-10"
            style={{ background: 'radial-gradient(circle, #FFFFFF 0%, #C36DFF 50%, #FFB65D 100%)' }}
          />

          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            {/* Back Morphing Shape */}
            <motion.div
              animate={{
                borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%"],
                rotate: [0, 15, 0],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[220px] h-[220px] -z-10 mt-[8%] opacity-25"
              style={{
                background: 'linear-gradient(135deg, #FF5FA2 0%, #C36DFF 50%, #FFB65D 100%)',
              }}
            />

            {/* Front Shape & Photo */}
            <div className="relative w-[230px] h-[270px] mx-auto z-10">
              {/* Front Shape */}
              <motion.div
                animate={{
                  borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[190px] h-[190px] bottom-3 opacity-90 shadow-lg -z-10"
                style={{
                  left: "50%", x: "-50%",
                  background: 'linear-gradient(135deg, #FF5FA2 0%, #C36DFF 50%, #FFB65D 100%)',
                }}
              />

              {/* Bottom Half Image */}
              <motion.div
                animate={{
                  borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[190px] h-[190px] bottom-3 overflow-hidden z-0"
                style={{ left: "50%", x: "-50%" }}
              >
                <motion.div
                  animate={{ y: [10, 18, 10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-[230px] h-[270px] -bottom-3"
                  style={{ left: "50%", x: "-50%" }}
                >
                  <Image key={`mob-bot-${profileImage}`} src={profileImage} alt="Darshan Designer" fill className="object-contain object-bottom" priority />
                </motion.div>
              </motion.div>

              {/* Top Half Image */}
              <motion.div
                animate={{ y: [10, 18, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[230px] h-[270px] bottom-0 z-10"
                style={{ left: "50%", x: "-50%", clipPath: 'inset(0 0 45% 0)' }}
              >
                <Image key={`mob-top-${profileImage}`} src={profileImage} alt="Darshan Designer" fill className="object-contain object-bottom drop-shadow-[0_5px_15px_rgba(0,0,0,0.15)]" priority />
              </motion.div>
            </div>

            {/* Orbiting Designer Badges (Safe within 280px) */}
            {/* Pen Tool (Top Left) */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-8, 0, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-2 left-1 z-30 w-11 h-11 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center p-2 shadow-lg border border-white/40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="url(#pen-grad-mob)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <defs>
                  <linearGradient id="pen-grad-mob" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF4D8D" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </motion.div>

            {/* Photoshop (Top Right) */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [8, -4, 8] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-3 right-1 z-30 w-11 h-11 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center p-2 shadow-lg border border-white/40"
            >
              <Image src="https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg" alt="Photoshop" width={22} height={22} />
            </motion.div>

            {/* Figma (Bottom Left) */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-5 left-1 z-20 w-11 h-11 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center p-2 shadow-lg border border-white/40"
            >
              <Image src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Figma" width={22} height={22} />
            </motion.div>

            {/* Type Tool "T" (Bottom Right) */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [-8, 0, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-4 right-1 z-30 w-11 h-11 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/40 text-gray-800 dark:text-gray-200 font-serif font-bold text-xl"
            >
              T
            </motion.div>
          </div>
        </div>

        {/* Identity & Tagline */}
        <div className="flex flex-col items-center text-center mt-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            <span>Darshan</span>{" "}
            <span
              style={{
                background: 'linear-gradient(135deg, #FF4D8D 0%, #FF7A45 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              "Prajapati"
            </span>
          </h1>

          <div className="mt-2 text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center h-7">
            <Typewriter phrases={typewriterTexts} speed={speed} delay={delay} loop={loop} className="text-gray-800 dark:text-gray-200" />
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-xs mt-1 mb-4 leading-relaxed px-2">
            Crafting visual identities that speak, inspire and leave lasting impressions.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Link href="https://behance.net" target="_blank" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 text-sm font-medium border border-gray-200 dark:border-[#333] shadow-sm hover:scale-105 transition-transform">
              <i className="fa-brands fa-behance text-sm"></i>
              Behance
            </Link>

            <Link href="#contact" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 text-sm font-medium border border-gray-200 dark:border-[#333] shadow-sm hover:scale-105 transition-transform">
              <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              Hire Me
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-2.5">
            {socialLinks.map((link: any, idx: number) => {
              const domain = getDomainFromUrl(link.url);
              let iconElement = <i className="fa-solid fa-link text-sm"></i>;
              let color = '#888';

              if (domain.includes('instagram')) { iconElement = <i className="fa-brands fa-instagram text-sm"></i>; color = '#E1306C'; }
              else if (domain.includes('dribbble')) { iconElement = <i className="fa-brands fa-dribbble text-sm"></i>; color = '#EA4C89'; }
              else if (domain.includes('behance')) { iconElement = <i className="fa-brands fa-behance text-sm"></i>; color = '#1769FF'; }
              else if (domain.includes('linkedin')) { iconElement = <i className="fa-brands fa-linkedin-in text-sm"></i>; color = '#0077B5'; }
              else if (domain.includes('github')) { iconElement = <i className="fa-brands fa-github text-sm"></i>; color = '#333'; }
              else if (domain.includes('whatsapp') || domain.includes('wa.link') || domain.includes('wa.me')) { iconElement = <i className="fa-brands fa-whatsapp text-sm"></i>; color = '#25D366'; }
              else if (domain.includes('youtube') || domain.includes('youtu.be')) { iconElement = <i className="fa-brands fa-youtube text-sm"></i>; color = '#FF0000'; }

              return (
                <Link
                  key={`mob-des-soc-${idx}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-200/50 dark:border-[#333] shadow-sm hover:scale-110 transition-transform"
                  style={{ color }}
                >
                  {iconElement}
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 💻 ORIGINAL DESKTOP HERO (>= 1024px) - STRICTLY UNCHANGED       */}
      {/* ============================================================== */}
      <div className="hidden lg:grid grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start z-10 mt-2 sm:mt-0 md:-mt-8 lg:-mt-12"
        >
          <h3 className="greeting">Hi I'm</h3>

          {/* Persona Toggle */}
          <div className="persona-toggle-container relative z-20 flex mb-6 mt-2">
            <button
              className="persona-toggle"
              onClick={togglePersona}
              aria-label="Toggle Persona"
            >
              <div className="toggle-slider" style={{ background: '#FF007F', transform: 'translateX(0)' }}></div>
              <span className="toggle-option active"><i className="fa-solid fa-palette"></i> Designer</span>
              <span className="toggle-option"><i className="fa-solid fa-code"></i> Developer</span>
            </button>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white mb-2">
            Darshan
          </h1>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 pb-4 pl-12 md:pl-[1.5em]"
            style={{
              background: 'linear-gradient(135deg, #FF4D8D 0%, #FF7A45 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
            "Prajapati"
          </h1>

          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 h-8 flex items-center">
            <Typewriter phrases={typewriterTexts} speed={speed} delay={delay} loop={loop} className="text-gray-800 dark:text-gray-200" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mb-10 leading-relaxed">
            Crafting visual identities that speak, inspire and leave lasting impressions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link href="https://behance.net" target="_blank" className="flex items-center gap-2 px-8 py-4 rounded-full bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 font-medium border border-gray-100 dark:border-[#333] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <i className="fa-brands fa-behance text-lg"></i>
              Behance
            </Link>

            <Link href="#contact" className="flex items-center gap-2 px-8 py-4 rounded-full bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 font-medium border border-gray-100 dark:border-[#333] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              Hire Me
            </Link>
          </div>

          {/* Socials */}
          <div className="flex flex-wrap items-center gap-4">
            {socialLinks.map((link: any, idx: number) => {
              const domain = getDomainFromUrl(link.url);
              let iconElement = <i className="fa-solid fa-link text-lg"></i>;
              let color = '#888';

              if (domain.includes('instagram')) { iconElement = <i className="fa-brands fa-instagram text-lg"></i>; color = '#E1306C'; }
              else if (domain.includes('dribbble')) { iconElement = <i className="fa-brands fa-dribbble text-lg"></i>; color = '#EA4C89'; }
              else if (domain.includes('behance')) { iconElement = <i className="fa-brands fa-behance text-lg"></i>; color = '#1769FF'; }
              else if (domain.includes('linkedin')) { iconElement = <i className="fa-brands fa-linkedin-in text-lg"></i>; color = '#0077B5'; }
              else if (domain.includes('github')) { iconElement = <i className="fa-brands fa-github text-lg"></i>; color = '#333'; }
              else if (domain.includes('whatsapp') || domain.includes('wa.link') || domain.includes('wa.me')) { iconElement = <i className="fa-brands fa-whatsapp text-lg"></i>; color = '#25D366'; }
              else if (domain.includes('youtube') || domain.includes('youtu.be')) { iconElement = <i className="fa-brands fa-youtube text-lg"></i>; color = '#FF0000'; }

              return (
                <motion.a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#333] shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-[#222]"
                  style={{ color }}
                >
                  {iconElement}
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Right Content - Hero Image & Floating Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, x: 60 }}
          animate={{ opacity: 1, scale: 0.85, x: 130 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative isolate z-0 h-[700px] flex items-center justify-center w-full"
        >
          {/* 3. GLOW BEHIND BLOB (Soft Light) */}
          <div className="absolute w-[120%] h-[120%] rounded-full blur-[140px] opacity-15 -z-20"
            style={{ background: 'radial-gradient(circle, #FFFFFF 0%, #C36DFF 50%, #FFB65D 100%)' }}></div>

          {/* 1. & 2. MORPHING BACKGROUND SHAPES */}

          {/* Back Shape (Larger, more transparent) */}
          <motion.div
            animate={{
              borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%"],
              rotate: [0, 15, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] -z-10 mt-[15%] opacity-25"
            style={{
              background: 'linear-gradient(135deg, #FF5FA2 0%, #C36DFF 50%, #FFB65D 100%)',
            }}
          ></motion.div>

          {/* CENTER COMPOSITION: Front Blob + Pop-out Portrait */}
          <div className="relative w-[380px] h-[500px] md:w-[420px] md:h-[600px] mx-auto -mt-[5%] z-10">

            {/* Front Shape (Background Color) */}
            <motion.div
              animate={{
                borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] bottom-8 md:bottom-10 opacity-90 shadow-lg -z-10"
              style={{
                left: "50%", x: "-50%",
                background: 'linear-gradient(135deg, #FF5FA2 0%, #C36DFF 50%, #FFB65D 100%)',
              }}
            ></motion.div>

            {/* BOTTOM HALF IMAGE (Clipped exactly to the Front Shape) */}
            <motion.div
              animate={{
                borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] bottom-8 md:bottom-10 overflow-hidden z-0"
              style={{ left: "50%", x: "-50%" }}
            >
              <motion.div
                animate={{ y: [20, 36, 20] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[380px] h-[500px] md:w-[420px] md:h-[600px] -bottom-8 md:-bottom-10"
                style={{ left: "50%", x: "-50%" }}
              >
                <Image key={`bot-${profileImage}`} src={profileImage} alt="Darshan Designer" fill className="object-contain object-bottom" priority />
              </motion.div>
            </motion.div>

            {/* TOP HALF IMAGE (Pops out of the shape) */}
            <motion.div
              animate={{ y: [20, 36, 20] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[380px] h-[500px] md:w-[420px] md:h-[600px] bottom-0 z-10"
              style={{ left: "50%", x: "-50%", clipPath: 'inset(0 0 45% 0)' }}
            >
              <Image key={`top-${profileImage}`} src={profileImage} alt="Darshan Designer" fill className="object-contain object-bottom drop-shadow-[0_5px_15px_rgba(0,0,0,0.15)]" priority />
            </motion.div>

          </div>

          {/* Floating Icons (Soft white glass cards) */}

          {/* Pen Tool (Top Left) */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-10, 0, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[15%] md:left-[22%] z-30 w-16 h-16 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center p-3 shadow-lg border border-white/50 dark:border-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="url(#pen-grad-desk)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <defs>
                <linearGradient id="pen-grad-desk" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF4D8D" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
          </motion.div>

          {/* Photoshop (Top Right) */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [10, -5, 10] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[25%] right-[15%] md:right-[20%] z-30 w-16 h-16 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center p-3 shadow-lg border border-white/50 dark:border-white/10"
          >
            <Image src="https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg" alt="Photoshop" width={40} height={40} />
          </motion.div>

          {/* Figma (Left) */}
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[25%] left-[10%] md:left-[15%] z-20 w-16 h-16 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-3xl flex items-center justify-center p-3 shadow-lg border border-white/50 dark:border-white/10"
          >
            <Image src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Figma" width={40} height={40} />
          </motion.div>

          {/* Type Tool "T" (Bottom Right) */}
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [-10, 0, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[40%] right-[20%] md:right-[20%] z-30 w-16 h-16 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/50 dark:border-white/10 text-gray-800 dark:text-gray-200 font-serif text-3xl font-bold"
          >
            T
          </motion.div>

          {/* Paint Brush (Far Bottom Right) */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [15, 25, 15] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[10%] right-[10%] md:right-[15%] xl:right-[20%] z-30 w-32 h-32 flex items-center justify-center drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
          >
            {/* Highly detailed 3D-like vector brush matching reference */}
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform -rotate-45">
              <defs>
                <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1a1a1a" />
                  <stop offset="30%" stopColor="#4d4d4d" />
                  <stop offset="70%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>

                <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#999" />
                  <stop offset="20%" stopColor="#fff" />
                  <stop offset="50%" stopColor="#ccc" />
                  <stop offset="80%" stopColor="#888" />
                  <stop offset="100%" stopColor="#444" />
                </linearGradient>

                <linearGradient id="bristleGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="40%" stopColor="#7e22ce" />
                  <stop offset="70%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              <path d="M70 70 L95 95 C97 97 97 100 95 100 C93 100 90 97 88 95 L65 72 Z" fill="url(#handleGrad)" />
              <rect x="58" y="58" width="16" height="8" rx="2" transform="rotate(45 58 58)" fill="url(#metalGrad)" />
              <path d="M45 45 C45 45 40 50 35 48 C30 46 25 35 20 30 C15 25 10 28 8 25 C6 22 10 15 15 10 C20 5 25 8 30 15 C35 22 45 28 48 35 C50 40 45 45 45 45 Z" fill="url(#bristleGrad)" />
              <path d="M12 20 C18 12 24 10 28 16" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
              <circle cx="25" cy="25" r="2" fill="#fff" opacity="0.8" />
            </svg>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
