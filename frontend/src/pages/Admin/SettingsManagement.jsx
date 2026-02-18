import React, { useState, useEffect } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Save, Mail, Phone, MapPin, Globe, Instagram, Linkedin, Twitter, MessageCircle } from "lucide-react";
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
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get("/settings");
            setFormData({
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || "",
                mapLink: data.mapLink || "",
                socialLinks: {
                    instagram: data.socialLinks?.instagram || "",
                    linkedin: data.socialLinks?.linkedin || "",
                    twitter: data.socialLinks?.twitter || "",
                    whatsapp: data.socialLinks?.whatsapp || ""
                }
            });
        } catch (error) {
            console.error("Failed to fetch settings", error);
            // toast.error("Failed to load settings"); // Optional: don't annoy on first load if empty
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
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/settings", formData);
            toast.success("Settings updated successfully");
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update settings");
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

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Google Maps Link</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    name="mapLink"
                                    value={formData.mapLink}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-600"
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 shadow-xl space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Globe size={20} className="text-cyan-400" />
                        Social Media
                    </h3>

                    <div className="space-y-4">
                        {[
                            { key: 'instagram', icon: Instagram, color: 'text-pink-400' },
                            { key: 'linkedin', icon: Linkedin, color: 'text-blue-400' },
                            { key: 'twitter', icon: Twitter, color: 'text-sky-400' },
                            { key: 'whatsapp', icon: MessageCircle, color: 'text-green-400' }
                        ].map(({ key, icon: Icon, color }) => (
                            <div key={key} className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">{key}</label>
                                <div className="relative">
                                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 ${color}`} size={16} />
                                    <input
                                        name={`social.${key}`}
                                        value={formData.socialLinks[key]}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-600"
                                        placeholder={`https://${key}.com/...`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full md:w-auto px-8 py-4 rounded-[1rem] font-black bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            <Save size={20} />
                            <span>{saving ? "Saving Changes..." : "Update Settings"}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SettingsManagement;
