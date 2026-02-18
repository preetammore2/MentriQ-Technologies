import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../admin/Sidebar';

const MotionDiv = motion.div;

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Auto-close sidebar on mobile when navigating
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex overflow-hidden font-inter selection:bg-indigo-500/30">
            {/* Background Pattern */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                {/* Mobile Header */}
                <header className="h-20 lg:hidden flex items-center px-6 border-b border-white/5 bg-[#1e293b] sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 -ml-3 text-gray-400 hover:text-white bg-white/5 rounded-2xl transition-all"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="ml-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white overflow-hidden flex items-center justify-center">
                            <img
                                src="/images/logo1.jpg"
                                alt="MentriQ Logo"
                                className="w-full h-full object-contain p-1"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg tracking-tight leading-none">MentriQ</span>
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mt-0.5">Admin</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar bg-slate-950/50">
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-7xl mx-auto"
                    >
                        {children}
                    </MotionDiv>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
