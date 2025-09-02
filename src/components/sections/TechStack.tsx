"use client";
import React from 'react';

const techStack = [
    "fa-brands fa-html5",
    "fa-brands fa-css3-alt",
    "fa-brands fa-js",
    "fa-brands fa-react",
    "fa-brands fa-node-js",
    "fa-brands fa-android",
    "fa-solid fa-database",
    "fa-solid fa-paintbrush"
];

export default function TechStack() {
    return (
        <section id="techstack" className="techstack-section section-reveal">
            <h2>Tech Stack & Tools</h2>
            <div className="techstack-carousel">
                {techStack.map((iconClass, index) => (
                    <div key={index} className="techstack-logo">
                        <i className={iconClass}></i>
                    </div>
                ))}
            </div>
        </section>
    );
}
