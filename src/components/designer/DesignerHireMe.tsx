"use client";

import React, { FormEvent, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Sparkles, ChevronDown, Palette, Zap, Clock, Award, Target, Infinity, Headphones, Lightbulb } from 'lucide-react';

const featuresList = [
    { id: 1, icon: Palette, title: "Pixel Perfect", sub: "Design", colorClass: "text-pink-500", bgClass: "bg-pink-500/10", borderClass: "border-pink-500/20", shadowClass: "shadow-[0_0_15px_rgba(236,72,153,0.1)]" },
    { id: 2, icon: Zap, title: "Fast & Agile", sub: "Delivery", colorClass: "text-orange-400", bgClass: "bg-orange-400/10", borderClass: "border-orange-400/20", shadowClass: "shadow-[0_0_15px_rgba(251,146,60,0.1)]" },
    { id: 3, icon: Clock, title: "Always On", sub: "Time", colorClass: "text-purple-500", bgClass: "bg-purple-500/10", borderClass: "border-purple-500/20", shadowClass: "shadow-[0_0_15px_rgba(168,85,247,0.1)]" },
    { id: 4, icon: Award, title: "Premium", sub: "Quality", colorClass: "text-blue-500", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/20", shadowClass: "shadow-[0_0_15px_rgba(59,130,246,0.1)]" },
    { id: 5, icon: Target, title: "High", sub: "Conversion", colorClass: "text-emerald-500", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/20", shadowClass: "shadow-[0_0_15px_rgba(16,185,129,0.1)]" },
    { id: 6, icon: Infinity, title: "Unlimited", sub: "Revisions", colorClass: "text-cyan-500", bgClass: "bg-cyan-500/10", borderClass: "border-cyan-500/20", shadowClass: "shadow-[0_0_15px_rgba(6,182,212,0.1)]" },
    { id: 7, icon: Headphones, title: "24/7", sub: "Support", colorClass: "text-rose-500", bgClass: "bg-rose-500/10", borderClass: "border-rose-500/20", shadowClass: "shadow-[0_0_15px_rgba(244,63,94,0.1)]" },
    { id: 8, icon: Lightbulb, title: "Creative", sub: "Strategy", colorClass: "text-amber-500", bgClass: "bg-amber-500/10", borderClass: "border-amber-500/20", shadowClass: "shadow-[0_0_15px_rgba(245,158,11,0.1)]" },
];

const CustomDropdown = ({ options, name, label, value, onChange, allowCustomInput = false, customTriggerValue = 'Other' }: { options: {label: string, value: string}[], name: string, label: string, value: string, onChange: (val: string) => void, allowCustomInput?: boolean, customTriggerValue?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isCustomTyping, setIsCustomTyping] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optValue: string) => {
        if (allowCustomInput && optValue === customTriggerValue) {
            setIsCustomTyping(true);
            onChange(''); // Clear for them to type
        } else {
            onChange(optValue);
        }
        setIsOpen(false);
    };

    const handleCancelCustom = () => {
        setIsCustomTyping(false);
        onChange(options[0].value); // Reset to first option
    };

    const selectedLabel = options.find(o => o.value === value)?.label || "Select an option";

    return (
        <div className="flex flex-col gap-2 relative w-full" ref={dropdownRef}>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{label}</label>
            <input type="hidden" name={name} value={value} />
            
            <AnimatePresence mode="wait">
                {isCustomTyping ? (
                    <motion.div 
                        key="custom-input"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full"
                    >
                        <input 
                            type="text" 
                            placeholder="Type your custom option..."
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            autoFocus
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-[#222] border border-pink-500 shadow-[0_0_0_2px_rgba(236,72,153,0.1)] rounded-xl outline-none text-gray-900 dark:text-white transition-all pr-12"
                        />
                        <button 
                            type="button"
                            onClick={handleCancelCustom}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-[#444] text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#555] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="dropdown-trigger"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`w-full px-5 py-3.5 bg-gray-50 dark:bg-[#222] border rounded-xl outline-none flex justify-between items-center cursor-pointer transition-all duration-300 text-gray-900 dark:text-white ${isOpen ? 'border-pink-500 shadow-[0_0_0_2px_rgba(236,72,153,0.1)]' : 'border-gray-100 dark:border-[#333] hover:border-gray-300 dark:hover:border-gray-600'}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="font-medium text-[15px]">{selectedLabel}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-pink-500' : ''}`} />
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {isOpen && !isCustomTyping && (
                    <motion.div 
                        initial={{ opacity: 0, y: 5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-[88px] left-0 w-full bg-white dark:bg-[#2a2a2a] border border-gray-100 dark:border-[#444] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] z-[100] overflow-hidden py-1"
                    >
                        {options.map((opt, i) => (
                            <div 
                                key={i}
                                className={`px-5 py-3 text-[15px] cursor-pointer transition-colors flex items-center justify-between ${value === opt.value ? 'bg-pink-50/50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#333]'}`}
                                onClick={() => handleSelect(opt.value)}
                            >
                                {opt.label}
                                {value === opt.value && <div className="w-2 h-2 rounded-full bg-pink-500"></div>}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

declare global {
    interface Window {
        emailjs: any;
    }
}

export default function DesignerHireMe() {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [service, setService] = useState('Brand Identity');
    const [budget, setBudget] = useState('Less than ₹10,000');

    const serviceOptions = [
        { label: 'Brand Identity', value: 'Brand Identity' },
        { label: 'UI/UX Design', value: 'UI/UX Design' },
        { label: 'Print Design', value: 'Print Design' },
        { label: 'Social Media', value: 'Social Media' },
        { label: 'Illustration', value: 'Illustration' },
        { label: 'Other', value: 'Other' },
    ];

    const budgetOptions = [
        { label: '< ₹10,000', value: 'Less than ₹10,000' },
        { label: '₹10,000 - ₹50,000', value: '₹10,000 - ₹50,000' },
        { label: '₹50,000 - ₹1,00,000', value: '₹50,000 - ₹1,00,000' },
        { label: '₹1,00,000+', value: '₹1,00,000+' },
        { label: 'Custom Budget', value: 'Custom Budget' },
    ];

    const [featureSet, setFeatureSet] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFeatureSet(prev => (prev === 0 ? 1 : 0));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const currentFeatures = featureSet === 0 ? featuresList.slice(0, 4) : featuresList.slice(4, 8);

    const featureVariants = {
        initial: (index: number) => ({
            opacity: 0,
            x: index % 2 === 0 ? -40 : 40,
            y: index < 2 ? -40 : 40,
            scale: 0.8
        }),
        animate: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 200, damping: 20 }
        },
        exit: (index: number) => ({
            opacity: 0,
            x: index % 2 === 0 ? 40 : -40,
            y: index < 2 ? 40 : -40,
            scale: 0.8,
            transition: { duration: 0.3 }
        })
    };

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
            name: formRef.current?.user_name?.value || 'Unknown',
            email: formRef.current?.user_email?.value || 'Unknown',
            subject: 'New Inquiry from Designer Portfolio',
            message: `
[Source: Designer Portfolio]
Service Needed: ${formRef.current?.service_type?.value || 'N/A'}
Budget Range: ${formRef.current?.budget_range?.value || 'N/A'}

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

    return (
        <section id="contact" className="relative mt-6 mb-6 w-full">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-50 dark:border-[#333] flex flex-col lg:flex-row gap-12 overflow-hidden relative"
            >
                {/* Background Glows */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-orange-400/10 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Left Side: Header & Info */}
                <div className="lg:w-1/2 flex flex-col relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-sm font-semibold mb-4 w-fit border border-pink-500/20">
                        <Sparkles className="w-4 h-4" /> Available for Freelance
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-orange-400 rounded-full"></div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">Ready to Elevate<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">Your Brand?</span></h2>
                    </div>
                    
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
                        Have a project in mind or just want to say hi? Fill out the form, and let's turn your vision into a stunning reality.
                    </p>

                    <div className="relative h-[160px] w-full mt-8 mb-8 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={featureSet}
                                className="grid grid-cols-2 gap-6 absolute inset-0"
                            >
                                {currentFeatures.map((f, i) => {
                                    const Icon = f.icon;
                                    return (
                                        <motion.div 
                                            key={f.id}
                                            custom={i}
                                            variants={featureVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="flex items-center gap-3"
                                        >
                                            <div className={`w-12 h-12 rounded-2xl ${f.bgClass} flex items-center justify-center ${f.colorClass} border ${f.borderClass} ${f.shadowClass}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                {f.title}<br/><span className="text-xs text-gray-500 font-normal">{f.sub}</span>
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-auto hidden lg:flex flex-col gap-6">
                        <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#222] flex items-center justify-center border border-gray-100 dark:border-[#333]">
                                <i className="fa-solid fa-envelope text-pink-500 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Email Me At</p>
                                <p className="font-semibold">
                                    <a 
                                        href="mailto:hdmixture@gmail.com" 
                                        style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
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
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-1/2 relative z-10">
                    <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-5">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Your Name</label>
                                <input 
                                    type="text" 
                                    name="user_name" 
                                    required 
                                    placeholder="John Doe"
                                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-[#333] rounded-xl outline-none focus:border-pink-500 dark:focus:border-pink-500 transition-colors text-gray-900 dark:text-white"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Your Email</label>
                                <input 
                                    type="email" 
                                    name="user_email" 
                                    required 
                                    placeholder="john@example.com"
                                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-[#333] rounded-xl outline-none focus:border-pink-500 dark:focus:border-pink-500 transition-colors text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <CustomDropdown 
                                label="Service Needed" 
                                name="service_type" 
                                options={serviceOptions} 
                                value={service} 
                                onChange={setService}
                                allowCustomInput={true}
                                customTriggerValue="Other"
                            />
                            
                            <CustomDropdown 
                                label="Estimated Budget" 
                                name="budget_range" 
                                options={budgetOptions} 
                                value={budget} 
                                onChange={setBudget}
                                allowCustomInput={true}
                                customTriggerValue="Custom Budget"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Your Message</label>
                            <textarea 
                                name="message" 
                                required 
                                rows={4}
                                placeholder="Tell me about your project..."
                                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-[#333] rounded-xl outline-none focus:border-pink-500 dark:focus:border-pink-500 transition-colors text-gray-900 dark:text-white resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={status === 'sending'}
                            className="mt-2 group relative w-full flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg overflow-hidden transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <span className="relative z-10 flex items-center gap-2">
                                {status === 'idle' && (
                                    <>
                                        Send Message <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </>
                                )}
                                {status === 'sending' && (
                                    <>
                                        Sending... <Sparkles className="w-5 h-5 animate-pulse" />
                                    </>
                                )}
                                {status === 'sent' && (
                                    <>
                                        Message Sent! <CheckCircle className="w-5 h-5" />
                                    </>
                                )}
                                {status === 'error' && (
                                    <>
                                        Failed to Send <AlertCircle className="w-5 h-5" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                </div>
            </motion.div>
        </section>
    );
}
