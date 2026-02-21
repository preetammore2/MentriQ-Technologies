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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-[#1e293b] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <MapPin size={20} className="text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">City Presence</h2>
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md border border-indigo-400/20">{cities.length} Distributed Nodes</span>
                        Manage locations and regional visibility.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-5 flex items-center group focus-within:border-indigo-500/50 transition-all shadow-inner">
                        <Search className="text-gray-500 ml-4" size={18} />
                        <input
                            type="text"
                            placeholder="Filter cities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-gray-600 focus:outline-none py-3.5 px-4 w-full lg:w-72 font-bold text-xs uppercase tracking-widest"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingCity(null);
                            setFormData(initialFormState);
                            setIsModalOpen(true);
                        }}
                        className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} strokeWidth={3} />
                        <span>Add City</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredCities.length === 0 ? (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-16 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <MapPin size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Cities Found</h3>
                    <p className="text-gray-400 mb-6">We couldn't find any cities matching your search.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <Plus size={18} />
                        Add First City
                    </button>
                </div>
            ) : (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Location Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Display Order</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
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
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-20 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-1 shrink-0 group-hover:border-indigo-500/30 transition-colors">
                                                        <img
                                                            src={resolveImageUrl(city.image)}
                                                            alt={city.name}
                                                            className="w-full h-full object-cover rounded-lg filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                                            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/80?text=City"; }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm tracking-tight">{city.name}</div>
                                                        <div className="text-gray-500 text-xs mt-1 max-w-[200px] truncate">{city.description || "No description"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="bg-white/5 px-3 py-1 rounded-lg text-xs font-mono text-gray-400">{city.order}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${city.isActive ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-gray-500/10 border-gray-500/20 text-gray-400"}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${city.isActive ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-wider">{city.isActive ? "Active" : "Hidden"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => handleEdit(city)}
                                                        className="p-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/10"
                                                        title="Edit Details"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(city._id)}
                                                        className="p-2.5 bg-red-500/10 text-red-500/50 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-transparent hover:border-red-500/20"
                                                        title="Remove Location"
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
                            className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]"
                        >
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{editingCity ? "Refine Location" : "Add Location"}</h2>
                                    <p className="text-gray-500 text-sm mt-1 font-bold uppercase tracking-widest">Regional Presence Config</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form id="cityForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                <div className="flex flex-col items-center justify-center">
                                    <label className="relative group cursor-pointer w-full">
                                        <div className={`w-full aspect-video rounded-[2rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative ${formData.image ? 'border-indigo-500/50' : 'border-white/10 bg-white/5 hover:border-indigo-500/30'}`}>
                                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
                                            {formData.image ? (
                                                <img src={resolveImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover relative z-10" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 text-gray-600 group-hover:text-indigo-400 transition-colors relative z-10 p-10">
                                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                                                        <Camera size={32} strokeWidth={1.5} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-center">Upload City Image</span>
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
                                            <span>Select Image</span>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">City Name</label>
                                        <div className="relative">
                                            <MapPin size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 text-white font-black focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all placeholder:text-gray-700"
                                                placeholder="e.g. New York"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Short Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all placeholder:text-gray-700 min-h-[100px] resize-none"
                                            placeholder="e.g. Premium tech-enabled learning centre."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Display Order</label>
                                            <input
                                                type="number"
                                                value={formData.order}
                                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all placeholder:text-gray-700"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Visibility Status</label>
                                            <div
                                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                                className={`w-full h-[62px] border border-white/10 rounded-2xl flex items-center justify-between px-5 cursor-pointer transition-all ${formData.isActive ? "bg-indigo-500/10 border-indigo-500/30" : "bg-white/5 hover:bg-white/10"}`}
                                            >
                                                <span className={`text-sm font-bold ${formData.isActive ? "text-indigo-400" : "text-gray-500"}`}>
                                                    {formData.isActive ? "Visible Online" : "Hidden Draft"}
                                                </span>
                                                <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${formData.isActive ? "bg-indigo-500" : "bg-white/10"}`}>
                                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${formData.isActive ? "translate-x-5" : "translate-x-0"}`} />
                                                </div>
                                            </div>
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
                                    form="cityForm"
                                    type="submit"
                                    disabled={uploading || submitting}
                                    className="px-12 py-5 rounded-[1.5rem] font-black bg-white text-black hover:bg-gray-200 shadow-2xl hover:scale-[1.05] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center gap-3 disabled:opacity-50"
                                >
                                    <Check size={20} strokeWidth={3} />
                                    <span>{submitting ? "Processing..." : (editingCity ? "Sync Changes" : "Deploy Location")}</span>
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
