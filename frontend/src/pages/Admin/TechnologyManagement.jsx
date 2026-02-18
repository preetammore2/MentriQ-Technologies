import React, { useCallback, useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Trash2, Search, Cpu, X, Plus, Image as ImageIcon, Loader2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const MotionDiv = motion.div;

const TechnologyManagement = () => {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTech, setEditingTech] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        logo: "", // URL or File path
        logoFile: null,
        category: "other",
        order: 0
    });

    // Preview State
    const [imagePreview, setImagePreview] = useState(null);

    const toast = useToast();

    const fetchTechnologies = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/technologies");
            setTechnologies(data.data || []);
        } catch (error) {
            toast.error("Failed to load technologies");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchTechnologies();
    }, [fetchTechnologies]);

    const filteredTechnologies = technologies.filter((tech) =>
        tech.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/technologies/${id}`);
            setTechnologies((prev) => prev.filter((t) => t._id !== id));
            toast.success("Technology deleted");
        } catch {
            toast.error("Failed to delete technology");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, logoFile: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let logoUrl = formData.logo;

            // 1. Upload Image if selected
            if (formData.logoFile) {
                const uploadData = new FormData();
                uploadData.append("image", formData.logoFile);

                try {
                    const uploadRes = await api.post("/upload", uploadData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    logoUrl = uploadRes.data.imageUrl;
                } catch (uploadError) {
                    console.error("Upload failed", uploadError);
                    toast.error("Image upload failed");
                    setSubmitting(false);
                    return;
                }
            }

            const payload = {
                name: formData.name,
                logo: logoUrl,
                category: formData.category,
                order: parseInt(formData.order) || 0
            };

            if (editingTech) {
                // Update
                const { data } = await api.put(`/technologies/${editingTech._id}`, payload);
                setTechnologies(prev => prev.map(t => t._id === editingTech._id ? data.data : t));
                toast.success("Technology updated");
            } else {
                // Create
                const { data } = await api.post("/technologies", payload);
                setTechnologies((prev) => [data.data, ...prev]);
                toast.success("Technology created");
            }

            // Reset
            closeModal();

        } catch (err) {
            toast.error(err?.response?.data?.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const openCreateModal = () => {
        setEditingTech(null);
        setFormData({ name: "", logo: "", logoFile: null, category: "other", order: 0 });
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (tech) => {
        setEditingTech(tech);
        setFormData({
            name: tech.name,
            logo: tech.logo,
            logoFile: null,
            category: tech.category,
            order: tech.order || 0
        });
        setImagePreview(resolveImageUrl(tech.logo));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTech(null);
        setFormData({ name: "", logo: "", logoFile: null, category: "other", order: 0 });
        setImagePreview(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Technology Stack</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage the technologies displayed on the homepage.</p>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-4 flex items-center w-full md:w-auto group focus-within:border-indigo-500/50 transition-all">
                        <Search className="text-gray-500 ml-4" size={18} />
                        <input
                            type="text"
                            placeholder="Search technologies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-gray-500 focus:outline-none py-3 px-4 w-full md:w-64 font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span>Add Tech</span>
                    </button>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-indigo-500" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {filteredTechnologies.map((tech) => (
                        <div key={tech._id} className="bg-[#1e293b] border border-white/5 p-6 rounded-3xl flex flex-col items-center gap-4 group hover:border-indigo-500/30 transition-all shadow-lg relative">
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => openEditModal(tech)}
                                    className="p-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(tech._id)}
                                    className="p-2 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="w-16 h-16 bg-white rounded-2xl p-3 flex items-center justify-center">
                                <img
                                    src={resolveImageUrl(tech.logo)}
                                    alt={tech.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=Tech" }}
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="text-white font-bold">{tech.name}</h3>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{tech.category}</span>
                            </div>
                        </div>
                    ))}

                    {filteredTechnologies.length === 0 && (
                        <div className="col-span-full py-10 text-center text-gray-500">
                            No technologies found.
                        </div>
                    )}
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <div
                            className="absolute inset-0"
                            onClick={() => !submitting && closeModal()}
                        />
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 24 }}
                            className="relative w-full max-w-lg bg-[#0f172a]/95 border border-white/10 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex items-start justify-between gap-4 mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-white">{editingTech ? "Update Technology" : "Add Technology"}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{editingTech ? "Update tech stack details." : "Add a new tech stack icon to the homepage."}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => !submitting && closeModal()}
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                >
                                    <X size={18} className="mx-auto" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Tech Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                        placeholder="e.g. React Native"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Icon / Logo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <ImageIcon className="text-gray-600" size={24} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
                                            />
                                            <p className="text-xs text-gray-600 mt-2">Recommended: PNG with transparent background</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none bg-[#0f172a]"
                                        >
                                            <option value="frontend" className="bg-slate-900">Frontend</option>
                                            <option value="backend" className="bg-slate-900">Backend</option>
                                            <option value="database" className="bg-slate-900">Database</option>
                                            <option value="devops" className="bg-slate-900">DevOps</option>
                                            <option value="mobile" className="bg-slate-900">Mobile</option>
                                            <option value="other" className="bg-slate-900">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Order</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => !submitting && closeModal()}
                                        className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all font-bold text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-60 transition-all text-sm flex items-center gap-2"
                                    >
                                        {submitting && <Loader2 size={14} className="animate-spin" />}
                                        {editingTech ? "Update Technology" : "Save Technology"}
                                    </button>
                                </div>
                            </form>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TechnologyManagement;
