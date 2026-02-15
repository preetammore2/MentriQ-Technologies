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
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-[#0f172a] text-white overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
                    >
                        Our Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Services</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        We deliver end-to-end digital solutions designed to help your business grow, innovate, and lead in the digital era.
                    </motion.p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-12 md:py-20 max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => {
                            const color = gradients[index % gradients.length];
                            // Determine Icon Component
                            let IconComponent = Layers;
                            if (service.icon && !service.icon.startsWith('http')) {
                                IconComponent = iconMap[service.icon] || Layers;
                            }

                            // Split description for features if formatted with newlines or bullets
                            // Simplified logic: just display description

                            return (
                                <motion.div
                                    key={service._id}
                                    onClick={() => navigate('/contact')}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -5 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl border border-gray-50 transition-all duration-500 flex flex-col h-full group cursor-pointer"
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-6 shadow-lg overflow-hidden group-hover:scale-110 transition-all duration-500`}>
                                        {service.icon?.startsWith('http') ? (
                                            <img src={service.icon} alt={service.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <IconComponent size={32} strokeWidth={2.5} />
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">{service.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-8 flex-grow whitespace-pre-line text-[15px]">{service.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
                        <Layers size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-500">No active services found</h3>
                        <p className="text-gray-400">Please check back later.</p>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Have a Project in Mind?</h2>
                    <p className="text-lg text-gray-600 mb-10">
                        Let's collaborate to bring your vision to life. Our team of experts is ready to build something amazing for you.
                    </p>
                    <a href="/contact" className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white transition-all duration-200 bg-indigo-600 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1">
                        Start Your Project
                        <ChevronRight className="ml-2" size={20} />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
