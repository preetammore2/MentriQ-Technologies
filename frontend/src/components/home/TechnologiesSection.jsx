import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiClient as api } from '../../utils/apiClient';

const TechnologiesSection = () => {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTechnologies = async () => {
            try {
                const { data } = await api.get('/technologies');
                setTechnologies(data.data || []);
            } catch (error) {
                console.error("Failed to fetch technologies:", error);
                // Fallback or empty state handled by UI
            } finally {
                setLoading(false);
            }
        };

        fetchTechnologies();
    }, []);

    if (loading) return null; // Or a skeleton loader
    if (technologies.length === 0) return null;

    return (
        <section className="py-32 bg-white overflow-hidden relative">
            {/* Advanced Ambient Glows - Refined for Light Theme */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px]" />

                {/* Background Tech Grid - Subtle for Light Theme */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 mb-24 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full bg-slate-50 border border-slate-100 mb-8 shadow-sm"
                >
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                    <span className="text-indigo-600 text-[10px] font-black tracking-[0.4em] uppercase">Industry Standard Tech</span>
                    <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(8,145,178,0.5)]" />
                </motion.div>

                <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-none text-slate-900">
                    TECHNOLOGIES YOU'LL <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600">MASTER</span>
                </h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                    Deployment-ready expertise in industry-standard tools and frameworks driving the <span className="text-slate-900">modern digital economy.</span>
                </p>
            </div>

            {/* 3D Perspective Scroller Container */}
            <div
                className="relative py-10"
                style={{
                    perspective: '2000px',
                    maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                }}
            >
                <div style={{ transformStyle: 'preserve-3d' }}>
                    <motion.div
                        className="flex gap-8 px-4 w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: Math.max(35, technologies.length * 2), // Adjust speed based on content
                            ease: "linear",
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Dual Buffer for Seamless Loop */}
                        {[...technologies, ...technologies].map((tech, index) => (
                            <motion.div
                                key={`${tech._id}-${index}`}
                                whileHover={{
                                    scale: 1.1,
                                    rotateX: 10,
                                    rotateY: 10,
                                    translateZ: 50,
                                    zIndex: 100
                                }}
                                className="w-40 h-40 bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center justify-center gap-4 group cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-indigo-100"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative w-16 h-16 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                    <img
                                        src={tech.logo}
                                        alt={tech.name}
                                        className="w-full h-full object-contain filter drop-shadow-sm"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/64?text=Tech"; // Fallback
                                        }}
                                    />
                                </div>
                                <span className="text-xs font-black uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 transition-colors relative z-10">{tech.name}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TechnologiesSection;
