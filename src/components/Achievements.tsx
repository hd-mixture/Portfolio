"use client";

import React, { useEffect, useRef, useState } from 'react';

const Counter = ({ targetNumber, suffix, label }: { targetNumber: number; suffix: string; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 2000;
          const end = targetNumber;
          const increment = end / (duration / 16);

          const animate = () => {
            start += increment;
            if (start < end) {
              setCount(Math.ceil(start));
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [targetNumber]);

  return (
    <div ref={ref} className="achievement-card">
      <div className="number">{count}{suffix}</div>
      <div className="label">{label}</div>
    </div>
  );
};


const AchievementCard = ({ icon, targetNumber, suffix, label }: { icon: string; targetNumber: number; suffix: string; label: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let start = 0;
                    const duration = 1500;
                    const end = targetNumber;
                    if(end === 0) return;
                    const stepTime = Math.abs(Math.floor(duration / end));

                    const timer = setInterval(() => {
                        start += 1;
                        setCount(start);
                        if (start === end) {
                            clearInterval(timer);
                        }
                    }, stepTime);
                }
            },
            { threshold: 0.5 }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [targetNumber]);

    return (
        <div ref={ref} className="achievement-card">
            <i className={icon}></i>
            <div className="number">{count}{suffix}</div>
            <div className="label">{label}</div>
        </div>
    );
};


export default function Achievements() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="achievements" ref={sectionRef} className={`achievements-section section-reveal ${isVisible ? 'visible' : ''}`}>
        <h2>Achievements</h2>
        <div className="achievements-grid">
            <AchievementCard icon="fa-solid fa-briefcase" targetNumber={10} suffix="+" label="Projects" />
            <AchievementCard icon="fa-solid fa-award" targetNumber={5} suffix="" label="Years Experience" />
            <AchievementCard icon="fa-solid fa-users" targetNumber={20} suffix="+" label="Happy Clients" />
        </div>
    </section>
  );
}
