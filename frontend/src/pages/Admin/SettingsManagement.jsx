import React, { useState, useEffect } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Save, Mail, Phone, MapPin, Globe, Instagram, Linkedin, Twitter, MessageCircle, TrendingUp } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const SettingsManagement = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        address: "",
        mapLink: "",
        socialLinks: {
            instagram: "",
            linkedin: "",
            twitter: "",
            whatsapp: ""
        },
        siteStats: {
            students: "",
            courses: "",
            placements: "",
            trainers: ""
        }
    });

    useEffect(() => {
        fetchSettings();

        const interval = setInterval(() => {
            fetchSettings();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const fetchSettings = async () => {
        try {
            const [{ data: settingsData }, { data: statsData }] = await Promise.all([
                api.get("/settings"),
                api.get("/stats")
            ]);

            setFormData({
                email: settingsData.email || "",
                phone: settingsData.phone || "",
                address: settingsData.address || "",
                mapLink: settingsData.mapLink || "",
                socialLinks: {
                    instagram: settingsData.socialLinks?.instagram || "",
                    linkedin: settingsData.socialLinks?.linkedin || "",
                    twitter: settingsData.socialLinks?.twitter || "",
                    whatsapp: settingsData.socialLinks?.whatsapp || ""
                },
                siteStats: {
                    students: statsData.students || "",
                    courses: statsData.courses || "",
                    placements: statsData.placements || "",
                    trainers: statsData.trainers || ""
                }
            });
        } catch (error) {
            console.error("Failed to fetch settings/stats", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("social.")) {
            const socialKey = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, [socialKey]: value }
            }));
        } else if (name.startsWith("stat.")) {
            const statKey = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                siteStats: { ...prev.siteStats, [statKey]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await Promise.all([
                api.put("/settings", {
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    mapLink: formData.mapLink,
                    socialLinks: formData.socialLinks
                }),
                api.put("/stats", formData.siteStats)
            ]);
            toast.success("All settings and metrics updated");
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to sync some settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-white">Loading Settings...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Global Settings</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage contact information and social media links.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 shadow-xl space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <MapPin size={20} className="text-indigo-400" />
                        Contact Information
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Official Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-600"
                                    placeholder="support@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-600"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Physical Address</label>
                            <textarea
                                name="address"
                                rows={3}
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-600 resize-none leading-relaxed"
                                placeholder="123 Tech Park..."
                            />
                        </div>

                    </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 shadow-xl space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Globe size={20} className="text-blue-400" />
                        Social Media Links
                    </h3>

                    <div className="space-y-4">
                        {[
                            { key: 'instagram', label: 'Instagram URL', icon: Instagram, color: 'text-pink-500' },
                            { key: 'linkedin', label: 'LinkedIn URL', icon: Linkedin, color: 'text-blue-600' },
                            { key: 'twitter', label: 'Twitter / X URL', icon: Twitter, color: 'text-sky-400' },
                            { key: 'whatsapp', label: 'WhatsApp Number/Link', icon: MessageCircle, color: 'text-emerald-500' }
                        ].map((social) => (
                            <div key={social.key} className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">{social.label}</label>
                                <div className="relative">
                                    <social.icon className={`absolute left-4 top-1/2 -translate-y-1/2 ${social.color}`} size={16} />
                                    <input
                                        name={`social.${social.key}`}
                                        value={formData.socialLinks[social.key]}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-600"
                                        placeholder={`Enter ${social.key} link...`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Homepage Key Metrics */}
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 shadow-xl space-y-6 lg:col-span-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp size={20} className="text-emerald-400" />
                            Homepage Key Metrics
                        </h3>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest hidden sm:block">Update Display Value Overrides</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { key: 'students', label: 'Students Trained', placeholder: '10K+' },
                            { key: 'courses', label: 'Live Courses', placeholder: '50+' },
                            { key: 'placements', label: 'Placement Rate', placeholder: '98%' },
                            { key: 'trainers', label: 'Expert Trainers', placeholder: '60+' }
                        ].map((stat) => (
                            <div key={stat.key} className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">{stat.label}</label>
                                <input
                                    name={`stat.${stat.key}`}
                                    value={formData.siteStats[stat.key]}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-700"
                                    placeholder={stat.placeholder}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full md:w-auto px-12 py-5 rounded-[1.5rem] font-black bg-white text-black hover:bg-gray-200 shadow-2xl hover:scale-[1.05] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            <Save size={20} strokeWidth={3} />
                            <span>{saving ? "Deploying Intel..." : "Deploy New Metrics"}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SettingsManagement;
