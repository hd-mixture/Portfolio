"use client";
import React from 'react';

const testimonials = [
    {
        quote: "Darshan has demonstrated exceptional creativity and design skill in his work for UPL University. His graphics are not only visually striking but also align perfectly with the university's branding. Each design reflects a strong understanding of layout, color harmony, and purpose. The attention to detail and originality in his work clearly set him apart. His ability to communicate ideas effectively through design is commendable. Overall, Darshan's portfolio showcases professional-level talent and dedication.",
        author: "Rupali Attarde",
        designation: "Assistant Professor at UPL University of Sustainable Technology",
        avatarIcon: "fa-solid fa-user-graduate"
    },
    {
        quote: "Working with Darshan was an absolute pleasure. He transformed our complex ideas into a beautiful, functional app that exceeded our expectations. His attention to detail and ability to understand client needs is remarkable. The final product was not only visually appealing but also highly intuitive and user-friendly.",
        author: "Sarah Johnson",
        designation: "Product Manager at TechStart",
        avatarIcon: "fa-solid fa-user-tie"
    },
    {
        quote: "Darshan's technical skills and communication abilities are outstanding. He delivered our project on time and within budget while maintaining the highest quality standards. His expertise in both frontend and backend development made him an invaluable team member. Highly recommended for any web or mobile project.",
        author: "Michael Chen",
        designation: "CTO at Digital Solutions",
        avatarIcon: "fa-solid fa-user-gear"
    },
    {
        quote: "The graphic design work Darshan created for our marketing campaign was exceptional. His creative vision and technical execution brought our brand to life in ways we hadn't imagined. The designs were not only beautiful but also strategically effective in reaching our target audience.",
        author: "Emily Rodriguez",
        designation: "Marketing Director at Creative Agency",
        avatarIcon: "fa-solid fa-user-pen"
    },
    {
        quote: "Darshan's ability to blend creativity with technical precision is rare. He consistently delivers projects that are both aesthetically pleasing and functionally robust. His collaborative approach and willingness to go the extra mile make him a pleasure to work with.",
        author: "David Thompson",
        designation: "Senior Developer at Innovation Labs",
        avatarIcon: "fa-solid fa-user-ninja"
    }
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="testimonials-section section-reveal">
            <h2>Testimonials</h2>
            <div className="testimonials-container">
                <div className="testimonials-wrapper">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-content">
                                <div className="quote-icon">
                                    <i className="fa-solid fa-quote-left"></i>
                                </div>
                                <p>"{testimonial.quote}"</p>
                                <div className="testimonial-author">
                                    <div className="author-info">
                                        <div className="author-name">{testimonial.author}</div>
                                        <div className="author-designation">{testimonial.designation}</div>
                                    </div>
                                    <div className="author-avatar">
                                        <i className={testimonial.avatarIcon}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
