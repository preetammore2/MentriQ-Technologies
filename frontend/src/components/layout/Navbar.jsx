import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, LogOut, Phone } from 'lucide-react'
import AuthModal from '../auth/AuthModal'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [hidden, setHidden] = useState(false)
    const { scrollY } = useScroll()
    const {
        user,
        logout,
        isAuthenticated,
        isAuthModalOpen,
        closeAuthModal
    } = useAuth()
    const location = useLocation()

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        // Hide if scrolling down and past 100px. Show if scrolling up.
        if (latest > previous && latest > 150) {
            setHidden(true)
        } else {
            setHidden(false)
        }
    })

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Courses', path: '/courses' },
        { name: 'Internships', path: '/training' },
        { name: 'Recruit', path: '/recruit' },
    ]

    return (
        <>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={closeAuthModal}
                initialTab="login"
            />

            <motion.nav
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-100"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">

                        {/* Logo / Brand */}
                        <div className="flex items-center gap-2">
                            {/* Optional: Add Logo Here if needed, otherwise keeping it clean per previous instructions */}
                            {/* <img src="/logo.png" alt="MentriQ" className="h-8" /> */}
                            <Link to="/" className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                                MentriQ<span className="text-indigo-600">.</span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === item.path
                                        ? 'text-indigo-600 bg-indigo-50 font-bold'
                                        : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Auth / CTA */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden lg:block">
                                        <div className="text-sm font-bold text-slate-900">{user?.name?.split(' ')[0]}</div>
                                        <div className="text-[10px] text-indigo-600 font-black uppercase tracking-wider">{user?.role || 'Student'}</div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={{
                                            boxShadow: ["0px 0px 0px rgba(99, 102, 241, 0)", "0px 0px 20px rgba(99, 102, 241, 0.3)", "0px 0px 0px rgba(99, 102, 241, 0)"],
                                        }}
                                        transition={{
                                            boxShadow: {
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }
                                        }}
                                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                    >
                                        <span>Contact Us</span>
                                        <Phone size={16} className="fill-white/20" />
                                    </motion.button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden p-2 text-slate-600 hover:text-indigo-600 transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
                        >
                            <div className="p-4 flex flex-col space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-sm font-bold ${location.pathname === item.path
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="pt-4 mt-2 border-t border-slate-100">
                                    {isAuthenticated ? (
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileOpen(false);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    ) : (
                                        <Link
                                            to="/contact"
                                            onClick={() => setMobileOpen(false)}
                                            className="block w-full"
                                        >
                                            <motion.div
                                                whileTap={{ scale: 0.95 }}
                                                className="w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200"
                                            >
                                                Contact Us
                                            </motion.div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    )
}

export default Navbar
