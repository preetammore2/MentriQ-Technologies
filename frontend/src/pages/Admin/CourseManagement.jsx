import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, BookOpen, Search, X, Check, DollarSign, Clock, BarChart, Image as ImageIcon, Loader2, ChevronDown, Users } from "lucide-react";
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <BookOpen size={28} className="text-emerald-600" />
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Curriculum Registry</h2>
                        <span className="ml-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 text-xs font-bold">
                            {courses.length} Active Modules
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">Manage curriculum, pricing, and course details.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl pr-6 flex items-center group focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
                        <Search className="text-slate-400 ml-4 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find a course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none py-3 px-4 w-full sm:w-64 font-bold text-sm tracking-tight"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingCourse(null);
                            setFormData(initialFormState);
                            setImagePreview(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span>Add Course</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-8 space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-slate-50 border border-slate-200 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-32 text-center group shadow-sm">
                    <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-emerald-100 text-emerald-600 shadow-sm">
                        <BookOpen size={48} />
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">No Courses Protocol</h3>
                    <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium text-sm leading-relaxed">The curriculum registry is currently offline. Manual deployment required.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-semibold flex items-center gap-3 justify-center hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/10 active:scale-95 mx-auto"
                    >
                        <Plus size={20} />
                        Initialize Curriculum
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Curriculum Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Domain</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Aptitude</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Tuition</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Commands</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence mode="popLayout">
                                    {filteredCourses.map((course) => (
                                        <motion.tr
                                            key={course._id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-1 group-hover:border-emerald-300 transition-all">
                                                        <img
                                                            src={resolveImageUrl(course.thumbnailUrl)}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover rounded-xl transition-transform group-hover:scale-110"
                                                            onError={(e) => e.target.src = "https://via.placeholder.com/64?text=Course"}
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-slate-900 text-base tracking-tight">{course.title}</div>
                                                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">{course.duration} • {course.mode}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-slate-600 text-sm font-medium">{course.category}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${course.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    course.level === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-rose-50 text-rose-700 border-rose-100'
                                                    }`}>
                                                    {course.level}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 font-bold text-sm">₹{course.price.toLocaleString()}</span>
                                                    {course.discount > 0 && (
                                                        <span className="text-[10px] text-emerald-500 font-bold mt-0.5">-{course.discount}% OFF</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => openEditModal(course)}
                                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200"
                                                        title="Refine Course"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course._id)}
                                                        className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                                                        title="Terminate Course"
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
                            className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                                        {editingCourse ? "Configure Module" : "Manifest Curriculum"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Registry Access Level: Academic Lead</p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-10 pb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 text-slate-500 uppercase tracking-[0.2em] ml-1">Identity Title</label>
                                            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300" placeholder="e.g. Masterclass in Quantum Engineering" />
                                        </div>

                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Asset Identity (Card Background)</label>
                                            <div className="relative group">
                                                <div className="w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group-hover:border-emerald-400 transition-all overflow-hidden relative">
                                                    {imagePreview ? (
                                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : formData.thumbnailUrl ? (
                                                        <img src={resolveImageUrl(formData.thumbnailUrl)} alt="Current" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <>
                                                            <ImageIcon size={40} className="text-slate-400 group-hover:text-emerald-500 transition-colors" strokeWidth={1.5} />
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inject Visual Asset</span>
                                                        </>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Curriculum Synopsys</label>
                                            <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300 resize-none leading-relaxed" placeholder="Detailed syllabus or overview..." />
                                        </div>

                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Learning Nodes (One per line)</label>
                                            <textarea rows={5} value={formData.modules} onChange={e => setFormData({ ...formData, modules: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300 resize-none leading-relaxed" placeholder="Module 1: Introduction&#10;Module 2: Advanced Concepts" />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Lead Instructor</label>
                                            <div className="relative group">
                                                <Users size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300" placeholder="Lead Instructor Name" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Program Domain</label>
                                            <div className="relative group">
                                                <BarChart size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300" placeholder="e.g. Technology" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Aptitude Level</label>
                                            <div className="relative group">
                                                <select required value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-8 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer">
                                                    <option value="Beginner">Beginner Tier</option>
                                                    <option value="Intermediate">Intermediate Tier</option>
                                                    <option value="Advanced">Elite Tier</option>
                                                </select>
                                                <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Temporal Duration</label>
                                            <div className="relative group">
                                                <Clock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input required value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300" placeholder="e.g. 12 Weeks" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Economic Value (₹)</label>
                                            <div className="relative group">
                                                <DollarSign size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300" placeholder="0.00" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Strike Price (Ref)</label>
                                            <div className="relative group">
                                                <X size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input type="number" value={formData.oldPrice} onChange={e => setFormData({ ...formData, oldPrice: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-14 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all placeholder:text-slate-300" placeholder="Original price..." />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4 shrink-0">
                                        <button type="button" onClick={closeModal} className="flex-1 py-4.5 rounded-2xl bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 border border-slate-200 transition-all">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={submitting} className="flex-2 py-4.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2">
                                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                            {editingCourse ? "Update Module" : "Confirm Manifestation"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseManagement;
