import React from 'react';
import { SplineScene } from '@/components/ui/SplineScene';
import { Spotlight } from '@/components/ui/Spotlight';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero3DElement = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-[85vh] relative overflow-hidden bg-white pt-20">

            {/* Animated color blobs */}
            <motion.div
                animate={{ x: [0, 60, -30, 0], y: [0, 40, -20, 0], scale: [1, 1.2, 0.95, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-32 -left-24 w-[500px] h-[500px] bg-indigo-200/60 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{ x: [0, -50, 30, 0], y: [0, 60, -30, 0], scale: [1, 1.15, 0.9, 1] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute top-1/3 right-[-100px] w-[450px] h-[450px] bg-violet-200/50 rounded-full blur-[130px] pointer-events-none"
            />
            <motion.div
                animate={{ x: [0, 40, -20, 0], y: [0, -40, 30, 0], scale: [1, 1.1, 0.95, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                className="absolute bottom-[-80px] left-1/3 w-[400px] h-[400px] bg-cyan-200/40 rounded-full blur-[110px] pointer-events-none"
            />
            <motion.div
                animate={{ x: [0, -30, 50, 0], y: [0, 30, -50, 0], scale: [1, 1.25, 0.9, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-0 right-1/3 w-[350px] h-[350px] bg-pink-200/40 rounded-full blur-[100px] pointer-events-none"
            />

            {/* Spotlight */}
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#6366f1" />

            <div className="flex flex-col lg:flex-row h-full min-h-[85vh] relative z-10">
                {/* Left content */}
                <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 w-fit"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                            The Future of Intelligence
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'circOut' }}
                        className="text-4xl md:text-5xl xl:text-7xl font-black mb-6 leading-[1.05] tracking-tighter uppercase text-slate-900"
                    >
                        REWIRE YOUR <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500">
                            POTENTIAL.
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2 text-slate-500 max-w-lg text-base leading-relaxed mb-8"
                    >
                        MentriQ is where precision meets innovation. Master the core of modern technology with industry-first curriculums and elite mentorship.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button
                            onClick={() => navigate('/courses')}
                            className="group px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            Start Learning
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className="px-8 py-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Get a Consultation
                        </button>
                    </motion.div>
                </div>

                {/* Right: Spline 3D Scene */}
                <div className="flex-1 relative min-h-[400px] lg:min-h-auto">
                    <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero3DElement;
