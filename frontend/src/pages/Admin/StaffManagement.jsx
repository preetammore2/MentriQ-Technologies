import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { ShieldCheck, Search, UserRound, UserCog, Lock, Download, Key, X, Eye, EyeOff, Loader2, ChevronDown } from "lucide-react";
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <UserCog size={28} className="text-indigo-600" />
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personnel Registry</h2>
                            <span className="ml-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 text-xs font-bold">
                                {staffUsers.length} Authorized
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium text-sm">System-wide access control and administrative entity management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                            <Search className="text-slate-400 ml-4 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search personnel..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none py-3 px-4 w-full lg:w-64 font-medium text-sm"
                            />
                        </div>
                        <button
                            onClick={handleExportStaff}
                            className="bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm text-sm"
                        >
                            <Download size={18} />
                            <span>Export Registry</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-3xl p-10 shadow-xl">
                <h3 className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <ShieldCheck size={14} className="text-indigo-400" />
                    Elevation Protocol
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-6 items-center">
                    <div className="relative group">
                        <UserRound size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                        <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all appearance-none bg-[#1e293b] cursor-pointer"
                        >
                            <option value="" className="bg-[#1e293b]">Select Candidate to Promote...</option>
                            {students.map((u) => (
                                <option key={u._id} value={u._id} className="bg-[#1e293b] italic">{u.name} ({u.email})</option>
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-white transition-colors" />
                    </div>
                    <button
                        onClick={() => grantFromStudent("moderator")}
                        disabled={!selectedStudentId}
                        className="px-8 py-6 rounded-2xl text-[10px] font-black bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all disabled:opacity-20 uppercase tracking-widest"
                    >
                        Moderator Status
                    </button>
                    <button
                        onClick={() => grantFromStudent("admin")}
                        disabled={!selectedStudentId}
                        className="px-8 py-6 rounded-2xl text-[10px] font-black bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all disabled:opacity-20 uppercase tracking-widest"
                    >
                        Admin Privilege
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

            <AnimatePresence>
                {resetModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 w-full max-w-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Security Override</h3>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">Credential Re-initialization</p>
                                </div>
                                <button
                                    onClick={() => setResetModalOpen(false)}
                                    className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl mb-8">
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    Injecting new credentials for <strong className="text-white italic">{selectedUserForReset?.name}</strong>.
                                    This operation will immediately invalidate current session access.
                                </p>
                            </div>

                            <form onSubmit={handlePasswordReset} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-1">New Access Key</label>
                                    <div className="relative group">
                                        <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                            placeholder="Min. 6 characters required"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end gap-8 items-center">
                                    <button
                                        type="button"
                                        onClick={() => setResetModalOpen(false)}
                                        className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={resetting}
                                        className="px-10 py-5 rounded-2xl font-black bg-white text-black hover:bg-gray-200 shadow-2xl hover:scale-[1.05] active:scale-95 transition-all text-[10px] uppercase tracking-widest flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {resetting && <Loader2 size={16} className="animate-spin" />}
                                        Update Protocol
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
