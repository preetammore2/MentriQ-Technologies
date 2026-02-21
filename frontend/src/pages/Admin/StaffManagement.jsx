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
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <UserCog size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Personnel Registry</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-bold">
                                {staffUsers.length} Authorized
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">System-wide access control and administrative entity management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-white/5 border border-white/10 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                            <Search className="text-slate-500 ml-4 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search personnel..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-600 focus:outline-none py-4 px-4 w-full lg:w-64 font-bold text-sm tracking-tight"
                            />
                        </div>
                        <button
                            onClick={handleExportStaff}
                            className="bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap justify-center"
                        >
                            <Download size={16} />
                            <span>Export Personnel</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Elevate Student Section */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 shadow-inner">
                        <ShieldCheck size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold text-white tracking-tight">Privilege Escalation</h3>
                        <p className="text-slate-400 text-sm mt-1">Select a candidate profile to grant administrative or moderator status.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <select
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-5 pr-10 text-slate-300 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-[#0f172a]">Select Candidate...</option>
                                {students.map((s) => (
                                    <option key={s._id} value={s._id} className="bg-[#0f172a]">
                                        {s.name} ({s.email})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => grantFromStudent('moderator')}
                                className="flex-1 md:flex-none px-6 py-3.5 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-600/20 text-emerald-400 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all active:scale-95"
                            >
                                Moderator
                            </button>
                            <button
                                onClick={() => grantFromStudent('admin')}
                                className="flex-1 md:flex-none px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                            >
                                Administrator
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Staff User</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Role</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredStaff.map((user) => {
                                const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;
                                const isPending = updatingId === user._id;
                                return (
                                    <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20 shadow-sm group-hover:scale-110 transition-transform">
                                                    {(user.name || "A").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-[15px] tracking-tight">{user.name}</div>
                                                    <div className="text-[11px] font-bold text-slate-500 tracking-wider mt-0.5">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${user.role === 'admin'
                                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                                {isSuperAdmin && (
                                                    <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-amber-500/10 text-amber-400 border-amber-500/20 inline-flex items-center gap-1.5">
                                                        <Lock size={10} className="text-amber-500" />
                                                        Super Admin
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => openResetModal(user)}
                                                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all flex items-center gap-2"
                                                    title="Security Reset"
                                                >
                                                    <Key size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Secret</span>
                                                </button>

                                                {user.email !== SUPER_ADMIN_EMAIL && (
                                                    <button
                                                        onClick={() => handleRoleUpdate(user._id, 'student')}
                                                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all flex items-center gap-2"
                                                        disabled={updatingId === user._id}
                                                        title="Revoke Access"
                                                    >
                                                        {updatingId === user._id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Lock size={14} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Revoke</span>
                                                            </>
                                                        )}
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
                    <div className="py-24 text-center">
                        <UserRound size={48} className="text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium italic">No personnel found matching the criteria.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {resetModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-[#0f172a] border border-white/10 rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">Security Override</h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Personnel: {selectedUserForReset?.name}</p>
                                </div>
                                <button
                                    onClick={() => !resetting && setResetModalOpen(false)}
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handlePasswordReset} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">New Secret Access Key</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                            <Key size={18} />
                                        </div>
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Min. 6 alphanumeric"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 pr-16 text-white font-bold tracking-widest focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => !resetting && setResetModalOpen(false)}
                                        className="flex-1 py-4.5 rounded-2xl bg-white/5 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/10 border border-white/10 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={resetting}
                                        className="flex-2 py-4.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {resetting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldCheck size={16} />
                                                <span>Authorize Reset</span>
                                            </>
                                        )}
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
