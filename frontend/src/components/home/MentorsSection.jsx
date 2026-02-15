import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useMotionValue, useAnimationFrame, useSpring } from 'framer-motion';
import { apiClient as api } from '../../utils/apiClient';
import { resolveImageUrl } from '../../utils/imageUtils';

const FALLBACK_MENTORS = [
    {
        name: "Litesh Singh", image: "/images/litesh.jpg", description: "5+ Years Experience in Automation and DevOps", stats: [
            { value: "5+", label: "Years" },
            { value: "15+", label: "Projects" }
        ]
    },
    {
        name: "Jeevan Chauhan", image: "/images/jeevan.jpg", description: "5+ Years Experience in Hybrid Applications Development", stats: [
            { value: "5+", label: "Years" },
            { value: "15+", label: "Projects" }
        ]
    },
    {
        name: "Yogesh Shekhawat", image: "/images/yogesh.jpg", description: "2+ Years Experience in Entrepreneurship and Product Management", stats: [
            { value: "2+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Ram Swami", image: "/images/user.png", description: "6+ Years Experience in Cyber Security", stats: [
            { value: "6+", label: "Years" },
            { value: "15+", label: "Projects" }
        ]
    },
    {
        name: "Shubham Sharma", image: "/images/subhammentors.jpg", description: "5+ years Experience in Full Stack Development", stats: [
            { value: "5+", label: "Years" },
            { value: "15+", label: "Projects" }
        ]
    },
    {
        name: "Shiva Rama Krishna", image: "/images/sivaramakrishna.jpg", description: "8+ Years Experience in Software Engineering", stats: [
            { value: "8+", label: "Years" },
            { value: "20+", label: "Projects" }
        ]
    },
    {
        name: "Lakhan Dadhich", image: "/images/lakhan.jpg", description: "3+ Years Experience in Product Management", stats: [
            { value: "3+", label: "Years" },
            { value: "7+", label: "Projects" }
        ]
    },
    {
        name: "Venkat Sai", image: "/images/venkatsai.jpg", description: "5+ Years Experience in Operations Experts", stats: [
            { value: "5+", label: "Years" },
            { value: "15+", label: "Projects" }
        ]
    },
    {
        name: "Satya Narayan Pradhan", image: "/images/satyanarayan.jpg", description: "5+ Years Experience in Integration Specialist", stats: [
            { value: "5+", label: "Years" },
            { value: "20+", label: "Projects" }
        ]
    },
    {
        name: "Hardik Sharma", image: "/images/hardik.jpg", description: "2+ Years Experience in Cloud Technologies", stats: [
            { value: "2+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Prince Jain", image: "/images/princejain.jpg", description: "2+ Years Experience in Cyber Security ", stats: [
            { value: "2+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Dharam Pal Singh", image: "/images/dharampalsingh.jpg", description: "2+ Years Experience in Full Stack Development", stats: [
            { value: "2+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Pooja Bharia", image: "/images/poojabharia.jpg", description: "1+ Years Experience in Research Engineer", stats: [
            { value: "1+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Gaurav Sharma", image: "/images/gauravsharma.jpg", description: "1+ Years Experience in Cloud Technologies", stats: [
            { value: "1+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Pooja Yadav", image: "/images/poojayadav.jpg", description: "1+ Years Experience in Data Automation", stats: [
            { value: "1+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
    {
        name: "Sameer Khan", image: "/images/sameer.jpg", description: "1+ Years Experience in Full Stack Development", stats: [
            { value: "1+", label: "Years" },
            { value: "5+", label: "Projects" }
        ]
    },
];

const MotionDiv = motion.div;
const MotionH3 = motion.h3;

const MentorCard = ({ item, scrollX, index, totalItems }) => {
    const cardRef = useRef(null);
    const CARD_WIDTH = 350;
    const GAP = 52;
    const FULL_STEP = CARD_WIDTH + GAP;

    const x = useTransform(scrollX, (v) => {
        let cardBaseX = index * FULL_STEP;
        let position = (v + cardBaseX) % (totalItems * FULL_STEP);
        if (position < 0) position += (totalItems * FULL_STEP);
        return position - (totalItems * FULL_STEP) / 2;
    });

    const springConfig = { damping: 40, stiffness: 300, mass: 0.3 };

    const rawScale = useTransform(x, [-800, -300, 0, 300, 800], [0.65, 0.78, 1.1, 0.78, 0.65]);
    const scale = useSpring(rawScale, springConfig);

    const rawOpacity = useTransform(x, [-1000, -400, 0, 400, 1000], [0, 0.15, 1, 0.15, 0]);
    const opacity = useSpring(rawOpacity, springConfig);

    const rawBrightness = useTransform(x, [-400, 0, 400], [0.7, 1.08, 0.7]);
    const brightness = useSpring(rawBrightness, springConfig);
    const rawCenterAccent = useTransform(x, [-260, 0, 260], [0, 1, 0]);
    const centerAccent = useSpring(rawCenterAccent, springConfig);
    const cardShadow = useTransform(
        rawCenterAccent,
        [0, 1],
        ["0 24px 50px rgba(15,23,42,0.10)", "0 34px 80px rgba(79,70,229,0.28)"]
    );

    const zIndex = useTransform(x, [-200, 0, 200], [10, 50, 10]);

    const [glitch, setGlitch] = useState({ x: 0, y: 0, opacity: 0 });

    useEffect(() => {
        let timeoutId;

        const triggerGlitch = () => {
            if (Math.random() > 0.8) {
                setGlitch({
                    x: (Math.random() - 0.5) * 15,
                    y: (Math.random() - 0.5) * 5,
                    opacity: 0.8
                });
                setTimeout(() => setGlitch({ x: 0, y: 0, opacity: 0 }), 80);
            }
            timeoutId = setTimeout(triggerGlitch, Math.random() * 2000 + 400);
        };

        timeoutId = setTimeout(triggerGlitch, 100);
        return () => clearTimeout(timeoutId);
    }, []);

    const glitchFilter = useTransform(x, (v) => {
        const active = Math.abs(v) < 150;
        if (!active) return 'none';
        return glitch.opacity > 0
            ? `drop-shadow(${glitch.x}px 0 rgba(255,0,0,0.5)) drop-shadow(${-glitch.x}px 0 rgba(0,255,255,0.5))`
            : 'none';
    });

    const brightnessFilter = useTransform(brightness, (v) => `brightness(${v})`);

    return (
        <MotionDiv
            ref={cardRef}
            style={{
                x,
                scale,
                opacity,
                zIndex,
                filter: brightnessFilter,
                boxShadow: cardShadow,
                willChange: "transform, opacity, filter"
            }}
            className="absolute bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-[0_24px_50px_rgba(15,23,42,0.10)] w-[330px] md:w-[350px] flex-shrink-0 group perspective-1000"
        >
            <MotionDiv
                style={{ opacity: centerAccent }}
                className="absolute inset-0 rounded-[2rem] pointer-events-none bg-gradient-to-br from-indigo-100/70 via-white/10 to-cyan-100/70"
            />
            <MotionDiv
                style={{ opacity: centerAccent }}
                className="absolute inset-x-10 top-0 h-1.5 rounded-b-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 pointer-events-none"
            />
            <MotionDiv
                style={{
                    x: glitch.x,
                    y: glitch.y,
                    opacity: glitch.opacity,
                    filter: glitchFilter
                }}
                className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-cyan-50/50 rounded-[2rem] pointer-events-none"
            />

            <div className="flex flex-col items-center justify-center h-full relative z-10">
                <div className="relative mb-8">
                    <div className="absolute -inset-6 bg-indigo-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative group/img overflow-hidden rounded-full">
                        <img
                            src={resolveImageUrl(item.image || item.imageUrl, "/images/user.png")}
                            alt={item.name}
                            className="relative w-28 h-28 md:w-32 md:h-32 object-cover rounded-full border-4 border-white group-hover:border-indigo-300 transition-all duration-500 grayscale group-hover:grayscale-0 shadow-[0_15px_30px_rgba(0,0,0,0.08)]"
                            onError={(e) => { e.target.src = "/images/user.png" }}
                        />
                        <MotionDiv
                            animate={{ y: ["-100%", "200%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100"
                        />
                    </div>
                </div>

                <div className="text-center w-full">
                    <MotionH3
                        style={{ x: glitch.x * 0.5 }}
                        className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight uppercase group-hover:text-indigo-600 transition-colors duration-300"
                    >
                        {item.name}
                    </MotionH3>

                    <div className="inline-block px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 mb-6 overflow-hidden relative group/tag">
                        <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.22em] whitespace-nowrap relative z-10">
                            {item.role || "Technical Expert"}
                        </span>
                        <div className="absolute inset-0 bg-indigo-500/5 translate-y-full group-hover/tag:translate-y-0 transition-transform duration-300" />
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 px-2 font-medium italic opacity-75 group-hover:opacity-100 transition-opacity duration-500">
                        "{item.description || item.bio || "Leading the future of technology through expert mentorship."}"
                    </p>
                </div>

                <div className="flex justify-center gap-10 pt-7 mt-7 border-t border-slate-100 w-full">
                    {(item.stats || [{ value: "5+", label: "Exp" }, { value: "10+", label: "Projects" }]).map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                                {stat.value}
                            </p>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none rounded-[2rem]" />
        </MotionDiv>
    );
};

const MentorsSection = () => {
    const [mentors, setMentors] = useState(FALLBACK_MENTORS);

    const rawScrollX = useMotionValue(0);
    const scrollX = useSpring(rawScrollX, { damping: 50, stiffness: 400, mass: 0.5 });

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const { data } = await api.get('/mentors');
                if (data && data.length > 0) {
                    setMentors(data);
                }
            } catch (error) {
                console.error("Failed to fetch mentors", error);
            }
        };
        fetchMentors();
    }, []);

    useAnimationFrame((t, d) => {
        const moveBy = -1.5 * (d / 16);
        rawScrollX.set(rawScrollX.get() + moveBy);
    });

    const displayMentors = mentors;
    const extendedMentors = [...displayMentors, ...displayMentors];

    return (
        <section className="py-24 md:py-32 bg-white overflow-hidden relative min-h-[860px]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-indigo-500/5 blur-[140px] rounded-full opacity-50" />
                <div className="absolute inset-0 opacity-[0.35]" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(79, 70, 229, 0.08) 1px, transparent 0)`,
                    backgroundSize: '32px 32px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24 relative z-10 text-center">
                <MotionDiv initial={false} animate={{ opacity: 1, scale: 1 }}>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-[0.85]">
                        Our Mentors
                    </h2>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-indigo-600/20 to-transparent" />
                        <p className="text-indigo-600 font-black uppercase tracking-[0.35em] text-[11px] md:text-[12px] opacity-80">Industry-Guided Learning</p>
                        <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-indigo-600/20 to-transparent" />
                    </div>
                </MotionDiv>
            </div>

            <div
                className="relative h-[620px] md:h-[680px] flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing"
            >
                <div className="relative w-full max-w-7xl flex items-center justify-center">
                    {extendedMentors.map((item, index) => (
                        <MentorCard
                            key={`${item.name}-${index}`}
                            item={item}
                            scrollX={scrollX}
                            index={index}
                            totalItems={extendedMentors.length}
                        />
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20" />
        </section>
    );
};

export default MentorsSection;
