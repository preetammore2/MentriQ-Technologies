import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Search, X, User, Briefcase, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const MentorManagement = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMentor, setEditingMentor] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const toast = useToast();

    const initialFormState = {
        name: "",
        role: "",
        company: "", // Note: Schema might allow arbitrary fields or we use role/description
        bio: "",
        image: "",
        linkedin: "",
        yearsExperience: "",
        projectsCompleted: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchMentors = async () => {
        try {
            const { data } = await api.get("/mentors");
            setMentors(data);
        } catch (err) {
            toast.error("Failed to load mentors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMentors();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchMentors();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // upload route returns plain string path
            return typeof data === "string" ? data : data?.imagePath || data?.path || "";
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
                imageUrl: undefined,
                linkedinUrl: formData.linkedin,
                stats: [
                    { value: formData.yearsExperience, label: "Years" },
                    { value: formData.projectsCompleted, label: "Projects" }
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
            setMentors(mentors.filter(m => m._id !== id));
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const openEditModal = (mentor) => {
        setEditingMentor(mentor);
        setFormData({
            name: mentor.name,
            role: mentor.role,
            company: mentor.company,
            bio: mentor.bio || mentor.description || "",
            image: mentor.image || mentor.imageUrl || "",
            linkedin: mentor.linkedin || mentor.linkedinUrl || "",
            yearsExperience: mentor.stats?.find(s => s.label === "Years")?.value || "",
            projectsCompleted: mentor.stats?.find(s => s.label === "Projects")?.value || ""
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section - Simplified */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Mentor Management</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage industry experts and their profiles.</p>
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
                    <span>Add Mentor</span>
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : mentors.length === 0 ? (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-16 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <User size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Mentors Found</h3>
                    <p className="text-gray-400 mb-6">You haven't added any mentors to the network yet.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <Plus size={18} />
                        Add First Mentor
                    </button>
                </div>
            ) : (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Mentor Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Company & Role</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Bio</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {mentors.map((mentor) => (
                                        <motion.tr
                                            key={mentor._id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-indigo-500/10 border border-indigo-500/20 shrink-0 shadow-lg">
                                                        {mentor.image || mentor.imageUrl ? (
                                                            <img src={resolveImageUrl(mentor.image || mentor.imageUrl, "/images/user.png")} alt={mentor.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-indigo-400 font-bold">
                                                                {mentor.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{mentor.name}</div>
                                                        {(mentor.linkedin || mentor.linkedinUrl) && (
                                                            <a href={mentor.linkedin || mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold">
                                                                <Linkedin size={10} /> LinkedIn
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-white font-bold text-xs">{mentor.role}</div>
                                                <div className="text-gray-500 text-[10px] uppercase font-black mt-0.5">{mentor.company}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-gray-400 text-xs line-clamp-2 max-w-xs italic leading-relaxed">"{mentor.bio}"</p>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(mentor)}
                                                        className="p-2.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                                                        title="Edit Mentor"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(mentor._id)}
                                                        className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                        title="Delete Mentor"
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
                                                <img src={resolveImageUrl(formData.image, "/images/user.png")} alt="Current" className="w-full h-full object-cover" />
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
                                        <textarea rows={4} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-700 resize-none leading-relaxed" placeholder="Briefly describe the expert's impact..." />
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
