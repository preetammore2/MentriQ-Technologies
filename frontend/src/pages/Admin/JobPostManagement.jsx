import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    X,
    MapPin,
    Briefcase,
    Building2,
    Check,
    ExternalLink,
    Clock,
    Filter,
    Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const JobPostManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [seeding, setSeeding] = useState(false);
    const toast = useToast();

    const initialFormState = {
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        description: "",
        requirements: "",
        applicationLink: "",
        isActive: true
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchJobs = async () => {
        try {
            const { data } = await api.get("/jobs");
            setJobs(data);
        } catch (err) {
            toast.error("Failed to load recruitment posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchJobs();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleEdit = (job) => {
        setEditingJob(job);
        setFormData({
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            description: job.description,
            requirements: job.requirements,
            applicationLink: job.applicationLink,
            isActive: job.isActive
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this recruitment post?")) return;
        try {
            await api.delete(`/jobs/${id}`);
            toast.success("Post deleted successfully");
            fetchJobs();
        } catch (err) {
            toast.error("Failed to delete post");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingJob) {
                await api.put(`/jobs/${editingJob._id}`, formData);
                toast.success("Post updated successfully");
            } else {
                await api.post("/jobs", formData);
                toast.success("Post created successfully");
            }
            setIsModalOpen(false);
            setEditingJob(null);
            setFormData(initialFormState);
            fetchJobs();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleSeed = async () => {
        if (!window.confirm("This will replace all current posts with default samples. Proceed?")) return;
        try {
            setSeeding(true);
            await api.post("/jobs/seed");
            toast.success("Default posts loaded successfully");
            fetchJobs();
        } catch (err) {
            toast.error("Failed to seed posts");
        } finally {
            setSeeding(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section - Simplified */}
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <Briefcase size={28} className="text-indigo-600" />
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recruitment Hub</h2>
                        <span className="ml-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 text-xs font-bold">
                            {jobs.length} Active Slots
                        </span>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Manage industry opportunities and recruitment protocols.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto relative z-10">
                    <button
                        onClick={handleSeed}
                        disabled={seeding}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-slate-200 text-[10px] uppercase tracking-widest"
                    >
                        <Database size={18} className={seeding ? "animate-spin" : ""} />
                        <span>{seeding ? "Seeding..." : "Seed Samples"}</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingJob(null);
                            setFormData(initialFormState);
                            setIsModalOpen(true);
                        }}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap text-[10px] uppercase tracking-widest"
                    >
                        <Plus size={18} />
                        <span>Post New Job</span>
                    </button>
                </div>
            </div>

            {/* Content Search */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-1 pr-6 flex items-center gap-4 group focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-sm">
                <Search className="text-slate-400 ml-5" size={18} />
                <input
                    type="text"
                    placeholder="Identify role, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none py-4 w-full font-bold text-sm tracking-tight"
                />
            </div>

            {/* Table Area */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Position</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Company & Location</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Type</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Commands</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center">
                                            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">Loading data...</p>
                                        </td>
                                    </tr>
                                ) : filteredJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center">
                                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10 text-gray-600">
                                                <Briefcase size={24} />
                                            </div>
                                            <h3 className="text-white font-bold mb-1">No Jobs Found</h3>
                                            <p className="text-gray-500 text-xs">Try adjusting your search filters.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredJobs.map((job) => (
                                        <motion.tr
                                            key={job._id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="font-extrabold text-slate-900 text-base tracking-tight">{job.title}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 text-xs font-bold uppercase tracking-wider">{job.company}</span>
                                                    <span className="text-slate-500 text-[10px] font-medium uppercase tracking-widest mt-1">{job.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-indigo-600 text-[10px] font-black uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm">
                                                    {job.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${job.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                    {job.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <a
                                                        href={job.applicationLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-200 shadow-sm"
                                                        title="Transmit Link"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    <button
                                                        onClick={() => handleEdit(job)}
                                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200 hover:border-indigo-100 shadow-sm"
                                                        title="Refine Post"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(job._id)}
                                                        className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shadow-sm"
                                                        title="Terminate Post"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Modern Reskin */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                                        {editingJob ? "Adjust Parameters" : "Initiate Protocol"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Registry Access Level: Recruitment Node</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form id="jobForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Designated Role</label>
                                        <div className="relative group/field">
                                            <Briefcase size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/field:text-indigo-500" />
                                            <input
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
                                                placeholder="e.g. Lead Kinetic Architect"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Affiliate Organization</label>
                                        <div className="relative group/field">
                                            <Building2 size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/field:text-indigo-500" />
                                            <input
                                                required
                                                value={formData.company}
                                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
                                                placeholder="Organization ID"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Station Location</label>
                                        <div className="relative group/field">
                                            <MapPin size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/field:text-indigo-500" />
                                            <input
                                                required
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
                                                placeholder="e.g. Distributed Node"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Engagement Frequency</label>
                                        <div className="relative group/field">
                                            <Clock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/field:text-indigo-500" />
                                            <select
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all appearance-none"
                                            >
                                                <option>Full-time</option>
                                                <option>Part-time</option>
                                                <option>Internship</option>
                                                <option>Contract</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Transmission Bridge (URL)</label>
                                    <div className="relative group/field">
                                        <ExternalLink size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/field:text-indigo-500" />
                                        <input
                                            required
                                            type="url"
                                            value={formData.applicationLink}
                                            onChange={e => setFormData({ ...formData, applicationLink: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300 font-mono text-sm"
                                            placeholder="https://hq.protocol.apply"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Mission Scope</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all resize-none placeholder:text-slate-300 leading-relaxed italic"
                                        placeholder="Outline the operational objectives..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Required Competencies</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={formData.requirements}
                                        onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all resize-none placeholder:text-slate-300 leading-relaxed italic font-mono text-sm"
                                        placeholder="List critical skills (comma separated)..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between group/toggle ${formData.isActive ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-200 text-slate-400'}`}>
                                                <Check size={20} strokeWidth={3} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`text-xs font-black uppercase tracking-widest ${formData.isActive ? 'text-emerald-900' : 'text-slate-600'}`}>Protocol Stance</p>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${formData.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>{formData.isActive ? "Live Signal Activated" : "Intermittent Broadcast"}</p>
                                            </div>
                                        </div>
                                        <div className={`w-14 h-7 rounded-full relative transition-all ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${formData.isActive ? 'left-8' : 'left-1'}`} />
                                        </div>
                                    </button>
                                </div>
                            </form>

                            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-6 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-[0.3em]"
                                >
                                    Abort Session
                                </button>
                                <button
                                    form="jobForm"
                                    type="submit"
                                    className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black flex items-center gap-4 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 text-[10px] uppercase tracking-widest"
                                >
                                    <Check size={20} strokeWidth={3} />
                                    <span>{editingJob ? "Confirm Changes" : "Deploy Opportunity"}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobPostManagement;
