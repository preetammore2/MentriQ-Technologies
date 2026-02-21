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

const StatCard = ({ title, value, icon: Icon, color, delay, trend = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
        className="bg-[#0f172a]/40 backdrop-blur-xl p-7 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 hover:shadow-[0_20px_50px_-12px_rgba(16,185,129,0.15)] transition-all group relative overflow-hidden"
    >
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-extrabold text-white tracking-tighter">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h3>
                </div>
                {trend !== 0 && (
                    <div className={`flex items-center gap-2 mt-4 transition-transform group-hover:translate-x-1 ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <div className={`p-1 rounded-md ${trend > 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        </div>
                        <span className="text-[11px] font-bold tracking-tight">{Math.abs(trend)}% Velocity</span>
                    </div>
                )}
            </div>
            <div className={`p-4 rounded-[1.5rem] ${color} bg-opacity-[0.12] backdrop-blur-md border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ring-4 ring-transparent group-hover:ring-white/5`}>
                <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} strokeWidth={2.5} />
            </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin" />
                    <Activity className="absolute inset-0 m-auto text-emerald-600 animate-pulse" size={24} />
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
            case 'enrollment': return <GraduationCap className="text-emerald-600" size={18} />;
            case 'internship': return <Briefcase className="text-slate-600" size={18} />;
            case 'user': return <UserPlus className="text-emerald-600" size={18} />;
            default: return <Activity className="text-slate-400" size={18} />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Unified Header */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <Zap size={200} className="text-emerald-500" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Main Dashboard</h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm">Overview of MentriQ Platform operations and student engagement.</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 relative z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-slate-300 font-bold text-xs tracking-wider uppercase">Uplink Active</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Student Base" value={raw.students} icon={Users} color="bg-emerald-600" trend={12} delay={0} />
                <StatCard title="Course Assets" value={raw.courses} icon={BookOpen} color="bg-emerald-600" trend={5} delay={0.1} />
                <StatCard title="Total Enrollment" value={raw.enrolledStudents} icon={GraduationCap} color="bg-emerald-600" trend={18} delay={0.2} />
                <StatCard title="Active Visitors" value={raw.activeVisitors || 0} icon={Eye} color="bg-slate-900" trend={0} delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Visualization */}
                <div className="lg:col-span-2 bg-[#0f172a]/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-2xl font-extrabold text-white tracking-tight">Ecosystem Growth</h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Enrollment trends • Last 30 Cycles</p>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live Feed</span>
                        </div>
                    </div>

                    <div className="h-[340px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.enrollmentTrends}>
                                <defs>
                                    <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                        <stop offset="50%" stopColor="#10b981" stopOpacity={0.05} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={15}
                                    fontWeight="700"
                                    textAnchor="middle"
                                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    fontWeight="700"
                                />
                                <Tooltip
                                    cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[#020617]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
                                                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">{label}</p>
                                                    <p className="text-lg font-bold text-white flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        {payload[0].value} Enrollees
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    fill="url(#colorInd)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Real-time Activity */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Active Pulse</h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Real-time Node Events</p>
                        </div>
                        <div className="p-2.5 bg-emerald-50 rounded-xl">
                            <Activity className="text-emerald-600" size={24} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-7 overflow-y-auto pr-2 custom-scrollbar max-h-[420px]">
                        {analytics.recentActivity.map((activity, idx) => (
                            <div key={activity.id} className="flex gap-4 group cursor-default">
                                <div className="mt-1 relative">
                                    <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all shadow-sm">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    {idx !== analytics.recentActivity.length - 1 && (
                                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-100 group-hover:bg-emerald-100 transition-colors" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[13px] font-bold text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                                        {activity.message.replace('User', 'Node Entity').replace('student', 'authorized node')}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold mt-1.5 flex items-center gap-2 uppercase tracking-widest">
                                        <TrendingUp size={10} className="text-emerald-500" />
                                        {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Live Signal
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98]">
                        Access Performance Logs
                    </button>
                </div>
            </div>

            {/* Infrastructure Linkage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">Cloud Infrastructure</h3>
                            <p className="text-slate-400 text-xs mt-1 font-medium">Core engine and database cluster status</p>
                        </div>
                        <div className="flex gap-8">
                            {[
                                { label: 'API Gateway', status: 'Operational', color: 'bg-emerald-500' },
                                { label: 'Compute Unit', status: 'Primary', color: 'bg-emerald-500' }
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
                        <button onClick={() => navigate('/admin/settings')} className="text-emerald-600 hover:text-emerald-700 transition-colors">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
