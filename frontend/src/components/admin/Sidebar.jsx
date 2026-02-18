import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Briefcase,
    MapPin,
    Award,
    Settings,
    LogOut,
    X,
    Layers,
    Handshake,
    Mail,
    MessageSquare,
    UserCog
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const MotionAside = motion.aside;
const MotionDiv = motion.div;
const MotionSpan = motion.span;

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const toast = useToast();

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
    ];

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <MotionAside
            initial={false}
            animate={{ width: isOpen ? 280 : 80 }}
            className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#1e293b] border-r border-white/5 flex flex-col transition-all duration-500 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
            {/* Logo Area */}
            <div className="h-24 flex items-center px-6 border-b border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-11 h-11 rounded-2xl bg-white shrink-0 shadow-lg shadow-white/10 ring-4 ring-white/5 overflow-hidden flex items-center justify-center">
                    <img
                        src="/images/logo1.jpg"
                        alt="MentriQ Logo"
                        className="w-full h-full object-contain p-1.5"
                    />
                </div>
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <MotionDiv
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="ml-4 flex flex-col"
                        >
                            <span className="font-black text-lg tracking-tight leading-none text-white">MentriQ</span>
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mt-1">Admin Portal</span>
                        </MotionDiv>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsOpen(false)}
                    className="ml-auto lg:hidden text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar relative z-10">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-4 rounded-[1.25rem] transition-all duration-300 group/item relative overflow-hidden ${isActive
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`shrink-0 transition-all duration-300 ${isActive ? 'rotate-0' : 'group-hover/item:scale-110'}`} />
                            <AnimatePresence mode="wait">
                                {isOpen && (
                                    <MotionSpan
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="font-bold tracking-tight text-sm"
                                    >
                                        {item.label}
                                    </MotionSpan>
                                )}
                            </AnimatePresence>
                            {!isOpen && (
                                <div className="absolute left-full ml-4 px-3 py-1 bg-white text-black text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-2xl lg:block hidden">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User */}
            <div className="p-4 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-[1.25rem] text-red-400 hover:bg-red-500/10 transition-all group/logout font-bold text-sm"
                >
                    <LogOut size={22} className="shrink-0 transition-all group-hover/logout:translate-x-1" />
                    <AnimatePresence>
                        {isOpen && (
                            <MotionSpan
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                            >
                                Sign Out
                            </MotionSpan>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </MotionAside>
    );
};

export default Sidebar;
