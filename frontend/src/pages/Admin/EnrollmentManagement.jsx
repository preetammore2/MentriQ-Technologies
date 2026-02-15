import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Search, CheckCircle, XCircle, Clock, Trash2, Download } from "lucide-react";
import { useToast } from "../../context/ToastContext";

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
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section - Simplified */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Enrollments</h2>
                    <p className="text-gray-400 text-sm mt-1">Monitor and authorize student course access.</p>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-4 flex items-center group focus-within:border-indigo-500/50 transition-all">
                        <Search className="text-gray-500 ml-4" size={18} />
                        <input
                            type="text"
                            placeholder="Search student or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-gray-500 focus:outline-none py-3 px-4 w-full md:w-64 font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={handleExportEnrollments}
                        className="bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 whitespace-nowrap"
                    >
                        <Download size={18} />
                        <span>Download Excel</span>
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Student</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Course</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Enrolled On</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">Fetching Enrollments...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10 text-gray-600">
                                            <Search size={24} />
                                        </div>
                                        <h3 className="text-white font-bold mb-1">No Enrollments Found</h3>
                                        <p className="text-gray-500 text-xs">Try adjusting your search criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((enrollment) => (
                                    <tr key={enrollment._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-white text-sm">{enrollment.user?.name || "Anonymous User"}</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{enrollment.user?.email || "No Email"}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-gray-300 text-xs font-semibold">{enrollment.course?.title || "Unknown Course"}</span>
                                        </td>
                                        <td className="px-6 py-5 text-gray-500 text-xs font-medium">
                                            {new Date(enrollment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${enrollment.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' :
                                                enrollment.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/10' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/10'
                                                }`}>
                                                {enrollment.status === 'approved' ? <CheckCircle size={10} /> :
                                                    enrollment.status === 'rejected' ? <XCircle size={10} /> :
                                                        <Clock size={10} />}
                                                {enrollment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {enrollment.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(enrollment._id, 'approved')}
                                                            className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm outline-none"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(enrollment._id, 'rejected')}
                                                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm outline-none"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(enrollment._id)}
                                                    className="p-2 bg-white/5 text-gray-500 hover:text-white hover:bg-red-500 rounded-lg transition-all shadow-sm outline-none"
                                                    title="Delete Record"
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
