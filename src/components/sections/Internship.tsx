"use client";
import React from 'react';
import Image from 'next/image';

const experiences = [
  {
    role: "Digital Repair Specialist Executive",
    company: "Reliance Jio, Ahmedabad",
    companyUrl: "https://www.jio.com/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Reliance_Jio_Logo.svg",
    date: "Sep 2025 – Mar 2026",
    description: "Managed end-to-end service operations including customer relationship management, installation scheduling, complaint resolution, technician coordination, SAP data management, and device troubleshooting. Ensured smooth daily operations and high customer satisfaction for Jio AirFiber services.",
  },
  {
    role: "Android Developer",
    company: "RiseUp Infotech, Surat",
    companyUrl: "https://share.google/sumZU9ye7TxnvSzCV",
    logo: "https://media.licdn.com/dms/image/v2/C4D0BAQFFrMKiwR45wg/company-logo_200_200/company-logo_200_200/0/1658907156557/riseupinfotech_logo?e=2147483647&v=beta&t=k4tRyTKDAokJD3mEbcQntQB6n6BSsMNYwKtsKtsbD4A",
    date: "Aug 2022 & Sep 2023",
    description: "Developed and maintained Android applications, collaborated with cross-functional teams, and contributed to real-world projects in a fast-paced environment.",
  }
];

export default function Internship() {
  return (
    <section id="internship" className="experience-section section-reveal">
      <h2>Internship & Job</h2>
      <div className="experience-timeline">
        {experiences.map((item, index) => (
          <div key={index} className="experience-item">
            <div className="experience-dot"></div>
            <div className="experience-card">
              <div className="experience-header">
                <div className="experience-logo-wrap">
                  <Image 
                    src={item.logo} 
                    alt={`${item.company} Logo`} 
                    width={40}
                    height={40}
                    data-ai-hint="company logo"
                  />
                </div>
                <h3 className="experience-role">{item.role}</h3>
              </div>
              
              <div className="experience-meta">
                <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="experience-badge">
                  <i className="fa-solid fa-building"></i>
                  {item.company}
                </a>
                <div className="experience-badge date">
                  <i className="fa-regular fa-calendar"></i>
                  {item.date}
                </div>
              </div>

              <div className="experience-description-box">
                <i className="fa-solid fa-circle-info"></i>
                <p>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
