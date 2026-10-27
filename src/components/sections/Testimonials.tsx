
"use client";

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export const initialTestimonials = [
    {
      quote:
        "Darshan has demonstrated exceptional creativity and design skill in his work for UPL University. His graphics are not only visually striking but also align perfectly with the university's branding. Each design reflects a strong understanding of layout, color harmony, and purpose. The attention to detail and originality in his work clearly set him apart. His ability to communicate ideas effectively through design is commendable. Overall, Darshan's portfolio showcases professional-level talent and dedication.",
      name: "Rupali Attarde",
      designation: "Assistant Professor at UPL University of Sustainable Technology",
      src: "/Testimonials Photos/Rupali Ma'am.png?v=2",
      stars: 5,
    },
    {
      quote:
        "The graphic design work Darshan created for our marketing campaign was exceptional. His creative vision and technical execution brought our brand to life in ways we hadn't imagined. The designs were not only beautiful but also strategically effective in reaching our target audience.",
      name: "Anup Sharma",
      designation: "Entrepreneur & Business Owner",
      src: "/Testimonials Photos/Anup.png",
      stars: 5,
    },
  ];

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setTestimonials(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch testimonials from backend", error);
      }
    };
    
    fetchTestimonials();
  }, []);

  return (
    <motion.section 
      id="testimonials" 
      className="testimonials-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.4, 2, 0.6, 1] }}
    >
      {/* Organic background elements */}
      <div className="tm-bg-blob"></div>
      <div className="tm-particle tm-particle-1"></div>
      <div className="tm-particle tm-particle-2"></div>
      <div className="tm-particle tm-particle-3"></div>
      <div className="tm-particle tm-particle-4"></div>
      
      <div className="tm-header-wrapper">
        <div className="tm-top-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
          TESTIMONIALS
        </div>
        
        <div className="tm-title-container">
          <h2 className="tm-title">
            What <span className="tm-title-highlight">People</span> Say
          </h2>
          <div className="tm-title-underline"></div>
        </div>
        
        <p className="tm-subtitle-text">
          Real experiences from clients, mentors, <br className="hidden md:block"/> and collaborators I've worked with.
        </p>
      </div>

      <AnimatedTestimonials testimonials={testimonials} />
    </motion.section>
  );
}
