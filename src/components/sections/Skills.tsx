"use client";
import React from 'react';

const skills = [
  {
    name: 'Problem Solving',
    icon: 'fa-solid fa-lightbulb',
    description: 'Identifying complex problems and developing effective solutions.'
  },
  {
    name: 'Team Collaboration',
    icon: 'fa-solid fa-users',
    description: 'Working effectively with teams to achieve common goals.'
  },
  {
    name: 'Critical Thinking',
    icon: 'fa-solid fa-brain',
    description: 'Analyzing information objectively and making reasoned judgments.'
  },
  {
    name: 'UI/UX Design',
    icon: 'fa-solid fa-object-group',
    description: 'Creating intuitive and visually appealing user interfaces.'
  },
  {
    name: 'Frontend Development',
    icon: 'fa-solid fa-code',
    description: 'Building responsive and interactive web frontends.'
  },
  {
    name: 'Time Management',
    icon: 'fa-solid fa-clock',
    description: 'Organizing and planning how to divide your time between activities.'
  }
];

export default function Skills() {
  return (
    <section id="skills" className="skills-section section-reveal">
      <h2>Skills</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div key={index} className="skill-card">
            <i className={`skill-icon ${skill.icon}`}></i>
            <h3>{skill.name}</h3>
            <p>{skill.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
