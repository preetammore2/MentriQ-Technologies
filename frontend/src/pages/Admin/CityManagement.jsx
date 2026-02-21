import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Search, X, MapPin, Upload, Camera, Check, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const MotionTr = motion.tr;
const MotionDiv = motion.div;

const CityManagement = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    const initialFormState = {
        name: "",
        image: "",
        description: "",
        order: 0,
        isActive: true
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchCities = useCallback(async () => {
        try {
            const { data } = await api.get("/cities/admin");
            setCities(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load cities");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchCities();
        const interval = setInterval(fetchCities, 15000);
        return () => clearInterval(interval);
    }, [fetchCities]);

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
            setFormData((prev) => ({ ...prev, image: data.imageUrl }));
            toast.success("Image uploaded to storage");
        } catch {
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (city) => {
        setEditingCity(city);
        setFormData({
            name: city.name || "",
            image: city.image || "",
            description: city.description || "",
            order: city.order || 0,
            isActive: city.isActive !== undefined ? city.isActive : true
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this city?")) return;
        try {
            await api.delete(`/cities/${id}`);
            toast.success("City removed successfully");
            setCities((prev) => prev.filter((city) => city._id !== id));
        } catch {
            toast.error("Failed to delete city");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...formData };

            if (editingCity) {
                const { data } = await api.put(`/cities/${editingCity._id}`, payload);
                toast.success("City updated successfully");
                setCities((prev) => prev.map((city) => city._id === editingCity._id ? data : city));
            } else {
                const { data } = await api.post("/cities", payload);
                toast.success("City added successfully");
                setCities((prev) => [data, ...prev]);
            }

            setIsModalOpen(false);
            setEditingCity(null);
            setFormData(initialFormState);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCities = useMemo(() => (
        cities.filter((c) => (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
    ), [cities, searchTerm]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <MapPin size={28} className="text-emerald-600" />
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">City Presence</h2>
                        <span className="ml-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 text-xs font-bold">
                            {cities.length} Distributed Nodes
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">Manage locations and regional visibility.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl pr-6 flex items-center group focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
                        <Search className="text-slate-400 ml-4 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Filter cities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none py-3 px-4 w-full lg:w-72 font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingCity(null);
                            setFormData(initialFormState);
                            setIsModalOpen(true);
                        }}
                        className="bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-xl font-semibold shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 transition-all active:scale-95 text-sm whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span>Add City</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredCities.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-[3rem] p-24 text-center shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.03),transparent)]" />
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 text-slate-200 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all">
                        <MapPin size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight uppercase">Registry Void</h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto font-medium text-[10px] uppercase tracking-widest leading-relaxed">No regional nodes detected in the current sector.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                    >
                        Establish First Terminal
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Location Signature</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Display Priority</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Commands</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence mode="popLayout">
                                    {filteredCities.map((city) => (
                                        <MotionTr
                                            key={city._id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-24 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center p-1 shrink-0 group-hover:border-emerald-500/30 transition-all shadow-sm">
                                                        <img
                                                            src={resolveImageUrl(city.image)}
                                                            alt={city.name}
                                                            className="w-full h-full object-cover rounded-lg grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                                            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/120x80?text=City"; }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-slate-900 text-base tracking-tight">{city.name}</div>
                                                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1.5 max-w-[200px] truncate">{city.description || "No classification brief"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="bg-slate-50 px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-400 border border-slate-200 tracking-widest">#{city.order}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${city.isActive ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${city.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{city.isActive ? "Operational" : "Deactivated"}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => handleEdit(city)}
                                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-200 shadow-sm outline-none active:scale-95"
                                                        title="Refine Parameters"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(city._id)}
                                                        className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shadow-sm outline-none active:scale-95"
                                                        title="Terminate Node"
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <MotionDiv
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-xl bg-white border border-slate-200 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                                        {editingCity ? "Refine Terminal" : "Establish Node"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Status: Regional Presence Protocol</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form id="cityForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                <div className="flex flex-col items-center justify-center mb-4">
                                    <label className="relative group cursor-pointer w-full">
                                        <div className={`w-full aspect-video rounded-[2.5rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative ${formData.image ? 'border-emerald-500/30' : 'border-slate-200 bg-slate-50 group-hover:border-emerald-300'} shadow-inner`}>
                                            {formData.image ? (
                                                <img src={resolveImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover relative z-10" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 text-slate-300 group-hover:text-emerald-400 transition-colors relative z-10 p-10">
                                                    <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                                        <Camera size={38} strokeWidth={1.5} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-center">Capture City Vista</span>
                                                </div>
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-20">
                                                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-3 right-6 px-8 py-4 bg-emerald-600 text-white rounded-[1.5rem] shadow-xl group-hover:scale-110 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest z-30 active:scale-95 border-4 border-white">
                                            <Upload size={16} strokeWidth={3} />
                                            <span>Inject Visual</span>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">City Designation</label>
                                        <div className="relative group">
                                            <MapPin size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-extrabold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all placeholder:text-slate-300"
                                                placeholder="e.g. New York Terminal"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Regional Classification Brief</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-slate-700 font-medium italic focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all placeholder:text-slate-300 min-h-[120px] resize-none leading-relaxed"
                                            placeholder="Primary technological hub and learning sanctuary..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Display Priority</label>
                                            <input
                                                type="number"
                                                value={formData.order}
                                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-extrabold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all placeholder:text-slate-300"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Operational State</label>
                                            <div
                                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                                className={`w-full h-[74px] border rounded-2xl flex items-center justify-between px-6 cursor-pointer transition-all ${formData.isActive ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-200 hover:border-slate-300"}`}
                                            >
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${formData.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                                                    {formData.isActive ? "Online" : "Ghost Mode"}
                                                </span>
                                                <div className={`w-14 h-8 rounded-full p-1.5 transition-colors duration-300 ${formData.isActive ? "bg-emerald-500" : "bg-slate-200"}`}>
                                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${formData.isActive ? "translate-x-6" : "translate-x-0"}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-8 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.3em] transition-colors"
                                >
                                    Abort
                                </button>
                                <button
                                    form="cityForm"
                                    type="submit"
                                    disabled={uploading || submitting}
                                    className="px-12 py-5 rounded-2xl font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all text-[10px] uppercase tracking-widest flex items-center gap-4 disabled:opacity-50"
                                >
                                    <Check size={20} strokeWidth={3} />
                                    <span>{submitting ? "Syncing..." : (editingCity ? "Commit Changes" : "Deploy Node")}</span>
                                </button>
                            </div>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CityManagement;
