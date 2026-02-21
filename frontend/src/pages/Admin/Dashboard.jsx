import React, { useEffect, useState, useCallback } from "react";
import { apiClient as api } from "../../utils/apiClient";
import {
    Users,
    BookOpen,
    GraduationCap,
    Briefcase,
    TrendingUp,
    TrendingDown,
    Activity,
    ArrowRight,
    Loader2,
    CheckCircle2,
    UserPlus,
    CreditCard,
    Eye,
    Zap,
    Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts";

const StatCard = ({ title, value, icon: Icon, color, delay, trend = 0, isVelocity = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all group relative overflow-hidden"
    >
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-2">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </h3>
                {trend !== 0 && (
                    <div className={`flex items-center gap-1.5 mt-2 transition-transform group-hover:translate-x-1 ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span className="text-xs font-bold leading-none">{Math.abs(trend)}% {isVelocity ? 'Velocity' : 'Growth'}</span>
                    </div>
                )}
            </div>
            <div className={`p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-indigo-50 group-hover:border-indigo-100 relative`}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors relative z-10" strokeWidth={1.5} />
            </div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        try {
            const { data: res } = await api.get('/stats');
            if (res && res.raw && res.analytics) {
                setData(res);
                setError(null);
            } else {
                throw new Error("Invalid stats data received");
            }
        } catch (err) {
            console.error("Dashboard Sync Error:", err);
            if (!data) {
                setError("Infrastructure link unreachable. Check your uplink.");
            }
        } finally {
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 15000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                    <Activity className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={24} />
                </div>
                <p className="text-slate-400 font-medium text-sm tracking-wide">Syncing Command Center...</p>
            </div>
        );
    }

    const {
        raw = {
            students: 0,
            courses: 0,
            enrolledStudents: 0,
            internships: 0,
            activeVisitors: 0,
        },
        analytics = { enrollmentTrends: [], userTrends: [], recentActivity: [], popularPages: [] }
    } = data || {};

    const getActivityIcon = (type) => {
        switch (type) {
            case 'enrollment': return <GraduationCap className="text-indigo-600" size={18} />;
            case 'internship': return <Briefcase className="text-slate-600" size={18} />;
            case 'user': return <UserPlus className="text-emerald-600" size={18} />;
            default: return <Activity className="text-slate-400" size={18} />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Unified Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <Zap size={200} />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Main Dashboard</h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm">Overview of MentriQ Platform operations and student engagement.</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 relative z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" />
                    <span className="text-slate-600 font-semibold text-xs tracking-wide">Live Infrastructure Link</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Student Base" value={raw.students} icon={Users} trend={12} delay={0} isVelocity />
                <StatCard title="Course Assets" value={raw.courses} icon={BookOpen} trend={5} delay={0.1} isVelocity />
                <StatCard title="Total Enrollment" value={raw.enrolledStudents} icon={GraduationCap} trend={18} delay={0.2} isVelocity />
                <StatCard title="Active Visitors" value={raw.activeVisitors || 0} icon={Eye} trend={0} delay={0.3} isVelocity />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Visualization */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Platform Growth</h3>
                            <p className="text-slate-400 text-xs font-medium mt-1">Enrollment trends over the past 30 days</p>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-2 h-2 rounded-full bg-indigo-600" />
                            <span className="text-[11px] font-bold text-slate-600">Active Students</span>
                        </div>
                    </div>

                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.enrollmentTrends}>
                                <defs>
                                    <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} fontWeight="500" />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} fontWeight="500" tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                                        fontSize: '12px'
                                    }}
                                    cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fill="url(#colorInd)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Real-time Activity */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Recent Pulse</h3>
                            <p className="text-slate-400 text-xs font-medium mt-1">Latest platform events</p>
                        </div>
                        <Activity className="text-slate-300" size={24} />
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                        {analytics.recentActivity.map((activity, idx) => (
                            <div key={activity.id} className="flex gap-4 group">
                                <div className="mt-0.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors relative">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    {idx !== analytics.recentActivity.length - 1 && (
                                        <div className="w-px h-10 bg-slate-100 mx-auto mt-2" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-slate-900">
                                        {activity.message.replace('User', 'Node')}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-medium mt-1 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                                        {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-100 text-xs font-bold transition-all">
                        Access Performance Logs
                    </button>
                </div>
            </div>

            {/* Infrastructure Linkage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">Cloud Infrastructure</h3>
                            <p className="text-slate-400 text-xs mt-1 font-medium">Core engine and database cluster status</p>
                        </div>
                        <div className="flex gap-8">
                            {[
                                { label: 'API Gateway', status: 'Operational', color: 'bg-emerald-500' },
                                { label: 'Compute Unit', status: 'Primary', color: 'bg-indigo-500' }
                            ].map((s, i) => (
                                <div key={i} className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{s.label}</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${s.color}`} />
                                        <span className="text-xs font-bold text-white tracking-wide">{s.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Visitor Reach</h3>
                            <p className="text-slate-400 text-xs font-medium mt-1">Popular page segments across the portal</p>
                        </div>
                        <button onClick={() => navigate('/admin/settings')} className="text-indigo-600 hover:text-indigo-700 transition-colors">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
