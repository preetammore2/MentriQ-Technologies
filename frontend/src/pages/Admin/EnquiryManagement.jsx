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
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <MessageSquare size={28} className="text-emerald-600" />
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Intelligence Hub</h2>
                        <span className="ml-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 text-xs font-bold">
                            {inquiries.length + enquiries.length} signals
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">Central hub for general leads and recruitment queries.</p>
                </div>

                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 relative z-10">
                    <button
                        onClick={() => { setActiveTab('contact'); setSearchTerm(''); setFilter('all'); }}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'contact'
                            ? 'bg-white text-emerald-600 shadow-sm border border-slate-200'
                            : 'text-slate-500 hover:text-emerald-600 hover:bg-white'}`}
                    >
                        General inquiries
                    </button>
                    <button
                        onClick={() => { setActiveTab('recruit'); setSearchTerm(''); setFilter('all'); }}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'recruit'
                            ? 'bg-white text-emerald-600 shadow-sm border border-slate-200'
                            : 'text-slate-500 hover:text-emerald-600 hover:bg-white'}`}
                    >
                        Recruitment
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col lg:flex-row gap-6 shadow-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder={activeTab === 'contact' ? "Find inquiry..." : "Search recruitment leads..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-14 pr-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-300 transition-all font-medium text-sm"
                    />
                </div>
                {activeTab === 'contact' && (
                    <div className="flex gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200">
                        {['all', 'unread', 'read'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all text-xs capitalize ${filter === f
                                    ? 'bg-white text-emerald-600 shadow-sm border border-slate-200'
                                    : 'text-slate-500 hover:text-slate-700'
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
                        className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-700"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Sender</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Subject & Message</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Date</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredInquiries.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-24 text-center">
                                                <Mail size={48} className="text-slate-200 mx-auto mb-4" />
                                                <h3 className="text-slate-900 font-bold mb-1">No Inquiries Found</h3>
                                                <p className="text-slate-400 text-xs italic">All channels are quiet and processed.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredInquiries.map((inq) => (
                                            <tr
                                                key={inq._id}
                                                className={`hover:bg-slate-50/50 transition-colors group ${!inq.isRead ? 'bg-emerald-50/30' : ''}`}
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-slate-900 text-base tracking-tight">{inq.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">{inq.email}</div>
                                                    <div className="text-[10px] text-emerald-500 font-bold mt-1">{inq.phone}</div>
                                                </td>
                                                <td className="px-8 py-6 max-w-md">
                                                    <div className="font-bold text-slate-600 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                        {inq.subject}
                                                    </div>
                                                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed italic">"{inq.message}"</p>
                                                </td>
                                                <td className="px-8 py-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                    {new Date(inq.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${inq.isRead ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse'}`}>
                                                        {inq.isRead ? 'Processed' : 'Awaiting Intel'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        {!inq.isRead && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(inq._id)}
                                                                className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 shadow-sm"
                                                                title="Mark as Processed"
                                                            >
                                                                <CheckCircle size={16} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteContact(inq._id)}
                                                            className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
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
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* Recruit List */}
                        <div className="lg:col-span-1 space-y-4">
                            {filteredRecruitEnquiries.length === 0 ? (
                                <div className="bg-white border border-slate-200 border-dashed rounded-[2.5rem] p-16 text-center shadow-sm">
                                    <Briefcase size={40} className="text-slate-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">System Idle</h3>
                                    <p className="text-slate-400 text-sm italic">No recruitment signals detected.</p>
                                </div>
                            ) : (
                                filteredRecruitEnquiries.map((enquiry) => (
                                    <div
                                        key={enquiry._id}
                                        onClick={() => setSelectedRecruitEnquiry(enquiry)}
                                        className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative group overflow-hidden ${selectedRecruitEnquiry?._id === enquiry._id
                                            ? 'bg-white border-emerald-400 shadow-[0_20px_40px_-15px_rgba(79,70,229,0.1)] translate-x-1'
                                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(enquiry.status).replace('bg-amber-500/10', 'bg-amber-50').replace('text-amber-400', 'text-amber-700').replace('border-amber-500/10', 'border-amber-100').replace('bg-blue-500/10', 'bg-blue-50').replace('text-blue-400', 'text-blue-700').replace('border-blue-500/10', 'border-blue-100').replace('bg-emerald-500/10', 'bg-emerald-50').replace('text-emerald-400', 'text-emerald-700').replace('border-emerald-500/10', 'border-emerald-100').replace('bg-gray-500/10', 'bg-slate-50').replace('text-gray-400', 'text-slate-500').replace('border-gray-500/10', 'border-slate-200')}`}>
                                                {enquiry.status}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                {new Date(enquiry.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="text-slate-900 font-extrabold truncate text-lg tracking-tight relative z-10">{enquiry.company}</h4>
                                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-2 font-medium relative z-10">
                                            <User size={14} className="text-emerald-400" />
                                            {enquiry.name}
                                        </div>
                                        {selectedRecruitEnquiry?._id === enquiry._id && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-emerald-600 rounded-r-full" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Recruit Detail View */}
                        <div className="lg:col-span-2">
                            {selectedRecruitEnquiry ? (
                                <MotionDiv
                                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    key={selectedRecruitEnquiry._id}
                                    className="bg-white border border-slate-200 rounded-[3rem] p-10 sticky top-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -mr-32 -mt-32" />

                                    <div className="flex justify-between items-start mb-10 relative z-10">
                                        <div>
                                            <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase leading-none">{selectedRecruitEnquiry.company}</h3>
                                            <div className="flex flex-wrap gap-4 mt-6">
                                                <span className="flex items-center gap-2.5 text-slate-600 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-200 font-bold uppercase tracking-widest text-[10px] shadow-sm">
                                                    <User size={16} className="text-emerald-500" />
                                                    {selectedRecruitEnquiry.name}
                                                </span>
                                                <span className="flex items-center gap-2.5 text-slate-600 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-200 font-bold uppercase tracking-widest text-[10px] shadow-sm">
                                                    <Mail size={16} className="text-emerald-500" />
                                                    {selectedRecruitEnquiry.email}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteRecruit(selectedRecruitEnquiry._id)}
                                            className="p-3.5 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl border border-rose-100 transition-all shadow-sm"
                                            title="Expunge Lead"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-10 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] relative group">
                                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Resource Requirements
                                                </div>
                                                <p className="text-slate-800 font-bold leading-relaxed italic text-lg tracking-tight">"{selectedRecruitEnquiry.hiringNeeds}"</p>
                                            </div>
                                            <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem]">
                                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Classification
                                                </div>
                                                <div className="relative group">
                                                    <select
                                                        value={selectedRecruitEnquiry.status}
                                                        onChange={(e) => handleStatusUpdate(selectedRecruitEnquiry._id, e.target.value)}
                                                        className="w-full bg-white text-slate-900 border border-slate-200 rounded-2xl px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 cursor-pointer appearance-none transition-all shadow-sm"
                                                    >
                                                        <option value="pending">Awaiting Intel</option>
                                                        <option value="viewed">Intel Accessed</option>
                                                        <option value="contacted">Link Established</option>
                                                        <option value="closed">Protocol Terminated</option>
                                                    </select>
                                                    <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-emerald-600 transition-colors" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10">
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                Mission Briefing
                                            </div>
                                            <div className="text-slate-600 leading-relaxed font-medium italic text-base">
                                                "{selectedRecruitEnquiry.message || "No additional briefing provided."}"
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-4">
                                            <a
                                                href={`mailto:${selectedRecruitEnquiry.email}`}
                                                className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                                            >
                                                <Mail size={20} />
                                                Transmit Reply
                                            </a>
                                            {selectedRecruitEnquiry.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedRecruitEnquiry._id, 'viewed')}
                                                    className="px-10 py-5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-sm"
                                                >
                                                    <Check size={20} className="text-emerald-500" />
                                                    Confirm Access
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </MotionDiv>
                            ) : (
                                <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-300 bg-slate-50 border border-slate-200 border-dashed rounded-[3rem] p-12 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.03),transparent)]" />
                                    <div className="w-24 h-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:rotate-3">
                                        <Briefcase size={40} className="text-slate-200" />
                                    </div>
                                    <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400 relative z-10 text-center">Select target profile for complete briefing</p>
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
