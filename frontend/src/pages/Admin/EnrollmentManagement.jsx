import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Search, CheckCircle, XCircle, Clock, Trash2, Download, GraduationCap } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

const EnrollmentManagement = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const toast = useToast();

    const fetchEnrollments = async () => {
        try {
            const { data } = await api.get("/enrollments"); // Admin endpoint to get all
            setEnrollments(data);
        } catch {
            toast.error("Failed to load enrollments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchEnrollments();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/enrollments/${id}`, { status });
            toast.success(`Enrollment ${status}`);
            setEnrollments(enrollments.map(e => e._id === id ? { ...e, status } : e));
        } catch {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this enrollment record?")) return;
        try {
            await api.delete(`/enrollments/${id}`);
            toast.success("Enrollment deleted");
            setEnrollments(enrollments.filter(e => e._id !== id));
        } catch {
            toast.error("Delete failed");
        }
    };

    const filtered = enrollments.filter(e =>
        e.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExportEnrollments = () => {
        if (filtered.length === 0) {
            toast.error("No enrollments to export");
            return;
        }

        const headers = ["Student Name", "Student Email", "Course", "Status", "Enrolled On"];
        const rows = filtered.map((enrollment) => ([
            enrollment.user?.name || "Anonymous User",
            enrollment.user?.email || "No Email",
            enrollment.course?.title || "Unknown Course",
            enrollment.status || "pending",
            enrollment.createdAt
                ? new Date(enrollment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                : ""
        ]));

        const escapeCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
        const csv = [headers, ...rows]
            .map((row) => row.map(escapeCell).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Enrollments exported in Excel format");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <GraduationCap size={28} className="text-indigo-600" />
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Access Registry</h2>
                        <span className="ml-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 text-xs font-bold">
                            {enrollments.length} Active Records
                        </span>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Monitor and authorize student course access protocols.</p>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 relative z-10">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl pr-6 flex items-center group focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                        <Search className="text-slate-400 ml-4" size={18} />
                        <input
                            type="text"
                            placeholder="Find enrollment..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none py-3 px-4 w-full md:w-64 font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={handleExportEnrollments}
                        className="bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm text-sm"
                    >
                        <Download size={18} />
                        <span>Export Data</span>
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Student Identity</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Module/Course</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Authorization</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Commands</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">Fetching Enrollments...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-24 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 text-slate-200 shadow-inner">
                                            <Search size={40} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight uppercase">Registry Void</h3>
                                        <p className="text-slate-500 max-w-xs mx-auto font-medium text-[10px] uppercase tracking-widest leading-relaxed">No matching enrollment signatures detected in the databanks.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((enrollment) => (
                                    <tr key={enrollment._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-extrabold text-slate-900 text-sm tracking-tight">{enrollment.user?.name || "Anonymous User"}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1">{enrollment.user?.email || "No Email"}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-slate-600 text-xs font-bold uppercase tracking-tight">{enrollment.course?.title || "Unknown Course"}</span>
                                        </td>
                                        <td className="px-8 py-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                            {new Date(enrollment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${enrollment.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                enrollment.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {enrollment.status === 'approved' ? <CheckCircle size={10} strokeWidth={3} /> :
                                                    enrollment.status === 'rejected' ? <XCircle size={10} strokeWidth={3} /> :
                                                        <Clock size={10} strokeWidth={3} />}
                                                {enrollment.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {enrollment.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(enrollment._id, 'approved')}
                                                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 shadow-sm outline-none"
                                                            title="Authorize Access"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(enrollment._id, 'rejected')}
                                                            className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100 shadow-sm outline-none"
                                                            title="Revoke Access"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(enrollment._id)}
                                                    className="p-2.5 bg-slate-50 text-slate-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 border border-slate-200 rounded-xl transition-all shadow-sm outline-none"
                                                    title="Purge Record"
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
        </div>
    );
};

export default EnrollmentManagement;
