"use client";
import React from 'react';
import Image from 'next/image';

const internships = [
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
    <section id="internship" className="internship-section section-reveal">
      <h2>Internship</h2>
      <div className="internship-container">
        {internships.map((item, index) => (
          <div key={index} className="internship-card">
            <div className="internship-role">
              <span className="internship-logo-wrap">
                <Image 
                    src={item.logo} 
                    alt={`${item.company} Logo`} 
                    className="internship-android-logo"
                    width={38}
                    height={38}
                    data-ai-hint="company logo"
                />
              </span>
              <span className="internship-title">{item.role}</span>
            </div>
            <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="internship-company" style={{textDecoration: 'none'}}>
              <i className="fa-solid fa-building"></i>
              {item.company}
            </a>
            <div className="internship-date">
              <i className="fa-regular fa-calendar"></i>
              {item.date}
            </div>
            <div className="internship-desc">
              <i className="fa-solid fa-circle-info"></i>
              <span>
                {item.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
