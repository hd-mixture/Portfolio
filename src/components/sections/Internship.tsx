"use client";
import React from 'react';
import Image from 'next/image';

export default function Internship() {
  return (
    <section id="internship" className="internship-section section-reveal">
      <h2>Internship</h2>
      <div className="internship-card">
        <div className="internship-role">
          <span className="internship-logo-wrap">
            <Image 
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/androidstudio/androidstudio-original.svg" 
                alt="Android Studio Logo" 
                className="internship-android-logo"
                width={38}
                height={38}
            />
          </span>
          <span className="internship-title">Android Developer</span>
        </div>
        <div className="internship-company">
          <i className="fa-solid fa-building-columns"></i>
          RiseUp Infotech, Surat
        </div>
        <div className="internship-date">
          <i className="fa-regular fa-calendar"></i>
          Aug 2022 &amp; Sep 2023
        </div>
        <div className="internship-desc">
          <i className="fa-solid fa-circle-info"></i>
          <span>
            Developed and maintained Android applications, collaborated with cross-functional teams, and contributed to real-world projects in a fast-paced environment.
          </span>
        </div>
      </div>
    </section>
  );
}
