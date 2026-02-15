import React, { useState, useEffect } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { apiClient as api } from '../../utils/apiClient';
import { resolveImageUrl } from '../../utils/imageUtils';

const MotionDiv = framerMotion.div;

const Testimonial3D = ({ testimonials }) => {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (testimonials.length === 0) return;
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    if (testimonials.length === 0) return null;

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center py-10">
            <div className="relative w-full max-w-2xl h-64 perspective-1000">
                <AnimatePresence mode='wait'>
                    <MotionDiv
                        key={active}
                        initial={{ opacity: 0, rotateX: -20, y: 50, z: -100 }}
                        animate={{ opacity: 1, rotateX: 0, y: 0, z: 0 }}
                        exit={{ opacity: 0, rotateX: 20, y: -50, z: -100 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="bg-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />

                        <div className="relative z-10">
                            <p className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-8">
                                {testimonials[active].message}
                            </p>

                            <div className="flex items-center gap-4">
                                <img
                                    src={resolveImageUrl(testimonials[active].image, "/images/user.png")}
                                    alt={testimonials[active].name}
                                    className="w-14 h-14 rounded-full shadow-md object-cover"
                                    onError={(e) => { e.target.src = "/images/user.png"; }}
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">{testimonials[active].name}</h4>
                                    <p className="text-indigo-600 text-sm font-medium">{testimonials[active].role}</p>
                                </div>
                                <div className="ml-auto flex gap-1">
                                    {[...Array(testimonials[active].rating || 5)].map((_, i) => <Sparkles key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
                                </div>
                            </div>
                        </div>
                    </MotionDiv>
                </AnimatePresence>
            </div>

            <div className="flex gap-2 mt-12">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`h-2 rounded-full transition-all duration-500 ${active === i ? 'w-8 bg-indigo-600' : 'w-2 bg-indigo-200 hover:bg-indigo-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data } = await api.get('/feedbacks');
                setTestimonials(data);
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading) return null;
    if (testimonials.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-glow">
                    What Our Students Say
                </h2>
            </div>

            <div className="relative max-w-6xl mx-auto px-4 h-[450px]">
                <Testimonial3D testimonials={testimonials} />
            </div>
        </section>
    );
};

export default TestimonialsSection;
