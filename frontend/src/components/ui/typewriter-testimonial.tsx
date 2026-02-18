import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Testimonial = {
    image: string;
    audio: string;
    text: string;
    name: string;
    jobtitle: string;
};

type ComponentProps = {
    testimonials: Testimonial[];
};

export const TypewriterTestimonial: React.FC<ComponentProps> = ({ testimonials }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
    const [hasBeenHovered, setHasBeenHovered] = useState<boolean[]>(new Array(testimonials.length).fill(false));
    const [typedText, setTypedText] = useState('');
    const typewriterTimeoutRef = useRef<any>(null);
    const currentTextRef = useRef('');


    const stopAudio = useCallback(() => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.currentTime = 0;
            audioPlayerRef.current.src = '';
            audioPlayerRef.current.load();
            audioPlayerRef.current = null;
        }
    }, []);

    const startTypewriter = useCallback((text: string) => {
        if (typewriterTimeoutRef.current) {
            clearTimeout(typewriterTimeoutRef.current);
        }
        setTypedText('');
        currentTextRef.current = text;

        let i = 0;
        const type = () => {
            if (i <= text.length) {
                setTypedText(text.slice(0, i));
                i++;
                typewriterTimeoutRef.current = setTimeout(type, 50);
            }
        };
        type();
    }, []);

    const stopTypewriter = useCallback(() => {
        if (typewriterTimeoutRef.current) {
            clearTimeout(typewriterTimeoutRef.current);
            typewriterTimeoutRef.current = null;
        }
        setTypedText('');
        currentTextRef.current = '';
    }, []);

    // Auto-loop when not hovering
    useEffect(() => {
        if (hoveredIndex !== null) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [hoveredIndex, testimonials.length]);

    // Update typewriter and audio state based on either hover or active index
    useEffect(() => {
        const indexToDisplay = hoveredIndex !== null ? hoveredIndex : activeIndex;
        startTypewriter(testimonials[indexToDisplay].text);

        // We only play audio for manual hover, not auto-loop to avoid user annoyance
        if (hoveredIndex !== null) {
            // Audio logic is already in handleMouseEnter
        }

    }, [hoveredIndex, activeIndex, testimonials, startTypewriter]);

    const handleMouseEnter = useCallback((index: number) => {
        stopAudio();

        setHoveredIndex(index);

        const newAudio = new Audio(`/audio/${testimonials[index].audio}`);
        audioPlayerRef.current = newAudio;
        newAudio.play().catch(e => {
            console.warn("Audio playback prevented or failed:", e);
        });

        setHasBeenHovered(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
        startTypewriter(testimonials[index].text);
    }, [testimonials, stopAudio, startTypewriter]);

    const handleMouseLeave = useCallback(() => {
        stopAudio();
        setHoveredIndex(null);
        stopTypewriter();
    }, [stopAudio, stopTypewriter]);

    useEffect(() => {
        return () => {
            stopAudio();
            stopTypewriter();
        };
    }, [stopAudio, stopTypewriter]);

    return (
        <div className="relative w-full overflow-hidden py-32">
            {/* Gradient Overlays for smooth entry/exit */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />

            <div
                className="flex gap-8 items-center w-max px-4 animate-scroll-horizontal"
                style={{
                    animationPlayState: hoveredIndex !== null ? 'paused' : 'running'
                }}
            >
                {/* Double buffer for seamless loop */}
                {[...testimonials, ...testimonials].map((testimonial, index) => {
                    const realIndex = index % testimonials.length;
                    return (
                        <motion.div
                            key={index}
                            className="relative flex flex-col items-center flex-shrink-0"
                            onMouseEnter={() => handleMouseEnter(realIndex)}
                            onMouseLeave={handleMouseLeave}
                            whileHover={{ scale: 1.1 }}
                        >
                            <motion.img
                                src={testimonial.image}
                                alt={`Testimonial ${realIndex}`}
                                className="w-20 h-20 rounded-full border-4 hover:animate-pulse border-white/10 object-cover shadow-2xl"
                                animate={{
                                    borderColor: (hoveredIndex === realIndex || activeIndex === realIndex) ? '#ACA0FB' : 'rgba(255,255,255,0.1)',
                                    scale: (hoveredIndex === realIndex || activeIndex === realIndex) ? 1.1 : 1
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            <AnimatePresence>
                                {hoveredIndex === realIndex && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 24 }}
                                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute top-0 bg-white text-black text-sm px-5 py-4 rounded-2xl shadow-2xl max-w-xs w-64 z-50 overflow-visible"
                                    >
                                        <div className="h-28 overflow-hidden whitespace-pre-wrap leading-relaxed">
                                            {typedText}
                                            <span className="animate-blink font-bold ml-0.5">|</span>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col items-end">
                                            <p className="font-black text-gray-900 leading-none mb-1 uppercase tracking-tighter text-base">{testimonial.name}</p>
                                        </div>
                                        {/* Speech Bubble Tail (Pointing UP) */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-4 h-4 bg-white rotate-45 rounded-sm -z-10 shadow-sm" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
            <style>{`
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-horizontal {
          animation: scroll-horizontal ${testimonials.length * 5}s linear infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
        </div>
    );
};
