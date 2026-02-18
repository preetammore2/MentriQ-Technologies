import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { resolveImageUrl } from '../../utils/imageUtils';

const OneByOneTestimonial = ({ testimonials }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const nextTestimonial = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setProgress(0);
    }, [testimonials.length]);

    // Auto-loop and Progress Logic
    useEffect(() => {
        if (isPaused) return;

        const duration = 5000; // 5 seconds per testimonial
        const step = 100;
        const increment = (step / duration) * 100;

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    nextTestimonial();
                    return 0;
                }
                return prev + increment;
            });
        }, step);

        return () => clearInterval(progressInterval);
    }, [nextTestimonial, isPaused]);

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 200 : -200,
            opacity: 0,
            filter: 'blur(10px)',
            scale: 0.95,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 200 : -200,
            opacity: 0,
            filter: 'blur(10px)',
            scale: 0.95,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    const testimonial = testimonials[currentIndex];

    return (
        <div
            className="relative max-w-4xl mx-auto px-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative h-[320px] md:h-[260px] flex items-center justify-center overflow-visible">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] border border-white/40 shadow-indigo-500/5 relative overflow-hidden group">

                            {/* Premium Progress Bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-700" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors duration-700" />

                            {/* Floating Quote Icon */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-6 right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000"
                            >
                                <Quote className="w-24 h-24 text-indigo-600 rotate-180" />
                            </motion.div>

                            {/* Image Section with 3D Effect */}
                            <div className="relative flex-shrink-0 perspective-1000">
                                <motion.div
                                    whileHover={{ rotateY: 20, rotateX: -10, scale: 1.05 }}
                                    className="relative z-10"
                                >
                                    <div className="absolute -inset-3 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <img
                                        src={resolveImageUrl(testimonial.image)}
                                        alt={testimonial.name}
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] object-cover relative z-10 border-4 border-white shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
                                        onError={(e) => { e.currentTarget.src = '/images/user.png' }}
                                    />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-2 rounded-xl z-20 shadow-xl border-2 border-white"
                                    >
                                        <Star className="w-4 h-4 fill-current" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 text-center md:text-left relative z-10">
                                <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-indigo-50/50 border border-indigo-100/50">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-3 h-3 fill-indigo-500 text-indigo-500" />
                                    ))}
                                    <span className="text-[10px] font-black text-indigo-600 ml-2 tracking-widest uppercase">Elite Student</span>
                                </div>

                                <blockquote className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed italic mb-6">
                                    "{testimonial.feedback || testimonial.text}"
                                </blockquote>

                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight font-display mb-0.5 uppercase leading-none">
                                            {testimonial.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-6 h-0.5 bg-indigo-200 rounded-full" />
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified Journey</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Centered Dots Navigation */}
            <div className="mt-8 flex justify-center items-center gap-3">
                {testimonials.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                            setProgress(0);
                        }}
                        className={`group relative h-2 transition-all duration-500 ${idx === currentIndex ? 'w-10 bg-indigo-600' : 'w-2 bg-slate-200 hover:bg-slate-300 hover:w-4'
                            } rounded-full`}
                    >
                        {idx === currentIndex && (
                            <div className="absolute inset-0 bg-indigo-400 animate-pulse rounded-full opacity-50 blur-sm" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OneByOneTestimonial;
