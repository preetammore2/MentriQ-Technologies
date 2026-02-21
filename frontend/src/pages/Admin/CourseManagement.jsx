import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, BookOpen, Search, X, Check, DollarSign, Clock, BarChart, Image as ImageIcon, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    const initialFormState = {
        title: "",
        slug: "",
        description: "",
        category: "",
        level: "Beginner",
        price: "",
        discount: 0,
        duration: "",
        mode: "Online",
        modules: [],
        instructor: "MentriQ Team",
        syllabusUrl: "",
        brochureUrl: "",
        thumbnailUrl: "",
        thumbnailFile: null
    };
    const [formData, setFormData] = useState(initialFormState);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get("/courses");
            setCourses(data);
        } catch (err) {
            toast.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchCourses();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this course permanently?")) return;
        try {
            await api.delete(`/courses/${id}`);
            toast.success("Course deleted");
            setCourses(courses.filter(c => c._id !== id));
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, thumbnailFile: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let finalThumbnailUrl = formData.thumbnailUrl;

            // Upload Image if selected
            if (formData.thumbnailFile) {
                const uploadData = new FormData();
                uploadData.append("image", formData.thumbnailFile);

                try {
                    const uploadRes = await api.post("/upload", uploadData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    finalThumbnailUrl = uploadRes.data.imageUrl;
                } catch (uploadError) {
                    console.error("Upload failed", uploadError);
                    toast.error("Image upload failed");
                    setSubmitting(false);
                    return;
                }
            }

            const payload = {
                ...formData,
                price: Number(formData.price),
                discount: Number(formData.discount),
                thumbnailUrl: finalThumbnailUrl,
                modules: typeof formData.modules === 'string'
                    ? formData.modules.split('\n').filter(m => m.trim())
                    : formData.modules || []
            };
            delete payload.thumbnailFile; // Don't send file object to API

            if (editingCourse) {
                await api.put(`/courses/${editingCourse._id}`, payload);
                toast.success("Course updated");
            } else {
                await api.post("/courses", payload);
                toast.success("Course created");
            }
            closeModal();
            fetchCourses();
        } catch (err) {
            const msg = err.response?.data?.message || "Operation failed";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            slug: course.slug || "",
            description: course.description,
            category: course.category,
            level: course.level,
            price: course.price,
            discount: course.discount || 0,
            duration: course.duration,
            mode: course.mode || "Online",
            modules: course.modules?.join('\n') || "",
            instructor: course.instructor || "MentriQ Team",
            syllabusUrl: course.syllabusUrl || "",
            brochureUrl: course.brochureUrl || "",
            thumbnailUrl: course.thumbnailUrl || "",
            thumbnailFile: null
        });
        setImagePreview(resolveImageUrl(course.thumbnailUrl));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
        setFormData(initialFormState);
        setImagePreview(null);
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[#1e293b] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl">
                <div className="w-full lg:w-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Course Management</h2>
                    <p className="text-gray-400 text-xs md:text-sm mt-1">Manage curriculum, pricing, and course details.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center group focus-within:border-indigo-500/50 transition-all w-full sm:w-auto">
                        <Search className="text-gray-500 ml-4 shrink-0" size={18} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-gray-500 focus:outline-none py-3 px-4 w-full sm:w-64 font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingCourse(null);
                            setFormData(initialFormState);
                            setImagePreview(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap w-full sm:w-auto"
                    >
                        <Plus size={18} />
                        <span>Add Course</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-16 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <BookOpen size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Courses Found</h3>
                    <p className="text-gray-400 mb-6">We couldn't find any courses matching your search.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <Plus size={18} />
                        Create First Course
                    </button>
                </div>
            ) : (
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Course info</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Level</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Pricing</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {filteredCourses.map((course) => (
                                        <motion.tr
                                            key={course._id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                        <img
                                                            src={resolveImageUrl(course.thumbnailUrl)}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => e.target.src = "https://via.placeholder.com/64?text=Course"}
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-white truncate max-w-[200px]">{course.title}</div>
                                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{course.duration} • {course.mode}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-gray-400 text-sm">{course.category}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${course.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' :
                                                    course.level === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/10' :
                                                        'bg-rose-500/10 text-rose-400 border-rose-500/10'
                                                    }`}>
                                                    {course.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-sm">₹{course.price.toLocaleString()}</span>
                                                    {course.discount > 0 && (
                                                        <span className="text-[10px] text-emerald-500 font-bold">-{course.discount}% OFF</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(course)}
                                                        className="p-2.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                                                        title="Edit Course"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course._id)}
                                                        className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                        title="Delete Course"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col max-h-[92vh]"
                        >
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent shrink-0">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">{editingCourse ? "Update Protocol" : "Initialize Module"}</h2>
                                    <p className="text-gray-500 text-[10px] mt-1 font-black uppercase tracking-[0.2em]">Curriculum Deployment Interface</p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Curriculum Designation</label>
                                        <div className="relative group">
                                            <BookOpen size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-gray-700 uppercase tracking-tight italic"
                                                placeholder="Enter Program Title"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Asset Identity (Thumbnail)</label>
                                        <div className="flex items-center gap-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                                            <div className="w-32 h-32 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative group">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                ) : (
                                                    <ImageIcon className="text-gray-600" size={40} />
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Plus className="text-white" size={24} />
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="relative overflow-hidden cursor-pointer group inline-block">
                                                    <button type="button" className="px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all group-hover:scale-105 active:scale-95 shadow-xl">
                                                        Inject Stream
                                                    </button>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">
                                                    Recommended: 1280x720 • HD RATIO <br /> JPG, PNG or WEBP format.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Curriculum Synopsys</label>
                                        <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-gray-700 resize-none leading-relaxed" placeholder="Detailed syllabus or overview..." />
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Learning Nodes (One per line)</label>
                                        <textarea rows={5} value={formData.modules} onChange={e => setFormData({ ...formData, modules: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-gray-700 resize-none leading-relaxed" placeholder="Module 1: Introduction&#10;Module 2: Advanced Concepts" />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Lead Instructor</label>
                                        <div className="relative group">
                                            <Users size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-700" placeholder="Lead Instructor Name" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Program Domain</label>
                                        <div className="relative group">
                                            <BarChart size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-700" placeholder="e.g. Technology" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Aptitude Level</label>
                                        <div className="relative group">
                                            <select value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all bg-[#0f172a] appearance-none cursor-pointer">
                                                <option value="Beginner">Entry Level</option>
                                                <option value="Intermediate">Strategic Growth</option>
                                                <option value="Advanced">Elite Mastery</option>
                                            </select>
                                            <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-white transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Tuition Fees (INR)</label>
                                        <div className="relative group">
                                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                            <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-700" placeholder="0" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Deployment Timeline</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                            <input required value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-700" placeholder="e.g. 12 Weeks" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Execution Mode</label>
                                        <div className="relative group">
                                            <select value={formData.mode} onChange={e => setFormData({ ...formData, mode: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-6 text-white font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all bg-[#0f172a] appearance-none cursor-pointer">
                                                <option value="Online">Remote Direct</option>
                                                <option value="Offline">Physical Mesh</option>
                                                <option value="Hybrid">Hybrid Sync</option>
                                            </select>
                                            <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 flex justify-end gap-10 items-center shrink-0">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={submitting}
                                        className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-16 py-5 rounded-2xl font-black bg-white text-black hover:bg-gray-200 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:scale-[1.05] active:scale-95 transition-all text-xs uppercase tracking-[0.2em] flex items-center gap-4 disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={4} />}
                                        <span>{submitting ? "Saving..." : "Confirm Deployment"}</span>
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

export default CourseManagement;
