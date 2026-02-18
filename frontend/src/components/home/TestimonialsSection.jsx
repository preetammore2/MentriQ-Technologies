import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { apiClient as api } from '../../utils/apiClient';
import { resolveImageUrl } from '../../utils/imageUtils';

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data } = await api.get('/feedbacks');
                setTestimonials(data || []);
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    useEffect(() => {
        if (testimonials.length === 0) return;
        const timer = setInterval(() => {
            handleNext();
        }, 6000);
        return () => clearInterval(timer);
    }, [active, testimonials.length]);

    const handleNext = () => {
        setDirection(1);
        setActive((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)"
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)"
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)"
        })
    };

    if (loading) return null;
    if (testimonials.length === 0) return null;

    return (
        <section className="py-20 bg-[#0f172a] relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/3 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[180px]" />
                <div className="absolute bottom-0 left-1/3 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[180px]" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                    >
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-indigo-300 text-xs font-black tracking-[0.3em] uppercase">Student Success Stories</span>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                        Real Impact, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Real Careers</span>
                    </h2>
                </div>

                {/* Main Carousel Card */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all hover:scale-110 z-20 backdrop-blur-md group hidden md:block"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all hover:scale-110 z-20 backdrop-blur-md group hidden md:block"
                    >
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="relative min-h-[400px]">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={active}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.2 }
                                }}
                                className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors"
                            >
                                {/* Decorative Quote Icon */}
                                <div className="absolute top-10 left-10 text-indigo-500/20 transform -translate-x-1/2 -translate-y-1/2">
                                    <Quote size={120} className="fill-current" />
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-14">
                                    {/* User Image Area */}
                                    <div className="shrink-0 relative">
                                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full p-1.5 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10">
                                            <img
                                                src={resolveImageUrl(testimonials[active].image, "/images/user.png")}
                                                alt={testimonials[active].name}
                                                className="w-full h-full rounded-full object-cover shadow-2xl"
                                                onError={(e) => { e.target.src = "/images/user.png"; }}
                                            />
                                        </div>
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#0f172a] px-4 py-1.5 rounded-full border border-indigo-500/30 flex gap-1">
                                            {[...Array(testimonials[active].rating || 5)].map((_, i) => (
                                                <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="text-center md:text-left flex-1">
                                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium italic mb-6">
                                            "{testimonials[active].message}"
                                        </p>

                                        <div>
                                            <h4 className="text-xl font-black text-white tracking-tight mb-1">
                                                {testimonials[active].name}
                                            </h4>
                                            <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">
                                                {testimonials[active].role || 'Student'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Mobile Controls & Indicators */}
                    <div className="flex justify-center items-center gap-6 mt-12">
                        <button
                            onClick={handlePrev}
                            className="md:hidden p-3 rounded-full bg-white/5 border border-white/10 text-white"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setDirection(i > active ? 1 : -1);
                                        setActive(i);
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20 hover:bg-white/40'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="md:hidden p-3 rounded-full bg-white/5 border border-white/10 text-white"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
