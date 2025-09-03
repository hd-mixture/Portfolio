"use client";
import React from 'react';
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const testimonials = [
    {
        quote: "Darshan has demonstrated exceptional creativity and design skill in his work for UPL University. His graphics are not only visually striking but also align perfectly with the university's branding. Each design reflects a strong understanding of layout, color harmony, and purpose. The attention to detail and originality in his work clearly set him apart. His ability to communicate ideas effectively through design is commendable. Overall, Darshan's portfolio showcases professional-level talent and dedication.",
        name: "Rupali Attarde",
        designation: "Assistant Professor at UPL University of Sustainable Technology",
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        quote: "Working with Darshan was an absolute pleasure. He transformed our complex ideas into a beautiful, functional app that exceeded our expectations. His attention to detail and ability to understand client needs is remarkable. The final product was not only visually appealing but also highly intuitive and user-friendly.",
        name: "Sarah Johnson",
        designation: "Product Manager at TechStart",
        src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        quote: "Darshan's technical skills and communication abilities are outstanding. He delivered our project on time and within budget while maintaining the highest quality standards. His expertise in both frontend and backend development made him an invaluable team member. Highly recommended for any web or mobile project.",
        name: "Michael Chen",
        designation: "CTO at Digital Solutions",
        src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        quote: "The graphic design work Darshan created for our marketing campaign was exceptional. His creative vision and technical execution brought our brand to life in ways we hadn't imagined. The designs were not only beautiful but also strategically effective in reaching our target audience.",
        name: "Emily Rodriguez",
        designation: "Marketing Director at Creative Agency",
        src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        quote: "Darshan's ability to blend creativity with technical precision is rare. He consistently delivers projects that are both aesthetically pleasing and functionally robust. His collaborative approach and willingness to go the extra mile make him a pleasure to work with.",
        name: "David Thompson",
        designation: "Senior Developer at Innovation Labs",
        src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="testimonials-section section-reveal">
            <h2>Testimonials</h2>
            <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </section>
    );
}
