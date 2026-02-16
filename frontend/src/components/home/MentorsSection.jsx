import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useMotionValue, useAnimationFrame, useSpring } from 'framer-motion';
import { apiClient as api } from '../../utils/apiClient';
import { resolveImageUrl } from '../../utils/imageUtils';

const MENTORS_DATA = [
    {
        name: "Litesh Singh", image: "/images/litesh.jpg", description: "5+ Years Experience in Automation and Deveops", stats: [
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
        name: "Venkat Sai", image: "/images/venkatsai.jpg", description: "5+ Years Experience in Oprations Experts", stats: [
            { value: "5+", label: "Years" },
            { value: "15+", label: "Projects" }
        ]
    },
    {
        name: "Satya Narayan Pradhan", image: "/images/satyanarayan.jpg", description: "5+ Years Experince in Integration Specialist", stats: [
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

// ... (MentorCard component remains the same)

const MentorsSection = () => {
    const [mentors, setMentors] = useState(MENTORS_DATA);

    const rawScrollX = useMotionValue(0);
    const scrollX = useSpring(rawScrollX, { damping: 50, stiffness: 400, mass: 0.5 });

    /* 
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
    */


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
