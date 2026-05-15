import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Typewriter from '../Typewriter';

export default function Hero() {
  return (
    <section id="home">
      <div className="main">
        <div className="detail">
          <h3>Hi I'm</h3>
          {/* Desktop Heading */}
          <h1 className="desktop-heading">
            <span style={{ color: '#52489C' }}>Darshan</span>{' '}
            <span>"Prajapati"</span>
          </h1>
          {/* Tablet & Mobile Heading */}
          <h1 className="tablet-mobile-heading">
            <span style={{ color: '#52489C' }}>Darshan</span>{' '}
            <span className="prajapati-lastname">"Prajapati"</span>
          </h1>
          <div className="typewriter-container">
            <span className="static-text">Unleash Your Imagination –</span>
            <Typewriter />
          </div>
          <div className="social">
            <Link href="https://www.linkedin.com/in/hdmixture/" style={{ '--socialAni': 1 } as React.CSSProperties} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin-in"></i>
            </Link>
            <Link href="https://www.instagram.com/hd_mixture/" style={{ '--socialAni': 2 } as React.CSSProperties} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </Link>
            <Link href="https://github.com/hd-mixture" style={{ '--socialAni': 3 } as React.CSSProperties} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-github"></i>
            </Link>
            <Link href="https://wa.link/ey6lzx" style={{ '--socialAni': 4 } as React.CSSProperties} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-whatsapp"></i>
            </Link>
          </div>
        </div>
        <div className="images">
          <Image
            src="/Logos/hd_image.png"
            alt="Darshan Prajapati profile"
            width={300}
            height={450}
            className="img-w"
            data-ai-hint="profile picture"
            priority
          />
        </div>
      </div>
    </section>
  );
}

    