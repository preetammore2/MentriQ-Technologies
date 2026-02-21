import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Search, X, Globe, Building2, Upload, Camera, Check, Link as LinkIcon, Handshake, RefreshCw, Loader2 } from "lucide-react";
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

const FALLBACK_PARTNERS = [
    { name: "HD Media Network", logo: "/images/hdmn.png" },
    { name: "SkyServer", logo: "/images/skyserver.jpg" },
    { name: "Singh Enterprises", logo: "/images/singh2.jpeg" },
    { name: "Falcons Beyond Imagination", logo: "/images/falcons.png" },
    { name: "Voltzenic Motors", logo: "/images/volt.png" },
    { name: "Ashok Infratech", logo: "/images/ashok.jpg" },
    { name: "Shekhawat Group of Industries", logo: "/images/shekhawat2.jpeg" },
    { name: "BIMPro Solutions pvt ltd", logo: "/images/bimpro2.jpeg" },
    { name: "Milan Power", logo: "/images/milanPower.png" },
    { name: "PU incent", logo: "/images/puIncent.png" },
    { name: "UPnex", logo: "/images/upnex2.jpeg" },
    { name: "NT Education", logo: "/images/nt2.jpeg" },
];

const PartnerManagement = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
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
            setFormData((prev) => ({ ...prev, logo: data.imageUrl || data.imagePath || data }));
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

    const syncDefaultPartners = async () => {
        setIsSyncing(true);
        try {
            const syncPromises = FALLBACK_PARTNERS.map(p => api.post("/partners", p));
            await Promise.all(syncPromises);
            toast.success("Synchronized default partners link to database");
            fetchPartners();
        } catch (err) {
            toast.error("Sync failed: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const filteredPartners = useMemo(() => (
        partners.filter((p) => (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
    ), [partners, searchTerm]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                            <Handshake size={28} className="text-indigo-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Alliance Registry</h2>
                                <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 text-xs font-bold">
                                    {partners.length} Entities
                                </span>
                            </div>
                            <p className="text-slate-500 font-medium text-sm">Authenticated network of corporate partners and hiring entities.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
                        {partners.length === 0 && (
                            <button
                                onClick={syncDefaultPartners}
                                disabled={isSyncing}
                                className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap"
                            >
                                <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                                <span>{isSyncing ? "Syncing..." : "Sync Partners"}</span>
                            </button>
                        )}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl pr-6 flex items-center group focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all w-full lg:w-auto">
                            <Search className="text-slate-400 ml-4 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search partners..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none py-3 px-4 w-full lg:w-64 font-bold text-sm tracking-tight"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setEditingPartner(null);
                                setFormData(initialFormState);
                                setIsModalOpen(true);
                            }}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap"
                        >
                            <Plus size={18} />
                            <span>Add Partner</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredPartners.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-32 text-center group shadow-sm">
                        <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-indigo-100 text-indigo-600 shadow-sm">
                            <Building2 size={48} />
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Alliance Network Offline</h3>
                        <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium text-sm leading-relaxed">The hiring and corporate connection network is currently empty. Manual deployment required.</p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <button
                                onClick={syncDefaultPartners}
                                disabled={isSyncing}
                                className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-10 py-4 rounded-xl font-bold flex items-center gap-3 justify-center hover:bg-emerald-100 transition-all active:scale-95 text-[10px] uppercase tracking-widest"
                            >
                                <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                                {isSyncing ? "Synchronizing..." : "Sync Global Entities"}
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-[10px] uppercase tracking-widest"
                            >
                                <Plus size={18} />
                                Initialize Registry
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Partner Details</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Digital Presence</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <AnimatePresence mode="popLayout">
                                        {filteredPartners.map((partner) => (
                                            <MotionTr
                                                key={partner._id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-slate-50/50 transition-colors group"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-2.5 shrink-0 group-hover:border-indigo-300 transition-all shadow-sm">
                                                            <img
                                                                src={resolveImageUrl(partner.logo)}
                                                                alt={partner.name}
                                                                className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-500"
                                                                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/80?text=Logo"; }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-base tracking-tight">{partner.name}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Entity Partner</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {partner.website ? (
                                                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 hover:text-indigo-700 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-indigo-100">
                                                            <Globe size={12} />
                                                            {getSafeWebsiteHost(partner.website)}
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Offline Presence</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => handleEdit(partner)}
                                                            className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200"
                                                            title="Refine Entity"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(partner._id)}
                                                            className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                                                            title="Terminate Connection"
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
                                className="relative w-full max-w-xl bg-white border border-slate-200 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col"
                            >
                                <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{editingPartner ? "Refine Entity" : "Global Onboarding"}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Partner Identity Protocol</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-200"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form id="partnerForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-10 custom-scrollbar">
                                    <div className="flex flex-col items-center justify-center">
                                        <label className="relative group cursor-pointer">
                                            <div className={`w-48 h-48 rounded-[2.5rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative ${formData.logo ? 'border-indigo-400 bg-white' : 'border-slate-200 bg-slate-50 hover:border-indigo-400'}`}>
                                                {formData.logo ? (
                                                    <img src={resolveImageUrl(formData.logo)} alt="Preview" className="w-full h-full object-contain p-6 relative z-10" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-4 text-slate-400 group-hover:text-indigo-500 transition-colors relative z-10">
                                                        <Camera size={32} strokeWidth={1.5} />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Initialize Logo</span>
                                                    </div>
                                                )}
                                                {uploading && (
                                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm z-20">
                                                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-indigo-600 border border-slate-200 rounded-2xl shadow-xl group-hover:-translate-y-1 transition-all flex items-center gap-3 text-xs font-black uppercase tracking-widest z-30 opacity-0 group-hover:opacity-100">
                                                <Upload size={14} strokeWidth={3} />
                                                <span>Inject Asset</span>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Entity Designation</label>
                                            <div className="relative group">
                                                <Building2 size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                                <input
                                                    required
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
                                                    placeholder="e.g. Aether Dynamics"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Digital Domain</label>
                                            <div className="relative group">
                                                <Globe size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                                <input
                                                    value={formData.website}
                                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
                                                    placeholder="https://aether.network"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                <div className="p-10 border-t border-slate-100 flex justify-end items-center gap-4 shrink-0 -mx-10 -mb-10 mt-10 bg-slate-50/50">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4.5 rounded-2xl bg-white text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 border border-slate-200 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        form="partnerForm"
                                        type="submit"
                                        disabled={uploading || submitting}
                                        className="flex-2 py-4.5 rounded-2xl bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <Check size={18} strokeWidth={3} />
                                        <span>{submitting ? "Processing..." : (editingPartner ? "Sync Changes" : "Deploy Entity")}</span>
                                    </button>
                                </div>
                            </MotionDiv>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PartnerManagement;
