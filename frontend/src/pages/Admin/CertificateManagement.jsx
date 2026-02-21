import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Award, Search, X, RotateCcw, Users, BookOpen, Trash2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const CertificateManagement = () => {
    const MotionDiv = motion.div;
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Data for generation form
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ userId: "", courseId: "", grade: "A+" });

    const toast = useToast();

    const fetchData = async () => {
        try {
            const [certRes, userRes, courseRes] = await Promise.all([
                api.get("/certificates"),
                api.get("/users"),
                api.get("/courses")
            ]);
            setCertificates(certRes.data);
            setUsers(userRes.data.filter(u => u.role !== 'admin')); // Filter admins if needed
            setCourses(courseRes.data);
        } catch (err) {
            console.error("Certificate fetch error", err);
            // toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchData();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/certificates/generate", formData);
            toast.success("Certificate generated successfully");
            setIsModalOpen(false);
            setFormData({ userId: "", courseId: "", grade: "A+" });
            // Refresh list
            const { data } = await api.get("/certificates");
            setCertificates(data);
        } catch (err) {
            const msg = err.response?.data?.message || "Generation failed";
            toast.error(msg);
        }
    };

    const handleRevoke = async (id) => {
        if (!window.confirm("Are you sure you want to revoke this certificate?")) return;
        try {
            await api.put(`/certificates/${id}/revoke`);
            toast.success("Certificate revoked");
            setCertificates(certificates.map(c => c._id === id ? { ...c, status: 'Revoked' } : c));
        } catch {
            toast.error("Revocation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this certificate permanently?")) return;
        try {
            await api.delete(`/certificates/${id}`);
            toast.success("Certificate deleted");
            setCertificates((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            toast.error(err?.response?.data?.message || "Delete failed");
        }
    };

    const filteredCerts = certificates.filter(c =>
        c.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.certificateId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <Award size={28} className="text-emerald-600" />
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Credential Registry</h2>
                        <span className="ml-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 text-xs font-bold">
                            {certificates.length} Issued Assets
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">Authenticated ledger of student certifications and institutional endorsements.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl pr-6 flex items-center group focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
                        <Search className="text-slate-400 ml-4 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search recipient or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none py-3 px-4 w-full md:w-64 font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-xl font-semibold shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 transition-all active:scale-95 text-sm whitespace-nowrap"
                    >
                        <Award size={18} />
                        <span>Issue Credential</span>
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Credential ID</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Recipient Identity</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Academic Program</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Authorization</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Commands</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-16 text-center">
                                        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Syncing Registry...</p>
                                    </td>
                                </tr>
                            ) : filteredCerts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-24 text-center">
                                        <Award size={48} className="text-slate-200 mx-auto mb-4" />
                                        <h3 className="text-slate-900 font-extrabold text-xl mb-2 tracking-tight uppercase">Ledger Empty</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic mb-8">No credentials have been issued in this cycle.</p>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                                        >
                                            Initiate Issuance
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                filteredCerts.map((cert) => (
                                    <tr key={cert._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 font-bold whitespace-nowrap">
                                                {cert.certificateId}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-extrabold text-slate-900 text-base tracking-tight">{cert.studentName}</div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 italic">Performance: {cert.grade}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-slate-600 text-sm font-bold tracking-tight mb-1">{cert.courseName}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mastery validation</div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                            {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${cert.status === 'Revoked'
                                                ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {cert.status || 'Authenticated'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {cert.status !== 'Revoked' && (
                                                    <button
                                                        onClick={() => handleRevoke(cert._id)}
                                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-200 shadow-sm outline-none active:scale-95"
                                                        title="Revoke Credential"
                                                    >
                                                        <RotateCcw size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(cert._id)}
                                                    className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shadow-sm outline-none active:scale-95"
                                                    title="Expunge Record"
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

            {/* Generation Modal */}
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
                            className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[3rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-6 mb-12 shrink-0">
                                <div>
                                    <h3 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Issue Credential</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Status: Credential Generation Protocol</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-14 h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-200"
                                >
                                    <X size={28} />
                                </button>
                            </div>

                            <form onSubmit={handleGenerate} className="p-12 space-y-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Select Candidate Identity</label>
                                        <div className="relative group">
                                            <Users size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-600 transition-colors" />
                                            <select
                                                required
                                                value={formData.userId}
                                                onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-extrabold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Awaiting selection...</option>
                                                {users.map(u => <option key={u._id} value={u._id}>{u.name} — {u.email}</option>)}
                                            </select>
                                            <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-emerald-600 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Academic Program Module</label>
                                        <div className="relative group">
                                            <BookOpen size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-600 transition-colors" />
                                            <select
                                                required
                                                value={formData.courseId}
                                                onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-extrabold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Select target curriculum...</option>
                                                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                            </select>
                                            <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-emerald-600 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Aptitude Validation Index</label>
                                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                            {['A+', 'A', 'B+', 'B', 'C', 'Pass'].map(g => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, grade: g })}
                                                    className={`py-5 rounded-2xl font-black transition-all border text-[10px] tracking-widest uppercase ${formData.grade === g
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10 scale-105 z-10'
                                                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                                                        }`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 flex justify-end gap-8 items-center border-t border-slate-100 -mx-12 px-12 -mb-12 bg-slate-50/50 mt-10">
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
                                        <Award size={20} strokeWidth={3} />
                                        <span>Authorize & Dispatch</span>
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

export default CertificateManagement;
