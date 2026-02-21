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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-[#1e293b]/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden shadow-2xl"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.03] to-transparent rounded-bl-[5rem]" />

        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">{title}</p>
                <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-4xl font-black text-white italic tracking-tighter">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
                </div>
                {trend !== 0 && (
                    <div className={`flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full w-fit bg-opacity-10 ${trend > 0 ? 'bg-emerald-500 text-emerald-400' : 'bg-rose-500 text-rose-400'} border border-white/5`}>
                        {trend > 0 ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{Math.abs(trend)}% Velocity</span>
                    </div>
                )}
            </div>
            <div className={`p-5 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-all border border-white/5 shadow-2xl shadow-indigo-500/5`}>
                <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} strokeWidth={2.5} />
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
                const isTimeout = err.code === 'ECONNABORTED' || err.message.includes('timeout');
                const isNetwork = !err.response;

                if (isTimeout) {
                    setError("Command Center is waking up... Please wait.");
                } else if (isNetwork) {
                    setError("Infrastructure link unreachable. Check your uplink.");
                } else {
                    setError("Failed to synchronize with command center");
                }
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
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">Syncing Core Analytics...</p>
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
            // Homepage metrics overrides
            homepageStudents: '10K+',
            homepageCourses: '50+',
            homepagePlacements: '98%',
            homepageTrainers: '60+'
        },
        analytics = { enrollmentTrends: [], userTrends: [], recentActivity: [], popularPages: [] }
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
                    title="Active Visitors"
                    value={raw.activeVisitors || 0}
                    icon={Eye}
                    color="bg-cyan-500"
                    trend={0}
                    delay={0.5}
                />
            </div>

            {/* Homepage Impact Stats (Dynamic Overrides) */}
            <div className="bg-[#1e293b] rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-wider">Public Impact Metrics</h3>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Values displayed on homepage impact section</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/admin/settings'}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                        Update Metrics <ArrowRight size={14} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {[
                        { label: 'Students Trained', value: raw.homepageStudents || '10K+', icon: GraduationCap, color: 'text-indigo-400' },
                        { label: 'Live Courses', value: raw.homepageCourses || '50+', icon: BookOpen, color: 'text-cyan-400' },
                        { label: 'Placement Rate', value: raw.homepagePlacements || '98%', icon: TrendingUp, color: 'text-emerald-400' },
                        { label: 'Expert Trainers', value: raw.homepageTrainers || '60+', icon: UserPlus, color: 'text-blue-400' }
                    ].map((m, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center group/card hover:bg-white/[0.08] transition-all">
                            <m.icon className={`${m.color} mb-3 group-hover/card:scale-110 transition-transform`} size={24} />
                            <h4 className="text-2xl font-black text-white italic">{m.value}</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{m.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-[#1e293b] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group"
                >
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Growth Trajectory</h3>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Enrollment & Platform Scaling Analytics</p>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Active Nodes</span>
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

                {/* Visitor Flow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#1e293b] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-wider">Visitor Flow</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Platform Impact & Page Popularity</p>
                        </div>
                        <Zap className="text-amber-400 opacity-20" size={24} />
                    </div>

                    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                        {(analytics.popularPages || []).map((page, idx) => (
                            <div key={page.path} className="space-y-2 group/item">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400 truncate max-w-[70%] group-hover/item:text-indigo-400 transition-colors">{page.path}</span>
                                    <span className="text-white bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10">{page.count} unique hits</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(page.count / Math.max(...analytics.popularPages.map(p => p.count))) * 100}%` }}
                                        transition={{ duration: 1, delay: idx * 0.05 }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                        {(!analytics.popularPages || analytics.popularPages.length === 0) && (
                            <div className="h-40 flex flex-col items-center justify-center text-center opacity-30 italic">
                                <p className="text-[10px] uppercase font-black tracking-widest">Awaiting visitor metrics...</p>
                            </div>
                        )}
                    </div>
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

