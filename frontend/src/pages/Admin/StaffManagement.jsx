import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { ShieldCheck, Search, UserRound, UserCog, Lock, Download, Key, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

const SUPER_ADMIN_EMAIL = "admin@mentriqtechnologies.in";
const MotionDiv = motion.div;

const StaffManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState("");

    // Password Reset State
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [selectedUserForReset, setSelectedUserForReset] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [resetting, setResetting] = useState(false);

    const toast = useToast();

    const fetchUsers = useCallback(async () => {
        try {
            const { data } = await api.get("/users");
            setUsers(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load users");
        }
    }, [toast]);

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 15000);
        return () => clearInterval(interval);
    }, [fetchUsers]);

    const staffUsers = useMemo(() => {
        return users.filter((u) => u.role === "admin" || u.role === "moderator");
    }, [users]);

    const students = useMemo(() => {
        return users.filter((u) => u.role === "student");
    }, [users]);

    const filteredStaff = useMemo(() => {
        return staffUsers.filter((u) =>
            `${u?.name || ""} ${u?.email || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [staffUsers, searchTerm]);

    const handleRoleUpdate = async (userId, role) => {
        setUpdatingId(userId);
        try {
            await api.put(`/users/role/${userId}`, { role });
            setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
            toast.success(`Role updated to ${role}`);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Role update failed");
        } finally {
            setUpdatingId("");
        }
    };

    const grantFromStudent = async (targetRole) => {
        if (!selectedStudentId) {
            toast.error("Select a student first");
            return;
        }
        await handleRoleUpdate(selectedStudentId, targetRole);
        setSelectedStudentId("");
    };

    const handleExportStaff = () => {
        if (filteredStaff.length === 0) {
            toast.error("No staff data to export");
            return;
        }

        const headers = ["Name", "Email", "Role", "Joined Date"];
        const rows = filteredStaff.map((user) => [
            user?.name || "",
            user?.email || "",
            user?.role || "",
            user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""
        ]);

        const escapeCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
        const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `staff-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Exported in Excel-compatible format");
    };

    const openResetModal = (user) => {
        setSelectedUserForReset(user);
        setNewPassword("");
        setResetModalOpen(true);
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be 6+ chars");
            return;
        }
        setResetting(true);
        try {
            await api.put(`/users/${selectedUserForReset._id}/password`, { password: newPassword });
            toast.success(`Password updated for ${selectedUserForReset.name}`);
            setResetModalOpen(false);
            setNewPassword("");
            setSelectedUserForReset(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Password reset failed");
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Staff Access Control</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Admin and moderator users are listed here. Grant staff access from student accounts.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-4 flex items-center w-full lg:w-auto group focus-within:border-indigo-500/50 transition-all">
                            <Search className="text-gray-500 ml-4" size={18} />
                            <input
                                type="text"
                                placeholder="Search staff by name/email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-gray-500 focus:outline-none py-3 px-4 w-full lg:w-80 font-medium text-sm"
                            />
                        </div>
                        <button
                            onClick={handleExportStaff}
                            className="bg-emerald-600 text-white hover:bg-emerald-500 px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                        >
                            <Download size={16} />
                            <span>Download Excel</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-6 shadow-xl">
                <h3 className="text-white font-bold text-lg mb-4">Grant Staff Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-center">
                    <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 appearance-none"
                    >
                        <option value="" className="bg-[#1e293b]">Select student to promote...</option>
                        {students.map((u) => (
                            <option key={u._id} value={u._id} className="bg-[#1e293b]">{u.name} ({u.email})</option>
                        ))}
                    </select>
                    <button
                        onClick={() => grantFromStudent("moderator")}
                        disabled={!selectedStudentId}
                        className="px-4 py-3 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition disabled:opacity-40"
                    >
                        Make Moderator
                    </button>
                    <button
                        onClick={() => grantFromStudent("admin")}
                        disabled={!selectedStudentId}
                        className="px-4 py-3 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition disabled:opacity-40"
                    >
                        Make Admin
                    </button>
                </div>
            </div>

            <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Staff User</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Current Role</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredStaff.map((user) => {
                                const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;
                                const isPending = updatingId === user._id;
                                return (
                                    <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center">
                                                    <UserRound size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-sm">{user.name}</div>
                                                    <div className="text-gray-500 text-xs">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${user.role === "admin"
                                                ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                                                : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                                                }`}>
                                                {user.role === "admin" ? <ShieldCheck size={10} /> : <UserCog size={10} />}
                                                {user.role}
                                            </span>
                                            {isSuperAdmin && (
                                                <div className="mt-2 text-[11px] text-amber-300 inline-flex items-center gap-1">
                                                    <Lock size={12} />
                                                    Super Admin
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openResetModal(user)}
                                                    className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                                                    title="Reset Password"
                                                >
                                                    <Key size={14} />
                                                </button>
                                                {!isSuperAdmin && (
                                                    <button
                                                        onClick={() => handleRoleUpdate(user._id, "student")}
                                                        disabled={isPending}
                                                        className="px-3 py-2 rounded-lg text-xs font-bold bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition disabled:opacity-40"
                                                    >
                                                        Revoke
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredStaff.length === 0 && (
                    <div className="py-16 text-center text-gray-500 text-sm">No staff users found.</div>
                )}
            </div>

            {/* Password Reset Modal */}
            <AnimatePresence>
                {resetModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1e293b] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Reset Staff Password</h3>
                                <button onClick={() => setResetModalOpen(false)} className="text-gray-500 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-gray-400 text-sm mb-6">
                                Set a new permanent password for <strong className="text-white">{selectedUserForReset?.name}</strong>.
                                <br />This will immediately invalidate their old password.
                            </p>

                            <form onSubmit={handlePasswordReset} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-500">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
                                            placeholder="Enter new secure password"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setResetModalOpen(false)}
                                        className="px-4 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={resetting}
                                        className="px-6 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {resetting && <Loader2 size={14} className="animate-spin" />}
                                        Update Password
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

export default StaffManagement;
