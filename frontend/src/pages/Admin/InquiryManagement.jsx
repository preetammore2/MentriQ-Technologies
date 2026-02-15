import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../utils/apiClient';
import {
    Mail,
    Phone,
    User,
    MessageSquare,
    Calendar,
    Trash2,
    CheckCircle,
    Clock,
    Filter,
    Search,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InquiryManagement = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, read, unread

    useEffect(() => {
        fetchInquiries();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchInquiries();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const fetchInquiries = async () => {
        try {
            const { data } = await api.get('/contact');
            setInquiries(data);
        } catch (error) {
            console.error("Failed to fetch inquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/contact/${id}/read`);
            setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, isRead: true } : inq));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
        try {
            await api.delete(`/contact/${id}`);
            setInquiries(inquiries.filter(inq => inq._id !== id));
        } catch (error) {
            console.error("Failed to delete inquiry:", error);
        }
    };

    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch =
            inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.subject.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'read') return matchesSearch && inq.isRead;
        if (filter === 'unread') return matchesSearch && !inq.isRead;
        return matchesSearch;
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section - Simplified */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Inquiries</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage and respond to contact form submissions.</p>
                </div>
            </div>

            {/* Filters and Search - Simplified */}
            <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 shadow-xl">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
                    {['all', 'unread', 'read'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-lg font-bold capitalize transition-all text-xs tracking-wider ${filter === f
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sender</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subject & Message</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredInquiries.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center">
                                            <Mail size={32} className="text-gray-600 mx-auto mb-4" />
                                            <h3 className="text-white font-bold mb-1">No Inquiries Found</h3>
                                            <p className="text-gray-500 text-xs">All caught up with student messages.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInquiries.map((inq) => (
                                        <motion.tr
                                            key={inq._id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={`hover:bg-white/[0.02] transition-colors group ${!inq.isRead ? 'bg-indigo-500/[0.02]' : ''}`}
                                        >
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-white text-sm">{inq.name}</div>
                                                <div className="text-[10px] text-gray-500 font-bold tracking-wider mt-0.5">{inq.email}</div>
                                                <div className="text-[10px] text-indigo-400/70 mt-0.5">{inq.phone}</div>
                                            </td>
                                            <td className="px-6 py-5 max-w-md">
                                                <div className="font-bold text-gray-300 text-xs uppercase tracking-wider mb-1">{inq.subject}</div>
                                                <p className="text-gray-500 text-xs line-clamp-2 italic">"{inq.message}"</p>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500 text-[10px] font-bold uppercase whitespace-nowrap">
                                                {new Date(inq.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${inq.isRead ? 'bg-white/5 text-gray-500 border-white/5' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10 animate-pulse'}`}>
                                                    {inq.isRead ? 'Read' : 'Unread'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {!inq.isRead && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(inq._id)}
                                                            className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm outline-none"
                                                            title="Mark as Read"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(inq._id)}
                                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm outline-none"
                                                        title="Delete Inquiry"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InquiryManagement;
