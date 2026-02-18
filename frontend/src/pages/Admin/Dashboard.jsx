import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../utils/apiClient';
import {
    Users,
    BookOpen,
    GraduationCap,
    Briefcase,
    TrendingUp,
    Clock,
    Activity,
    Handshake,
    Save,
    ChevronRight,
    ArrowUpRight
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
        { title: 'Community Impact', value: stats.students, subValue: `${stats.enrolledStudents} Enrolled Students`, icon: Users, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-indigo-500/20' },
        { title: 'Knowledge Base', value: stats.courses, subValue: 'Active Programs', icon: BookOpen, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
        { title: 'Success Rate', value: stats.placements, subValue: 'Student Placements', icon: GraduationCap, color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/20' },
        { title: 'Network', value: stats.partners, subValue: 'Corporate Partners', icon: Handshake, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">Aggregating Intel...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                        Admin Dashboard
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">Overview of platform performance and engagement.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-gray-300">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">Live Monitor</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <MotionDiv
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group hover:border-white/10 transition-all hover:-translate-y-1 hover:shadow-2xl"
                    >
                        {/* Glow Effect */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity duration-500`} />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg ${card.shadow}`}>
                                    <card.icon size={28} />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                                    <Activity size={12} className="text-emerald-400" />
                                    Live
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-5xl font-black text-white tracking-tight">
                                    {card.value}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.title}</span>
                                    <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 mt-1">
                                        <ArrowUpRight size={10} />
                                        {card.subValue}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </MotionDiv>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Homepage Stats Editor */}
                <div className="lg:col-span-2 bg-[#1e293b]/80 border border-white/5 rounded-[2rem] p-8 shadow-xl backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                <Settings size={20} className="text-indigo-400" />
                                Public Stats Configuration
                            </h3>
                            <p className="text-gray-400 text-xs mt-1.5">Manage the counters displayed on the landing page.</p>
                        </div>
                    </div>
                    <form onSubmit={handleSaveStats} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { key: 'students', label: 'Students Trained', placeholder: '2K+' },
                            { key: 'courses', label: 'Live Courses', placeholder: '50+' },
                            { key: 'placements', label: 'Placement Rate', placeholder: '98%' },
                            { key: 'trainers', label: 'Expert Trainers', placeholder: '60+' }
                        ].map((field) => (
                            <div key={field.key} className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-indigo-400 transition-colors ml-1">{field.label}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={statsForm[field.key]}
                                        onChange={(e) => setStatsForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                        placeholder={field.placeholder}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="md:col-span-2 lg:col-span-4 flex justify-end pt-4 border-t border-white/5 mt-2">
                            <button
                                type="submit"
                                disabled={savingStats}
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-70 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                            >
                                <Save size={16} />
                                {savingStats ? 'Saving Changes...' : 'Save Configuration'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* System Status / Quick Actions */}
                <div className="space-y-6">
                    {/* System Integrity */}
                    <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors" />
                        <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20 relative z-10">
                            <Clock size={32} strokeWidth={1.5} />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1 relative z-10">System Operational</h3>
                        <p className="text-indigo-200/60 text-xs font-medium max-w-[200px] mb-4 relative z-10">
                            Syncing with database in real-time.
                        </p>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 relative z-10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live
                        </div>
                    </div>

                    {/* Detailed Stats List */}
                    <div className="bg-[#1e293b]/50 border border-white/5 rounded-[2rem] p-6 shadow-xl">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Quick Stats</h4>
                        <div className="space-y-3">
                            {[
                                { label: 'Total Profiles', val: stats.totalUsers, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                                { label: 'Enrollments', val: stats.enrollments, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                                { label: 'Partnerships', val: stats.partners, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                                    <span className="text-xs font-bold text-gray-400">{item.label}</span>
                                    <span className={`text-sm font-bold ${item.color} px-2 py-1 rounded-md ${item.bg}`}>{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section could go here */}
        </div>
    );
};

export default Dashboard;
