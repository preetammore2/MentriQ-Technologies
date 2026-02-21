import React, { useEffect, useState, useCallback } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Search, X, User, Briefcase, Linkedin, Check, RefreshCw, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const FALLBACK_MENTORS = [
    { name: "Litesh Singh", image: "/images/litesh.jpg", description: "5+ Years Experience in Automation and DevOps", role: "Automation & DevOps Specialist", company: "MentriQ", stats: [{ value: "5+", label: "Years" }, { value: "15+", label: "Projects" }] },
    { name: "Jeevan Chauhan", image: "/images/jeevan.jpg", description: "5+ Years Experience in Hybrid Applications Development", role: "Hybrid App Developer", company: "MentriQ", stats: [{ value: "5+", label: "Years" }, { value: "15+", label: "Projects" }] },
    { name: "Yogesh Shekhawat", image: "/images/yogesh.jpg", description: "2+ Years Experience in Entrepreneurship and Product Management", role: "Entrepreneurship Lead", company: "MentriQ", stats: [{ value: "2+", label: "Years" }, { value: "5+", label: "Projects" }] },
    { name: "Ram Swami", image: "/images/user.png", description: "6+ Years Experience in Cyber Security", role: "Cyber Security Architect", company: "MentriQ", stats: [{ value: "6+", label: "Years" }, { value: "15+", label: "Projects" }] },
    { name: "Shubham Sharma", image: "/images/subhammentors.jpg", description: "5+ years Experience in Full Stack Development", role: "Full Stack Engineer", company: "MentriQ", stats: [{ value: "5+", label: "Years" }, { value: "15+", label: "Projects" }] },
    { name: "Shiva Rama Krishna", image: "/images/sivaramakrishna.jpg", description: "8+ Years Experience in Software Engineering", role: "Senior Software Engineer", company: "MentriQ", stats: [{ value: "8+", label: "Years" }, { value: "20+", label: "Projects" }] },
    { name: "Lakhan Dadhich", image: "/images/lakhan.jpg", description: "3+ Years Experience in Product Management", role: "Product Manager", company: "MentriQ", stats: [{ value: "3+", label: "Years" }, { value: "7+", label: "Projects" }] },
    { name: "Venkat Sai", image: "/images/venkatsai.jpg", description: "5+ Years Experience in Operations Experts", role: "Operations Expert", company: "MentriQ", stats: [{ value: "5+", label: "Years" }, { value: "15+", label: "Projects" }] },
    { name: "Satya Narayan Pradhan", image: "/images/satyanarayan.jpg", description: "5+ Years Experience in Integration Specialist", role: "Integration Specialist", company: "MentriQ", stats: [{ value: "5+", label: "Years" }, { value: "20+", label: "Projects" }] },
    { name: "Hardik Sharma", image: "/images/hardik.jpg", description: "2+ Years Experience in Cloud Technologies", role: "Cloud Solutions Architect", company: "MentriQ", stats: [{ value: "2+", label: "Years" }, { value: "5+", label: "Projects" }] },
    { name: "Prince Jain", image: "/images/princejain.jpg", description: "2+ Years Experience in Cyber Security ", role: "Security Specialist", company: "MentriQ", stats: [{ value: "2+", label: "Years" }, { value: "5+", label: "Projects" }] },
    { name: "Dharam Pal Singh", image: "/images/dharampalsingh.jpg", description: "2+ Years Experience in Full Stack Development", role: "Full Stack Developer", company: "MentriQ", stats: [{ value: "2+", label: "Years" }, { value: "5+", label: "Projects" }] },
    { name: "Pooja Bharia", image: "/images/poojabharia.jpg", description: "1+ Years Experience in Research Engineer", role: "Research Engineer", company: "MentriQ", stats: [{ value: "1+", label: "Years" }, { value: "5+", label: "Projects" }] },
    { name: "Gaurav Sharma", image: "/images/gauravsharma.jpg", description: "1+ Years Experience in Cloud Technologies", role: "Cloud Engineer", company: "MentriQ", stats: [{ value: "1+", label: "Years" }, { value: "5+", label: "Projects" }] },
    { name: "Pooja Yadav", image: "/images/poojayadav.jpg", description: "1+ Years Experience in Data Automation", role: "Data Automation Engineer", company: "MentriQ", stats: [{ value: "1+", label: "Years" }, { value: "5+", label: "Projects" }] },
    { name: "Sameer Khan", image: "/images/sameer.jpg", description: "1+ Years Experience in Full Stack Development", role: "Full Stack Developer", company: "MentriQ", stats: [{ value: "1+", label: "Years" }, { value: "5+", label: "Projects" }] }
];

