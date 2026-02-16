import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Search, X, Globe, Building2, Upload, Camera, Check, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const MotionTr = motion.tr;
const MotionDiv = motion.div;

import { resolveImageUrl } from "../../utils/imageUtils";

const getSafeWebsiteHost = (website) => {
    if (!website) return "";
    try {
        const url = /^https?:\/\//i.test(website) ? website : `https://${website}`;
        return new URL(url).hostname;
    } catch {
        return website;
    }
};

const PartnerManagement = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    const initialFormState = {
        name: "",
        logo: "",
        website: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchPartners = useCallback(async () => {
        try {
            const { data } = await api.get("/partners");
            setPartners(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load partners");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchPartners();
        const interval = setInterval(fetchPartners, 15000);
        return () => clearInterval(interval);
    }, [fetchPartners]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image too large (max 2MB)");
            return;
        }

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setUploading(true);
            const { data } = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData((prev) => ({ ...prev, logo: data }));
            toast.success("Logo uploaded to storage");
        } catch {
            toast.error("Logo upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (partner) => {
        setEditingPartner(partner);
        setFormData({
            name: partner.name || "",
            logo: partner.logo || "",
            website: partner.website || ""
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this partner?")) return;
        try {
            await api.delete(`/partners/${id}`);
            toast.success("Partner removed successfully");
            setPartners((prev) => prev.filter((partner) => partner._id !== id));
        } catch {
            toast.error("Failed to delete partner");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                website: formData.website?.trim()
                    ? (/^https?:\/\//i.test(formData.website.trim()) ? formData.website.trim() : `https://${formData.website.trim()}`)
                    : ""
            };

            if (editingPartner) {
                const { data } = await api.put(`/partners/${editingPartner._id}`, payload);
                toast.success("Partner updated successfully");
                setPartners((prev) => prev.map((partner) => partner._id === editingPartner._id ? data : partner));
            } else {
                const { data } = await api.post("/partners", payload);
                toast.success("Partner added successfully");
                setPartners((prev) => [data, ...prev]);
            }

            setIsModalOpen(false);
            setEditingPartner(null);
            setFormData(initialFormState);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredPartners = useMemo(() => (
        partners.filter((p) => (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
    ), [partners, searchTerm]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Partner Management</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage and monitor corporate partnerships.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-4 flex items-center group focus-within:border-indigo-500/50 transition-all">
                        <Search className="text-gray-500 ml-4" size={18} />
                        <input
                            type="text"
                            placeholder="Search partners..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-gray-500 focus:outline-none py-3 px-4 w-full md:w-64 font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingPartner(null);
                            setFormData(initialFormState);
                            setIsModalOpen(true);
                        }}
                        className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span>Add Partner</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredPartners.length === 0 ? (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-16 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Building2 size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Partners Found</h3>
                    <p className="text-gray-400 mb-6">We couldn't find any partners matching your search.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <Plus size={18} />
                        Add First Partner
                    </button>
                </div>
            ) : (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Partner Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Digital Presence</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {filteredPartners.map((partner) => (
                                        <MotionTr
                                            key={partner._id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-2 shrink-0">
                                                        <img
                                                            src={resolveImageUrl(partner.logo)}
                                                            alt={partner.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/80?text=Logo"; }}
                                                        />
                                                    </div>
                                                    <div className="font-bold text-white text-sm">{partner.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {partner.website ? (
                                                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-colors">
                                                        <LinkIcon size={14} />
                                                        {getSafeWebsiteHost(partner.website)}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-600 text-xs">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(partner)}
                                                        className="p-2.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                                                        title="Edit Partner"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(partner._id)}
                                                        className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                        title="Delete Partner"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </MotionTr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col"
                        >
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{editingPartner ? "Refine Entity" : "Global Onboarding"}</h2>
                                    <p className="text-gray-500 text-sm mt-1 font-bold uppercase tracking-widest">Partner Identity Protocol</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form id="partnerForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                <div className="flex flex-col items-center justify-center">
                                    <label className="relative group cursor-pointer">
                                        <div className={`w-48 h-48 rounded-[2rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative ${formData.logo ? 'border-indigo-500/50' : 'border-white/10 bg-white/5 hover:border-indigo-500/30'}`}>
                                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
                                            {formData.logo ? (
                                                <img src={resolveImageUrl(formData.logo)} alt="Preview" className="w-full h-full object-contain p-6 relative z-10" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 text-gray-600 group-hover:text-indigo-400 transition-colors relative z-10">
                                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                                                        <Camera size={32} strokeWidth={1.5} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Initialize Logo</span>
                                                </div>
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-md z-20">
                                                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-black rounded-[1rem] shadow-2xl group-hover:-translate-y-1 transition-all flex items-center gap-3 text-xs font-black uppercase tracking-widest z-30 opacity-0 group-hover:opacity-100">
                                            <Upload size={14} strokeWidth={3} />
                                            <span>Inject Asset</span>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Entity Designation</label>
                                        <div className="relative">
                                            <Building2 size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 text-white font-black focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all placeholder:text-gray-700"
                                                placeholder="e.g. Aether Dynamics"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Digital Domain</label>
                                        <div className="relative">
                                            <Globe size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input
                                                value={formData.website}
                                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 text-white font-black focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all placeholder:text-gray-700"
                                                placeholder="https://aether.network"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="p-10 border-t border-white/5 bg-gradient-to-t from-white/[0.02] to-transparent flex justify-end items-center gap-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors bg-white/5 px-10 py-5 rounded-2xl hover:bg-white/10"
                                >
                                    Dismiss
                                </button>
                                <button
                                    form="partnerForm"
                                    type="submit"
                                    disabled={uploading || submitting}
                                    className="px-12 py-5 rounded-[1.5rem] font-black bg-white text-black hover:bg-gray-200 shadow-2xl hover:scale-[1.05] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center gap-3 disabled:opacity-50"
                                >
                                    <Check size={20} strokeWidth={3} />
                                    <span>{submitting ? "Processing..." : (editingPartner ? "Sync Changes" : "Deploy Entity")}</span>
                                </button>
                            </div>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PartnerManagement;
