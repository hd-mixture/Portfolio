import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Typewriter from '../Typewriter';

export default function Hero() {
  return (
    <section id="home">
      <div className="main">
        <div className="detail">
          <h3>Hi I&apos;m</h3>
          <h1>
            <span style={{ color: '#52489C' }}>Darshan</span>
            &nbsp;&quot;Prajapati&quot;
          </h1>
          <div className="typewriter-container">
            <span className="static-text">Unleash Your Imagination –</span>
            <Typewriter />
          </div>
          <div className="social">
            <Link href="https://www.linkedin.com/in/hdmixture/" style={{ '--socialAni': 1 } as React.CSSProperties} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin-in"></i>
            </Link>
            <Link href="https://www.instagram.com/hd_mixture/ss" style={{ '--socialAni': 2 } as React.CSSProperties} target="_blank" rel="noopener noreferrer">
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
            src="https://picsum.photos/300/450"
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