const MentorManagement = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMentor, setEditingMentor] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
        } finally {
            setSubmitting(false);
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
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Users size={28} className="text-indigo-600" />
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Expert Registry</h2>
                            <span className="ml-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 text-xs font-bold">
                                {mentors.length} Verified
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium text-sm">Manage global industry veterans and strategic mentor profiles.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
                        {mentors.length === 0 && (
                            <button
                                onClick={syncDefaultMentors}
                                disabled={isSyncing}
                                className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap shadow-sm"
                            >
                                <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                                <span>{isSyncing ? "Syncing..." : "Sync Mentors"}</span>
                            </button>
                        )}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                            <Search className="text-slate-400 ml-4 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search experts..."
                                className="bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none py-3 px-4 w-full lg:w-64 font-bold text-sm tracking-tight"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => {
                                setEditingMentor(null);
                                setFormData(initialFormState);
                                setIsModalOpen(true);
                                setImageFile(null);
                            }}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap"
                        >
                            <Plus size={18} />
                            <span>Add Mentor</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-x-auto">

                    {
                        loading ? (
                            <div className="p-8 space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-16 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : mentors.length === 0 ? (
                            <div className="bg-white p-32 text-center rounded-[3rem] border border-slate-200 border-dashed group shadow-sm transition-all hover:border-indigo-300">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 text-slate-200 shadow-inner group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-all">
                                    <User size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight uppercase">Expert Registry Offline</h3>
                                <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium text-sm leading-relaxed uppercase tracking-widest text-[10px]">The expert network layer is currently void. Manual deployment required.</p>
                                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                    <button
                                        onClick={syncDefaultMentors}
                                        disabled={isSyncing}
                                        className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all flex items-center gap-3 justify-center shadow-lg shadow-indigo-600/20"
                                    >
                                        <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                                        {isSyncing ? "Synchronizing Hub..." : "Sync Global Nodes"}
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-slate-50 text-slate-600 border border-slate-200 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-3 justify-center"
                                    >
                                        <Plus size={18} />
                                        Manual Initialize
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border-t border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Expert Identity</th>
                                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Node Location</th>
                                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Operational Bio</th>
                                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Commands</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <AnimatePresence mode="popLayout">
                                                {filteredMentors.map((mentor) => (
                                                    <motion.tr
                                                        key={mentor._id}
                                                        layout
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="hover:bg-slate-50/50 transition-colors group"
                                                    >
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-5">
                                                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0 shadow-sm relative p-1 group-hover:border-indigo-300 transition-all">
                                                                    <img
                                                                        src={resolveImageUrl(mentor.image || mentor.imageUrl, "/images/user.png")}
                                                                        alt={mentor.name}
                                                                        className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                                                        onError={(e) => { e.target.src = "/images/user.png" }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 text-base tracking-tight">{mentor.name}</div>
                                                                    {(mentor.linkedin || mentor.linkedinUrl) && (
                                                                        <a href={mentor.linkedin || mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:text-indigo-600 flex items-center gap-1 font-semibold mt-1">
                                                                            <Linkedin size={12} /> LinkedIn Profile
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="text-slate-900 font-semibold text-xs uppercase tracking-wider">{mentor.role}</div>
                                                            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1.5 flex items-center gap-2">
                                                                <Briefcase size={12} className="text-indigo-500" />
                                                                {mentor.company}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="text-slate-500 text-xs line-clamp-2 max-w-xs font-medium leading-relaxed">
                                                                {mentor.description || mentor.bio || "No brief available."}
                                                            </p>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <div className="flex justify-end gap-3">
                                                                <button
                                                                    onClick={() => openEditModal(mentor)}
                                                                    className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(mentor._id)}
                                                                    className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
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
                                    className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh]"
                                >
                                    <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                                                {editingMentor ? "Update Experience" : "Onboard Expert"}
                                            </h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Registry Access Level: Global Mentor</p>
                                        </div>
                                        <button
                                            onClick={closeModal}
                                            className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-200"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                                        <form onSubmit={handleSubmit} className="space-y-10">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="relative group">
                                                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-indigo-400 transition-all">
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
                                                            <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                                                <User size={32} strokeWidth={1.5} />
                                                                <span className="text-[8px] font-black uppercase tracking-widest">Initialize Avatar</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <label className="absolute bottom-[-10px] right-[-10px] bg-white p-3 rounded-2xl cursor-pointer hover:scale-110 transition-all shadow-xl border border-slate-200">
                                                        <Plus size={16} strokeWidth={3} className="text-indigo-600" />
                                                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="col-span-2 space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300" placeholder="e.g. Satoshi Nakamoto" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Professional Designation</label>
                                                    <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300" placeholder="e.g. Quantum Lead" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Parent Organization</label>
                                                    <input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300" placeholder="e.g. OpenAI" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Expertise Link (LinkedIn)</label>
                                                    <input value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300" placeholder="https://linkedin.com/in/unique-id" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Years Experience</label>
                                                        <input value={formData.yearsExperience} onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all" placeholder="e.g. 10+" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Projects Done</label>
                                                        <input value={formData.projectsCompleted} onChange={e => setFormData({ ...formData, projectsCompleted: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all" placeholder="e.g. 50+" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Expert Background / Bio</label>
                                                <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300 resize-none leading-relaxed" placeholder="Brief professional synopsis..." />
                                            </div>

                                            <div className="flex gap-4 pt-10 shrink-0 border-t border-slate-100 -mx-10 px-10 -mb-10 bg-slate-50/50 mt-10">
                                                <button type="button" onClick={closeModal} className="flex-1 py-4.5 rounded-2xl bg-white text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 border border-slate-200 transition-all">
                                                    Abort Deployment
                                                </button>
                                                <button type="submit" disabled={submitting} className="flex-2 py-4.5 rounded-2xl bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 active:scale-95">
                                                    {submitting ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                                                    <span>{editingMentor ? "Commit Sync" : "Deploy Expert"}</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MentorManagement;
