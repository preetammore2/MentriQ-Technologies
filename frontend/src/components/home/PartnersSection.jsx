import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient as api } from '../../utils/apiClient';
const MotionDiv = motion.div;

// Helper to get full image URL
const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace('/api', '');
    return `${baseUrl}${path}`;
};

const PartnersSection = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const { data } = await api.get('/partners');
                setPartners(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch partners", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    if (loading) return null;
    if (partners.length === 0) return null;

    return (
        <section className="py-24 bg-[#0f172a] overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block"
                >
                    <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4 block w-fit mx-auto">
                        Trusted Network
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        Our Hiring <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Partners</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Leading companies trust our graduates to build the future of technology.
                    </p>
                </motion.div>
            </div>

            <div className="relative w-full overflow-hidden flex flex-col gap-12">
                {/* Edge Blur Masks - Dark Theme */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0f172a] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0f172a] to-transparent z-10 pointer-events-none" />

                {/* Top Row: Scroll Left (Seamless Loop) */}
                <div className="flex overflow-hidden py-4">
                    <MotionDiv
                        className="flex gap-8 px-4 w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 40,
                            ease: "linear",
                        }}
                    >
                        {[...partners, ...partners].map((partner, index) => (
                            <PartnerCard key={`top-${index}`} partner={partner} />
                        ))}
                    </MotionDiv>
                </div>

                {/* Bottom Row: Scroll Right (Seamless Loop) */}
                <div className="flex overflow-hidden py-4">
                    <MotionDiv
                        className="flex gap-8 px-4 w-max"
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 45,
                            ease: "linear",
                        }}
                    >
                        {[...partners, ...partners].map((partner, index) => (
                            <PartnerCard key={`bottom-${index}`} partner={partner} />
                        ))}
                    </MotionDiv>
                </div>
            </div>
        </section>
    );
};

const PartnerCard = ({ partner }) => (
    <div
        className="group flex items-center justify-center min-w-[200px] h-28 px-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <img
            src={getImageUrl(partner.logo)}
            alt={partner.name}
            className="max-h-12 w-auto object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
            onError={(e) => e.target.src = "https://via.placeholder.com/150"}
        />
    </div>
);

export default PartnersSection;
