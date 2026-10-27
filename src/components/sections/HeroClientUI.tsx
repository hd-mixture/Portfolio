"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Typewriter from '../Typewriter';
import { usePersona } from '../PersonaContext';

interface HeroClientUIProps {
  developerData: any;
  designerData: any;
}

export default function HeroClientUI({
  developerData,
  designerData
}: HeroClientUIProps) {
  const { persona, togglePersona } = usePersona();

  const getDomainFromUrl = (url: string) => {
    try {
      if (!url) return '';
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsedUrl.hostname;
    } catch {
      return '';
    }
  };

  const isDesigner = persona === 'designer';
  const activeData = isDesigner ? designerData : developerData;

  const typewriterTexts = activeData?.typewriterTexts?.length > 0
    ? activeData.typewriterTexts.map((t: any) => t.text)
    : (isDesigner ? ["Design the Unseen", "Crafting visual stories", "Pixel perfect designs"] : ["Design the Unseen", "Develop the Unbuilt", "Deliver the Unforgettable"]);

  const speed = activeData?.typingSpeed || 80;
  const delay = activeData?.delayBetween || 1500;
  const loop = activeData?.loopAnimation ?? true;

  const socialLinks = activeData?.socialLinks?.filter((l: any) => l.visible) || [
    { url: 'https://www.linkedin.com/in/hdmixture/' },
    { url: 'https://www.instagram.com/hd_mixture/' },
    { url: 'https://github.com/hd-mixture' },
    { url: 'https://wa.link/ey6lzx' }
  ];

  const profileImage = activeData?.profileImage || "/Logos/hd_image.png";

  return (
    <section id="home" className={`relative developer-home overflow-x-hidden ${isDesigner ? 'designer-mode-active' : ''}`}>

      {/* Dynamic Background Blobs */}
      <div className="hero-bg-blob blob-1"></div>
      <div className="hero-bg-blob blob-2"></div>
      <div className="hero-bg-blob blob-3"></div>

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
              className={`persona-toggle ${isDesigner ? 'designer-active' : 'developer-active'}`}
              onClick={togglePersona}
              aria-label="Toggle Persona"
            >
              <div className="toggle-slider"></div>
              <span className={`toggle-option ${!isDesigner ? 'active' : ''}`}><i className="fa-solid fa-code"></i> Developer</span>
              <span className={`toggle-option ${isDesigner ? 'active' : ''}`}><i className="fa-solid fa-palette"></i> Designer</span>
            </button>
          </div>
        </div>

        {/* Center: 3D Portrait Composition (Compact, 100% Centered, Zero Horizontal Overflow) */}
        <div className="relative w-full flex items-center justify-center my-2">
          {/* Soft ambient glow */}
          <div
            className="absolute w-[240px] h-[240px] rounded-full blur-[70px] opacity-25 -z-10"
            style={{ background: 'radial-gradient(circle, #FFFFFF 0%, #3B82F6 50%, #8B5CF6 100%)' }}
          />

          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            {/* Back Morphing Shape */}
            <motion.div
              animate={{
                borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%"],
                rotate: [0, -15, 0],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[220px] h-[220px] -z-10 mt-[8%] opacity-25"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #3B82F6 100%)',
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
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
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
                  <Image key={`mob-bot-${profileImage}`} src={profileImage} alt="Darshan" fill className="object-contain object-bottom" priority />
                </motion.div>
              </motion.div>

              {/* Top Half Image */}
              <motion.div
                animate={{ y: [10, 18, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[230px] h-[270px] bottom-0 z-10"
                style={{ left: "50%", x: "-50%", clipPath: 'inset(0 0 45% 0)' }}
              >
                <Image key={`mob-top-${profileImage}`} src={profileImage} alt="Darshan" fill className="object-contain object-bottom drop-shadow-[0_5px_15px_rgba(0,0,0,0.15)]" priority />
              </motion.div>
            </div>

            {/* Orbiting Tech Badges (Inside the 280px safe bounds) */}
            {/* React (Top Left) */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-8, 0, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-2 left-1 z-30 w-11 h-11 bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center p-2 shadow-lg border border-white/20"
            >
              <i className="fa-brands fa-react text-blue-400 text-xl"></i>
            </motion.div>

            {/* VS Code (Top Right) */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [8, -4, 8] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-3 right-1 z-30 w-11 h-11 bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center p-2 shadow-lg border border-white/20"
            >
              <Image src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" alt="VS Code" width={22} height={22} />
            </motion.div>

            {/* Node.js (Bottom Left) */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-5 left-1 z-20 w-11 h-11 bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center p-2 shadow-lg border border-white/20"
            >
              <i className="fa-brands fa-node-js text-green-500 text-xl"></i>
            </motion.div>

            {/* Terminal (Bottom Right) */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [-8, 0, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-4 right-1 z-30 w-11 h-11 bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/20"
            >
              <i className="fa-solid fa-terminal text-purple-400 text-base"></i>
            </motion.div>
          </div>
        </div>

        {/* Identity & Tagline */}
        <div className="flex flex-col items-center text-center mt-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Darshan
            </span>{" "}
            <span className="text-gray-900 dark:text-white">
              "Prajapati"
            </span>
          </h1>

          {/* Typewriter text */}
          <div className="mt-2 text-sm sm:text-base font-medium flex flex-wrap justify-center items-center gap-1.5 px-2 text-gray-700 dark:text-gray-300">
            <span className="opacity-80">Unleash Your Imagination –</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              <Typewriter
                phrases={typewriterTexts}
                speed={speed}
                delay={delay}
                loop={loop}
                key={`mob-${persona}`}
              />
            </span>
          </div>

          {/* Social Icons (Sleek Glass Pills) */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {socialLinks.map((link: any, index: number) => {
              const domain = getDomainFromUrl(link.url);

              let faviconDomain = domain;
              if (domain === 'wa.link' || domain === 'wa.me' || domain === 'api.whatsapp.com') {
                faviconDomain = 'whatsapp.com';
              } else if (domain === 'fb.com' || domain === 'fb.watch') {
                faviconDomain = 'facebook.com';
              } else if (domain === 't.me') {
                faviconDomain = 'telegram.org';
              } else if (domain === 'ig.me') {
                faviconDomain = 'instagram.com';
              } else if (domain === 'youtu.be') {
                faviconDomain = 'youtube.com';
              }

              let iconElement = <i className="fa-solid fa-link text-base"></i>;
              if (domain.includes('linkedin')) iconElement = <i className="fa-brands fa-linkedin text-base" style={{ color: '#0077b5' }}></i>;
              else if (domain.includes('instagram')) iconElement = <i className="fa-brands fa-instagram text-base" style={{ color: '#E1306C' }}></i>;
              else if (domain.includes('github')) iconElement = <i className="fa-brands fa-github text-base"></i>;
              else if (domain.includes('whatsapp') || domain.includes('wa.link') || domain.includes('wa.me')) iconElement = <i className="fa-brands fa-whatsapp text-base" style={{ color: '#25D366' }}></i>;
              else if (domain.includes('youtube') || domain.includes('youtu.be')) iconElement = <i className="fa-brands fa-youtube text-base" style={{ color: '#FF0000' }}></i>;
              else if (domain.includes('twitter') || domain.includes('x.com')) iconElement = <i className="fa-brands fa-x-twitter text-base"></i>;
              else if (domain.includes('telegram') || domain.includes('t.me')) iconElement = <i className="fa-brands fa-telegram text-base" style={{ color: '#0088cc' }}></i>;
              else {
                const faviconUrl = faviconDomain ? `https://www.google.com/s2/favicons?domain=${faviconDomain}&sz=64` : '';
                iconElement = faviconUrl ? <Image src={faviconUrl} alt={domain} width={18} height={18} className="object-contain" unoptimized /> : <i className="fa-solid fa-link"></i>;
              }

              return (
                <Link
                  key={`mob-soc-${link.id || index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-sm border border-gray-200/50 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform"
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
      <div className="hidden lg:grid main relative z-10 !pt-0 md:!pt-0 !pb-16 px-4 md:px-8 w-full !max-w-[1400px] mx-auto grid-cols-2 !gap-12 items-center">
        <div className="detail flex flex-col items-start z-10 md:-mt-24 lg:-mt-36">
          <h3 className="greeting">Hi I'm</h3>
          {/* Persona Toggle */}
          <div className="persona-toggle-container relative z-20 flex mb-4 mt-2">
            <button
              className={`persona-toggle ${isDesigner ? 'designer-active' : 'developer-active'}`}
              onClick={togglePersona}
              aria-label="Toggle Persona"
            >
              <div className="toggle-slider"></div>
              <span className={`toggle-option ${!isDesigner ? 'active' : ''}`}><i className="fa-solid fa-code"></i> Developer</span>
              <span className={`toggle-option ${isDesigner ? 'active' : ''}`}><i className="fa-solid fa-palette"></i> Designer</span>
            </button>
          </div>
          {/* Desktop Heading */}
          <h1 className="desktop-heading gradient-text">
            <span>Darshan</span>
            <span className="prajapati-lastname">"Prajapati"</span>
          </h1>
          <div className="typewriter-container">
            <span className="static-text">Unleash Your Imagination –</span>
            <Typewriter
              phrases={typewriterTexts}
              speed={speed}
              delay={delay}
              loop={loop}
              key={persona} // Re-mount typewriter when persona changes
            />
          </div>

          <div className="social">
            {socialLinks.map((link: any, index: number) => {
              const domain = getDomainFromUrl(link.url);

              let faviconDomain = domain;
              if (domain === 'wa.link' || domain === 'wa.me' || domain === 'api.whatsapp.com') {
                faviconDomain = 'whatsapp.com';
              } else if (domain === 'fb.com' || domain === 'fb.watch') {
                faviconDomain = 'facebook.com';
              } else if (domain === 't.me') {
                faviconDomain = 'telegram.org';
              } else if (domain === 'ig.me') {
                faviconDomain = 'instagram.com';
              } else if (domain === 'youtu.be') {
                faviconDomain = 'youtube.com';
              }

              let iconElement = <i className="fa-solid fa-link"></i>;
              if (domain.includes('linkedin')) iconElement = <i className="fa-brands fa-linkedin" style={{ color: '#0077b5', fontSize: '20px' }}></i>;
              else if (domain.includes('instagram')) iconElement = <i className="fa-brands fa-instagram" style={{ color: '#E1306C', fontSize: '20px' }}></i>;
              else if (domain.includes('github')) iconElement = <i className="fa-brands fa-github" style={{ fontSize: '20px' }}></i>;
              else if (domain.includes('whatsapp') || domain.includes('wa.link') || domain.includes('wa.me')) iconElement = <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '20px' }}></i>;
              else if (domain.includes('youtube') || domain.includes('youtu.be')) iconElement = <i className="fa-brands fa-youtube" style={{ color: '#FF0000', fontSize: '20px' }}></i>;
              else if (domain.includes('twitter') || domain.includes('x.com')) iconElement = <i className="fa-brands fa-x-twitter" style={{ fontSize: '20px' }}></i>;
              else if (domain.includes('telegram') || domain.includes('t.me')) iconElement = <i className="fa-brands fa-telegram" style={{ color: '#0088cc', fontSize: '20px' }}></i>;
              else {
                const faviconUrl = faviconDomain ? `https://www.google.com/s2/favicons?domain=${faviconDomain}&sz=64` : '';
                iconElement = faviconUrl ? <Image src={faviconUrl} alt={domain} width={20} height={20} className="object-contain group-hover:scale-110 transition-transform" unoptimized /> : <i className="fa-solid fa-link"></i>;
              }

              return (
                <Link
                  key={link.id || index}
                  href={link.url}
                  style={{ '--socialAni': index + 1 } as React.CSSProperties}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link group"
                >
                  {iconElement}
                  <span className="social-tooltip">{faviconDomain || 'Link'}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.75, x: 20 }}
          animate={{ opacity: 1, scale: 0.85, x: 80 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative isolate z-0 h-[700px] flex items-center justify-center w-full"
        >
          {/* 3. GLOW BEHIND BLOB (Soft Light) */}
          <div className="absolute w-[120%] h-[120%] rounded-full blur-[140px] opacity-15 -z-20"
            style={{ background: 'radial-gradient(circle, #FFFFFF 0%, #3B82F6 50%, #8B5CF6 100%)' }}></div>

          {/* Back Shape */}
          <motion.div
            animate={{
              borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%"],
              rotate: [0, -15, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] -z-10 mt-[15%] opacity-25"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #3B82F6 100%)',
            }}
          ></motion.div>

          {/* CENTER COMPOSITION */}
          <div className="relative w-[380px] h-[500px] md:w-[420px] md:h-[600px] mx-auto -mt-[5%] z-10">

            {/* Front Shape */}
            <motion.div
              animate={{
                borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] bottom-8 md:bottom-10 opacity-90 shadow-lg -z-10"
              style={{
                left: "50%", x: "-50%",
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
              }}
            ></motion.div>

            {/* BOTTOM HALF IMAGE */}
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
                <Image key={`bot-${profileImage}`} src={profileImage} alt="Darshan" fill className="object-contain object-bottom" priority />
              </motion.div>
            </motion.div>

            {/* TOP HALF IMAGE */}
            <motion.div
              animate={{ y: [20, 36, 20] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[380px] h-[500px] md:w-[420px] md:h-[600px] bottom-0 z-10"
              style={{ left: "50%", x: "-50%", clipPath: 'inset(0 0 45% 0)' }}
            >
              <Image key={`top-${profileImage}`} src={profileImage} alt="Darshan" fill className="object-contain object-bottom drop-shadow-[0_5px_15px_rgba(0,0,0,0.15)]" priority />
            </motion.div>

          </div>

          {/* Floating Icons Developer */}

          {/* React (Top Left) */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-10, 0, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[12%] md:left-[18%] xl:left-[22%] z-30 w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center p-3 shadow-[0_8px_32px_rgba(59,130,246,0.15)] border border-white/10"
          >
            <i className="fa-brands fa-react text-blue-400 text-4xl"></i>
          </motion.div>

          {/* VS Code (Top Right) */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [10, -5, 10] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[25%] right-[15%] md:right-[22%] xl:right-[25%] z-30 w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center p-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/10"
          >
            <Image src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" alt="VS Code" width={32} height={32} />
          </motion.div>

          {/* Node.js (Left) */}
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[25%] left-[8%] md:left-[15%] xl:left-[18%] z-20 w-16 h-16 bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center p-3 shadow-[0_15px_35px_rgba(34,197,94,0.15)] border border-white/10"
          >
            <i className="fa-brands fa-node-js text-green-500 text-4xl"></i>
          </motion.div>

          {/* Terminal (Bottom Right) */}
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [-10, 0, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[15%] right-[10%] md:right-[15%] xl:right-[20%] z-30 w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(139,92,246,0.15)] border border-white/10"
          >
            <i className="fa-solid fa-terminal text-purple-400 text-3xl"></i>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
