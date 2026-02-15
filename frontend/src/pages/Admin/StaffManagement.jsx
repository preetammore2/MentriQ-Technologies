import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { ShieldCheck, Search, UserRound, UserCog, Lock, Download } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const SUPER_ADMIN_EMAIL = "admin@mentriqtechnologies.in";

const StaffManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState("");
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
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
                    >
                        <option value="">Select student</option>
                        {students.map((u) => (
                            <option key={u._id} value={u._id}>{u.name} - {u.email}</option>
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
                                                    Protected Super Admin
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleRoleUpdate(user._id, "moderator")}
                                                    disabled={isSuperAdmin || isPending}
                                                    className="px-3 py-2 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition disabled:opacity-40"
                                                >
                                                    Moderator
                                                </button>
                                                <button
                                                    onClick={() => handleRoleUpdate(user._id, "admin")}
                                                    disabled={isSuperAdmin || isPending}
                                                    className="px-3 py-2 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition disabled:opacity-40"
                                                >
                                                    Admin
                                                </button>
                                                <button
                                                    onClick={() => handleRoleUpdate(user._id, "student")}
                                                    disabled={isSuperAdmin || isPending}
                                                    className="px-3 py-2 rounded-lg text-xs font-bold bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition disabled:opacity-40"
                                                >
                                                    Revoke
                                                </button>
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
        </div>
    );
};

export default StaffManagement;
