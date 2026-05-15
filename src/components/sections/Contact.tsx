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
            setStatus('error');
            return;
        }

        setStatus('sending');

        // Explicitly initialize with Public Key provided by user
        window.emailjs.init('lGrdPZlqH_eXVNyV0');

        const serviceID = 'service_0x9isti';
        const templateID = 'template_pn7n1mc';

        window.emailjs.sendForm(serviceID, templateID, formRef.current)
            .then((response: any) => {
                console.log('EmailJS Success:', response.status, response.text);
                setStatus('sent');
                formRef.current?.reset();
                setTimeout(() => setStatus('idle'), 4000);
            })
            .catch((error: any) => {
                // Use console.log to avoid Next.js Red Error Overlay
                console.log('EmailJS Error:', error?.text || error || 'Connection Failed');
                setStatus('error');
                setTimeout(() => setStatus('idle'), 4000);
            });
    };

    const getButtonContent = () => {
        switch (status) {
            case 'sending':
                return (
                    <>
                        <span className="sending-spinner mr-2">
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
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Your Name" 
                    required 
                    suppressHydrationWarning 
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Your Email" 
                    required 
                    suppressHydrationWarning 
                />
                <textarea 
                    name="message" 
                    placeholder="Your Message" 
                    required 
                    suppressHydrationWarning 
                ></textarea>
                <button 
                    type="submit" 
                    disabled={status === 'sending'} 
                    suppressHydrationWarning
                    className="transition-all duration-300"
                    style={{
                        backgroundColor: status === 'sent' ? '#4CAF50' : status === 'error' ? '#f44336' : '',
                    }}
                >
                    {getButtonContent()}
                </button>
            </form>
            <div className="contact-socials">
                <a href="https://www.linkedin.com/in/hdmixture/" target="_blank" rel="noopener noreferrer" suppressHydrationWarning><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="https://www.instagram.com/hd_mixture/ss" target="_blank" rel="noopener noreferrer" suppressHydrationWarning><i className="fa-brands fa-instagram"></i></a>
                <a href="https://github.com/hd-mixture" target="_blank" rel="noopener noreferrer" suppressHydrationWarning><i className="fa-brands fa-github"></i></a>
                <a href="https://wa.link/ey6lzx" target="_blank" rel="noopener noreferrer" suppressHydrationWarning><i className="fa-brands fa-whatsapp"></i></a>
            </div>
        </section>
    );
}