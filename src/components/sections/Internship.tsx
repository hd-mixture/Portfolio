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
                src="https://media.licdn.com/dms/image/v2/C4D0BAQFFrMKiwR45wg/company-logo_200_200/company-logo_200_200/0/1658907156557/riseupinfotech_logo?e=2147483647&v=beta&t=k4tRyTKDAokJD3mEbcQntQB6n6BSsMNYwKtsKtsbD4A" 
                alt="RiseUp Infotech Logo" 
                className="internship-android-logo"
                width={38}
                height={38}
                data-ai-hint="company logo"
            />
          </span>
          <span className="internship-title">Android Developer</span>
        </div>
        <a href="https://share.google/sumZU9ye7TxnvSzCV" target="_blank" rel="noopener noreferrer" className="internship-company" style={{textDecoration: 'none'}}>
          <i className="fa-solid fa-building-columns"></i>
          RiseUp Infotech, Surat
        </a>
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
