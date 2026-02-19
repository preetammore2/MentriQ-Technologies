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
            <div className="grid grid-cols-6 gap-2 mt-2">
                {iconList.map(iconName => {
                    const Icon = Icons[iconName] || Icons.Box;
                    return (
                        <button
                            key={iconName}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: iconName })}
                            className={`p-3 rounded-xl flex items-center justify-center transition-all ${formData.icon === iconName && formData.iconType === 'icon'
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

    const GRADIENTS = [
        { label: 'Ocean', value: 'from-blue-500 to-cyan-500' },
        { label: 'Purple', value: 'from-purple-500 to-pink-500' },
        { label: 'Sunset', value: 'from-orange-500 to-red-500' },
        { label: 'Emerald', value: 'from-green-500 to-emerald-500' },
        { label: 'Indigo', value: 'from-indigo-500 to-purple-500' },
        { label: 'Midnight', value: 'from-slate-700 to-slate-900' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#1e293b] p-8 rounded-3xl border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Services & Capabilities</h2>
                    <p className="text-gray-400 text-sm mt-1">Configure and manage platform service offerings.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {services.length === 0 && (
                        <button
                            onClick={syncDefaultServices}
                            disabled={isSyncing}
                            className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600/30 transition-all whitespace-nowrap active:scale-95"
                        >
                            <Icons.RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                            <span>{isSyncing ? "Syncing..." : "Sync Website Services"}</span>
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setEditingService(null);
                            setFormData(initialFormState);
                            setImagePreview(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                    >
                        <Icons.Plus size={18} />
                        <span>Add Service</span>
                    </button>
                </div>
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
                                    <td colSpan="4" className="px-6 py-32 text-center bg-white/5">
                                        <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-white/10 text-gray-600">
                                            <Icons.Layers size={40} />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">No Services Detected</h3>
                                        <p className="text-gray-500 mb-8 max-w-sm mx-auto font-bold text-xs uppercase tracking-widest leading-loose">The platform offerings are currently offline. Synchronize with website defaults or manually deploy a new service node.</p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <button
                                                onClick={syncDefaultServices}
                                                disabled={isSyncing}
                                                className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 justify-center shadow-xl shadow-white/5"
                                            >
                                                <Icons.RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                                                {isSyncing ? "Synchronizing..." : "Sync From Website"}
                                            </button>
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="bg-white/5 text-white border border-white/10 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 justify-center"
                                            >
                                                <Icons.Plus size={16} />
                                                Deploy Manual
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => {
                                    const isImage = service.icon.startsWith("http") || service.icon.startsWith("/") || service.icon.startsWith("data:");
                                    const Icon = !isImage ? (Icons[service.icon] || Icons.Box) : null;

                                    return (
                                        <tr key={service._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg overflow-hidden bg-gradient-to-br ${service.color || 'from-indigo-500 to-purple-500'}`}>
                                                    {isImage ? (
                                                        <img
                                                            src={resolveImageUrl(service.icon)}
                                                            alt={service.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/40?text=Srvc"; }}
                                                        />
                                                    ) : (
                                                        <Icon size={20} />
                                                    )}
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
                            className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent shrink-0">
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">{editingService ? "Update System" : "Integrate Service"}</h2>
                                    <p className="text-gray-500 text-xs mt-1 font-bold uppercase tracking-widest">Global Offering Config</p>
                                </div>
                                <button onClick={closeModal} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"><Icons.X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Icon Representation</label>
                                        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, iconType: 'icon' })}
                                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${formData.iconType === 'icon' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                Standard Icon
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, iconType: 'image' })}
                                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${formData.iconType === 'image' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                Custom Image
                                            </button>
                                        </div>
                                    </div>

                                    {formData.iconType === 'icon' ? (
                                        <IconSelector />
                                    ) : (
                                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Icons.Image className="text-gray-600" size={24} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
                                                />
                                                <p className="text-xs text-gray-600 mt-2">Upload a custom SVG, PNG, or JPG icon.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Display Title</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-600"
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
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-600 resize-none leading-relaxed"
                                        placeholder="Describe the service complexity..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Key Features (One per line)</label>
                                    <textarea
                                        rows={4}
                                        value={formData.features}
                                        onChange={e => setFormData({ ...formData, features: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-gray-600 resize-none leading-relaxed font-mono text-xs"
                                        placeholder="e.g. 24/7 Support&#10;Cloud Integration&#10;Security First"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Theme Gradient</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {GRADIENTS.map((gradient) => (
                                            <button
                                                key={gradient.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: gradient.value })}
                                                className={`relative p-3 rounded-xl border transition-all overflow-hidden group ${formData.color === gradient.value ? 'border-white ring-2 ring-indigo-500/50' : 'border-white/5 hover:border-white/20'}`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient.value} opacity-80 group-hover:opacity-100 transition-opacity`} />
                                                <span className="relative z-10 text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">{gradient.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end gap-3 items-center shrink-0">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={submitting}
                                        className="text-xs font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors bg-white/5 px-6 py-3 rounded-2xl hover:bg-white/10"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-8 py-3 rounded-[1rem] font-black bg-white text-black hover:bg-gray-200 shadow-2xl hover:scale-[1.05] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        {submitting ? <Icons.Loader2 size={20} className="animate-spin" /> : <Icons.Check size={20} strokeWidth={3} />}
                                        <span>{submitting ? "Saving..." : "Confirm Save"}</span>
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
