import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Trash2, Search, User, X, Plus, KeyRound, Mail, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const MotionTr = motion.tr;
const MotionDiv = motion.div;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const toast = useToast();

    const fetchUsers = useCallback(async () => {
        try {
            const { data } = await api.get("/users");
            setUsers(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load students");
        }
    }, [toast]);

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 15000);
        return () => clearInterval(interval);
    }, [fetchUsers]);

    const students = useMemo(
        () => users.filter((u) => u.role === "student"),
        [users]
    );

    const filteredStudents = useMemo(() => {
        return students.filter((user) =>
            `${user?.name || ""} ${user?.email || ""}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success("Student deleted successfully");
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch {
            toast.error("Failed to delete student");
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: "student"
            };
            const { data } = await api.post("/users", payload);
            if (data?.user) {
                setUsers((prev) => [data.user, ...prev]);
            } else {
                fetchUsers();
            }
            toast.success("Student created successfully");
            setFormData({ name: "", email: "", password: "" });
            setIsCreateOpen(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create student");
        } finally {
            setCreating(false);
        }
    };

    const handleExportStudents = () => {
        if (filteredStudents.length === 0) {
            toast.error("No students available to export");
            return;
        }

        const headers = ["Name", "Email", "Role", "Joined Date"];
        const rows = filteredStudents.map((user) => [
            user?.name || "",
            user?.email || "",
            user?.role || "student",
            user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""
        ]);

        const escapeCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
        const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Exported in Excel-compatible format");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Student Management</h2>
                    <p className="text-gray-400 text-sm mt-1">Only student users are shown here. Admins and moderators are managed in Staff section.</p>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-4 flex items-center w-full md:w-auto group focus-within:border-indigo-500/50 transition-all">
                        <Search className="text-gray-500 ml-4" size={18} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-gray-500 focus:outline-none py-3 px-4 w-full md:w-64 font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={handleExportStudents}
                        className="bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 whitespace-nowrap"
                    >
                        <Download size={18} />
                        <span>Download Excel</span>
                    </button>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span>Add Student</span>
                    </button>
                </div>
            </div>

            <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Student</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Joined</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredStudents.map((user) => (
                                    <MotionTr
                                        layout
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/10">
                                                    {(user.name || "S").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-500 text-xs">
                                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2.5 rounded-lg text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 transition-all"
                                                title="Delete Student"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </MotionTr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {filteredStudents.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <User size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">No students found</h3>
                        <p className="text-gray-500 text-sm">We couldn't find any students matching "{searchTerm}".</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <div
                            className="absolute inset-0"
                            onClick={() => !creating && setIsCreateOpen(false)}
                        />
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 24 }}
                            className="relative w-full max-w-xl bg-[#0f172a]/95 border border-white/10 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex items-start justify-between gap-4 mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-white">Create Student</h3>
                                    <p className="text-gray-400 text-sm mt-1">New user will be created with student role.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => !creating && setIsCreateOpen(false)}
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                >
                                    <X size={18} className="mx-auto" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Password</label>
                                    <div className="relative">
                                        <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                            placeholder="Min 6 characters"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => !creating && setIsCreateOpen(false)}
                                        className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-60 transition-all"
                                    >
                                        {creating ? "Creating..." : "Create Student"}
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

export default UserManagement;
