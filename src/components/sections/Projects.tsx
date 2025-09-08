
"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ProjectStatus = 'completed' | 'ongoing' | 'live';

const projectsData = [
  {
    date: "Jul 2025 - Ongoing",
    title: "DevTeXhHub",
    description: "DevTeXhHub is a modern, full-featured project management application designed to streamline workflows for software development teams. It provides distinct, role-based dashboards for Admins, Managers, Developers, QAs, and Designers, ensuring that every team member has the tools they need to be productive.",
    liveLink: null,
    codeLink: null,
    icon: <Image src="/Project Logo/DevTeXhHub Logo.png" alt="DevTeXhHub Logo" width={48} height={48} data-ai-hint="modern logo" />,
    timelineIcon: <i className="fa-solid fa-tasks"></i>,
    status: 'ongoing' as ProjectStatus,
  },
  {
    date: "Jun 2025 - Jul 2025",
    title: "Cardify",
    description: "Cardify is a modern, web-based application that allows users to effortlessly create, customize, and download professional virtual visiting cards. With a live preview and a wide range of customization options, creating your perfect digital card has never been easier.",
    liveLink: "https://cardify.hdmixture.site",
    codeLink: "https://github.com/hd-mixture/Cardify.git",
    icon: <Image src="/Project Logo/Cardify Logo.png" alt="Cardify Logo" width={48} height={48} data-ai-hint="visiting card" />,
    timelineIcon: <i className="fa-solid fa-address-card"></i>,
    status: 'completed' as ProjectStatus,
  },
  {
    date: "Mar 2020 - Ongoing",
    title: "Graphic Designs",
    description: "A showcase of my creative graphic design works, including posters, banners, logos, and more.",
    portfolioLink: true,
    behanceLink: "https://www.behance.net/hd_mixture",
    icon: <i className="fa-solid fa-palette"></i>,
    timelineIcon: <i className="fa-solid fa-palette"></i>,
    status: 'ongoing' as ProjectStatus,
  },
  {
    date: "Jan 2025 - May 2025",
    title: "Campus Cuisine 2.0 – Web Application (Enhanced Version)",
    description: "Upgraded the UI/UX, added real-time ordering features, and role-based admin functionalities.",
    liveLink: "https://hd-mixture.github.io/Campus-Cuisine-2/",
    codeLink: "https://github.com/hd-mixture/Campus-Cuisine-2",
    icon: <Image src="/Project Logo/Campus_Cuisine_Logo_.2.0.png" alt="Campus Cuisine 2.0 Logo" width={48} height={48} data-ai-hint="modern food" />,
    timelineIcon: <i className="fa-solid fa-utensils"></i>,
    status: 'completed' as ProjectStatus,
  },
  {
    date: "Feb 2025 - Apr 2025",
    title: "Save & Share – PHP-Based Donation Platform",
    description: "Designed a donation network connecting food donors, NGOs, and volunteers.",
    liveLink: "https://github.com/100rabx23/Save-Share.git",
    codeLink: "https://github.com/100rabx23/Save-Share.git",
    icon: <Image src="/Project Logo/save_share_logo.png" alt="Save & Share Logo" width={48} height={48} data-ai-hint="charity logo" />,
    timelineIcon: <i className="fa-solid fa-hand-holding-heart"></i>,
    status: 'completed' as ProjectStatus,
  },
  {
    date: "Oct 2024 - Present",
    title: "ABHAR : AI-Based Home Automation Robot – Group Project (G-Code, C++)",
    description: "Built an automation robot to control home appliances via voice commands and sensors. Programmed using G-Code and C++ with smart features for real-time response.",
    liveLink: "https://epicpjm05.github.io/ABHAR/WEb",
    codeLink: "https://github.com/EPICPJM05/ABHAR.git",
    icon: <Image src="/Project Logo/ABHAR Orange Resize Logo.png" alt="ABHAR Logo" width={48} height={48} data-ai-hint="robot logo" />,
    timelineIcon: <i className="fa-solid fa-robot"></i>,
    status: 'live' as ProjectStatus,
  },
  {
    date: "Apr 2025 - Apr 2025",
    title: "BitTRiX AI : Automated Test Agent – Group Project (Python)",
    description: "Developed a smart testing system to generate and integrate with CI/CD tools.",
    liveLink: "https://github.com/EPICPJM05/NU-Thon-Bittrix.git",
    codeLink: "https://github.com/EPICPJM05/NU-Thon-Bittrix.git",
    icon: <Image src="/Project Logo/BitTRix Logo.jpg" alt="BitTRiX AI Logo" width={48} height={48} data-ai-hint="ai logo" />,
    timelineIcon: <i className="fa-solid fa-microchip"></i>,
    status: 'completed' as ProjectStatus,
  },
  {
    date: "Mar 2024 - Jun 2024",
    title: "Campus Cuisine – Web Application (Initial Version)",
    description: "Built a web app for students to discover and review affordable meals on campus.",
    liveLink: "https://hd-mixture.github.io/Campus-Cuisine/",
    codeLink: "https://github.com/hd-mixture/Campus-Cuisine.git",
    icon: <Image src="/Project Logo/Campus Cuisin Logo Black.png" alt="Campus Cuisine Logo" width={48} height={48} data-ai-hint="food logo" />,
    timelineIcon: <i className="fa-solid fa-utensils"></i>,
    status: 'completed' as ProjectStatus,
  },
  {
    date: "Aug 2023 - Sep 2023",
    title: "Driving Licence Application – Mobile Application",
    description: "Designed a user-friendly interface to apply, check documents, and track driving licence.",
    liveLink: "https://github.com/hd-mixture/DrivingLicenceApplicaion.git",
    codeLink: "https://github.com/hd-mixture/DrivingLicenceApplicaion.git",
    icon: <Image src="/Project Logo/Driving Licence App Logo.png" alt="Driving Licence App Logo" width={48} height={48} data-ai-hint="card document" />,
    timelineIcon: <i className="fa-solid fa-id-card"></i>,
    status: 'completed' as ProjectStatus,
  },
  {
    date: "Aug 2022 - Sep 2022",
    title: "Nearby Places – Mobile Application",
    description: "Created an Android app using Google Maps API to display nearby essential locations like ATMs, hospitals, and restaurants.",
    liveLink: "https://github.com/hd-mixture/Nearby-Places.git",
    codeLink: "https://github.com/hd-mixture/Nearby-Places.git",
    icon: <Image src="/Project Logo/Nearby Place Logo.png?v=2" alt="Nearby Places Logo" width={48} height={48} data-ai-hint="location pin" />,
    timelineIcon: <i className="fa-solid fa-location-dot"></i>,
    status: 'completed' as ProjectStatus,
  }
];

