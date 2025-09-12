
"use client";

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export const testimonials = [
    {
      quote:
        "Darshan has demonstrated exceptional creativity and design skill in his work for UPL University. His graphics are not only visually striking but also align perfectly with the university's branding. Each design reflects a strong understanding of layout, color harmony, and purpose. The attention to detail and originality in his work clearly set him apart. His ability to communicate ideas effectively through design is commendable. Overall, Darshan's portfolio showcases professional-level talent and dedication.",
      name: "Rupali Attarde",
      designation: "Assistant Professor at UPL University of Sustainable Technology",
      src: "/Testimonials Photos/Rupali Ma'am.png?v=2",
    },
    {
      quote:
        "The graphic design work Darshan created for our marketing campaign was exceptional. His creative vision and technical execution brought our brand to life in ways we hadn't imagined. The designs were not only beautiful but also strategically effective in reaching our target audience.",
      name: "Anup Sharma",
      designation: "Entrepreneur & Business Owner",
      src: "/Testimonials Photos/Anup.png",
    },
  ];

export default function Testimonials() {

  return (
    <section id="testimonials" className="testimonials-section section-reveal">
      <h2>Testimonials</h2>
      <AnimatedTestimonials testimonials={testimonials} />
    </section>
  );
}
