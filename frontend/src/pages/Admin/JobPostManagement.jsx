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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Job Opportunities</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage recruitment postings and external job links.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button
                        onClick={handleSeed}
                        disabled={seeding}
                        className="bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10 text-xs uppercase tracking-widest"
                    >
                        <Database size={16} className={seeding ? "animate-spin" : ""} />
                        <span>{seeding ? "Seeding..." : "Seed Samples"}</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingJob(null);
                            setFormData(initialFormState);
                            setIsModalOpen(true);
                        }}
                        className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span>Add Job Post</span>
                    </button>
                </div>
            </div>

            {/* Search Bar - Simplified */}
            <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-4 flex items-center gap-4 group focus-within:border-indigo-500/50 transition-all shadow-xl">
                <Search className="text-gray-500 ml-2" size={20} />
                <input
                    type="text"
                    placeholder="Search by role, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-white placeholder:text-gray-600 focus:outline-none py-2 w-full font-medium"
                />
            </div>

            {/* Jobs Table - Clean Admin Style */}
            <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Position</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Company & Location</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Type</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
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
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-white text-sm">{job.title}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-300 text-xs font-medium uppercase tracking-wider">{job.company}</span>
                                                    <span className="text-gray-500 text-[10px] mt-0.5">{job.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/10">
                                                    {job.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${job.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-red-500/10 text-red-400 border-red-500/10'}`}>
                                                    {job.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <a
                                                        href={job.applicationLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all shadow-sm"
                                                        title="External Link"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    <button
                                                        onClick={() => handleEdit(job)}
                                                        className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all shadow-sm"
                                                        title="Edit Job"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(job._id)}
                                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                        title="Delete Job"
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
                            className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]"
                        >
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent shrink-0">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase italic flex items-center gap-4">
                                        <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                                            {editingJob ? <Edit2 size={24} strokeWidth={2.5} /> : <Plus size={28} strokeWidth={2.5} />}
                                        </div>
                                        {editingJob ? "Adjust Parameters" : "Initiate Protocol"}
                                    </h2>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-3 ml-18 bg-white/5 w-fit px-3 py-1 rounded-md">CORE_SYS: RECRU_MGMT_V2.0</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                >
                                    <X size={28} />
                                </button>
                            </div>

                            <form id="jobForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Designated Role</label>
                                        <div className="relative group/field">
                                            <Briefcase size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within/field:text-indigo-500" />
                                            <input
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                                placeholder="e.g. Lead Kinetic Architect"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Affiliate Organization</label>
                                        <div className="relative group/field">
                                            <Building2 size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within/field:text-indigo-500" />
                                            <input
                                                required
                                                value={formData.company}
                                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                                placeholder="Organization ID"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Station Location</label>
                                        <div className="relative group/field">
                                            <MapPin size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within/field:text-indigo-500" />
                                            <input
                                                required
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                                placeholder="e.g. Distributed Node"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Engagement Frequency</label>
                                        <div className="relative group/field">
                                            <Clock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within/field:text-indigo-500" />
                                            <select
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all appearance-none bg-[#0f172a]"
                                            >
                                                <option className="bg-[#0f172a]">Full-time</option>
                                                <option className="bg-[#0f172a]">Part-time</option>
                                                <option className="bg-[#0f172a]">Internship</option>
                                                <option className="bg-[#0f172a]">Contract</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Transmission Bridge (URL)</label>
                                    <div className="relative group/field">
                                        <ExternalLink size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within/field:text-indigo-500" />
                                        <input
                                            required
                                            type="url"
                                            value={formData.applicationLink}
                                            onChange={e => setFormData({ ...formData, applicationLink: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-gray-700 font-mono text-sm"
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
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all resize-none placeholder:text-gray-700 leading-relaxed italic"
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
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all resize-none placeholder:text-gray-700 leading-relaxed italic font-mono text-sm"
                                        placeholder="List critical skills (comma separated)..."
                                    />
                                </div>

                                <div className="flex items-center gap-6 p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={`w-16 h-8 rounded-full transition-all relative shrink-0 ${formData.isActive ? 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-white/10 border border-white/10'}`}
                                    >
                                        <div className={`absolute top-1.5 w-5 h-5 rounded-full transition-all duration-300 ${formData.isActive ? 'left-9 bg-white' : 'left-2 bg-gray-600'}`} />
                                    </button>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Protocol Stance</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{formData.isActive ? "Live Signal Activated" : "Intermittent Broadcast"}</span>
                                    </div>
                                </div>
                            </form>

                            <div className="p-10 border-t border-white/5 bg-gradient-to-t from-white/[0.02] to-transparent flex justify-end items-center gap-8 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-[0.4em] italic"
                                >
                                    Abort Session
                                </button>
                                <button
                                    form="jobForm"
                                    type="submit"
                                    className="bg-white text-black px-12 py-5 rounded-[1.5rem] font-black flex items-center gap-4 hover:bg-gray-200 transition-all hover:scale-[1.05] active:scale-95 shadow-2xl text-sm uppercase tracking-widest"
                                >
                                    <Check size={20} strokeWidth={3} />
                                    <span>{editingJob ? "Confirm Changes" : "Post Opportunity"}</span>
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
