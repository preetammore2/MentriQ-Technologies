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
    ChevronDown,
    ExternalLink,
    Briefcase,
    Building2,
    Check,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const MotionDiv = motion.div;

const EnquiryManagement = () => {
    const [activeTab, setActiveTab] = useState('contact');
    const [inquiries, setInquiries] = useState([]);
    const [enquiries, setEnquiries] = useState([]); // Recruit enquiries
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedRecruitEnquiry, setSelectedRecruitEnquiry] = useState(null);
    const toast = useToast();

    const fetchInquiries = async () => {
        try {
            const { data } = await api.get('/contact');
            setInquiries(data);
        } catch (error) {
            console.error("Failed to fetch inquiries:", error);
        }
    };

    const fetchRecruitEnquiries = async () => {
        try {
            const { data } = await api.get("/recruit");
            setEnquiries(data.data || []);
        } catch (err) {
            console.error("Failed to load recruit enquiries:", err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchInquiries(), fetchRecruitEnquiries()]);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Contact Handlers
    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/contact/${id}/read`);
            setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, isRead: true } : inq));
            toast.success("Marked as read");
        } catch (error) {
            toast.error("Failed to mark as read");
        }
    };

    const handleDeleteContact = async (id) => {
        if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
        try {
            await api.delete(`/contact/${id}`);
            setInquiries(inquiries.filter(inq => inq._id !== id));
            toast.success("Inquiry deleted");
        } catch (error) {
            toast.error("Failed to delete inquiry");
        }
    };

    // Recruit Handlers
    const handleDeleteRecruit = async (id) => {
        if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
        try {
            await api.delete(`/recruit/${id}`);
            setEnquiries((prev) => prev.filter((e) => e._id !== id));
            toast.success("Enquiry deleted");
            if (selectedRecruitEnquiry?._id === id) setSelectedRecruitEnquiry(null);
        } catch (err) {
            toast.error("Failed to delete enquiry");
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const { data } = await api.put(`/recruit/${id}`, { status: newStatus });
            setEnquiries((prev) => prev.map((e) => e._id === id ? data.data : e));
            toast.success(`Status updated to ${newStatus}`);
            if (selectedRecruitEnquiry?._id === id) {
                setSelectedRecruitEnquiry(data.data);
            }
        } catch (err) {
            toast.error("Failed to update status");
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

    const filteredRecruitEnquiries = enquiries.filter((e) =>
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

    if (loading && inquiries.length === 0 && enquiries.length === 0) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <MessageSquare size={120} />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">Enquiry Panel</h2>
                    <p className="text-gray-400 text-sm mt-1 uppercase font-bold tracking-widest opacity-60">Central Intelligence Hub for Leads & Messages</p>
                </div>

                <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/5 relative z-10">
                    <button
                        onClick={() => { setActiveTab('contact'); setSearchTerm(''); setFilter('all'); }}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'contact'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        General Inquiries
                    </button>
                    <button
                        onClick={() => { setActiveTab('recruit'); setSearchTerm(''); setFilter('all'); }}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'recruit'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Recruitment
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 shadow-xl">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder={activeTab === 'contact' ? "Search by user, email, or subject..." : "Search companies or agents..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                    />
                </div>
                {activeTab === 'contact' && (
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
                )}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {activeTab === 'contact' ? (
                    <MotionDiv
                        key="contact-tab"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl"
                    >
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
                                    {filteredInquiries.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-16 text-center">
                                                <Mail size={32} className="text-gray-600 mx-auto mb-4" />
                                                <h3 className="text-white font-bold mb-1">No Inquiries Found</h3>
                                                <p className="text-gray-500 text-xs">All channels are quiet.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredInquiries.map((inq) => (
                                            <tr
                                                key={inq._id}
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
                                                        {inq.isRead ? 'Processed' : 'Awaiting'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {!inq.isRead && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(inq._id)}
                                                                className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm outline-none"
                                                                title="Mark as Processed"
                                                            >
                                                                <CheckCircle size={16} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteContact(inq._id)}
                                                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm outline-none"
                                                            title="Purge Record"
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
                    </MotionDiv>
                ) : (
                    <MotionDiv
                        key="recruit-tab"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Recruit List */}
                        <div className="lg:col-span-1 space-y-4">
                            {filteredRecruitEnquiries.length === 0 ? (
                                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-16 text-center">
                                    <Briefcase size={40} className="text-gray-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">No Leads</h3>
                                    <p className="text-gray-400">Recruitment requests will appear here.</p>
                                </div>
                            ) : (
                                filteredRecruitEnquiries.map((enquiry) => (
                                    <div
                                        key={enquiry._id}
                                        onClick={() => setSelectedRecruitEnquiry(enquiry)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedRecruitEnquiry?._id === enquiry._id
                                            ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                                            : 'bg-[#1e293b] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider border ${getStatusColor(enquiry.status)}`}>
                                                {enquiry.status}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">
                                                {new Date(enquiry.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="text-white font-black truncate text-lg uppercase tracking-tight">{enquiry.company}</h4>
                                        <div className="text-sm text-gray-400 flex items-center gap-2 mt-2 font-medium">
                                            <User size={14} className="text-indigo-400" />
                                            {enquiry.name}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Recruit Detail View */}
                        <div className="lg:col-span-2">
                            {selectedRecruitEnquiry ? (
                                <MotionDiv
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={selectedRecruitEnquiry._id}
                                    className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 sticky top-6 shadow-2xl"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="text-3xl font-black text-white tracking-tight mb-2 italic uppercase">{selectedRecruitEnquiry.company}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm mt-4">
                                                <span className="flex items-center gap-2 text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5 font-bold uppercase tracking-widest text-[10px]">
                                                    <User size={14} className="text-indigo-400" />
                                                    {selectedRecruitEnquiry.name}
                                                </span>
                                                <span className="flex items-center gap-2 text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5 font-bold uppercase tracking-widest text-[10px]">
                                                    <Mail size={14} className="text-indigo-400" />
                                                    {selectedRecruitEnquiry.email}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteRecruit(selectedRecruitEnquiry._id)}
                                            className="p-3 bg-red-500/10 text-red-500/50 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                            title="Expunge Lead"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/50 mb-3">Resource Requirements</div>
                                                <p className="text-white font-bold leading-relaxed">{selectedRecruitEnquiry.hiringNeeds}</p>
                                            </div>
                                            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/50 mb-3">Classification</div>
                                                <div className="relative group">
                                                    <select
                                                        value={selectedRecruitEnquiry.status}
                                                        onChange={(e) => handleStatusUpdate(selectedRecruitEnquiry._id, e.target.value)}
                                                        className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer appearance-none transition-all group-hover:border-white/20"
                                                    >
                                                        <option value="pending">Awaiting Intel</option>
                                                        <option value="viewed">Intel Accessed</option>
                                                        <option value="contacted">Link Established</option>
                                                        <option value="closed">Protocol Terminated</option>
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-white transition-colors" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/50 mb-3 ml-1">Mission Briefing</div>
                                            <div className="bg-black/20 border border-white/5 rounded-2xl p-6 text-gray-300 leading-relaxed font-medium italic">
                                                "{selectedRecruitEnquiry.message || "No additional briefing provided."}"
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4">
                                            <a
                                                href={`mailto:${selectedRecruitEnquiry.email}`}
                                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                                            >
                                                <Mail size={18} />
                                                Transmit Reply
                                            </a>
                                            {selectedRecruitEnquiry.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedRecruitEnquiry._id, 'viewed')}
                                                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all border border-white/10"
                                                >
                                                    <Check size={18} />
                                                    Confirm Access
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </MotionDiv>
                            ) : (
                                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-500 bg-[#1e293b] border border-white/5 rounded-3xl p-8 border-dashed relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03),transparent)]" />
                                    <Briefcase size={48} className="mb-4 opacity-20 relative z-10" />
                                    <p className="font-black uppercase tracking-[0.2em] text-xs relative z-10">Select target profile for briefing</p>
                                </div>
                            )}
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EnquiryManagement;
