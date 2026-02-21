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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <MapPin size={28} className="text-emerald-600" />
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Timeline Architecture</h2>
                        <span className="ml-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 text-xs font-bold">
                            {milestones.length} Historical Nodes
                        </span>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Manage historical milestones and corporate trajectory.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingMilestone(null);
                        setFormData(initialFormState);
                        setIsModalOpen(true);
                    }}
                    className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 whitespace-nowrap text-[10px] uppercase tracking-widest"
                >
                    <Plus size={18} />
                    <span>Append Node</span>
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Order</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Year</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Title & Description</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Commands</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">Syncing Timeline...</p>
                                    </td>
                                </tr>
                            ) : milestones.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 text-slate-200 shadow-inner">
                                            <Calendar size={40} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight uppercase">Timeline Void</h3>
                                        <p className="text-slate-500 mb-8 max-w-xs mx-auto font-medium text-[10px] uppercase tracking-widest leading-relaxed">No historical nodes detected in the trajectory data.</p>
                                        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">Initiate First Node</button>
                                    </td>
                                </tr>
                            ) : (
                                milestones.map((milestone) => (
                                    <tr key={milestone._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                                                Node #{milestone.order}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-black text-slate-900 text-2xl tracking-tighter italic">
                                            {milestone.year}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-extrabold text-slate-900 text-base tracking-tight mb-1">{milestone.title}</div>
                                            <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-xl">{milestone.description}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => openEditModal(milestone)}
                                                    className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-200 shadow-sm outline-none"
                                                    title="Refine Node"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(milestone._id)}
                                                    className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shadow-sm outline-none"
                                                    title="Terminate Node"
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
                            className="relative w-full max-w-xl bg-white border border-slate-200 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                                        {editingMilestone ? "Modify Node" : "Append Node"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Registry Access Level: Trajectory Control</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Temporal Year</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.year}
                                            onChange={e => setFormData({ ...formData, year: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-black text-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300"
                                            placeholder="20XX"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Sequence Order</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.order}
                                            onChange={e => setFormData({ ...formData, order: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-black text-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Milestone Designation</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-black focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300 uppercase tracking-tight"
                                        placeholder="Strategic Expansion..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Milestone Context</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-slate-700 font-medium italic leading-relaxed focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all resize-none placeholder:text-slate-300"
                                        placeholder="Details of the event..."
                                    />
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
                                        className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black flex items-center gap-4 hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-600/20 text-[10px] uppercase tracking-widest"
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
