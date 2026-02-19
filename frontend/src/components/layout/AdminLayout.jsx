import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Layers,
    MapPin,
    Handshake,
    Award,
    Mail,
    UserCog,
    MessageSquare,
    Cpu
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { logout } = useAuth()
    const toast = useToast()

    useEffect(() => {
        // Auto-close sidebar on mobile when navigating
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
        { path: '/admin/enrollments', icon: GraduationCap, label: 'Enrollments' },
        { path: '/admin/internships', icon: Briefcase, label: 'Internships' },
        { path: '/admin/services', icon: Layers, label: 'Services' },
        { path: '/admin/cities', icon: MapPin, label: 'Cities' },
        { path: '/admin/partners', icon: Handshake, label: 'Partners' },
        { path: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
        { path: '/admin/journey', icon: MapPin, label: 'Journey' },
        { path: '/admin/certificates', icon: Award, label: 'Certificates' },
        { path: '/admin/mentors', icon: Users, label: 'Mentors' },
        { path: '/admin/staff', icon: UserCog, label: 'Staff' },
        { path: '/admin/inquiries', icon: Mail, label: 'Inquiries' },
        { path: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
        { path: '/admin/technologies', icon: Cpu, label: 'Technologies' },
    ];

    const handleLogout = () => {
        logout()
        navigate('/')
        toast.success('Logged out successfully')
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className={`fixed lg:static inset-y-0 left-0 z-40 bg-[#1e293b] border-r border-white/5 flex flex-col transition-all duration-300 ${!isSidebarOpen && 'lg:w-20'
                    } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                    <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'lg:hidden'}`}>
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold">M</span>
                        </div>
                        <span className="text-white font-bold text-lg whitespace-nowrap">MentriQ Admin</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-400 hover:text-white lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${!isSidebarOpen ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                                    }`}>
                                    {item.label}
                                </span>
                                {isActive && isSidebarOpen && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                                    />
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Bottom Section */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all group ${!isSidebarOpen && 'lg:justify-center'
                            }`}
                    >
                        <LogOut size={20} />
                        <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${!isSidebarOpen ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                            }`}>
                            Logout
                        </span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Header */}
                <header className="h-20 lg:hidden flex items-center px-6 border-b border-white/5 bg-[#1e293b] sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 -ml-3 text-gray-400 hover:text-white bg-white/5 rounded-2xl transition-all"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="ml-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold">M</span>
                        </div>
                        <span className="text-white font-bold text-lg">MentriQ Admin</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0f172a] p-6 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
