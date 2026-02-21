import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, MapPin, Calendar, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const JourneyManagement = () => {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);
    const toast = useToast();

    const initialFormState = { year: "", title: "", description: "", order: 0 };
    const [formData, setFormData] = useState(initialFormState);

    const fetchMilestones = async () => {
        try {
            const { data } = await api.get("/journey");
            // Assuming the backend returns the list sorted, or we can sort here
            setMilestones(data);
        } catch (err) {
            toast.error("Failed to load journey");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMilestones();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchMilestones();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this milestone?")) return;
        try {
            await api.delete(`/journey/${id}`);
            toast.success("Milestone removed");
            fetchMilestones();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ensure order and year are numbers
            const payload = {
                ...formData,
                year: parseInt(formData.year),
                order: parseInt(formData.order)
            };

            if (editingMilestone) {
                await api.put(`/journey/${editingMilestone._id}`, payload);
                toast.success("Milestone updated");
            } else {
                await api.post("/journey", payload);
                toast.success("Milestone created");
            }
            setIsModalOpen(false);
            setEditingMilestone(null);
            setFormData(initialFormState);
            fetchMilestones();
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const openEditModal = (milestone) => {
        setEditingMilestone(milestone);
        setFormData({
            year: milestone.year,
            title: milestone.title,
            description: milestone.description,
            order: milestone.order
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section - Simplified */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">Our Journey</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md border border-indigo-400/20">{milestones.length} Milestones</span>
                        Manage historical milestones and company trajectory.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingMilestone(null);
                        setFormData(initialFormState);
                        setIsModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                >
                    <Plus size={18} />
                    <span>Add Milestone</span>
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Year</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Title & Description</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">Syncing Timeline...</p>
                                    </td>
                                </tr>
                            ) : milestones.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <Calendar size={32} className="text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-white font-bold mb-1">No Milestones Found</h3>
                                        <button onClick={() => setIsModalOpen(true)} className="text-indigo-400 text-xs font-bold hover:text-indigo-300">Create First Milestone</button>
                                    </td>
                                </tr>
                            ) : (
                                milestones.map((milestone) => (
                                    <tr key={milestone._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-indigo-400 font-bold text-sm bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10">
                                                #{milestone.order}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-black text-white text-lg tracking-tight italic">
                                            {milestone.year}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-white text-sm uppercase tracking-wide mb-1">{milestone.title}</div>
                                            <p className="text-gray-500 text-xs line-clamp-2 max-w-xl">{milestone.description}</p>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(milestone)}
                                                    className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all shadow-sm outline-none"
                                                    title="Edit Milestone"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(milestone._id)}
                                                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm outline-none"
                                                    title="Delete Milestone"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Premium Reskin */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col"
                        >
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase italic flex items-center gap-4">
                                        <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                            {editingMilestone ? <Edit2 size={24} strokeWidth={2.5} /> : <Plus size={28} strokeWidth={2.5} />}
                                        </div>
                                        {editingMilestone ? "Modify Node" : "Append Node"}
                                    </h2>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-3 bg-white/5 w-fit px-3 py-1 rounded-md">CORE_SYS: JOURNEY_MGMT_V1.1</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                >
                                    <X size={28} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Temporal Year</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.year}
                                            onChange={e => setFormData({ ...formData, year: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black text-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                            placeholder="20XX"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Sequence Order</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.order}
                                            onChange={e => setFormData({ ...formData, order: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black text-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Milestone Designation</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-gray-700 uppercase tracking-tight"
                                        placeholder="Strategic Expansion..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Milestone Context</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-white font-medium italic leading-relaxed focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all resize-none placeholder:text-gray-700"
                                        placeholder="Details of the event..."
                                    />
                                </div>

                                <div className="pt-6 flex justify-end items-center gap-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-[0.4em] italic"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-white text-black px-12 py-5 rounded-[1.5rem] font-black flex items-center gap-4 hover:bg-gray-200 transition-all hover:scale-[1.05] active:scale-95 shadow-2xl text-sm uppercase tracking-widest"
                                    >
                                        <Check size={20} strokeWidth={3} />
                                        <span>Confirm Node</span>
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

export default JourneyManagement;
