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
                            <UserCog size={28} className="text-emerald-600" />
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personnel Registry</h2>
                            <span className="ml-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 text-xs font-bold">
                                {staffUsers.length} Authorized
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium text-sm">System-wide access control and administrative entity management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
                            <Search className="text-slate-400 ml-4 group-focus-within:text-emerald-500 transition-colors" size={18} />
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

            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-emerald-100/50" />
                <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-8 flex items-center gap-3 relative z-10">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    Elevation Protocol
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-6 items-center relative z-10">
                    <div className="relative group">
                        <UserRound size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                        <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Select Candidate to Promote...</option>
                            {students.map((u) => (
                                <option key={u._id} value={u._id} className="text-slate-900 font-medium">{u.name} ({u.email})</option>
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <button
                        onClick={() => grantFromStudent("moderator")}
                        disabled={!selectedStudentId}
                        className="px-8 py-6 rounded-2xl text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-all disabled:opacity-30 uppercase tracking-widest shadow-sm"
                    >
                        Moderator Status
                    </button>
                    <button
                        onClick={() => grantFromStudent("admin")}
                        disabled={!selectedStudentId}
                        className="px-8 py-6 rounded-2xl text-[10px] font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-30 uppercase tracking-widest shadow-md shadow-emerald-600/10"
                    >
                        Admin Privilege
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Staff User</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Role</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStaff.map((user) => {
                                const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;
                                const isPending = updatingId === user._id;
                                return (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                                                    <UserRound size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-slate-900 font-bold text-sm tracking-tight">{user.name}</div>
                                                    <div className="text-slate-400 text-xs font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${user.role === "admin"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                }`}>
                                                {user.role === "admin" ? <ShieldCheck size={10} /> : <UserCog size={10} />}
                                                {user.role}
                                            </span>
                                            {isSuperAdmin && (
                                                <div className="ml-3 text-[10px] text-amber-600 font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
                                                    <Lock size={12} className="text-amber-500" />
                                                    Super Admin
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => openResetModal(user)}
                                                    className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200"
                                                    title="Reset Password"
                                                >
                                                    <Key size={16} />
                                                </button>
                                                {!isSuperAdmin && (
                                                    <button
                                                        onClick={() => handleRoleUpdate(user._id, "student")}
                                                        disabled={isPending}
                                                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-40"
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
                            className="bg-white border border-slate-200 rounded-[3rem] p-10 w-full max-w-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Security Override</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Credential Re-initialization</p>
                                </div>
                                <button
                                    onClick={() => setResetModalOpen(false)}
                                    className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl mb-10">
                                <p className="text-rose-700 text-xs font-medium leading-relaxed">
                                    Injecting new credentials for <strong className="font-bold underline italic text-rose-800">{selectedUserForReset?.name}</strong>.
                                    This operation will immediately invalidate current session access.
                                </p>
                            </div>

                            <form onSubmit={handlePasswordReset} className="space-y-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">New Access Key</label>
                                    <div className="relative group">
                                        <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 pl-16 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300"
                                            placeholder="Min. 6 characters required"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setResetModalOpen(false)}
                                        className="flex-1 py-4.5 rounded-2xl bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 border border-slate-200 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={resetting}
                                        className="flex-2 py-4.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {resetting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                                        <span>Update Protocol</span>
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
