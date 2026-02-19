import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Briefcase, FileText, Check, X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const InternshipManagement = () => {
    const [activeTab, setActiveTab] = useState("postings");
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInternship, setEditingInternship] = useState(null);
    const toast = useToast();

    const initialFormState = { title: "", company: "", location: "", type: "Remote", description: "", requirements: [], questions: [], duration: "" };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchData();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchData();
        }, 15000);

        return () => clearInterval(interval);
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "postings") {
                const { data } = await api.get("/internships");
                setInternships(data);
            } else {
                const { data } = await api.get("/internships/admin/applications");
                setApplications(data);
            }
        } catch (err) {
            console.error(err);
            // toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Split requirements by new line if string
            const payload = {
                ...formData,
                requirements: typeof formData.requirements === 'string'
                    ? formData.requirements.split('\n').filter(r => r.trim())
                    : formData.requirements,
                questions: typeof formData.questions === 'string'
                    ? formData.questions.split('\n').filter(q => q.trim())
                    : formData.questions || []
            };

            if (editingInternship) {
                await api.put(`/internships/${editingInternship._id}`, payload);
                toast.success("Internship updated");
            } else {
                await api.post("/internships", payload);
                toast.success("Internship created");
            }
            setIsModalOpen(false);
            setEditingInternship(null);
            setFormData(initialFormState);
            fetchData();
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this internship?")) return;
        try {
            await api.delete(`/internships/${id}`);
            toast.success("Internship deleted");
            fetchData();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const handleApplicationStatus = async (id, status) => {
        try {
            await api.put(`/internships/applications/${id}`, { status });
            toast.success("Status updated");
            setApplications(applications.map(app => app._id === id ? { ...app, status } : app));
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const openEditModal = (internship) => {
        setEditingInternship(internship);
        setFormData({
            ...internship,
            requirements: internship.requirements?.join('\n') || '',
            questions: internship.questions?.join('\n') || ''
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section - Simplified */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Internship Management</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage postings and track candidate applications.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setActiveTab("postings")}
                        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'postings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Listings
                    </button>
                    <button
                        onClick={() => setActiveTab("applications")}
                        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'applications' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Applications
                    </button>
                </div>
            </div>

            {activeTab === "postings" && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setEditingInternship(null);
                                setFormData(initialFormState);
                                setIsModalOpen(true);
                            }}
                            className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={18} />
                            <span>Add Internship</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />)}
                        </div>
                    ) : internships.length === 0 ? (
                        <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-16 text-center">
                            <Briefcase size={40} className="text-gray-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Postings Yet</h3>
                            <button onClick={() => setIsModalOpen(true)} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Create First Listing</button>
                        </div>
                    ) : (
                        <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/10">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Position & Company</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Type & Location</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Duration</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <AnimatePresence mode="popLayout">
                                            {internships.map((internship) => (
                                                <motion.tr
                                                    key={internship._id}
                                                    layout
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="hover:bg-white/[0.02] transition-colors group"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="font-bold text-white text-sm">{internship.title}</div>
                                                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider mt-0.5">{internship.company}</div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-xs text-gray-400">{internship.location}</span>
                                                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{internship.type}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-gray-400 text-xs font-medium">{internship.duration}</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditModal(internship)}
                                                                className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all outline-none"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(internship._id)}
                                                                className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all outline-none"
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
                </div>
            )}

            {activeTab === "applications" && (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Candidate</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Role</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Applied Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {applications.map(app => (
                                    <tr key={app._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-white text-sm">{app.user?.name || "Candidate"}</div>
                                            <div className="text-[10px] text-gray-500 font-bold tracking-wider mt-0.5">{app.email}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">{app.internship?.title || "N/A"}</span>
                                        </td>
                                        <td className="px-6 py-5 text-gray-500 text-xs font-medium uppercase">
                                            {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' :
                                                app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/10' :
                                                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/10'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <select
                                                value={app.status}
                                                onChange={(e) => handleApplicationStatus(app._id, e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-black uppercase text-gray-400 tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:text-white transition-all"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="reviewing">Reviewing</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {applications.length === 0 && (
                        <div className="p-16 text-center text-gray-500 font-bold uppercase tracking-widest text-sm">
                            No applications found.
                        </div>
                    )}
                </div>
            )}

            {/* Modal for Posts */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]"
                        >
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent shrink-0">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">{editingInternship ? "Refine Position" : "Initial Broadcast"}</h2>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">Deployment Module V2.4</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10">
                                    <X size={28} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-10 overflow-y-auto custom-scrollbar flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Mission Title</label>
                                        <div className="relative">
                                            <Briefcase size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                                placeholder="e.g. Neural Architecture Specialist"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Base of Operations</label>
                                        <input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-gray-700" placeholder="Organization ID" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Geographic Coordinates</label>
                                        <input required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-gray-700" placeholder="e.g. Global Distributed" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Cycle Length</label>
                                        <input required value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-gray-700" placeholder="e.g. 12 Solar Weeks" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Protocol Type</label>
                                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all appearance-none bg-[#0f172a]">
                                            <option value="Remote">Remote Execution</option>
                                            <option value="On-site">Physical Presence</option>
                                            <option value="Hybrid">Hybrid Mesh</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Operational Briefing</label>
                                        <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all resize-none placeholder:text-gray-700 leading-relaxed" placeholder="Detailed mission objectives..." />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Competency Stack (One per line)</label>
                                        <textarea required rows={5} value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all resize-none font-mono text-sm placeholder:text-gray-700" placeholder="◈ Deep Learning Fundamentals&#10;◈ High-Scale System Design" />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Screening Questions (One per line)</label>
                                        <textarea rows={5} value={formData.questions} onChange={e => setFormData({ ...formData, questions: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all resize-none font-mono text-sm placeholder:text-gray-700" placeholder="? Why do you want to join MentriQ?&#10;? Describe a challenging project you worked on." />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-6 items-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-white text-black px-12 py-5 rounded-[1.5rem] font-black flex items-center gap-4 hover:bg-gray-200 transition-all hover:scale-[1.05] active:scale-95 shadow-2xl text-sm uppercase tracking-widest"
                                    >
                                        <Plus size={20} strokeWidth={3} />
                                        <span>Initialize Broadcast</span>
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

export default InternshipManagement;