const designData = {
    android: [
        { src: "/Graphic Designes/Android/1.png", title: "Android Screen Design 1" },
        { src: "/Graphic Designes/Android/2.png", title: "Android Screen Design 2" },
        { src: "/Graphic Designes/Android/3.png", title: "Android Screen Design 3" },
        { src: "/Graphic Designes/Android/4.png", title: "Android Screen Design 4" },
        { src: "/Graphic Designes/Android/5.png", title: "Android Screen Design 5" }
    ],
    web: [
        { src: "/Graphic Designes/Web/1.png", title: "Web Screen Design 1" },
        { src: "/Graphic Designes/Web/2.png", title: "Web Screen Design 2" },
        { src: "/Graphic Designes/Web/3.png", title: "Web Screen Design 3" },
        { src: "/Graphic Designes/Web/4.png", title: "Web Screen Design 4" },
        { src: "/Graphic Designes/Web/5.png", title: "Web Screen Design 5" },
        { src: "/Graphic Designes/Web/6.png", title: "Web Screen Design 6" },
        { src: "/Graphic Designes/Web/7.png", title: "Web Screen Design 7" },
        { src: "/Graphic Designes/Web/8.png", title: "Web Screen Design 8" }
    ],
    banners: [
        { src: "/Graphic Designes/Banners/1.png", title: "Banner Design 1" },
        { src: "/Graphic Designes/Banners/2.png", title: "Banner Design 2" },
        { src: "/Graphic Designes/Banners/3.png", title: "Banner Design 3" },
        { src: "/Graphic Designes/Banners/4.png", title: "Banner Design 4" },
        { src: "/Graphic Designes/Banners/5.png", title: "Banner Design 5" },
        { src: "/Graphic Designes/Banners/6.png", title: "Banner Design 6" },
        { src: "/Graphic Designes/Banners/7.png", title: "Banner Design 7" }
    ],
    certificates: [
        { src: "/Graphic Designes/Certificates/1.png", title: "Certificate Design 1" },
        { src: "/Graphic Designes/Certificates/2.png", title: "Certificate Design 2" },
        { src: "/Graphic Designes/Certificates/3.png", title: "Certificate Design 3" }
    ],
    logos: [
        { src: "/Graphic Designes/Logos/1.png", title: "Logo Design 1" },
        { src: "/Graphic Designes/Logos/2.png", title: "Logo Design 2" },
        { src: "/Graphic Designes/Logos/3.png", title: "Logo Design 3" },
        { src: "/Graphic Designes/Logos/4.png", title: "Logo Design 4" },
        { src: "/Graphic Designes/Logos/5.png", title: "Logo Design 5" },
        { src: "/Graphic Designes/Logos/6.png", title: "Logo Design 6" },
        { src: "/Graphic Designes/Logos/7.png", title: "Logo Design 7" },
        { src: "/Graphic Designes/Logos/8.png", title: "Logo Design 8" }
    ],
    posters: [
        { src: "/Graphic Designes/Posters/1.png", title: "Poster Design 1" },
        { src: "/Graphic Designes/Posters/2.png", title: "Poster Design 2" },
        { src: "/Graphic Designes/Posters/3.png", title: "Poster Design 3" },
        { src: "/Graphic Designes/Posters/4.png", title: "Poster Design 4" },
        { src: "/Graphic Designes/Posters/5.png", title: "Poster Design 5" },
        { src: "/Graphic Designes/Posters/6.png", title: "Poster Design 6" },
        { src: "/Graphic Designes/Posters/7.png", title: "Poster Design 7" },
        { src: "/Graphic Designes/Posters/8.png", title: "Poster Design 8" },
        { src: "/Graphic Designes/Posters/9.png", title: "Poster Design 9" },
        { src: "/Graphic Designes/Posters/10.png", title: "Poster Design 10" }
    ]
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

const ProjectLinks = ({ project, openDesignModal }: { project: any, openDesignModal: (e: React.MouseEvent) => void }) => {
    const disabledStyle = { cursor: 'not-allowed', opacity: 0.5 };
    
    if (project.portfolioLink) {
        return (
            <>
                <a href="#" className="project-link" onClick={openDesignModal}><i className="fa-solid fa-image"></i> View Portfolio</a>
                {project.behanceLink && <Link href={project.behanceLink} className="project-link" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-behance"></i> View Behance</Link>}
            </>
        );
    }

    return (
        <>
            {project.liveLink ? (
                <Link href={project.liveLink} className="project-link" target="_blank" rel="noopener noreferrer">
                    <i className="fa-solid fa-globe"></i> View Live
                </Link>
            ) : (
                <span className="project-link" style={disabledStyle}>
                    <i className="fa-solid fa-globe"></i> View Live
                </span>
            )}
            {project.codeLink ? (
                <Link href={project.codeLink} className="project-link" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-github"></i> View Code
                </Link>
            ) : (
                <span className="project-link" style={disabledStyle}>
                    <i className="fa-brands fa-github"></i> View Code
                </span>
            )}
        </>
    );
};

export default function Projects() {
    const [showDesignModal, setShowDesignModal] = useState(false);

    const openDesignModal = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowDesignModal(true);
    }
    
    const sortedProjects = [...projectsData].sort((a, b) => {
        const dateToParseA = a.date.split(' - ')[0];
        const dateToParseB = b.date.split(' - ')[0];
        
        // Handle "Ongoing" or "Present" dates by giving them a very high value
        const getSortableDate = (dateStr: string) => {
            if (dateStr.toLowerCase().includes('ongoing') || dateStr.toLowerCase().includes('present')) {
                return new Date(8640000000000000); // Max Date
            }
            return new Date(dateStr);
        };

        const dateA = getSortableDate(dateToParseA);
        const dateB = getSortableDate(dateToParseB);

        return dateB.getTime() - dateA.getTime();
    });

    return (
        <>
            <section id="projects" className="projects-section section-reveal">
                <h2>Projects</h2>
                <div className="projects-timeline">
                    {sortedProjects.map((project, index) => {
                        const side = index % 2 === 0 ? 'right' : 'left';
                        return (
                            <div key={index} className="timeline-event" data-side={side}>
                                {side === 'left' ? (
                                    <>
                                        <div className="timeline-col left">
                                            <div className="project-card-zoom">
                                                <div className="timeline-content section-reveal">
                                                    <div className={`project-icon ${side}`}>{project.icon}</div>
                                                    <div className="project-date-badge">{project.date}</div>
                                                    <div className="project-info">
                                                        <h3>{project.title}</h3>
                                                        <p>{project.description}</p>
                                                        <div className="project-links">
                                                          <ProjectLinks project={project} openDesignModal={openDesignModal} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="timeline-col center"><div className={`timeline-dot section-reveal ${project.status === 'live' || project.status === 'ongoing' ? 'live' : ''}`}><span className="timeline-dot-icon">{project.timelineIcon}</span></div></div>
                                        <div className="timeline-col right"></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="timeline-col left"></div>
                                        <div className="timeline-col center"><div className={`timeline-dot section-reveal ${project.status === 'live' || project.status === 'ongoing' ? 'live' : ''}`}><span className="timeline-dot-icon">{project.timelineIcon}</span></div></div>
                                        <div className="timeline-col right">
                                            <div className="project-card-zoom">
                                                <div className="timeline-content section-reveal">
                                                    <div className={`project-icon ${side}`}>{project.icon}</div>
                                                    <div className="project-date-badge">{project.date}</div>
                                                    <div className="project-info">
                                                        <h3>{project.title}</h3>
                                                        <p>{project.description}</p>
                                                        <div className="project-links">
                                                            <ProjectLinks project={project} openDesignModal={openDesignModal} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="projects-grid mobile-only">
                    {sortedProjects.map((project, index) => (
                        <div key={index} className="project-card">
                            <div className="project-icon">{project.icon}</div>
                            <div className="project-date-badge">{project.date}</div>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="project-links">
                                <ProjectLinks project={project} openDesignModal={openDesignModal} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {showDesignModal && <DesignGalleryModal onClose={() => setShowDesignModal(false)} />}
        </>
    );
}

    