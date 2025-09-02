"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const projects = [
  {
    date: "Aug 2022 - Sep 2022",
    title: "Nearby Places – Mobile Application",
    description: "Created an Android app using Google Maps API to display nearby essential locations like ATMs, hospitals, and restaurants.",
    liveLink: "https://github.com/hd-mixture/Nearby-Places.git",
    codeLink: "https://github.com/hd-mixture/Nearby-Places.git",
    icon: <i className="fa-solid fa-location-dot"></i>,
    side: "right"
  },
  {
    date: "Aug 2023 - Sep 2023",
    title: "Driving Licence Application – Mobile Application",
    description: "Designed a user-friendly interface to apply, check documents, and track driving licence.",
    liveLink: "https://github.com/hd-mixture/DrivingLicenceApplicaion.git",
    codeLink: "https://github.com/hd-mixture/DrivingLicenceApplicaion.git",
    icon: <Image src="https://picsum.photos/seed/dlapp/48/48" alt="Driving Licence App Logo" width={48} height={48} data-ai-hint="card document" />,
    side: "left"
  },
  {
    date: "Mar 2024 - Jun 2024",
    title: "Campus Cuisine – Web Application (Initial Version)",
    description: "Built a web app for students to discover and review affordable meals on campus.",
    liveLink: "https://hd-mixture.github.io/Campus-Cuisine/",
    codeLink: "https://github.com/hd-mixture/Campus-Cuisine.git",
    icon: <Image src="https://picsum.photos/seed/cc1/48/48" alt="Campus Cuisine Logo" width={48} height={48} data-ai-hint="food logo" />,
    side: "right"
  },
  {
    date: "Oct 2024 - Present",
    title: "ABHAR : AI-Based Home Automation Robot – Group Project (G-Code, C++)",
    description: "Built an automation robot to control home appliances via voice commands and sensors. Programmed using G-Code and C++ with smart features for real-time response.",
    liveLink: "https://epicpjm05.github.io/ABHAR/WEb",
    codeLink: "https://github.com/EPICPJM05/ABHAR.git",
    icon: <Image src="https://picsum.photos/seed/abhar/48/48" alt="ABHAR Logo" width={48} height={48} data-ai-hint="robot logo" />,
    side: "left"
  },
  {
    date: "Feb 2025 - Apr 2025",
    title: "Save & Share – PHP-Based Donation Platform",
    description: "Designed a donation network connecting food donors, NGOs, and volunteers.",
    liveLink: "https://github.com/100rabx23/Save-Share.git",
    codeLink: "https://github.com/100rabx23/Save-Share.git",
    icon: <Image src="https://picsum.photos/seed/saveshare/48/48" alt="Save & Share Logo" width={48} height={48} data-ai-hint="charity logo" />,
    side: "right"
  },
  {
    date: "Apr 2025 - Apr 2025",
    title: "BitTRiX AI : Automated Test Agent – Group Project (Python)",
    description: "Developed a smart testing system to generate and integrate with CI/CD tools.",
    liveLink: "https://github.com/EPICPJM05/NU-Thon-Bittrix.git",
    codeLink: "https://github.com/EPICPJM05/NU-Thon-Bittrix.git",
    icon: <Image src="https://picsum.photos/seed/bittrix/48/48" alt="BitTRiX AI Logo" width={48} height={48} data-ai-hint="ai logo" />,
    side: "left"
  },
  {
    date: "Jan 2025 - May 2025",
    title: "Campus Cuisine 2.0 – Web Application (Enhanced Version)",
    description: "Upgraded the UI/UX, added real-time ordering features, and role-based admin functionalities.",
    liveLink: "https://hd-mixture.github.io/Campus-Cuisine-2/",
    codeLink: "https://github.com/hd-mixture/Campus-Cuisine-2",
    icon: <Image src="https://picsum.photos/seed/cc2/48/48" alt="Campus Cuisine 2.0 Logo" width={48} height={48} data-ai-hint="modern food" />,
    side: "right"
  },
  {
    date: "Ongoing",
    title: "Graphic Designs",
    description: "A showcase of my creative graphic design works, including posters, banners, logos, and more.",
    portfolioLink: true,
    behanceLink: "https://www.behance.net/hd_mixture",
    icon: <i className="fa-solid fa-palette"></i>,
    side: "left"
  }
];

const designData = {
    android: Array.from({ length: 5 }, (_, i) => ({ src: `https://picsum.photos/seed/android${i}/250/200`, title: `Android Screen Design ${i+1}` })),
    web: Array.from({ length: 8 }, (_, i) => ({ src: `https://picsum.photos/seed/web${i}/250/200`, title: `Web Screen Design ${i+1}` })),
    banners: Array.from({ length: 7 }, (_, i) => ({ src: `https://picsum.photos/seed/banner${i}/250/200`, title: `Banner Design ${i+1}` })),
    certificates: Array.from({ length: 3 }, (_, i) => ({ src: `https://picsum.photos/seed/cert${i}/250/200`, title: `Certificate Design ${i+1}` })),
    logos: Array.from({ length: 8 }, (_, i) => ({ src: `https://picsum.photos/seed/logo${i}/250/200`, title: `Logo Design ${i+1}` })),
    posters: Array.from({ length: 10 }, (_, i) => ({ src: `https://picsum.photos/seed/poster${i}/250/200`, title: `Poster Design ${i+1}` })),
};

const allDesigns = Object.values(designData).flat();

