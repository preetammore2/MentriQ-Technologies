import React, { useCallback, useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Trash2, Edit2, MessageSquare, X, Upload, Camera } from "lucide-react";
import { motion as framerMotion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const MotionDiv = framerMotion.div;
const MotionTr = framerMotion.tr;

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const toast = useToast();

    const initialFormState = { name: "", role: "", message: "", rating: 5, image: "" };
    const [formData, setFormData] = useState(initialFormState);

    const fetchFeedbacks = useCallback(async () => {
        try {
            const { data } = await api.get("/feedbacks");
            setFeedbacks(data);
        } catch {
            toast.error("Failed to load feedback");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchFeedbacks();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchFeedbacks();
        }, 15000);

        return () => clearInterval(interval);
    }, [fetchFeedbacks]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this testimonial?")) return;
        try {
            await api.delete(`/feedbacks/${id}`);
            toast.success("Feedback deleted");
            setFeedbacks(feedbacks.filter(f => f._id !== id));
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalImage = formData.image;
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append("image", imageFile);
                setUploading(true);
                const { data } = await api.post("/upload", uploadData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                finalImage = data.imageUrl;
            }

            const payload = { ...formData, image: finalImage };
            if (editingFeedback) {
                await api.put(`/feedbacks/${editingFeedback._id}`, payload);
                toast.success("Feedback updated");
            } else {
                await api.post("/feedbacks", payload);
                toast.success("Feedback created");
            }
            setIsModalOpen(false);
            setEditingFeedback(null);
            setFormData(initialFormState);
            setImageFile(null);
            fetchFeedbacks();
        } catch {
            toast.error("Operation failed");
        } finally {
            setUploading(false);
        }
    };

    const openEditModal = (feedback) => {
        setEditingFeedback(feedback);
        setFormData({
            name: feedback.name,
            role: feedback.role,
            message: feedback.message,
            rating: feedback.rating || 5,
            image: feedback.image || ""
        });
        setImageFile(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <MessageSquare size={28} className="text-indigo-600" />
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Success Narratives</h2>
                        <span className="ml-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 text-xs font-bold">
                            {feedbacks.length} Verified Briefings
                        </span>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Manage student success stories displayed on the website.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingFeedback(null);
                        setFormData(initialFormState);
                        setIsModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap text-[10px] uppercase tracking-widest"
                >
                    <Plus size={18} />
                    <span>Append Narrative</span>
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : feedbacks.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-[3rem] p-24 text-center shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.03),transparent)]" />
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 text-slate-200 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all">
                        <MessageSquare size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight uppercase">Narrative Void</h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto font-medium text-[10px] uppercase tracking-widest leading-relaxed">No student testimonials detected in the registry.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        Initiate First Narrative
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Student Profile</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Narrative Briefing</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Commands</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence mode="popLayout">
                                    {feedbacks.map((item) => (
                                        <MotionTr
                                            key={item._id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    {item.image ? (
                                                        <img
                                                            src={resolveImageUrl(item.image, "/images/user.png")}
                                                            alt={item.name}
                                                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                                                            onError={(e) => { e.currentTarget.src = "/images/user.png"; }}
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-indigo-600 border border-slate-200 text-xl">
                                                            {item.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-extrabold text-slate-900 text-base tracking-tight">{item.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-md italic">"{item.message}"</p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-200 shadow-sm outline-none"
                                                        title="Refine Narrative"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shadow-sm outline-none"
                                                        title="Purge Narrative"
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

            {/* Modal */}
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
                            className="relative w-full max-w-xl bg-white border border-slate-200 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                                        {editingFeedback ? "Refine Narrative" : "Init Narrative"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Status: Student Success Protocols</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex justify-center mb-4">
                                        <label className="relative group cursor-pointer">
                                            <div className="w-32 h-32 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center transition-all group-hover:border-indigo-300 shadow-inner">
                                                {imageFile ? (
                                                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                                                ) : formData.image ? (
                                                    <img src={resolveImageUrl(formData.image, "/images/user.png")} alt="Current" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-slate-300">
                                                        <Camera size={28} strokeWidth={1.5} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Profile Identity</span>
                                                    </div>
                                                )}
                                                {uploading && (
                                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                                        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white rounded-2xl p-3 shadow-lg group-hover:scale-110 transition-all active:scale-95 border-4 border-white">
                                                <Upload size={16} strokeWidth={3} />
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                            />
                                        </label>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">The Narrative Briefing</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-slate-700 font-medium italic leading-relaxed focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all resize-none placeholder:text-slate-300"
                                            placeholder="What did the student say..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Student Identity</label>
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
                                                placeholder="e.g. Rahul Sharma"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Vocation / Role</label>
                                            <input
                                                required
                                                value={formData.role}
                                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
                                                placeholder="e.g. MERN Developer"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-10 flex justify-end items-center gap-6 border-t border-slate-100 -mx-10 px-10 -mb-10 bg-slate-50/50 mt-10">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-[0.3em]"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black flex items-center gap-4 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 text-[10px] uppercase tracking-widest disabled:opacity-50"
                                    >
                                        <Plus size={20} strokeWidth={3} />
                                        <span>Confirm Narrative</span>
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

export default FeedbackManagement;
