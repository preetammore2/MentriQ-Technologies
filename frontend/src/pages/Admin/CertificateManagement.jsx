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
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section - Simplified */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-[#1e293b] p-8 md:p-10 rounded-3xl border border-white/5 shadow-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a]">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight italic uppercase">Credential Repository</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Authenticated ledger of student certifications and institutional endorsements.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-6 flex items-center group focus-within:border-indigo-500/30 transition-all">
                        <Search className="text-gray-600 ml-4 group-focus-within:text-indigo-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Identify recipient or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-gray-700 focus:outline-none py-4 px-4 w-full md:w-64 font-black uppercase italic tracking-tighter text-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.05] active:scale-95 shadow-2xl text-[10px] uppercase tracking-widest whitespace-nowrap"
                    >
                        <Award size={18} strokeWidth={3} />
                        <span>Issue Credential</span>
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">ID</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recipient</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Course</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Issued On</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">Syncing Ledger...</p>
                                    </td>
                                </tr>
                            ) : filteredCerts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <Award size={32} className="text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-white font-bold mb-1">No Certificates Found</h3>
                                        <button onClick={() => setIsModalOpen(true)} className="text-indigo-400 text-xs font-bold hover:text-indigo-300">Issue New Certificate</button>
                                    </td>
                                </tr>
                            ) : (
                                filteredCerts.map((cert) => (
                                    <tr key={cert._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/5 px-2 py-1 rounded-md border border-indigo-500/10">
                                                {cert.certificateId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-white text-sm">{cert.studentName}</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Grade: {cert.grade}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-gray-400 text-xs font-medium">{cert.courseName}</span>
                                        </td>
                                        <td className="px-6 py-5 text-gray-500 text-xs font-medium">
                                            {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${cert.status === 'Revoked'
                                                ? 'bg-red-500/10 text-red-400 border-red-500/10'
                                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                                                }`}>
                                                {cert.status || 'Verified'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {cert.status !== 'Revoked' && (
                                                    <button
                                                        onClick={() => handleRevoke(cert._id)}
                                                        className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm outline-none"
                                                        title="Revoke Certificate"
                                                    >
                                                        <RotateCcw size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(cert._id)}
                                                    className="p-2.5 bg-white/5 text-gray-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all shadow-sm outline-none"
                                                    title="Delete Certificate"
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] w-full max-w-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col"
                        >
                            <div className="p-12 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
                                <div>
                                    <h2 className="text-4xl font-black text-white tracking-tight italic uppercase">Issue Credential</h2>
                                    <p className="text-gray-500 mt-1 font-bold uppercase tracking-widest text-xs">Credential Generation Protocol</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                                    <X size={28} />
                                </button>
                            </div>

                            <form onSubmit={handleGenerate} className="p-12 space-y-10">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Select Candidate</label>
                                        <div className="relative group">
                                            <Users size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                            <select
                                                required
                                                value={formData.userId}
                                                onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all appearance-none bg-[#0f172a] cursor-pointer"
                                            >
                                                <option value="">Choose Student Account</option>
                                                {users.map(u => <option key={u._id} value={u._id}>{u.name} — {u.email}</option>)}
                                            </select>
                                            <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Academic Program</label>
                                        <div className="relative group">
                                            <BookOpen size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                            <select
                                                required
                                                value={formData.courseId}
                                                onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all appearance-none bg-[#0f172a] cursor-pointer"
                                            >
                                                <option value="">Select Target Curriculum</option>
                                                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                            </select>
                                            <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Aptitude Validation</label>
                                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                                            {['A+', 'A', 'B+', 'B', 'C', 'Pass'].map(g => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, grade: g })}
                                                    className={`py-6 rounded-2xl font-black transition-all border text-xs tracking-widest ${formData.grade === g
                                                        ? 'bg-white text-black border-white shadow-[0_10px_30px_-5px_rgba(255,255,255,0.3)] scale-[1.08] z-10'
                                                        : 'bg-white/5 text-gray-700 border-white/10 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end gap-6 items-center">
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
