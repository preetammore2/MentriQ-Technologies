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
    CreditCard
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 hover:border-indigo-500/50 transition-all group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.02] to-transparent rounded-bl-[4rem]" />

        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{title}</p>
                <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-3xl font-black text-white italic">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
                </div>
                {trend !== 0 && (
                    <div className={`flex items-center gap-1 mt-2 ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span className="text-xs font-bold uppercase tracking-tighter">{Math.abs(trend)}% vs last week</span>
                    </div>
                )}
            </div>
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all border border-white/5`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
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
            if (!data) setError("Failed to synchronize with command center");
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
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">Syncing Core Analytics...</p>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                <Activity className="w-12 h-12 text-rose-500 opacity-50" />
                <p className="text-rose-400 font-bold uppercase tracking-[0.2em] text-sm text-center">
                    {error}<br />
                    <span className="text-[10px] text-gray-500">Checking for link restoration...</span>
                </p>
                <button
                    onClick={() => { setLoading(true); fetchStats(); }}
                    className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                >
                    Retry Link
                </button>
            </div>
        );
    }

    const {
        raw = { students: 0, courses: 0, enrolledStudents: 0, internships: 0 },
        analytics = { enrollmentTrends: [], userTrends: [], recentActivity: [] }
    } = data || {};

    const getActivityIcon = (type) => {
        switch (type) {
            case 'enrollment': return <GraduationCap className="text-purple-400" size={16} />;
            case 'internship': return <Briefcase className="text-emerald-400" size={16} />;
            case 'user': return <UserPlus className="text-blue-400" size={16} />;
            default: return <Activity className="text-indigo-400" size={16} />;
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-[#1e293b] to-transparent p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent)] pointer-events-none" />
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-white tracking-tight italic uppercase">Command Center</h1>
                    <p className="text-gray-400 mt-2 font-bold uppercase tracking-[0.2em] text-xs">Real-time Operations & Intelligence</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 relative z-10 backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-gray-300 font-black uppercase tracking-widest text-[10px]">Live Data Sync active</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Student Base"
                    value={raw.students}
                    icon={Users}
                    color="bg-blue-500"
                    trend={12}
                    delay={0.1}
                />
                <StatCard
                    title="Course Assets"
                    value={raw.courses}
                    icon={BookOpen}
                    color="bg-indigo-500"
                    trend={5}
                    delay={0.2}
                />
                <StatCard
                    title="Total Enrollment"
                    value={raw.enrolledStudents}
                    icon={GraduationCap}
                    color="bg-purple-500"
                    trend={18}
                    delay={0.3}
                />
                <StatCard
                    title="Open Positions"
                    value={raw.internships}
                    icon={Briefcase}
                    color="bg-emerald-500"
                    trend={8}
                    delay={0.4}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-[#1e293b] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group"
                >
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-wider">Growth Vectors</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Platform Expansion Metrics</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Enrollments</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.enrollmentTrends}>
                                <defs>
                                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    fontWeight="bold"
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    fontWeight="bold"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorTrend)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#1e293b] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl flex flex-col"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-wider">Live Intel</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time Activity Stream</p>
                        </div>
                        <Activity className="text-indigo-500 opacity-20" size={24} />
                    </div>

                    <div className="flex-1 space-y-6">
                        {analytics.recentActivity.map((activity, idx) => (
                            <div key={activity.id} className="flex gap-4 group">
                                <div className="mt-1">
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    {idx !== analytics.recentActivity.length - 1 && (
                                        <div className="w-px h-10 bg-white/5 mx-auto mt-2" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors leading-snug">
                                        {activity.message}
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                        {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {analytics.recentActivity.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 italic py-10">
                                <Activity size={40} className="mb-4" />
                                <p className="text-xs uppercase font-black tracking-widest">Awaiting Pulse...</p>
                            </div>
                        )}
                    </div>

                    <button className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2">
                        View Audit Log <ArrowRight size={14} />
                    </button>
                </motion.div>
            </div>

            {/* System Status */}
            <div className="bg-[#1e293b] rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Cpu size={120} />
                </div>
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-wider">Infrastructure Status</h3>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Current Node Configuration: v2.4.0-Indigo</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">API Engine</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-white uppercase">Operational</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Database Cluster</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-white uppercase">Primary Link</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Storage Grid</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-white uppercase">Encrypted</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Latent Sync</span>
                            <div className="flex items-center gap-2">
                                <ArrowRight className="text-indigo-400 rotate-180" size={14} />
                                <span className="text-xs font-bold text-white uppercase">42ms Range</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

