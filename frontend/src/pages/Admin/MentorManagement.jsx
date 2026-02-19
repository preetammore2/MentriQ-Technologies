import React, { useEffect, useState, useCallback } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Search, X, User, Briefcase, Linkedin, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const FALLBACK_MENTORS = [
    { name: "Litesh Singh", image: "/images/litesh.jpg", description: "5+ Years Experience in Automation and Deveops", role: "Automation Expert", company: "MentriQ", stats: [{ value: "5+", label: "Years" }, { value: "15+", label: "Projects" }] },
    { name: "Jeevan Chauhan", image: "/images/jeevan.jpg", description: "5+ Years Experience in Hybrid Applications Development", role: "Hybrid Dev", company: "MentriQ", stats: [{ value: "5+", label: "Years" }, { value: "15+", label: "Projects" }] },
    { name: "Yogesh Shekhawat", image: "/images/yogesh.jpg", description: "2+ Years Experience in Entrepreneurship and Product Management", role: "Product Lead", company: "MentriQ", stats: [{ value: "2+", label: "Years" }, { value: "5+", label: "Projects" }] },
    { name: "Ram Swami", image: "/images/user.png", description: "6+ Years Experience in Cyber Security", role: "Security Architect", company: "MentriQ", stats: [{ value: "6+", label: "Years" }, { value: "15+", label: "Projects" }] },
    { name: "Shubham Sharma", image: "/images/subhammentors.jpg", description: "5+ years Experience in Full Stack Development", role: "Full Stack Eng", company: "MentriQ", stats: [{ value: "5+", label: "Years" }, { value: "15+", label: "Projects" }] }
];

