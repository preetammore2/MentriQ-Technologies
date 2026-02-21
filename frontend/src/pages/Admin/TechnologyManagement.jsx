import React, { useCallback, useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Trash2, Search, Cpu, X, Plus, Image as ImageIcon, Loader2, Edit2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const MotionDiv = motion.div;

const FALLBACK_TECHS = [
    { name: "HTML", logo: "/images/html.png", category: "frontend", order: 1 },
    { name: "CSS", logo: "/images/css.png", category: "frontend", order: 2 },
    { name: "JavaScript", logo: "/images/js.png", category: "frontend", order: 3 },
    { name: "React", logo: "/images/react.png", category: "frontend", order: 4 },
    { name: "Node.js", logo: "/images/Node.js_logo.svg.png", category: "backend", order: 5 },
    { name: "Express.js", logo: "/images/express3.webp", category: "backend", order: 6 },
    { name: "MongoDB", logo: "/images/mongodb4.png", category: "database", order: 7 },
    { name: "SQL", logo: "/images/sql.png", category: "database", order: 8 },
    { name: "DevOps", logo: "/images/deveops.svg", category: "devops", order: 9 },
    { name: "Cyber Security", logo: "/images/security.png", category: "other", order: 10 },
    { name: "Java", logo: "/images/java2.webp", category: "backend", order: 11 },
    { name: "Blockchain", logo: "/images/blockchain.png", category: "other", order: 12 },
    { name: "Flutter", logo: "/images/flutter5.png", category: "mobile", order: 13 },
    { name: "Python", logo: "/images/python.png", category: "backend", order: 14 },
    { name: "Data Analyst", logo: "/images/bigdata.png", category: "other", order: 15 },
    { name: "Power BI", logo: "/images/powerBI.png", category: "other", order: 16 },
];

const TechnologyManagement = () => {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTech, setEditingTech] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const toast = useToast();

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

    const fetchTechnologies = useCallback(async () => {
        try {
            const { data } = await api.get("/technologies");
            setTechnologies(data.data || []);
        } catch (error) {
            toast.error("Failed to load technologies");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const syncDefaultTechs = async () => {
        setIsSyncing(true);
        try {
            const syncPromises = FALLBACK_TECHS.map(t => api.post("/technologies", t));
            await Promise.all(syncPromises);
            toast.success("Synchronized mastery stack to database");
            fetchTechnologies();
        } catch (err) {
            toast.error("Sync failed: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        fetchTechnologies();
        const interval = setInterval(fetchTechnologies, 15000);
        return () => clearInterval(interval);
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-[#1e293b] p-8 md:p-10 rounded-3xl border border-white/5 shadow-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a]">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight italic uppercase">Mastery Stack</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md border border-indigo-400/20">{technologies.length} Tech Nodes</span>
                        Inventory of core technologies and framework protocols.
                    </p>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                    {technologies.length === 0 && (
                        <button
                            onClick={syncDefaultTechs}
                            disabled={isSyncing}
                            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                            <Loader2 size={16} className={isSyncing ? "animate-spin" : ""} />
                            <span>{isSyncing ? "Syncing..." : "Sync Node Services"}</span>
                        </button>
                    )}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-6 flex items-center w-full md:w-auto group focus-within:border-indigo-500/30 transition-all">
                        <Search className="text-gray-600 ml-4 group-focus-within:text-indigo-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Identify technology..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-gray-700 focus:outline-none py-4 px-4 w-full md:w-64 font-black uppercase italic tracking-tighter text-sm"
                        />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.05] active:scale-95 shadow-2xl text-[10px] uppercase tracking-widest whitespace-nowrap"
                    >
                        <Plus size={18} strokeWidth={3} />
                        <span>Deploy Node</span>
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
                        <div className="col-span-full py-20 text-center bg-[#1e293b] rounded-[2.5rem] border border-white/5 border-dashed group">
                            <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/10 text-gray-600 transition-all group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/20">
                                <Cpu size={40} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">Stack Undefined</h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto font-bold text-xs uppercase tracking-widest leading-loose">The technology mastery stack is currently empty. Synchronize with global standards or manually initialize a new tech node.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={syncDefaultTechs}
                                    disabled={isSyncing}
                                    className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 justify-center shadow-xl shadow-white/5"
                                >
                                    <Loader2 size={16} className={isSyncing ? "animate-spin" : ""} />
                                    {isSyncing ? "Synchronizing..." : "Sync From Website"}
                                </button>
                                <button
                                    onClick={openCreateModal}
                                    className="bg-white/5 text-white border border-white/10 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 justify-center"
                                >
                                    <Plus size={16} />
                                    Manual Deploy
                                </button>
                            </div>
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
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-lg bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{editingTech ? "Update Node" : "Deploy Node"}</h3>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Infrastructure Hub V2.1</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => !submitting && closeModal()}
                                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Protocol Identifier</label>
                                    <div className="relative group">
                                        <Cpu size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                            placeholder="e.g. React Native"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Visual Signature</label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 bg-white rounded-2xl p-4 flex items-center justify-center flex-shrink-0 shadow-2xl">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                            ) : (
                                                <ImageIcon className="text-gray-300" size={32} />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="w-full text-[10px] text-gray-400 file:mr-6 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-white/5 file:text-white hover:file:bg-white/10 transition-all"
                                            />
                                            <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Recommended: Transparent PNG</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Ecosystem</label>
                                        <div className="relative group">
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 appearance-none bg-[#0f172a] cursor-pointer transition-all"
                                            >
                                                <option value="frontend" className="bg-slate-900 italic">Frontend</option>
                                                <option value="backend" className="bg-slate-900 italic">Backend</option>
                                                <option value="database" className="bg-slate-900 italic">Database</option>
                                                <option value="devops" className="bg-slate-900 italic">DevOps</option>
                                                <option value="mobile" className="bg-slate-900 italic">Mobile</option>
                                                <option value="other" className="bg-slate-900 italic">Other</option>
                                            </select>
                                            <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Render Order</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 flex justify-end gap-8 items-center">
                                    <button
                                        type="button"
                                        onClick={() => !submitting && closeModal()}
                                        className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-white text-black px-12 py-5 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-gray-200 transition-all hover:scale-[1.05] active:scale-95 shadow-2xl text-[10px] uppercase tracking-widest disabled:opacity-60"
                                    >
                                        {submitting && <Loader2 size={16} className="animate-spin" />}
                                        <span>{editingTech ? "Commit Changes" : "Confirm Deployment"}</span>
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
