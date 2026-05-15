"use client";
import React from 'react';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const techSkills = [
  { name: 'HTML5', icon: <i className="fa-brands fa-html5"></i> },
  { name: 'CSS3', icon: <i className="fa-brands fa-css3-alt"></i> },
  { name: 'JavaScript', icon: <i className="fa-brands fa-js"></i> },
  { name: 'Tailwind CSS', icon: <Image src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" width={40} height={40} style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(20%) saturate(6268%) hue-rotate(222deg) brightness(89%) contrast(89%)' }} /> },
  { name: 'MongoDB', icon: <Image src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" alt="MongoDB" width={40} height={40} style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(20%) saturate(6268%) hue-rotate(222deg) brightness(89%) contrast(89%)' }} /> },
  { name: 'Express.js', icon: <Image src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" alt="Express.js" width={40} height={40} style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(20%) saturate(6268%) hue-rotate(222deg) brightness(89%) contrast(89%)' }} /> },
  { name: 'React', icon: <i className="fa-brands fa-react"></i> },
  { name: 'Node.js', icon: <i className="fa-brands fa-node-js"></i> },
  { name: 'Mongoose', icon: <Image src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongoose/mongoose-original.svg" alt="Mongoose" width={40} height={40} style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(20%) saturate(6268%) hue-rotate(222deg) brightness(89%) contrast(89%)' }} /> },
  { name: 'Postman', icon: <Image src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postman/postman-plain.svg" alt="Postman" width={40} height={40} style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(20%) saturate(6268%) hue-rotate(222deg) brightness(89%) contrast(89%)' }} /> },
  { name: 'Firebase', icon: <Image src="https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg" alt="Firebase" width={40} height={40} style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(20%) saturate(6268%) hue-rotate(222deg) brightness(89%) contrast(89%)' }} /> },
  { name: 'SQL', icon: <i className="fa-solid fa-database"></i> },
  { name: 'Figma', icon: <i className="fa-brands fa-figma"></i> },
  { name: 'CorelDRAW', icon: <i className="fa-solid fa-pen-nib"></i> },
  { name: 'Graphic Design', icon: <i className="fa-solid fa-palette"></i> },
  { name: 'Python', icon: <i className="fa-brands fa-python"></i> },
];


const TechStackMarquee = () => {
    // Duplicate the array to create a seamless loop
    const extendedSkills = [...techSkills, ...techSkills, ...techSkills, ...techSkills];
  
    return (
        <div className="marquee-container">
            <div className="marquee-content">
            {extendedSkills.map((skill, index) => (
                <Tooltip key={`skill-${index}`}>
                    <TooltipTrigger asChild>
                        <div className="techstack-item">
                            {skill.icon}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{skill.name}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
            </div>
        </div>
    );
};

export default function TechStack() {
    return (
        <section id="techstack" className="techstack-section section-reveal">
            <TooltipProvider delayDuration={100}>
                <h2>Tech Stack & Tools</h2>
                <div className="techstack-wrapper">
                    <TechStackMarquee />
                </div>
            </TooltipProvider>
        </section>
    );
}
