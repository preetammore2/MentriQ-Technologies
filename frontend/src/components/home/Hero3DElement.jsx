import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useAnimation } from 'framer-motion';
import { Code, Cpu, Database, Shield, Zap, Brain, Layers } from 'lucide-react';
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

const FloatingIcon = ({ element, index, smoothMouseX, smoothMouseY }) => {
    const Icon = element.icon;
    const magneticX = useTransform(smoothMouseX, [-400, 400], [element.x - 30, element.x + 30]);
    const magneticY = useTransform(smoothMouseY, [-400, 400], [element.y - 30, element.y + 30]);
    const zDepth = 150 + (index * 40);

    return (
        <motion.div
            className="absolute group z-50"
            style={{
                x: magneticX,
                y: magneticY,
                translateZ: zDepth,
                transformStyle: 'preserve-3d'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: element.delay, duration: 1 }}
        >
            <motion.div
                className="w-16 h-16 bg-white/60 backdrop-blur-3xl rounded-2xl flex items-center justify-center border border-slate-200 cursor-pointer relative overflow-hidden group/box shadow-xl shadow-slate-200/50 transition-all duration-500"
                whileHover={{
                    scale: 1.2,
                    rotateY: 180,
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
            >
                {/* Background Energy Core */}
                <div className="absolute inset-0 bg-indigo-500/5 opacity-50" />

                <Icon className="w-7 h-7 text-indigo-500 group-hover/box:opacity-0 transition-all duration-300 drop-shadow-[0_2px_5px_rgba(79,70,229,0.1)]" />

                <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 rounded-2xl rotate-y-180 backface-hidden opacity-0 group-hover/box:opacity-100 transition-opacity duration-300">
                    <span className="text-[9px] font-black uppercase tracking-tighter text-white px-2 text-center leading-tight">
                        {element.label}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Hero3DElement = () => {
    const containerRef = useRef(null);
    const [pulse, setPulse] = useState(0);

    const triggerPulse = () => {
        setPulse(prev => prev + 1);
    };

    // Ultra-smooth cursor tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 80, mass: 0.5 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(smoothMouseY, [-400, 400], [10, -10]);
    const rotateY = useTransform(smoothMouseX, [-400, 400], [-10, 10]);

    // Top-level transforms for background elements to avoid Hook violations in return
    const bgX = useTransform(smoothMouseX, [-400, 400], [20, -20]);
    const bgY = useTransform(smoothMouseY, [-400, 400], [20, -20]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const floatingElements = [
        { icon: Cpu, color: 'from-blue-500 to-blue-600', x: -220, y: -120, label: 'AI & ML', delay: 0 },
        { icon: Database, color: 'from-emerald-500 to-emerald-600', x: 220, y: -100, label: 'Cloud Systems', delay: 0.2 },
        { icon: Shield, color: 'from-purple-500 to-purple-600', x: -240, y: 110, label: 'Secure Core', delay: 0.4 },
        { icon: Zap, color: 'from-yellow-500 to-yellow-600', x: 230, y: 130, label: 'Cyber Tech', delay: 0.6 },
        { icon: Brain, color: 'from-pink-500 to-pink-600', x: 0, y: -200, label: 'Intelligence', delay: 0.8 },
        { icon: Layers, color: 'from-cyan-500 to-cyan-600', x: 0, y: 200, label: 'Full Stack', delay: 1.0 },
    ];

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[700px] flex items-center justify-center cursor-crosshair select-none group/stage"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={triggerPulse}
            style={{ perspective: '2000px' }}
        >
            {/* Spotlight Effect for Depth - Themed to Indigo */}
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="#6366f1"
            />

            {/* Holographic HUD Corners - Refined for Light Theme */}
            <div className="absolute inset-20 border-[1px] border-indigo-500/5 rounded-[3rem] pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500/20 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-500/20 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-500/20 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-500/20 rounded-br-2xl" />
            </div>

            {/* Orbital Data Streams - Adjusted for Light Theme */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[1, 2].map((ring) => (
                    <motion.div
                        key={ring}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                        transition={{ duration: 25 + ring * 5, repeat: Infinity, ease: "linear" }}
                        style={{
                            width: 500 + ring * 100,
                            height: 500 + ring * 100,
                            border: '1px dashed rgba(79, 70, 229, 0.08)',
                            borderRadius: '50%',
                        }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Interactive Energy Pulse Ring */}
            <AnimatePresence>
                {pulse > 0 && (
                    <motion.div
                        key={pulse}
                        initial={{ scale: 0.5, opacity: 0.8 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute w-64 h-64 border-2 border-indigo-600/30 rounded-full pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Dynamic Interactive Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, #6366f1 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        x: bgX,
                        y: bgY
                    }}
                />
            </div>

            {/* Main 3D Stage */}
            <motion.div
                className="relative w-full h-full flex items-center justify-center"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Central Spline Scene Integration */}
                <motion.div
                    className="relative w-[600px] h-[600px] z-10"
                    translateZ={50}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full animate-in fade-in zoom-in duration-1000"
                    />

                    {/* Glass Portal Reflection Overlay - Refined for Light Theme */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/20 to-transparent rounded-full mix-blend-overlay opacity-40 blur-2xl animate-pulse" />

                    {/* Scanner Beam Animation (Vertical Sweep) */}
                    <motion.div
                        animate={{ top: ["-10%", "110%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent pointer-events-none blur-[2px]"
                    />
                </motion.div>

                {/* Magnetic Floating Icons - Now Using FloatingIcon Component to satisfy Hook Rules */}
                {floatingElements.map((element, index) => (
                    <FloatingIcon
                        key={index}
                        element={element}
                        index={index}
                        smoothMouseX={smoothMouseX}
                        smoothMouseY={smoothMouseY}
                    />
                ))}

                {/* Tech Aura Reflection - Subtle for Light Theme */}
                <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
            </motion.div>
        </div>
    );
};

export default Hero3DElement;
