"use client";
import React, { useEffect, useRef, useState } from 'react';

const achievements = [
    { icon: "fa-solid fa-briefcase", target: 10, suffix: "+", label: "Projects" },
    { icon: "fa-solid fa-award", target: 5, suffix: "", label: "Years Experience" },
    { icon: "fa-solid fa-users", target: 20, suffix: "+", label: "Happy Clients" },
];

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
                    const stepTime = Math.abs(Math.floor(duration / target));
                    
                    if (target === 0) return;

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

export default function Achievements() {
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
