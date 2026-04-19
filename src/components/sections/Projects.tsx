
"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ProjectStatus = 'completed' | 'ongoing' | 'live';

export const projectsData = [
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
        { src: "/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0020.jpg", title: "Driving Licence Application Splash Screen" },
        { src: "/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0021.jpg", title: "Driving Licence Application Register Screen" },
        { src: "/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0022.jpg", title: "Driving Licence Application Login Screen" },
        { src: "/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0024.jpg", title: "Driving Licence Application Categories Screen" },
        { src: "/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0025.jpg", title: "Driving Licence Application Categories Screen " }
    ],
    web: [
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_1.png", title: "Campus Cuisine 2 Home Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_2.png", title: "Campus Cuisine 2 Login Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_3.png", title: "Campus Cuisine 2 Order Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_4.png", title: "Campus Cuisine 2 Order Checkout Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_5.png", title: "Campus Cuisine 2 Dashboard" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_6.png", title: "Campus Cuisine 2 Delivery Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_7.png", title: "Campus Cuisine 2 About Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_8.png", title: "Campus Cuisine 2 Contact Page" }
    ],
    banners: [
        { src: "/Graphic Designs/Banner/Blood Donation E-Banner_.jpg", title: "UPL Blood Donation Banner" },
        { src: "/Graphic Designs/Banner/BOD Navrati Banner.png", title: "UPL Navratri Banner" },
        { src: "/Graphic Designs/Banner/Diploma Summer Result 2024 Banner.png", title: "UPL Result Standy Banner" },
        { src: "/Graphic Designs/Banner/IMG-20250311-WA0023.jpg", title: "UPL Admission Banner 2025 - 26" },
        { src: "/Graphic Designs/Banner/Main Banner.png", title: "UPL Ganpati Hostel Banner" },
        { src: "/Graphic Designs/Banner/Sec- Tec Banner Graphic Poster Final Day.jpg", title: "UPL Sci - Technovation 2022 Graphic Banner" },
        { src: "/Graphic Designs/Banner/Sec- Tec Game Banner.jpg", title: "UPL Sci - Technovation 2022 Mobile Game Banner" },
        { src: "/Graphic Designs/Banner/σ Banner.jpg", title: "Sigma Night Standy Banner" }
    ],
    certificates: [
        { src: "/Graphic Designs/Certificate/BOD Potery Certificate - 2.jpg", title: "UPL Certificate Design 1" },
        { src: "/Graphic Designs/Certificate/Certificate on Webinar.jpg", title: "UPL Certificate Design 2" },
        { src: "/Graphic Designs/Certificate/WordPrees Certificate_.jpg", title: "UPL Certificate Design 3" }
    ],
    logos: [
        { src: "/Graphic Designs/Logos/ABHAR Orange Resize Logo.png", title: "ABHAR Logo" },
        { src: "/Graphic Designs/Logos/BIttStock App Logo.png", title: "Bittstock Logo" },
        { src: "/Graphic Designs/Logos/Campus Cuisin Logo.jpg", title: "Campus Cuisine Logo" },
        { src: "/Graphic Designs/Logos/Driving Licence App Logo.png", title: "Driving Licence Logo" },
        { src: "/Graphic Designs/Logos/Netflix Unlock Creative Logo.png", title: "COHORT Logo" },
        { src: "/Graphic Designs/Logos/Neural Grafix Logo.png", title: "Neural Grafix Logo" },
        { src: "/Graphic Designs/Logos/save_share_logo1.png", title: "Save & Share Logo" },
        { src: "/Graphic Designs/Logos/YASHODA Logo.png", title: "Yashoda Furniture Logo" },
        { src: "/Graphic Designs/Logos/K-Naturals Logo.jpg", title: "Krishna Naturals Logo" }
    ],
    posters: [
        { src: "/Graphic Designs/Posters/BOD Blood Donation Poster.jpg", title: "Rotaract Rakt Kundali Post" },
        { src: "/Graphic Designs/Posters/BOD Freshers Poster Beginning.jpg", title: "Rotaract Brizzy Night Post" },
        { src: "/Graphic Designs/Posters/BOD Ganesh Mahotsav Poster.jpg", title: "Rotaract Ganpati Banner" },
        { src: "/Graphic Designs/Posters/BOD Independence Day.jpg", title: "Rotaract 76th Independence Day Post" },
        { src: "/Graphic Designs/Posters/BOD Letter Exchange PanColombo.jpg", title: "Rotaract Letterhead Poster" },
        { src: "/Graphic Designs/Posters/BOD National Cinema Day.jpg", title: "Rotaract National Cinema Day Post" },
        { src: "/Graphic Designs/Posters/BOD Physically Challenged Poster Page 3.jpg", title: "Rotaract Medical Camp Post" },
        { src: "/Graphic Designs/Posters/BOD Raksha_Bandhan.jpg", title: "Rotaract Raksha Bhandhan Post" },
        { src: "/Graphic Designs/Posters/BOD World Physo Day.jpg", title: "Rotaract Word Physo Day Post" },
        { src: "/Graphic Designs/Posters/BOD મિત્રતા - એક સંબંધ.jpg", title: "Rotaract મિત્રતા - એક સંબંધ Post" }
    ]
};

const allDesigns = Object.values(designData).flat();

const FullImageSlider = ({ images, startIndex, onClose }: { images: {src: string, title: string}[], startIndex: number, onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

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

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrev();
        }
        setTouchStart(null);
        setTouchEnd(null);
    };


    return (
        <div 
          className="full-image-modal" 
          style={{display: 'flex'}} 
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
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
        const getSortableDate = (dateStr: string) => {
            const datePart = dateStr.split(' - ')[0];
            if (datePart.toLowerCase().includes('ongoing') || datePart.toLowerCase().includes('present')) {
                return new Date(8640000000000000); 
            }
            return new Date(datePart);
        };

        const dateA = getSortableDate(a.date);
        const dateB = getSortableDate(b.date);

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
                            <div className={`project-icon ${project.status === 'live' || project.status === 'ongoing' ? 'live' : ''}`}>{project.icon}</div>
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
