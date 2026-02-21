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

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Identifying System Parameters...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <Globe size={200} />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Global Parameters</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-3">
                        <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 shadow-sm font-black">System Wide</span>
                        <span className="opacity-70">Manage contact information and social media entry points.</span>
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

                    <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 relative z-10">
                        <MapPin size={14} className="text-indigo-600" />
                        Communication Nodes
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Official Uplink</label>
                            <div className="relative group/field">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-indigo-600 transition-colors" size={18} />
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
                                    placeholder="support@mentriq.in"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Vocal Interface</label>
                            <div className="relative group/field">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-indigo-600 transition-colors" size={18} />
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Physical Coordinates</label>
                            <textarea
                                name="address"
                                rows={3}
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300 resize-none leading-relaxed"
                                placeholder="Headquarters details..."
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

                    <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 relative z-10">
                        <Globe size={14} className="text-indigo-600" />
                        Network Integration
                    </h3>

                    <div className="space-y-5 relative z-10">
                        {[
                            { key: 'instagram', label: 'Meta Visual Access', icon: Instagram, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
                            { key: 'linkedin', label: 'Professional Matrix', icon: Linkedin, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                            { key: 'twitter', label: 'Micro Signal Stream', icon: Twitter, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
                            { key: 'whatsapp', label: 'Direct Sync Channel', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }
                        ].map((social) => (
                            <div key={social.key} className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{social.label}</label>
                                <div className="relative group/field">
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 ${social.bg} ${social.border} border rounded-lg flex items-center justify-center transition-transform group-focus-within/field:scale-110`}>
                                        <social.icon className={`${social.color}`} size={14} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        name={`social.${social.key}`}
                                        value={formData.socialLinks[social.key]}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-16 text-slate-800 font-black text-xs focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
                                        placeholder={`Enter ${social.key} destination...`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Homepage Key Metrics */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8 lg:col-span-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                        <div>
                            <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3">
                                <TrendingUp size={14} className="text-emerald-500" />
                                Ecosystem Output Metrics
                            </h3>
                            <p className="text-slate-500 font-medium text-xs mt-1">Manual overrides for homepage impact statistics.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {[
                            { key: 'students', label: 'Active Enrollees', placeholder: '10K+', icon: Users },
                            { key: 'courses', label: 'Live Modules', placeholder: '50+', icon: BookOpen },
                            { key: 'placements', label: 'Success Velocity', placeholder: '98%', icon: TrendingUp },
                            { key: 'trainers', label: 'Expert Nodes', placeholder: '60+', icon: UserRound }
                        ].map((stat) => (
                            <div key={stat.key} className="space-y-3 p-6 bg-slate-50 border border-slate-100 rounded-3xl transition-all hover:bg-white hover:border-indigo-200 hover:shadow-lg group/stat">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</label>
                                <input
                                    name={`stat.${stat.key}`}
                                    value={formData.siteStats[stat.key]}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-none p-0 text-slate-900 font-black text-2xl focus:outline-none placeholder:text-slate-200"
                                    placeholder={stat.placeholder}
                                />
                                <div className="h-1 w-8 bg-indigo-100 rounded-full group-hover/stat:w-full group-hover/stat:bg-indigo-500 transition-all duration-500" />
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex justify-end relative z-10">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 px-10 py-5 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 text-[10px] uppercase tracking-[0.2em] w-full md:w-auto justify-center"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} strokeWidth={2.5} />
                                    <span>Sync All Parameters</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SettingsManagement;
