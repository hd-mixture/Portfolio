
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { projectsData } from './Projects';
import { testimonials } from './Testimonials';

const AchievementCard = ({ icon, target, suffix, label }: { icon: string; target: number; suffix: string; label: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const element = ref.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let start = 0;
                    const duration = 1500;
                    if (target === 0) {
                        setCount(0);
                        return;
                    }
                    const stepTime = Math.abs(Math.floor(duration / target));

                    const timer = setInterval(() => {
                        start += 1;
                        setCount(start);
                        if (start === target) {
                            clearInterval(timer);
                        }
                    }, stepTime);
                }
            },
            { threshold: 0.5 }
        );

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [target]);

    return (
        <div ref={ref} className="achievement-card">
            <i className={icon}></i>
            <div className="number">{count}{suffix}</div>
            <div className="label">{label}</div>
        </div>
    );
};

const getYearsOfExperience = () => {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
}

export default function Achievements() {
  const [projectsCount, setProjectsCount] = useState(0);
  const [experience, setExperience] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  
  useEffect(() => {
    setProjectsCount(projectsData.length);
    setExperience(getYearsOfExperience());
    setClientsCount(testimonials.length);
  }, []);

  const achievements = [
      { icon: "fa-solid fa-briefcase", target: projectsCount, suffix: "+", label: "Projects" },
      { icon: "fa-solid fa-award", target: experience, suffix: "+", label: "Years Experience" },
      { icon: "fa-solid fa-users", target: clientsCount, suffix: "+", label: "Happy Clients" },
  ];

  return (
    <section id="achievements" className="achievements-section section-reveal">
        <h2>Achievements</h2>
        <div className="achievements-grid">
            {achievements.map((ach, index) => (
                <AchievementCard key={index} {...ach} />
            ))}
        </div>
    </section>
  );
}