const FullImageSlider = ({ images, startIndex, onClose }: { images: {src: string, title: string}[], startIndex: number, onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    const goToPrev = () => setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    const goToNext = () => setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goToPrev();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="full-image-modal" style={{display: 'flex'}} onClick={onClose}>
            <div className="full-image-content" onClick={e => e.stopPropagation()}>
                <button className="slider-nav prev-btn" onClick={goToPrev}><i className="fa-solid fa-chevron-left"></i></button>
                <div className="slider-container">
                    {images.map((img, index) => (
                        <div key={index} className={`slider-item ${index === currentIndex ? 'active' : ''}`} style={{ transform: `translateX(${(index - currentIndex) * 100}%)`}}>
                            <Image src={img.src} alt={img.title} width={1200} height={800} style={{ objectFit: 'contain' }} data-ai-hint="graphic design" />
                            <div className="image-caption">{img.title}</div>
                        </div>
                    ))}
                </div>
                <button className="slider-nav next-btn" onClick={goToNext}><i className="fa-solid fa-chevron-right"></i></button>
                <button className="close-full-image" onClick={onClose}>&times;</button>
            </div>
        </div>
    );
};

const DesignGalleryModal = ({ onClose }: { onClose: () => void }) => {
    const [category, setCategory] = useState('all');
    const [images, setImages] = useState(allDesigns);
    const [fullImage, setFullImage] = useState<{images: {src: string, title: string}[], index: number} | null>(null);

    const handleFilter = (cat: string) => {
        setCategory(cat);
        if (cat === 'all') {
            setImages(allDesigns);
        } else {
            setImages((designData as any)[cat]);
        }
    };
    
    return (
        <>
            <div className="design-modal" style={{display: 'block'}}>
                <div className="design-modal-content">
                    <button className="design-modal-close" onClick={onClose}>&times;</button>
                    <div className="design-categories">
                        <button className={`category-btn ${category === 'all' ? 'active' : ''}`} onClick={() => handleFilter('all')}>All</button>
                        {Object.keys(designData).map(cat => (
                            <button key={cat} className={`category-btn ${category === cat ? 'active' : ''}`} onClick={() => handleFilter(cat)}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="design-gallery">
                        {images.map((design, index) => (
                            <div key={index} className="design-item" onClick={() => setFullImage({images: images, index: index})}>
                                <Image src={design.src} alt={design.title} width={250} height={200} data-ai-hint="abstract design"/>
                                <div className="design-item-overlay"><h4>{design.title}</h4></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {fullImage && <FullImageSlider images={fullImage.images} startIndex={fullImage.index} onClose={() => setFullImage(null)} />}
        </>
    );
};

export default function Projects() {
    const [showDesignModal, setShowDesignModal] = useState(false);

    const openDesignModal = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowDesignModal(true);
    }

    return (
        <>
            <section id="projects" className="projects-section section-reveal">
                <h2>Projects</h2>
                <div className="projects-timeline">
                    {projects.map((project, index) => (
                        <div key={index} className="timeline-event" data-side={project.side}>
                            {project.side === 'left' ? (
                                <>
                                    <div className="timeline-col left">
                                        <div className="project-card-zoom">
                                             <div className="project-icon section-reveal">{project.icon}</div>
                                            <div className="timeline-content section-reveal">
                                                <div className="project-date-badge">{project.date}</div>
                                                <div className="project-info">
                                                    <h3>{project.title}</h3>
                                                    <p>{project.description}</p>
                                                    <div className="project-links">
                                                        {project.liveLink && <Link href={project.liveLink} className="project-link" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-globe"></i> View Live</Link>}
                                                        {project.codeLink && <Link href={project.codeLink} className="project-link" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i> View Code</Link>}
                                                        {project.portfolioLink && <a href="#" className="project-link" onClick={openDesignModal}><i className="fa-solid fa-image"></i> View Portfolio</a>}
                                                        {project.behanceLink && <Link href={project.behanceLink} className="project-link" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-behance"></i> View Behance</Link>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="timeline-col center"><div className="timeline-dot section-reveal"><span className="timeline-dot-icon">{project.icon}</span></div></div>
                                    <div className="timeline-col right"></div>
                                </>
                            ) : (
                                <>
                                    <div className="timeline-col left"></div>
                                    <div className="timeline-col center"><div className="timeline-dot section-reveal"><span className="timeline-dot-icon">{project.icon}</span></div></div>
                                    <div className="timeline-col right">
                                        <div className="project-card-zoom">
                                            <div className="project-icon section-reveal">{project.icon}</div>
                                            <div className="timeline-content section-reveal">
                                                <div className="project-date-badge">{project.date}</div>
                                                <div className="project-info">
                                                    <h3>{project.title}</h3>
                                                    <p>{project.description}</p>
                                                    <div className="project-links">
                                                        {project.liveLink && <Link href={project.liveLink} className="project-link" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-globe"></i> View Live</Link>}
                                                        {project.codeLink && <Link href={project.codeLink} className="project-link" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i> View Code</Link>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="projects-grid mobile-only">
                    {projects.map((project, index) => (
                        <div key={index} className="project-card">
                            <div className="project-icon">{project.icon}</div>
                            <div className="project-date-badge">{project.date}</div>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="project-links">
                                {project.liveLink && <Link href={project.liveLink} className="project-link" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-globe"></i> View Live</Link>}
                                {project.codeLink && <Link href={project.codeLink} className="project-link" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i> View Code</Link>}
                                {project.portfolioLink && <a href="#" className="project-link" onClick={openDesignModal}><i className="fa-solid fa-image"></i> View Portfolio</a>}
                                {project.behanceLink && <Link href={project.behanceLink} className="project-link" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-behance"></i> View Behance</Link>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {showDesignModal && <DesignGalleryModal onClose={() => setShowDesignModal(false)} />}
        </>
    );
}
