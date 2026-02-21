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
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header section - Simplified */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b] p-8 rounded-3xl border border-white/5">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">Testimonials</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-3">
                        <span className="text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md border border-indigo-400/20">{feedbacks.length} Success Stories</span>
                        Manage student success stories displayed on the website.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingFeedback(null);
                        setFormData(initialFormState);
                        setIsModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                >
                    <Plus size={18} />
                    <span>Add Testimonial</span>
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : feedbacks.length === 0 ? (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-16 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <MessageSquare size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Testimonials</h3>
                    <p className="text-gray-400 mb-6">You haven't added any student testimonials yet.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <Plus size={18} />
                        Create First Feedback
                    </button>
                </div>
            ) : (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Student</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Message</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
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
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    {item.image ? (
                                                        <img
                                                            src={resolveImageUrl(item.image, "/images/user.png")}
                                                            alt={item.name}
                                                            className="w-10 h-10 rounded-xl object-cover border border-indigo-500/20"
                                                            onError={(e) => { e.currentTarget.src = "/images/user.png"; }}
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/20">
                                                            {item.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-white">{item.name}</div>
                                                        <div className="text-xs text-gray-500">{item.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-gray-400 text-sm line-clamp-2 max-w-md italic">"{item.message}"</p>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-2.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                                                        title="Delete"
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
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#0f172a] border border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl relative z-10"
                        >
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{editingFeedback ? "Update Story" : "New Testimonial"}</h2>
                                    <p className="text-gray-500 mt-1">Share the success of our students.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex justify-center">
                                        <label className="relative group cursor-pointer">
                                            <div className="w-28 h-28 rounded-3xl border-2 border-dashed border-white/15 bg-white/5 overflow-hidden flex items-center justify-center">
                                                {imageFile ? (
                                                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                                                ) : formData.image ? (
                                                    <img src={resolveImageUrl(formData.image, "/images/user.png")} alt="Current" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1 text-gray-500">
                                                        <Camera size={22} />
                                                        <span className="text-[9px] font-bold uppercase tracking-wider">Add Photo</span>
                                                    </div>
                                                )}
                                                {uploading && (
                                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                        <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-black rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                <Upload size={12} />
                                                Upload
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] block mb-3">The Experience</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-6 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none text-lg"
                                            placeholder="What did the student say..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] block mb-3">Student Name</label>
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                                                placeholder="e.g. Rahul Sharma"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] block mb-3">Course / Role</label>
                                            <input
                                                required
                                                value={formData.role}
                                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                                                placeholder="e.g. MERN Stack Student"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] block mb-3">Image URL (Optional)</label>
                                        <input
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="w-full py-5 rounded-[1.5rem] font-black bg-white text-black hover:bg-gray-200 shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all active:scale-[0.98] text-lg uppercase tracking-widest"
                                    >
                                        {editingFeedback ? "Update Testimonial" : "Post Testimonial"}
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
