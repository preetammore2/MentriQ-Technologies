'use client';
import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

type Testimonial = {
    image: string;
    text?: string;
    feedback?: string;
    name: string;
    color?: string;
};

type ComponentProps = {
    testimonials: Testimonial[];
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    const safeText = testimonial.text || testimonial.feedback || "Great learning experience at MentriQ.";
    const [typedText, setTypedText] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Typewriter Logic
    React.useEffect(() => {
        if (!isHovered) {
            setTypedText("");
            return;
        }

        let i = 0;
        const interval = setInterval(() => {
            if (i < safeText.length) {
                setTypedText(safeText.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [isHovered, safeText]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const colorMap: Record<string, {
        text: string;
        glow: string;
        border: string;
        ring: string;
        chipBg: string;
        chipText: string;
    }> = {
        indigo: { text: "text-indigo-600", glow: "from-indigo-500/20 to-indigo-200/20", border: "border-indigo-200/80", ring: "ring-indigo-100/70", chipBg: "bg-indigo-50", chipText: "text-indigo-600" },
        cyan: { text: "text-cyan-600", glow: "from-cyan-500/20 to-cyan-200/20", border: "border-cyan-200/80", ring: "ring-cyan-100/70", chipBg: "bg-cyan-50", chipText: "text-cyan-600" },
        emerald: { text: "text-emerald-600", glow: "from-emerald-500/20 to-emerald-200/20", border: "border-emerald-200/80", ring: "ring-emerald-100/70", chipBg: "bg-emerald-50", chipText: "text-emerald-600" },
        rose: { text: "text-rose-600", glow: "from-rose-500/20 to-rose-200/20", border: "border-rose-200/80", ring: "ring-rose-100/70", chipBg: "bg-rose-50", chipText: "text-rose-600" },
        amber: { text: "text-amber-600", glow: "from-amber-500/20 to-amber-200/20", border: "border-amber-200/80", ring: "ring-amber-100/70", chipBg: "bg-amber-50", chipText: "text-amber-600" },
        violet: { text: "text-violet-600", glow: "from-violet-500/20 to-violet-200/20", border: "border-violet-200/80", ring: "ring-violet-100/70", chipBg: "bg-violet-50", chipText: "text-violet-600" },
    };

    const theme = colorMap[testimonial.color || "indigo"] || colorMap.indigo;

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className={`relative w-80 h-[30rem] bg-white/85 backdrop-blur-2xl border rounded-[2.2rem] p-7 flex flex-col items-center text-center group transition-all duration-500 hover:shadow-[0_35px_75px_rgba(15,23,42,0.14)] ${isHovered ? `${theme.border} ring-2 ${theme.ring}` : 'border-slate-200/70'}`}
        >
            <div className={`absolute inset-0 rounded-[2.2rem] bg-gradient-to-br ${theme.glow} opacity-70 pointer-events-none`} />
            <div className="absolute inset-x-6 top-0 h-1.5 rounded-b-full bg-gradient-to-r from-transparent via-slate-300/80 to-transparent" />
            <div className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.24em] font-black text-slate-500 bg-white/80 border border-slate-200 rounded-full px-3 py-1">
                Verified
            </div>

            <div
                style={{ transform: "translateZ(50px)" }}
                className="relative mb-6 animate-bob"
            >
                <div className={`absolute -inset-3 rounded-full blur-2xl opacity-30 bg-gradient-to-br ${theme.glow} transition-opacity`} />
                <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className={`w-24 h-24 rounded-full border-4 border-white object-cover relative z-10 shadow-xl transition-all duration-500 ${isHovered ? 'scale-110' : ''}`}
                    onError={(e) => { e.currentTarget.src = '/images/user.png' }}
                />
            </div>

            <div style={{ transform: "translateZ(30px)" }} className="flex-1 flex flex-col justify-start w-full mt-1">
                <div className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full ${theme.chipBg} border border-white/80 mx-auto mb-4`}>
                    <span className={`text-[10px] uppercase tracking-[0.2em] font-black ${theme.chipText}`}>Student Voice</span>
                </div>

                <div className="text-slate-700 text-[16px] font-medium italic leading-relaxed mb-6 block min-h-[9.5rem] overflow-hidden px-1">
                    <span className={`mr-1 text-2xl align-middle ${theme.text}`}>"</span>
                    {isHovered ? (
                        <>
                            {typedText}
                            <span className={`inline-block w-0.5 h-5 ml-1 align-middle animate-blink ${theme.text}`} />
                        </>
                    ) : (
                        <>{safeText}</>
                    )}
                    <span className={`ml-1 text-2xl align-middle ${theme.text}`}>"</span>
                </div>

                <h4 className={`text-xl font-black uppercase tracking-tighter transition-colors duration-500 ${isHovered ? theme.text : 'text-slate-900'}`}>
                    {testimonial.name}
                </h4>
                <div className="mt-3 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </div>

            <div className={`absolute top-5 right-5 opacity-40 transition-opacity ${theme.text}`}>
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 5.849h3.983v10h-9.983z" />
                </svg>
            </div>
        </motion.div>
    );
};

export const Simple3DTestimonial: React.FC<ComponentProps> = ({ testimonials }) => {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <section className="relative w-full overflow-hidden py-28">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 left-1/3 w-[420px] h-[420px] rounded-full bg-indigo-500/10 blur-[90px]" />
                <div className="absolute -bottom-10 right-1/4 w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-[90px]" />
            </div>
            <div className="absolute inset-y-0 left-0 w-60 bg-gradient-to-r from-white via-white/90 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-60 bg-gradient-to-l from-white via-white/90 to-transparent z-20 pointer-events-none" />

            <div
                className="relative z-10 flex gap-10 items-center w-max px-10 animate-scroll-3d"
                style={{
                    animationPlayState: isPaused ? 'paused' : 'running'
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Triple buffer for absolute seamlessness */}
                {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                    <div key={index} className="flex-shrink-0 py-8">
                        <TestimonialCard testimonial={testimonial} />
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes scroll-3d {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-scroll-3d {
                    animation: scroll-3d ${Math.max(testimonials.length, 8) * 7}s linear infinite;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-blink {
                    animation: blink 1s infinite;
                }
                @keyframes bob {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bob {
                    animation: bob 3.5s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};
