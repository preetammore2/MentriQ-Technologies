import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    CheckCircle2,
    Layers,
    Globe,
    Smartphone,
    Palette,
    Megaphone,
    Server,
    Shield,
    Database,
    Code
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { apiClient as api } from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../utils/imageUtils';

// Icon mapping
const iconMap = {
    'Globe': Globe,
    'Smartphone': Smartphone,
    'Palette': Palette,
    'Megaphone': Megaphone,
    'Server': Server,
    'Shield': Shield,
    'Database': Database,
    'Code': Code,
    'Layers': Layers
};

const ServicesPage = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const gradients = [
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-orange-500 to-red-500',
        'from-green-500 to-emerald-500',
        'from-indigo-500 to-violet-500',
        'from-red-600 to-rose-600'
    ];

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await api.get('/services');
                setServices(data);
            } catch (error) {
                console.error("Failed to fetch services", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const isLoading = loading;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Premium Dark Hero Section */}
            <section className="relative min-h-[45vh] flex items-center bg-[#070b14] text-white overflow-hidden pt-24 pb-12">
                {/* Advanced Atmospheric Animations for Dark */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            x: [0, 80, 0],
                            y: [0, 40, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[10%] left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse"
                    />
                    <motion.div
                        animate={{
                            x: [0, -60, 0],
                            y: [0, 70, 0],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[10%] right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]"
                    />
                    {/* High-Contrast Technical Grid */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] bg-[length:40px_40px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 mb-8 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20"
                    >
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">Global Service Architecture</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter uppercase font-display leading-[0.9]"
                    >
                        ENGINEERING <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                            DIGITAL EXCELLENCE.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-sm md:text-base max-w-3xl mx-auto mb-10 text-slate-400 leading-relaxed font-medium opacity-80"
                    >
                        We deliver end-to-end digital solutions designed to help your business grow, innovate, and <span className="text-white font-bold">lead in the digital era</span>.
                    </motion.p>
                </div>
            </section>

            {/* Services Grid - Premium Architectural */}
            <section className="py-24 max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-gray-200/50 rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const color = gradients[index % gradients.length];
                            const iconValue = service.icon || "";
                            const isImage = iconValue.startsWith("http") || iconValue.startsWith("/") || iconValue.startsWith("data:");

                            let IconComponent = Layers;
                            if (!isImage) {
                                IconComponent = iconMap[iconValue] || Layers;
                            }

                            return (
                                <motion.div
                                    key={service._id}
                                    onClick={() => navigate('/contact')}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 hover:border-indigo-500/20 transition-all duration-500 flex flex-col h-full group cursor-pointer relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${color} opacity-5 rounded-bl-[100%] -mr-10 -mt-10 transition-transform group-hover:scale-150`} />

                                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                                        {isImage ? (
                                            <img src={resolveImageUrl(iconValue)} alt={service.title} className="w-full h-full object-cover rounded-3xl" />
                                        ) : (
                                            <IconComponent size={36} strokeWidth={2} />
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors relative z-10">{service.title}</h3>
                                    <p className="text-slate-500 leading-relaxed mb-8 flex-grow whitespace-pre-line text-sm font-medium relative z-10">{service.description}</p>

                                    <div className="flex items-center text-indigo-600 font-bold text-sm uppercase tracking-widest mt-auto group-hover:translate-x-2 transition-transform">
                                        Learn More <ChevronRight size={16} className="ml-1" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl border border-slate-100">
                        <Layers size={64} className="mx-auto text-slate-200 mb-6" />
                        <h3 className="text-2xl font-black text-slate-400">No active services found</h3>
                    </div>
                )}
            </section>

            {/* CTA Section - Technical Dark */}
            <section className="py-24 bg-[#070b14] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] bg-[length:30px_30px]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase">
                        READY TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">SCALE UP?</span>
                    </h2>
                    <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Let's collaborate to bring your vision to life. Our engineering team is ready to build something exceptional.
                    </p>
                    <a href="/contact" className="inline-flex items-center justify-center px-10 py-5 text-sm font-black text-white uppercase tracking-[0.2em] transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/20 group">
                        Initialize Project
                        <ChevronRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
