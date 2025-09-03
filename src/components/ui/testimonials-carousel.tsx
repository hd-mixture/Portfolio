"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from 'next/image';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export const TestimonialsCarousel = ({
  testimonials,
}: TestimonialsCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div
              className="min-w-0 flex-shrink-0 flex-grow-0 basis-full pl-4 md:basis-1/2 lg:basis-1/3"
              key={index}
            >
              <div className="testimonial-card">
                  <div className="quote-icon">
                    <i className="fa-solid fa-quote-left"></i>
                  </div>
                  <p className="testimonial-card-p">
                   {testimonial.quote}
                  </p>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-designation">{testimonial.designation}</div>
                    </div>
                    <div className="author-avatar">
                      <Image
                        src={testimonial.src}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        data-ai-hint="person portrait"
                      />
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 left-[-1rem] hidden md:block">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={scrollPrev}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Previous slide</span>
        </Button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-[-1rem] hidden md:block">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={scrollNext}
        >
          <ArrowRight className="h-5 w-5" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
    </div>
  );
};