const MentorManagement = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMentor, setEditingMentor] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const toast = useToast();

    const initialFormState = {
        name: "",
        role: "",
        company: "",
        description: "", // Renamed from bio for model alignment
        image: "",
        linkedin: "",
        yearsExperience: "",
        projectsCompleted: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchMentors = useCallback(async () => {
        try {
            const { data } = await api.get("/mentors");
            setMentors(data);
        } catch (err) {
            toast.error("Failed to load mentors");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchMentors();
        const interval = setInterval(fetchMentors, 15000);
        return () => clearInterval(interval);
    }, [fetchMentors]);

    const syncDefaultMentors = async () => {
        setIsSyncing(true);
        try {
            const syncPromises = FALLBACK_MENTORS.map(m => api.post("/mentors", m));
            await Promise.all(syncPromises);
            toast.success("Synchronized default experts to database");
            fetchMentors();
        } catch (err) {
            toast.error("Sync failed: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return typeof data === "string" ? data : data?.imageUrl || data?.imagePath || data?.path || "";
        } catch (error) {
            toast.error('Image upload failed');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalImageUrl = formData.image;
            if (imageFile) {
                const uploadedPath = await handleImageUpload(imageFile);
                if (uploadedPath) finalImageUrl = uploadedPath;
            }

            const payload = {
                ...formData,
                image: finalImageUrl,
                stats: [
                    { value: formData.yearsExperience || "0+", label: "Years" },
                    { value: formData.projectsCompleted || "0+", label: "Projects" }
                ]
            };

            if (editingMentor) {
                await api.put(`/mentors/${editingMentor._id}`, payload);
                toast.success("Mentor updated");
            } else {
                await api.post("/mentors", payload);
                toast.success("Mentor added");
            }
            setIsModalOpen(false);
            setEditingMentor(null);
            setFormData(initialFormState);
            setImageFile(null);
            fetchMentors();
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this mentor?")) return;
        try {
            await api.delete(`/mentors/${id}`);
            toast.success("Mentor removed");
            setMentors(m => m.filter(item => item._id !== id));
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const filteredMentors = mentors.filter(m =>
        (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.company || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEditModal = (mentor) => {
        setEditingMentor(mentor);
        setFormData({
            name: mentor.name || "",
            role: mentor.role || "",
            company: mentor.company || "",
            description: mentor.description || mentor.bio || "",
            image: mentor.image || mentor.imageUrl || "",
            linkedin: mentor.linkedin || mentor.linkedinUrl || "",
            yearsExperience: mentor.stats?.find(s => s.label === "Years")?.value || "",
            projectsCompleted: mentor.stats?.find(s => s.label === "Projects")?.value || ""
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Mentor Network</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage global industry experts and their profiles.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {mentors.length === 0 && (
                        <button
                            onClick={syncDefaultMentors}
                            disabled={isSyncing}
                            className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600/30 transition-all whitespace-nowrap"
                        >
                            <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                            <span>{isSyncing ? "Syncing..." : "Sync Website Mentors"}</span>
                        </button>
                    )}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-4 flex items-center w-full lg:w-auto group focus-within:border-indigo-500/50 transition-all">
                        <Search className="text-gray-500 ml-4" size={18} />
                        <input
                            type="text"
                            placeholder="Search mentors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-gray-600 focus:outline-none py-3 px-4 w-full lg:w-64 font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingMentor(null);
                            setFormData(initialFormState);
                            setIsModalOpen(true);
                            setImageFile(null);
                        }}
                        className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span>Add Expert</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 bg-[#1e293b] border border-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : mentors.length === 0 ? (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-16 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <User size={40} className="text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase italic">No Mentors Detected</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto font-bold text-xs uppercase tracking-widest leading-loose">The expert network is currently offline. Synchronize with the website defaults or manually deploy a new mentor profile.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={syncDefaultMentors}
                            disabled={isSyncing}
                            className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 justify-center"
                        >
                            <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                            Sync From Website
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white/5 text-white border border-white/10 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 justify-center"
                        >
                            <Plus size={16} />
                            Deploy Manual
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Expert Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Node Location</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Operational Bio</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-right">Commands</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {filteredMentors.map((mentor) => (
                                        <motion.tr
                                            key={mentor._id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 shadow-2xl relative">
                                                        <img
                                                            src={resolveImageUrl(mentor.image || mentor.imageUrl, "/images/user.png")}
                                                            alt={mentor.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={(e) => { e.target.src = "/images/user.png" }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-white text-base tracking-tight">{mentor.name}</div>
                                                        {(mentor.linkedin || mentor.linkedinUrl) && (
                                                            <a href={mentor.linkedin || mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-black uppercase tracking-widest mt-1">
                                                                <Linkedin size={10} /> Sync Verified
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-white font-black text-xs italic">{mentor.role}</div>
                                                <div className="text-indigo-500 text-[10px] uppercase font-black tracking-widest mt-1">{mentor.company}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-gray-500 text-xs line-clamp-2 max-w-xs font-bold leading-relaxed">
                                                    {mentor.description || mentor.bio || "No operational brief available for this node."}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => openEditModal(mentor)}
                                                        className="p-3 bg-white/5 text-gray-500 rounded-xl hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/10"
                                                        title="Modify Node"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(mentor._id)}
                                                        className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-transparent hover:border-red-500/20"
                                                        title="Terminate Node"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col max-h-[92vh]"
                        >
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{editingMentor ? "Refine Expert" : "Deploy Mentor"}</h2>
                                    <p className="text-gray-500 text-sm mt-1 font-bold uppercase tracking-widest">Global Mentor Configuration</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-center">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center group-hover:border-indigo-500/50 transition-all">
                                            {imageFile ? (
                                                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                                            ) : formData.image ? (
                                                <img
                                                    src={resolveImageUrl(formData.image, "/images/user.png")}
                                                    alt="Current"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = "/images/user.png" }}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-gray-600 group-hover:text-indigo-400 transition-colors">
                                                    <User size={32} strokeWidth={1.5} />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Initialize Avatar</span>
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute bottom-[-10px] right-[-10px] bg-white p-3 rounded-2xl cursor-pointer hover:scale-110 transition-all shadow-2xl border border-white/10">
                                            <Plus size={16} strokeWidth={3} className="text-black" />
                                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-700" placeholder="e.g. Satoshi Nakamoto" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Professional Designation</label>
                                        <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-700" placeholder="e.g. Quantum Lead" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Parent Organization</label>
                                        <input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-700" placeholder="e.g. OpenAI" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Expertise Link (LinkedIn)</label>
                                        <input value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-700" placeholder="https://linkedin.com/in/unique-id" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Years Experience</label>
                                            <input value={formData.yearsExperience} onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all" placeholder="e.g. 10+" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Projects Done</label>
                                            <input value={formData.projectsCompleted} onChange={e => setFormData({ ...formData, projectsCompleted: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all" placeholder="e.g. 50+" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Expert Profile Brief</label>
                                        <textarea rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-700 resize-none leading-relaxed" placeholder="Briefly describe the expert's impact..." />
                                    </div>
                                </div>

                                <div className="pt-8 flex justify-end gap-6 items-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors bg-white/5 px-10 py-5 rounded-2xl hover:bg-white/10"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-12 py-5 rounded-[1.5rem] font-black bg-white text-black hover:bg-gray-200 shadow-2xl hover:scale-[1.05] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center gap-3"
                                    >
                                        <Check size={20} strokeWidth={3} />
                                        <span>Deploy Mentor</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MentorManagement;
