"use client";

import React, { FormEvent, useRef, useState } from 'react';

declare global {
    interface Window {
        emailjs: any;
    }
}

export default function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const sendEmail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formRef.current || status === 'sending') return;
        if (typeof window.emailjs === 'undefined') {
            console.error('EmailJS script not loaded');
            setStatus('error');
            return;
        }

        setStatus('sending');

        window.emailjs.sendForm('service_0x9isti', 'template_pn7n1mc', formRef.current, 'lGrdPZlqH_eXVNyV0')
            .then(() => {
                setStatus('sent');
                formRef.current?.reset();
                setTimeout(() => setStatus('idle'), 3000);
            }, (error: any) => {
                console.error('EmailJS error:', error);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            });
    };

    const getButtonContent = () => {
        switch (status) {
            case 'sending':
                return (
                    <>
                        <span className="sending-spinner">
                            <i className="fa-solid fa-spinner fa-spin"></i>
                        </span>
                        Sending...
                    </>
                );
            case 'sent':
                return <><i className="fa-solid fa-check"></i> Message Sent!</>;
            case 'error':
                return <><i className="fa-solid fa-xmark"></i> Failed to Send</>;
            default:
                return 'Send Message';
        }
    };

    return (
        <section id="contact" className="contact-section section-reveal">
            <h2>Contact</h2>
            <form ref={formRef} className="contact-form" onSubmit={sendEmail}>
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="email" name="email" placeholder="Your Email" required />
                <textarea name="message" placeholder="Your Message" required></textarea>
                <button type="submit" disabled={status === 'sending'} 
                  style={{
                    backgroundColor: status === 'sent' ? '#4CAF50' : status === 'error' ? '#f44336' : '',
                  }}>
                    {getButtonContent()}
                </button>
            </form>
            <div className="contact-socials">
                <a href="https://www.linkedin.com/in/hdmixture/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="https://www.instagram.com/hd_mixture/ss" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
                <a href="https://github.com/hd-mixture" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
                <a href="https://wa.link/ey6lzx" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
        </section>
    );
}
