"use client";

import React, { FormEvent, useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

declare global {
    interface Window {
        emailjs: any;
    }
}

export default function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const sendEmail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formRef.current || status === 'sending') return;
        
        if (typeof window.emailjs === 'undefined') {
            console.log('EmailJS SDK not loaded');
            setStatus('error');
            return;
        }

        setStatus('sending');
        window.emailjs.init('lGrdPZlqH_eXVNyV0');

        const serviceID = 'service_0x9isti';
        const templateID = 'template_pn7n1mc';

        const templateParams = {
            name: formRef.current?.name?.value || 'Unknown',
            email: formRef.current?.email?.value || 'Unknown',
            subject: formRef.current?.subject?.value || 'New Inquiry from Developer Portfolio',
            message: `
[Source: Developer Portfolio]

Message:
${formRef.current?.message?.value || 'N/A'}
            `
        };

        window.emailjs.send(serviceID, templateID, templateParams)
            .then((response: any) => {
                console.log('EmailJS Success:', response.status, response.text);
                setStatus('sent');
                formRef.current?.reset();
                setTimeout(() => setStatus('idle'), 4000);
            })
            .catch((error: any) => {
                console.log('EmailJS Error Detail:', error?.text || error || 'Connection Failed');
                setStatus('error');
                setTimeout(() => setStatus('idle'), 4000);
            });
    };

    // Animation Variants
    const leftPanelVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };
    
    const rightPanelVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };
    
    const centerPanelVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } }
    };
    
    const bottomStripVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.4 } }
    };

    return (
        <section id="contact" className="contact-section-wrapper">
            <div className="contact-container">
                {/* Background FX */}
                <div className="contact-bg-glow-1"></div>
                <div className="contact-bg-glow-2"></div>
                <div className="contact-particles"></div>

                {/* FULL-WIDTH 3D WORKSPACE BACKGROUND */}
                <motion.div 
                    className="contact-bg-workspace"
                    animate={{ x: mousePos.x, y: mousePos.y }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                    <div className="workspace-overlay-fade"></div>
                    <img src="/images/contact_workspace.png" alt="Premium 3D Developer Workspace" className="workspace-bg-image" />
                </motion.div>

                <div className="contact-main-grid">
                    
                    {/* LEFT PANEL */}
                    <motion.div 
                        className="contact-left-panel"
                        variants={leftPanelVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1, margin: "-50px" }}
                    >
                        <div className="contact-badge">
                            <i className="fa-regular fa-paper-plane"></i> CONTACT ME
                        </div>
                        <h2 className="contact-heading">
                            Let's Build Something <br /><span>Amazing</span> Together
                        </h2>
                        <p className="contact-desc">
                            Have a project in mind or want to collaborate? I'd love to hear from you!
                        </p>
                        <div className="skills-header-underline" style={{ margin: "20px 0 30px 0" }}></div>

                        <div className="contact-info-list">
                            <div className="contact-info-item">
                                <div className="info-icon"><i className="fa-solid fa-envelope"></i></div>
                                <div className="info-content">
                                    <h4>Email</h4>
                                    <p>
                                        <a 
                                            href="mailto:hdmixture@gmail.com" 
                                            style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#6C63FF'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                                            onCopy={(e) => {
                                                e.preventDefault();
                                                e.clipboardData.setData('text/plain', 'hdmixture@gmail.com');
                                            }}
                                        >
                                            darshanprajapati@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="contact-info-item">
                                <div className="info-icon"><i className="fa-solid fa-phone"></i></div>
                                <div className="info-content">
                                    <h4>Phone</h4>
                                    <p>
                                        <a 
                                            href="tel:+917984327345" 
                                            style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#6C63FF'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                                            onCopy={(e) => {
                                                e.preventDefault();
                                                e.clipboardData.setData('text/plain', '+91 79843 27345');
                                            }}
                                        >
                                            +91 63557 13845
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="contact-info-item">
                                <div className="info-icon"><i className="fa-solid fa-location-dot"></i></div>
                                <div className="info-content">
                                    <h4>Location</h4>
                                    <p>Gujarat, India</p>
                                </div>
                            </div>
                            <div className="contact-info-item">
                                <div className="info-icon"><i className="fa-solid fa-user-check"></i></div>
                                <div className="info-content">
                                    <h4>Availability</h4>
                                    <p><span className="status-dot"></span> Available for freelance & full-time</p>
                                </div>
                            </div>
                        </div>

                        <div className="contact-socials">
                            <a href="https://www.linkedin.com/in/hdmixture/" target="_blank" rel="noopener noreferrer" className="social-btn">
                                <i className="fa-brands fa-linkedin-in"></i>
                            </a>
                            <a href="https://github.com/hd-mixture" target="_blank" rel="noopener noreferrer" className="social-btn">
                                <i className="fa-brands fa-github"></i>
                            </a>
                            <a href="https://www.instagram.com/hd_mixture/ss" target="_blank" rel="noopener noreferrer" className="social-btn">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="https://wa.link/ey6lzx" target="_blank" rel="noopener noreferrer" className="social-btn">
                                <i className="fa-brands fa-whatsapp"></i>
                            </a>
                        </div>
                    </motion.div>

                    {/* RIGHT PANEL (GLASS FORM) */}
                    <motion.div 
                        className="contact-right-panel"
                        variants={rightPanelVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1, margin: "-50px" }}
                    >
                        <form ref={formRef} className="glass-form-container" onSubmit={sendEmail}>
                            <div className="form-header">
                                <h3>Send me a message</h3>
                            </div>
                            
                            <div className="glass-input-group">
                                <i className="fa-regular fa-user"></i>
                                <input type="text" name="name" className="glass-input" placeholder="Your Name" required suppressHydrationWarning />
                            </div>
                            
                            <div className="glass-input-group">
                                <i className="fa-regular fa-envelope"></i>
                                <input type="email" name="email" className="glass-input" placeholder="Your Email" required suppressHydrationWarning />
                            </div>
                            
                            <div className="glass-input-group">
                                <i className="fa-solid fa-layer-group"></i>
                                <input type="text" name="subject" className="glass-input" placeholder="Subject (Optional)" suppressHydrationWarning />
                            </div>
                            
                            <div className="glass-input-group">
                                <i className="fa-regular fa-comment-dots"></i>
                                <textarea name="message" className="glass-textarea" placeholder="Your Message" required suppressHydrationWarning></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={status === 'sending'} 
                                className={`premium-submit-btn ${status === 'sending' ? 'btn-sending' : ''} ${status === 'sent' ? 'btn-sent' : ''} ${status === 'error' ? 'btn-error' : ''}`}
                                suppressHydrationWarning
                            >
                                {status === 'idle' && (
                                    <>Send Message <i className="fa-regular fa-paper-plane btn-icon"></i></>
                                )}
                                {status === 'sending' && (
                                    <><i className="fa-solid fa-spinner fa-spin"></i> Sending...</>
                                )}
                                {status === 'sent' && (
                                    <>Message Sent Successfully! <i className="fa-solid fa-check"></i></>
                                )}
                                {status === 'error' && (
                                    <>Failed to send <i className="fa-solid fa-xmark"></i></>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* BOTTOM FEATURE STRIP */}
                <motion.div 
                    className="contact-bottom-strip"
                    variants={bottomStripVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2, margin: "-20px" }}
                >
                    <div className="strip-item">
                        <div className="strip-icon"><i className="fa-solid fa-bolt"></i></div>
                        <div className="strip-content">
                            <h5>Fast Response</h5>
                            <p>Usually replies within 12 hours</p>
                        </div>
                    </div>
                    <div className="strip-item">
                        <div className="strip-icon"><i className="fa-solid fa-briefcase"></i></div>
                        <div className="strip-content">
                            <h5>Open to Opportunities</h5>
                            <p>Freelance, Full-time, or exciting projects</p>
                        </div>
                    </div>
                    <div className="strip-item">
                        <div className="strip-icon"><i className="fa-solid fa-globe"></i></div>
                        <div className="strip-content">
                            <h5>Based in India</h5>
                            <p>Available to work worldwide</p>
                        </div>
                    </div>
                    <div className="strip-item">
                        <div className="strip-icon"><i className="fa-solid fa-shield"></i></div>
                        <div className="strip-content">
                            <h5>Quality Work</h5>
                            <p>Clean, modern & scalable solutions</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
