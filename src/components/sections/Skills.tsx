"use client";
import React from 'react';
import Image from 'next/image';

const skills = [
  { name: 'HTML5', icon: <i className="fa-brands fa-html5"></i> },
  { name: 'CSS3', icon: <i className="fa-brands fa-css3-alt"></i> },
  { name: 'JavaScript', icon: <i className="fa-brands fa-js"></i> },
  { name: 'Tailwind CSS', icon: <i className="fa-brands fa-css3"></i> },
  { name: 'MongoDB', icon: <Image src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" alt="MongoDB" width={24} height={24} style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(20%) saturate(6268%) hue-rotate(222deg) brightness(89%) contrast(89%)' }} /> },
  { name: 'Express.js', icon: <Image src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" alt="Express.js" width={24} height={24} style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(20%) saturate(6268%) hue-rotate(222deg) brightness(89%) contrast(89%)' }} /> },
  { name: 'React', icon: <i className="fa-brands fa-react"></i> },
  { name: 'Node.js', icon: <i className="fa-brands fa-node-js"></i> },
  { name: 'Mongoose', icon: <Image src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongoose/mongoose-original.svg" alt="Mongoose" width={24} height={24} style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(20%) saturate(6268%) hue-rotate(222deg) brightness(89%) contrast(89%)' }} /> },
  { name: 'Postman', icon: <Image src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postman/postman-plain.svg" alt="Postman" width={24} height={24} style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(20%) saturate(6268%) hue-rotate(222deg) brightness(89%) contrast(89%)' }} /> },
  { name: 'Firebase', icon: <Image src="https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg" alt="Firebase" width={24} height={24} style={{ filter: 'brightness(0) saturate(100%) invert(24%) sepia(20%) saturate(6268%) hue-rotate(222deg) brightness(89%) contrast(89%)' }} /> },
  { name: 'SQL', icon: <i className="fa-solid fa-database"></i> },
  { name: 'Figma', icon: <i className="fa-brands fa-figma"></i> },
  { name: 'CorelDRAW', icon: <i className="fa-solid fa-pen-nib"></i> },
  { name: 'Graphic Design', icon: <i className="fa-solid fa-palette"></i> },
  { name: 'Python', icon: <i className="fa-brands fa-python"></i> },
];

export default function Skills() {
  return (
    <section id="skills" className="skills-section section-reveal">
      <h2>Skills</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div className="skill-card" key={index}>
            {skill.icon}
            <span>{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
