import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Briefcase, Building2, Check, Mail, MessageSquare, Search, Trash2, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const MotionDiv = motion.div;

const RecruitManagement = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const toast = useToast();

    const fetchEnquiries = async () => {
        try {
            const { data } = await api.get("/recruit");
            setEnquiries(data.data || []);
        } catch (err) {
            toast.error("Failed to load enquiries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
        const interval = setInterval(fetchEnquiries, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
        try {
            await api.delete(`/recruit/${id}`);
            setEnquiries((prev) => prev.filter((e) => e._id !== id));
            toast.success("Enquiry deleted");
            if (selectedEnquiry?._id === id) setSelectedEnquiry(null);
        } catch (err) {
            toast.error("Failed to delete enquiry");
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const { data } = await api.put(`/recruit/${id}`, { status: newStatus });
            setEnquiries((prev) => prev.map((e) => e._id === id ? data.data : e));
            toast.success(`Status updated to ${newStatus}`);
            if (selectedEnquiry?._id === id) {
                setSelectedEnquiry(data.data);
            }
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const filteredEnquiries = enquiries.filter((e) =>
        e.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/10';
            case 'viewed': return 'bg-blue-500/10 text-blue-400 border-blue-500/10';
            case 'contacted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10';
            case 'closed': return 'bg-gray-500/10 text-gray-400 border-gray-500/10';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/10';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Hiring Enquiries</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage partnership requests and talent acquisition leads.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-4 flex items-center w-full md:w-auto group focus-within:border-indigo-500/50 transition-all">
                    <Search className="text-gray-500 ml-4" size={18} />
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent text-white placeholder:text-gray-500 focus:outline-none py-3 px-4 w-full md:w-64 font-medium text-sm"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5  border border-white/10 rounded-xl animate-pulse" />)}
                </div>
            ) : filteredEnquiries.length === 0 ? (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-16 text-center">
                    <Briefcase size={40} className="text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Enquiries Yet</h3>
                    <p className="text-gray-400">Hiring requests will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* List */}
                    <div className="lg:col-span-1 space-y-4">
                        {filteredEnquiries.map((enquiry) => (
                            <div
                                key={enquiry._id}
                                onClick={() => setSelectedEnquiry(enquiry)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedEnquiry?._id === enquiry._id
                                    ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                                    : 'bg-[#1e293b] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${getStatusColor(enquiry.status)}`}>
                                        {enquiry.status}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-medium">
                                        {new Date(enquiry.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="text-white font-bold truncate">{enquiry.company}</h4>
                                <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                    <User size={12} />
                                    {enquiry.name}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Detail View */}
                    <div className="lg:col-span-2">
                        {selectedEnquiry ? (
                            <MotionDiv
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={selectedEnquiry._id}
                                className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 sticky top-6 shadow-2xl"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-3xl font-black text-white tracking-tight mb-2">{selectedEnquiry.company}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <span className="flex items-center gap-2 text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                                <User size={14} className="text-indigo-400" />
                                                {selectedEnquiry.name}
                                            </span>
                                            <span className="flex items-center gap-2 text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                                <Mail size={14} className="text-indigo-400" />
                                                {selectedEnquiry.email}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(selectedEnquiry._id)}
                                        className="p-3 bg-red-500/10 text-red-500/50 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                        title="Delete Enquiry"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Hiring Needs</div>
                                            <p className="text-white font-medium">{selectedEnquiry.hiringNeeds}</p>
                                        </div>
                                        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Status</div>
                                            <select
                                                value={selectedEnquiry.status}
                                                onChange={(e) => handleStatusUpdate(selectedEnquiry._id, e.target.value)}
                                                className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="viewed">Viewed</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Additional Message</div>
                                        <div className="bg-black/20 border border-white/5 rounded-2xl p-6 text-gray-300 leading-relaxed">
                                            {selectedEnquiry.message || "No additional message provided."}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4">
                                        <a
                                            href={`mailto:${selectedEnquiry.email}`}
                                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                                        >
                                            <Mail size={18} />
                                            Reply via Email
                                        </a>
                                        {selectedEnquiry.status === 'pending' && (
                                            <button
                                                onClick={() => handleStatusUpdate(selectedEnquiry._id, 'viewed')}
                                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10"
                                            >
                                                <Check size={18} />
                                                Mark as Viewed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </MotionDiv>
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-500 bg-[#1e293b] border border-white/5 rounded-3xl p-8 border-dashed">
                                <MessageSquare size={48} className="mb-4 opacity-20" />
                                <p className="font-medium">Select an enquiry to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruitManagement;
