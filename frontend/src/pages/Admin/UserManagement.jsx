import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Trash2, Search, User, X, Plus, KeyRound, Mail, Download, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const MotionTr = motion.tr;
const MotionDiv = motion.div;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingUser) {
                // Update Mode
                const payload = {
                    name: formData.name.trim(),
                    email: formData.email.trim()
                };
                const { data } = await api.put(`/users/${editingUser._id}`, payload);
                if (data?.success) {
                    setUsers(prev => prev.map(u => u._id === editingUser._id ? { ...u, ...data.user } : u));
                    toast.success("Student updated successfully");
                }
            } else {
                // Create Mode
                const payload = {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    role: "student"
                };
                const { data } = await api.post("/users", payload);
                if (data?.user) {
                    setUsers((prev) => [data.user, ...prev]);
                    toast.success("Student created successfully");
                }
            }

            closeModal();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, password: "" });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "" });
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-[#1e293b] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a]">
                <div className="w-full lg:w-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight italic uppercase">Candidate Registry</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md border border-indigo-400/20">{students.length} Nodes</span>
                        Authenticated database of active learners and enrollment entities.
                    </p>
                </div>
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-6 flex items-center w-full sm:w-auto group focus-within:border-indigo-500/30 transition-all shadow-inner">
                        <Search className="text-gray-600 ml-4 shrink-0 transition-colors group-focus-within:text-indigo-400" size={20} />
                        <input
                            type="text"
                            placeholder="Identify candidate profile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-gray-700 focus:outline-none py-4 px-4 w-full sm:w-64 font-black uppercase italic tracking-tighter text-sm"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportStudents}
                            className="bg-white/5 text-white hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl font-black flex items-center gap-3 transition-all active:scale-95 text-[10px] uppercase tracking-widest flex-1 sm:flex-none justify-center"
                        >
                            <Download size={16} />
                            <span>Export</span>
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-black flex items-center gap-3 transition-all hover:scale-[1.05] active:scale-95 shadow-2xl text-[10px] uppercase tracking-widest flex-1 sm:flex-none justify-center"
                        >
                            <Plus size={18} strokeWidth={3} />
                            <span>Deploy Profile</span>
                        </button>
                    </div>
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
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2.5 rounded-lg text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                                                    title="Edit Student"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2.5 rounded-lg text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 transition-all"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
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
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <div
                            className="absolute inset-0"
                            onClick={() => !submitting && closeModal()}
                        />
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-xl bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{editingUser ? "Update Profile" : "Initialize Entity"}</h3>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Registry Access Level: Student</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => !submitting && closeModal()}
                                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Entity Name</label>
                                    <div className="relative group">
                                        <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                            placeholder="Full Identification Name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Communication Link</label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                            placeholder="network@origin.com"
                                        />
                                    </div>
                                </div>

                                {!editingUser && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Security Key</label>
                                        <div className="relative group">
                                            <KeyRound size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                                placeholder="Cryptographic String"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-8 flex justify-end gap-8 items-center">
                                    <button
                                        type="button"
                                        onClick={() => !submitting && closeModal()}
                                        className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-white text-black px-12 py-5 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-gray-200 transition-all hover:scale-[1.05] active:scale-95 shadow-2xl text-[10px] uppercase tracking-widest disabled:opacity-60"
                                    >
                                        {submitting && <Loader2 size={16} className="animate-spin" />}
                                        <span>{editingUser ? "Commence Sync" : "Deploy Entity"}</span>
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
