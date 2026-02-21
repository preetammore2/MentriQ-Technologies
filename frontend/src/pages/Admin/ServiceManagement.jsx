import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const FALLBACK_SERVICES = [
    {
        icon: "Globe",
        title: 'Web Development',
        description: 'Custom, high-performance websites built with modern technologies like React, Next.js, and Node.js.',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: "Smartphone",
        title: 'App Development',
        description: 'Native and cross-platform mobile applications for iOS and Android using Flutter and React Native.',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: "Palette",
        title: 'UI/UX Design',
        description: 'User-centric design solutions that enhance engagement and provide seamless digital experiences.',
        color: 'from-orange-500 to-red-500'
    },
    {
        icon: "Megaphone",
        title: 'Digital Marketing',
        description: 'Strategic marketing campaigns including SEO, social media, and PPC to grow your online presence.',
        color: 'from-green-500 to-emerald-500'
    }
];

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const toast = useToast();

    // Form State
    const initialFormState = {
        title: "",
        description: "",
        icon: "Box", // Default icon
        iconType: "icon", // 'icon' or 'image'
        iconFile: null,
        features: "", // New field
        color: "from-blue-500 to-cyan-500" // Default gradient
    };
    const [formData, setFormData] = useState(initialFormState);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchServices = async () => {
        try {
            const { data } = await api.get("/services/admin");
            setServices(data);
        } catch (err) {
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    const syncDefaultServices = async () => {
        setIsSyncing(true);
        try {
            const syncPromises = FALLBACK_SERVICES.map(s => api.post("/services", s));
            await Promise.all(syncPromises);
            toast.success("Synchronized website services to database");
            fetchServices();
        } catch (err) {
            toast.error("Sync failed: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        fetchServices();
        const interval = setInterval(fetchServices, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await api.delete(`/services/${id}`);
            toast.success("Service deleted");
            setServices(services.filter(s => s._id !== id));
        } catch (err) {
            toast.error("Failed to delete service");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, iconFile: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let finalIcon = formData.icon;

            // Handle Image Upload if 'image' type is selected and file exists
            if (formData.iconType === 'image' && formData.iconFile) {
                const uploadData = new FormData();
                uploadData.append("image", formData.iconFile);

                try {
                    const uploadRes = await api.post("/upload", uploadData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    finalIcon = uploadRes.data.imageUrl;
                } catch (uploadError) {
                    console.error("Upload failed", uploadError);
                    toast.error("Image upload failed");
                    setSubmitting(false);
                    return;
                }
            } else if (formData.iconType === 'image' && !formData.iconFile && editingService) {
                // If editing and kept existing image, finalIcon is already set to the URL
                // Verify it's not the default "Box" if we are in image mode
                if (finalIcon === "Box" || !finalIcon.includes("/")) {
                    // Fallback check: if user switched to image but provided nothing, this might be an issue.
                    // But usually, initial load sets the icon correctly.
                }
            }

            const payload = {
                title: formData.title,
                description: formData.description,
                icon: finalIcon,
                features: formData.features.split('\n').map(f => f.trim()).filter(f => f), // Convert newline to array
                color: formData.color
            };

            if (editingService) {
                await api.put(`/services/${editingService._id}`, payload);
                toast.success("Service updated");
            } else {
                await api.post("/services", payload);
                toast.success("Service created");
            }
            closeModal();
            fetchServices();
        } catch (err) {
            toast.error("Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);

        // Determine if current icon is an image URL or Lucide icon name
        const isImage = service.icon.startsWith("http") || service.icon.startsWith("/") || service.icon.startsWith("data:");

        setFormData({
            title: service.title,
            description: service.description,
            icon: service.icon,
            iconType: isImage ? "image" : "icon",
            iconFile: null,
            features: Array.isArray(service.features) ? service.features.join('\n') : "", // Convert array to newline string
            color: service.color || "from-blue-500 to-cyan-500"
        });

        if (isImage) {
            setImagePreview(resolveImageUrl(service.icon));
        } else {
            setImagePreview(null);
        }

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setFormData(initialFormState);
        setImagePreview(null);
    };

    // Icon Selector Component
    const IconSelector = () => {
        const iconList = ['Globe', 'Smartphone', 'Code', 'Server', 'Shield', 'Database', 'Cloud', 'PenTool', 'Megaphone', 'Cpu', 'Layers', 'Zap'];

        return (
            <div className="grid grid-cols-6 gap-3 mt-3">
                {iconList.map(iconName => {
                    const Icon = Icons[iconName] || Icons.Box;
                    return (
                        <button
                            key={iconName}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: iconName })}
                            className={`p-4 rounded-xl flex items-center justify-center transition-all border ${formData.icon === iconName && formData.iconType === 'icon'
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                                : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <Icon size={20} />
                        </button>
                    );
                })}
            </div>
        );
    };

    const GRADIENTS = [
        { label: 'Ocean', value: 'from-blue-500 to-cyan-500' },
        { label: 'Purple', value: 'from-purple-500 to-pink-500' },
        { label: 'Sunset', value: 'from-orange-500 to-red-500' },
        { label: 'Emerald', value: 'from-green-500 to-emerald-500' },
        { label: 'Indigo', value: 'from-indigo-500 to-purple-500' },
        { label: 'Midnight', value: 'from-slate-700 to-slate-900' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <Layers size={28} className="text-indigo-600" />
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Services & Capabilities</h2>
                        <span className="ml-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 text-xs font-bold">
                            {services.length} Active
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">Configure and manage platform service offerings.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto relative z-10">
                    {services.length === 0 && (
                        <button
                            onClick={syncDefaultServices}
                            disabled={isSyncing}
                            className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-100 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap shadow-sm"
                        >
                            <Icons.RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                            <span>{isSyncing ? "Syncing..." : "Sync Global Services"}</span>
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setEditingService(null);
                            setFormData(initialFormState);
                            setImagePreview(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap text-[10px] uppercase tracking-widest"
                    >
                        <Icons.Plus size={18} />
                        <span>Deploy New Service</span>
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Service Identifier</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Core Identity</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Functional Description</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Commands</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Loading Service Registry...</p>
                                    </td>
                                </tr>
                            ) : services.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-32 text-center bg-white">
                                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 text-slate-200 shadow-inner">
                                            <Icons.Layers size={48} />
                                        </div>
                                        <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Platform Offering Offline</h3>
                                        <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium text-sm leading-relaxed">The platform services layer is currently void. Initialize from defaults or deploy a manual node.</p>
                                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                            <button
                                                onClick={syncDefaultServices}
                                                disabled={isSyncing}
                                                className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all flex items-center gap-3 justify-center shadow-lg shadow-indigo-600/20"
                                            >
                                                <Icons.RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                                                {isSyncing ? "Synchronizing Hub..." : "Sync Global Nodes"}
                                            </button>
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="bg-slate-50 text-slate-600 border border-slate-200 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-3 justify-center"
                                            >
                                                <Icons.Plus size={18} />
                                                Manual Initialize
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => {
                                    const isImage = service.icon.startsWith("http") || service.icon.startsWith("/") || service.icon.startsWith("data:");
                                    const Icon = !isImage ? (Icons[service.icon] || Icons.Box) : null;

                                    return (
                                        <tr key={service._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md overflow-hidden bg-gradient-to-br border border-white/20 p-3 group-hover:scale-110 transition-transform ${service.color || 'from-indigo-500 to-purple-500'}`}>
                                                    {isImage ? (
                                                        <img
                                                            src={resolveImageUrl(service.icon)}
                                                            alt={service.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/40?text=Srvc"; }}
                                                        />
                                                    ) : (
                                                        <Icon size={24} />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-extrabold text-slate-900 tracking-tight text-base mb-1">{service.title}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol ID</span>
                                                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                                                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{service._id.slice(-8).toUpperCase()}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-slate-500 text-sm font-medium line-clamp-2 max-w-md leading-relaxed">{service.description}</p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => handleEdit(service)}
                                                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200 hover:border-indigo-100"
                                                        title="Refine Capability"
                                                    >
                                                        <Icons.Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(service._id)}
                                                        className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                                                        title="Terminate Capability"
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
                            className="bg-white border border-slate-200 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh]"
                        >
                            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{editingService ? "Configure System" : "Onboard Capability"}</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Service Infrastructure Hub</p>
                                </div>
                                <button onClick={closeModal} className="w-12 h-12 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-slate-200 flex items-center justify-center shrink-0">
                                    <Icons.X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-10 overflow-y-auto custom-scrollbar flex-1">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Icon Representation</label>
                                        <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-200">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, iconType: 'icon' })}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.iconType === 'icon' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
                                            >
                                                Standard Icon
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, iconType: 'image' })}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.iconType === 'image' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
                                            >
                                                Custom Image
                                            </button>
                                        </div>
                                    </div>

                                    {formData.iconType === 'icon' ? (
                                        <IconSelector />
                                    ) : (
                                        <div className="flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500 bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
                                            <div className="w-24 h-24 bg-white rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner p-3">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                                ) : (
                                                    <Icons.Image className="text-slate-200" size={32} />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="w-full text-[10px] text-slate-400 file:mr-6 file:py-3 file:px-6 file:rounded-xl file:border-slate-200 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-white file:text-slate-600 hover:file:bg-slate-50 transition-all"
                                                />
                                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Recommended: Transparent PNG (64x64)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Capability Designation</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300"
                                        placeholder="e.g. Neural Architecture Design"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Functional Abstract</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300 resize-none leading-relaxed"
                                        placeholder="Detailed functional brief..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Module Features (New line per feature)</label>
                                    <textarea
                                        rows={4}
                                        value={formData.features}
                                        onChange={e => setFormData({ ...formData, features: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-slate-700 font-bold text-xs focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300 resize-none leading-loose uppercase tracking-widest"
                                        placeholder="DEPLOYMENT STRATEGY 2.0&#10;QUANTUM ENCRYPTION HUB&#10;REAL-TIME ANALYTICS CLOUD"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Visual Gradient Signature</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {GRADIENTS.map((gradient) => (
                                            <button
                                                key={gradient.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: gradient.value })}
                                                className={`relative p-5 rounded-2xl border transition-all overflow-hidden group ${formData.color === gradient.value ? 'border-indigo-600 ring-4 ring-indigo-500/5 shadow-md' : 'border-slate-100 hover:border-slate-300 bg-slate-50'}`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient.value} opacity-90 group-hover:opacity-100 transition-opacity`} />
                                                <span className="relative z-10 text-[9px] font-black text-white uppercase tracking-[0.2em] drop-shadow-md">{gradient.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-10 flex justify-end gap-6 items-center shrink-0 border-t border-slate-100 -mx-10 px-10 -mb-10 bg-slate-50/50 mt-10">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={submitting}
                                        className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.3em] transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 text-[10px] uppercase tracking-widest disabled:opacity-60"
                                    >
                                        {submitting ? <Icons.Loader2 size={18} className="animate-spin" /> : <Icons.Check size={18} strokeWidth={3} />}
                                        <span>{submitting ? "Commit Changes..." : "Confirm Deployment"}</span>
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
