"use client";

import { useState, useEffect } from 'react';

interface TypewriterProps {
    phrases?: string[];
    speed?: number;
    delay?: number;
    loop?: boolean;
    className?: string;
}

export default function Typewriter({ 
    phrases = ["Design the Unseen", "Develop the Unbuilt", "Deliver the Unforgettable"],
    speed = 80,
    delay = 1500,
    loop = true,
    className = "typewriter-text"
}: TypewriterProps) {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(speed);

    useEffect(() => {
        if (!phrases || phrases.length === 0) return;

        const handleType = () => {
            const i = loopNum % phrases.length;
            const fullText = phrases[i];

            setText(
                isDeleting
                    ? fullText.substring(0, text.length - 1)
                    : fullText.substring(0, text.length + 1)
            );
            
            if (isDeleting) {
                setTypingSpeed(speed / 2); // Deleting is usually faster
            } else {
                setTypingSpeed(speed);
            }

            if (!isDeleting && text === fullText) {
                if (!loop && loopNum === phrases.length - 1) {
                    return; // Stop at the end if not looping
                }
                setTimeout(() => setIsDeleting(true), delay);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed, phrases, speed, delay, loop]);

    return <span className={className}>{text}</span>;
}
