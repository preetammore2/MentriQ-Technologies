import React from 'react';
import { SplineScene } from '@/components/ui/SplineScene';
import { Card } from '@/components/ui/Card';
import { Spotlight } from '@/components/ui/Spotlight';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero3DElement = () => {
    const navigate = useNavigate();

    return (
        <Card className="w-full min-h-[85vh] bg-black/[0.96] relative overflow-hidden border-0 rounded-none pt-20">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />

            <div className="flex flex-col lg:flex-row h-full min-h-[85vh]">
                {/* Left content */}
                <div className="flex-1 p-8 lg:p-16 relative z-10 flex flex-col justify-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">
                            The Future of Intelligence
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'circOut' }}
                        className="text-4xl md:text-5xl xl:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6 leading-[1.05] tracking-tighter uppercase"
                    >
                        REWIRE YOUR <br />
                        POTENTIAL.
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2 text-neutral-400 max-w-lg text-base leading-relaxed mb-8"
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
                            className="group px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40"
                        >
                            Start Learning
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
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
        </Card>
    );
};

export default Hero3DElement;
