"use client";
import React, { useState } from 'react';

export default function About() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 1200);
  };

  return (
    <section id="about" className="about-section section-reveal">
      <div className="about-accent"></div>
      <div className="about-content">
        <div className="about-text">
          <h2>About Me</h2>
          <div className="about-tagline">“Unleash Your Imagination – Transform Ideas into Vision.”</div>
          <p>I am a Creative Developer with hands-on experience in building mobile and web applications, skilled in both front-end and back-end technologies. My strong graphic design skills enable me to create appealing user-centric interfaces with projects that improve usability and efficiency.</p>
          <div className="about-download-btn">
            <a 
              className={`download-resume-icon ${isDownloading ? 'success' : ''}`}
              href="/Darshan CV_8d3ff4d89fa4d8988cba31337f895c82.pdf" 
              download 
              aria-label="Download Resume"
              onClick={handleDownloadClick}
            >
              <span className="download-tooltip">Download Resume</span>
              <span className="download-icon"><i className="fa-solid fa-download"></i></span>
            </a>
          </div>
        </div>
        <div className="about-icon">
          <div className="icon-circle"><i className="fa-solid fa-user-astronaut"></i></div>
        </div>
      </div>
    </section>
  );
}
