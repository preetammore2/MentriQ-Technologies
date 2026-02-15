import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../utils/apiClient';
import {
    Users,
    BookOpen,
    GraduationCap,
    Briefcase,
    TrendingUp,
    Clock,
    CheckCircle,
    Handshake,
    Save
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const MotionDiv = motion.div;

const Dashboard = () => {
    const toast = useToast();
    const [stats, setStats] = useState({
        users: 0,
        courses: 0,
        enrollments: 0,
        internships: 0,
        enrolledStudents: 0,
        partners: 0
    });
    const [statsForm, setStatsForm] = useState({
        students: '2K+',
        courses: '50+',
        placements: '98%',
        trainers: '60+'
    });
    const [savingStats, setSavingStats] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch public stats for main numbers and raw counts concurrently
                const [publicStats, usersRes, enrollmentsRes, internshipsRes] = await Promise.all([
                    api.get('/stats'),
                    api.get('/users'),
                    api.get('/enrollments'),
                    api.get('/internships')
                ]);

                const studentCount = usersRes.data.filter(u => u.role === 'student').length;

                setStats({
                    students: publicStats.data.students,
                    courses: publicStats.data.courses,
                    placements: publicStats.data.placements,
                    trainers: publicStats.data.trainers,
                    partners: publicStats.data.raw.partners,
                    rawStudents: studentCount,
                    enrolledStudents: publicStats.data.raw.enrolledStudents || 0,
                    totalUsers: usersRes.data.length,
                    enrollments: enrollmentsRes.data.length,
                    internships: internshipsRes.data.length
                });
                setStatsForm({
                    students: publicStats.data.students || '2K+',
                    courses: publicStats.data.courses || '50+',
                    placements: publicStats.data.placements || '98%',
                    trainers: publicStats.data.trainers || '60+'
                });
            } catch (error) {
                console.error("Dashboard stats error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleSaveStats = async (e) => {
        e.preventDefault();
        setSavingStats(true);
        try {
            const payload = {
                students: statsForm.students,
                courses: statsForm.courses,
                placements: statsForm.placements,
                trainers: statsForm.trainers
            };
            await api.put('/stats', payload);
            setStats((prev) => ({
                ...prev,
                students: payload.students,
                courses: payload.courses,
                placements: payload.placements,
                trainers: payload.trainers
            }));
            toast.success('Homepage stats updated');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update stats');
        } finally {
            setSavingStats(false);
        }
    };

    const cards = [
        { title: 'Community', value: stats.students, subValue: `${stats.enrolledStudents} Enrolled Students`, icon: Users, color: 'from-blue-500 to-indigo-600', glow: 'bg-blue-500/20' },
        { title: 'Course Library', value: stats.courses, subValue: 'Active Programs', icon: BookOpen, color: 'from-emerald-500 to-teal-600', glow: 'bg-emerald-500/20' },
        { title: 'Success Rate', value: stats.placements, subValue: 'Student Placements', icon: GraduationCap, color: 'from-purple-500 to-pink-600', glow: 'bg-purple-500/20' },
        { title: 'Hiring Network', value: stats.partners, subValue: 'Corporate Partners', icon: Handshake, color: 'from-amber-500 to-orange-600', glow: 'bg-amber-500/20' },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">Aggregating Intel...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-400 mt-1">Platform performance and student engagement metrics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <MotionDiv
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        className="bg-[#1e293b] border border-white/5 rounded-3xl p-6 relative overflow-hidden group shadow-xl"
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                                    <card.icon size={24} />
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                    Metric
                                </div>
                            </div>

                            <div className="text-4xl font-bold text-white mb-1 tracking-tight">
                                {card.value}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.title}</span>
                                <span className="text-[10px] font-bold text-indigo-400 mt-0.5">{card.subValue}</span>
                            </div>
                        </div>
                    </MotionDiv>
                ))}
            </div>

            <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Homepage Stats Editor</h3>
                        <p className="text-gray-400 text-xs mt-1">Edit the values shown in: Students Trained, Live Courses, Placement Rate, Expert Trainers.</p>
                    </div>
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Public Section Control</div>
                </div>
                <form onSubmit={handleSaveStats} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                        { key: 'students', label: 'Students Trained', placeholder: '2K+' },
                        { key: 'courses', label: 'Live Courses', placeholder: '50+' },
                        { key: 'placements', label: 'Placement Rate', placeholder: '98%' },
                        { key: 'trainers', label: 'Expert Trainers', placeholder: '60+' }
                    ].map((field) => (
                        <div key={field.key} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{field.label}</label>
                            <input
                                type="text"
                                required
                                value={statsForm[field.key]}
                                onChange={(e) => setStatsForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                placeholder={field.placeholder}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-indigo-500/50"
                            />
                        </div>
                    ))}
                    <div className="md:col-span-2 xl:col-span-4 flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={savingStats}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all disabled:opacity-70"
                        >
                            <Save size={14} />
                            {savingStats ? 'Saving...' : 'Save Homepage Stats'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Detailed Analytics */}
                <div className="lg:col-span-2 bg-[#1e293b] border border-white/5 rounded-3xl p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                <TrendingUp size={16} className="text-indigo-400" />
                            </div>
                            Platform Analytics
                        </h3>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Real-time Data</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { label: 'Total User Profiles', val: stats.totalUsers, icon: Users, color: 'text-blue-400' },
                            { label: 'Enrollment Requests', val: stats.enrollments, icon: GraduationCap, color: 'text-purple-400' },
                            { label: 'Hiring Opportunities', val: stats.internships, icon: Briefcase, color: 'text-amber-400' },
                            { label: 'Verified Partners', val: stats.partners, icon: Handshake, color: 'text-emerald-400' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={item.color} />
                                    <span className="text-gray-400 font-bold text-xs">{item.label}</span>
                                </div>
                                <span className="text-lg font-bold text-white">{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Integrity */}
                <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
                    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 border border-white/5">
                        <Clock size={40} strokeWidth={1.5} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">System Status</h3>
                    <p className="text-gray-400 text-xs font-medium max-w-[200px] leading-relaxed mb-6">
                        All services are functional. Real-time data sync active.
                    </p>

                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live & Online
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
