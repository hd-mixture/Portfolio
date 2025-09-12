"use client";
import React from 'react';

// Define the type for the custom element
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'dotlottie-wc': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                src: string;
                loop?: boolean;
                autoplay?: boolean;
                style?: React.CSSProperties;
            }, HTMLElement>;
        }
    }
}


export default function About() {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownloadClick = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 1200);
  };

  return (
    <section id="about" className="about-section section-reveal">
      <div className="about-accent"></div>
      <h2>About Me</h2>
      <div className="about-content">
        <div className="about-text">
          <div className="about-tagline">“Unleash Your Imagination – Transform Ideas into Vision.”</div>
          <p>I am a Creative Developer with hands-on experience in building mobile and web applications, skilled in both front-end and back-end technologies. My strong graphic design skills enable me to create appealing user-centric interfaces with projects that improve usability and efficiency.</p>
          <div className="about-download-btn">
            <a 
              className={`download-resume-icon ${isDownloading ? 'success' : ''}`}
              href="/Darshan Prajapati_Resume_8d3ff4d89fa4d8988cba31337f895c82.pdf" 
              download 
              aria-label="Download Resume"
              onClick={handleDownloadClick}
            >
              <span className="download-tooltip">Download Resume</span>
              <div className="download-icon">
                <div className="download-icon-inner">
                  <span><i className="fa-solid fa-download"></i></span>
                  <span>CV</span>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div className="about-icon">
          <dotlottie-wc 
              src="https://lottie.host/d7cd1c46-a5c3-4eef-bec7-85833741a0d8/FqaZ7dKwqu.lottie"
              loop
              autoplay
              style={{ width: '200px', height: '200px' }}>
          </dotlottie-wc>
        </div>
      </div>
    </section>
  );
}
