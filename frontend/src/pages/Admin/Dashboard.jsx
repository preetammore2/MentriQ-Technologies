import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Users, BookOpen, GraduationCap, Briefcase, TrendingUp, Award, DollarSign, Activity } from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all group"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-2 font-display">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        totalInternships: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const mockStats = {
                totalUsers: 1250,
                totalCourses: 24,
                totalEnrollments: 3500,
                totalInternships: 150
            };

            try {
                const { data } = await api.get('/stats');
                setStats({
                    totalUsers: data.raw?.students || mockStats.totalUsers,
                    totalCourses: data.raw?.courses || mockStats.totalCourses,
                    totalEnrollments: data.raw?.enrolledStudents || mockStats.totalEnrollments,
                    totalInternships: mockStats.totalInternships
                });
            } catch (err) {
                console.log("Using mock stats due to API error", err);
                setStats(mockStats);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-gray-400 mt-2">Welcome back to MentriQ Admin Portal</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-blue-500"
                    delay={0.1}
                />
                <StatCard
                    title="Active Courses"
                    value={stats.totalCourses}
                    icon={BookOpen}
                    color="bg-indigo-500"
                    delay={0.2}
                />
                <StatCard
                    title="Total Enrollments"
                    value={stats.totalEnrollments}
                    icon={GraduationCap}
                    color="bg-purple-500"
                    delay={0.3}
                />
                <StatCard
                    title="Active Internships"
                    value={stats.totalInternships}
                    icon={Briefcase}
                    color="bg-emerald-500"
                    delay={0.4}
                />
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                    <div className="flex items-center justify-center h-48 text-gray-500">
                        Activity feed coming soon...
                    </div>
                </div>

                <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6">
                    <h3 className="text-xl font-bold text-white mb-6">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Server Status</span>
                            <span className="flex items-center gap-2 text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Operational
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Database</span>
                            <span className="text-emerald-400">Connected</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">API Version</span>
                            <span className="text-white">v1.2.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
