import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Briefcase, FileText, Check, X, Calendar, ChevronDown } from "lucide-react";
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <Briefcase size={28} className="text-emerald-600" />
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Internship Management</h2>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 text-xs font-bold">
                                {internships.length} Postings
                            </span>
                            <span className="text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-xs font-bold">
                                {applications.length} Candidates
                            </span>
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium text-sm mt-2">Manage postings and track candidate applications.</p>
                </div>

                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                    <button
                        onClick={() => setActiveTab("postings")}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'postings' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                    >
                        Listings
                    </button>
                    <button
                        onClick={() => setActiveTab("applications")}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'applications' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
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
                            className="bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/10 active:scale-95 whitespace-nowrap text-sm"
                        >
                            <Plus size={18} />
                            <span>Add Internship</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />)}
                        </div>
                    ) : internships.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                            <Briefcase size={40} className="text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Postings Yet</h3>
                            <button onClick={() => setIsModalOpen(true)} className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">Create First Listing</button>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Position & Corporate Identity</th>
                                            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Deployment Type</th>
                                            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Mission Clock</th>
                                            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Commands</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <AnimatePresence mode="popLayout">
                                            {internships.map((internship) => (
                                                <motion.tr
                                                    key={internship._id}
                                                    layout
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="hover:bg-slate-50/50 transition-colors group"
                                                >
                                                    <td className="px-8 py-6">
                                                        <div className="font-extrabold text-slate-900 text-base tracking-tight">{internship.title}</div>
                                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 italic">{internship.company} / HQ</div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{internship.type}</span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{internship.location}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                                        {internship.duration}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <button
                                                                onClick={() => openEditModal(internship)}
                                                                className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-200 shadow-sm outline-none active:scale-95"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(internship._id)}
                                                                className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shadow-sm outline-none active:scale-95"
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
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Candidate Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Target Role</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Submission Timestamp</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status Index</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {applications.map(app => (
                                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-extrabold text-slate-900 text-base tracking-tight">{app.user?.name || "Candidate"}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{app.email}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-slate-600 text-[10px] font-extrabold uppercase tracking-widest">{app.internship?.title || "N/A"}</div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">
                                            {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                app.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="relative inline-block group">
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => handleApplicationStatus(app._id, e.target.value)}
                                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 pr-10 text-[10px] font-black uppercase text-slate-500 tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 cursor-pointer hover:bg-slate-100 transition-all appearance-none"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="reviewing">Reviewing</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-900 transition-colors" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {applications.length === 0 && (
                        <div className="p-24 text-center">
                            <FileText size={48} className="text-slate-100 mx-auto mb-4" />
                            <p className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.3em] transition-colors bg-slate-50 px-8 py-3 rounded-full inline-block border border-slate-100">
                                Recruitment Feed Silent
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal for Posts */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                                        {editingInternship ? "Refine Position" : "Initial Broadcast"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Status: Deployment Module V2.4</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-14 h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-200"
                                >
                                    <X size={28} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-10 overflow-y-auto custom-scrollbar flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Mission Identifier</label>
                                        <div className="relative group">
                                            <Briefcase size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                            <input
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-extrabold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all placeholder:text-slate-300"
                                                placeholder="e.g. Fullstack Engineer Terminal"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Base of Operations</label>
                                        <input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-extrabold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all placeholder:text-slate-300" placeholder="Organization Identity" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Geographical Domain</label>
                                        <input required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-extrabold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all placeholder:text-slate-300" placeholder="e.g. Distributed Network" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Cycle Length</label>
                                        <div className="relative group">
                                            <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                            <input required value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-extrabold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all placeholder:text-slate-300" placeholder="e.g. 12 Solar Weeks" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Protocol execution Mode</label>
                                        <div className="relative group">
                                            <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-extrabold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer">
                                                <option value="Remote">Remote Execution</option>
                                                <option value="On-site">Physical Presence</option>
                                                <option value="Hybrid">Hybrid Mesh</option>
                                            </select>
                                            <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-600 transition-colors pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Operational Briefing</label>
                                        <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-slate-700 font-medium italic focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all placeholder:text-slate-300 min-h-[120px] resize-none leading-relaxed" placeholder="Detailed mission objectives..." />
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Competency Stack (Single Entry per Line)</label>
                                        <textarea required rows={5} value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-slate-700 font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all placeholder:text-slate-300 min-h-[160px] resize-none leading-loose font-mono text-xs" placeholder="◈ Deep Learning Fundamentals&#10;◈ High-Scale System Design" />
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Cognitive Screening Matrix (One per Line)</label>
                                        <textarea rows={5} value={formData.questions} onChange={e => setFormData({ ...formData, questions: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-slate-700 font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 outline-none transition-all placeholder:text-slate-300 min-h-[160px] resize-none leading-loose font-mono text-xs" placeholder="? Why do you want to join MentriQ?&#10;? Describe a challenging project you worked on." />
                                    </div>
                                </div>
                                <div className="pt-10 flex justify-end gap-8 items-center border-t border-slate-100 -mx-10 px-10 -mb-10 bg-slate-50/50 mt-10 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.3em] transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black flex items-center gap-4 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-600/20 text-[10px] uppercase tracking-widest"
                                    >
                                        <Check size={20} strokeWidth={3} />
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
