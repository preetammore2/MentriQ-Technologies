import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const toast = useToast();

    const initialFormState = {
        title: "",
        description: "",
        icon: "Box"
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchServices = async () => {
        try {
            const { data } = await api.get("/services/admin"); // Using admin endpoint to get all services
            setServices(data);
        } catch (err) {
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchServices();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await api.delete(`/services/${id}`);
            toast.success("Service deleted");
            fetchServices();
        } catch (err) {
            toast.error("Failed to delete service");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingService) {
                await api.put(`/services/${editingService._id}`, formData);
                toast.success("Service updated");
            } else {
                await api.post("/services", formData);
                toast.success("Service created");
            }
            setIsModalOpen(false);
            setEditingService(null);
            setFormData(initialFormState);
            fetchServices();
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description,
            icon: service.icon
        });
        setIsModalOpen(true);
    };

    // Icon Selector
    const IconSelector = () => {
        const iconList = ['Globe', 'Smartphone', 'Code', 'Server', 'Shield', 'Database', 'Cloud', 'PenTool', 'Megaphone', 'Cpu', 'Layers', 'Zap'];

        return (
            <div className="grid grid-cols-6 gap-2 mt-2">
                {iconList.map(iconName => {
                    const Icon = Icons[iconName] || Icons.Box;
                    return (
                        <button
                            key={iconName}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: iconName })}
                            className={`p-3 rounded-xl flex items-center justify-center transition-all ${formData.icon === iconName
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section - Simplified */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Services & Capabilities</h2>
                    <p className="text-gray-400 text-sm mt-1">Configure and manage platform service offerings.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingService(null);
                        setFormData(initialFormState);
                        setIsModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                >
                    <Icons.Plus size={18} />
                    <span>Add Service</span>
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Icon</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Service Title</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Description</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">Loading Services...</p>
                                    </td>
                                </tr>
                            ) : services.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10 text-gray-600">
                                            <Icons.Layers size={24} />
                                        </div>
                                        <h3 className="text-white font-bold mb-1">No Services Found</h3>
                                        <button onClick={() => setIsModalOpen(true)} className="text-indigo-400 text-xs font-bold hover:text-indigo-300">Create First Service</button>
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => {
                                    const Icon = Icons[service.icon] || Icons.Box;
                                    return (
                                        <tr key={service._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-500/10">
                                                    <Icon size={20} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-white text-sm uppercase tracking-wide italic">{service.title}</div>
                                                <div className="text-[10px] text-gray-500 font-mono mt-0.5">{service._id.slice(-8).toUpperCase()}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-gray-400 text-xs line-clamp-2 max-w-lg leading-relaxed">{service.description}</p>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(service)}
                                                        className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all shadow-sm outline-none"
                                                        title="Edit Service"
                                                    >
                                                        <Icons.Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(service._id)}
                                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm outline-none"
                                                        title="Delete Service"
                                                    >
                                                        <Icons.Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col"
                        >
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{editingService ? "Update System" : "Integrate Service"}</h2>
                                    <p className="text-gray-500 text-sm mt-1 font-bold uppercase tracking-widest">Global Offering Config</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"><Icons.X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Icon Identifier</label>
                                    <IconSelector />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Display Title</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-600"
                                        placeholder="Service Title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Explanatory Brief</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-600 resize-none leading-relaxed"
                                        placeholder="Describe the service complexity..."
                                    />
                                </div>

                                <div className="pt-8 flex justify-end gap-6 items-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors bg-white/5 px-10 py-5 rounded-2xl hover:bg-white/10"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-12 py-5 rounded-[1.5rem] font-black bg-white text-black hover:bg-gray-200 shadow-2xl hover:scale-[1.05] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center gap-3"
                                    >
                                        <Icons.Check size={20} strokeWidth={3} />
                                        <span>Confirm Save</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ServiceManagement;
