// Navbar.jsx
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, LogOut, ChevronDown, GraduationCap, Briefcase, Target } from 'lucide-react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import AuthModal from '../auth/AuthModal'

const NavButton3D = ({ children, to }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className="relative group"
    >
      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-1.5 bg-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-60 transition-opacity"
      />

      <Link
        to={to}
        className="relative block px-8 py-3.5 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-[0_10px_25px_rgba(79,70,229,0.3)] border border-indigo-400/20"
      >
        <motion.div
          animate={{
            x: ['-100%', '150%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
        />

        <span
          style={{ transform: "translateZ(40px)" }}
          className="relative block text-[11px] font-black text-white uppercase tracking-[0.25em] transform-gpu transition-all duration-500 group-hover:scale-110 drop-shadow-md"
        >
          {children}
        </span>
      </Link>
    </motion.div>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [careerOpen, setCareerOpen] = useState(false)
  const {
    user,
    logout,
    isAuthenticated,
    hasEnrollments,
    isAuthModalOpen,
    closeAuthModal
  } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const careerItems = [
    { name: 'Courses', path: '/courses', icon: GraduationCap },
    { name: 'Internship', path: '/training', icon: Briefcase },
    { name: 'Recruit', path: '/recruit', icon: Target },
  ]

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ]

  const isCareerActive = careerItems.some(item => location.pathname === item.path)

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTab="login"
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-700 rounded-3xl theme-glass-strong ${scrolled
          ? 'shadow-[0_20px_50px_rgba(15,23,42,0.12)] py-2'
          : 'py-3.5 shadow-[0_14px_32px_rgba(15,23,42,0.1)]'
          }`}
      >
        {/* Shimmer Effect for Scrolled State */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
            >
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/30 to-transparent skew-x-12"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-4 group relative">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur-lg opacity-10 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-200 overflow-hidden">
                  <img
                    className='w-full h-full object-contain p-1.5'
                    src="/images/logo.jpg"
                    alt="MentriQ"
                  />
                </div>
              </motion.div>

              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                  MentriQ
                </span>
                <div className="flex items-center gap-1.5 mt-1.5 opacity-80">
                  <span className="h-[2px] w-3 bg-indigo-600 rounded-full" />
                  <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] leading-none">
                    Technologies
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center bg-white/80 backdrop-blur-md rounded-2xl p-1 border border-slate-200 shadow-inner">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${location.pathname === item.path
                    ? 'text-indigo-700 bg-white shadow-[0_5px_15px_rgba(79,70,229,0.16)]'
                    : 'text-slate-600 hover:text-indigo-700 hover:bg-slate-100'
                    }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                    />
                  )}
                </Link>
              ))}

              {/* Enhanced 3D Explore Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCareerOpen(true)}
                onMouseLeave={() => setCareerOpen(false)}
                style={{ perspective: '1000px' }}
              >
                <button
                  className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 ${isCareerActive
                    ? 'text-indigo-700 bg-white shadow-[0_5px_15px_rgba(79,70,229,0.16)]'
                    : 'text-slate-600 hover:text-indigo-700 hover:bg-slate-100'
                    }`}
                >
                  Explore
                  <ChevronDown size={14} className={`transition-transform duration-500 ${careerOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {careerOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10, rotateX: -15 }}
                      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10, rotateX: -15 }}
                      transition={{ type: "spring", damping: 15, stiffness: 120 }}
                      className="absolute top-full left-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl rounded-[1.8rem] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18)] border border-slate-200 p-2 z-[60]"
                    >
                      {careerItems.map((item, idx) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Link
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[12px] font-bold transition-all duration-300 group ${location.pathname === item.path
                              ? 'text-indigo-700 bg-indigo-50'
                              : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/60 hover:translate-x-1.5'
                              }`}
                          >
                            <div className={`p-2.5 rounded-xl ${location.pathname === item.path ? 'bg-indigo-100 shadow-inner' : 'bg-slate-100 group-hover:bg-indigo-100 group-hover:scale-110'} transition-all duration-300`}>
                              <item.icon size={18} />
                            </div>
                            <span className="tracking-tight">{item.name}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA & User Section */}
            <div className="hidden md:flex items-center space-x-5">
              {isAuthenticated ? (
                <div className="flex items-center bg-white/85 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-slate-200">
                  <div className="flex flex-col items-end mr-4">
                    <span className="text-xs font-black text-slate-900 tracking-tight">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest opacity-90">
                      {user?.role || 'Student'}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <LogOut size={18} />
                  </motion.button>
                </div>
              ) : (
                <NavButton3D to="/recruit">
                  Apply Now
                </NavButton3D>
              )}
            </div>

            {/* Mobile Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-lg rounded-xl border border-slate-200 text-slate-900"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Sidebar Redesign */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] md:hidden bg-slate-900/20 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            >
              <motion.div
                initial={{ x: '100%', rotateY: 20 }}
                animate={{ x: 0, rotateY: 0 }}
                exit={{ x: '100%', rotateY: 20 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                style={{ perspective: '1000px', transformOrigin: 'right center' }}
                className="absolute right-0 top-0 bottom-0 w-[85%] bg-white/95 backdrop-blur-3xl p-8 border-l border-slate-200 shadow-[-20px_0_80px_rgba(15,23,42,0.15)] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-10">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">MentriQ</span>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                      <span className="text-[10px] font-bold text-indigo-600 tracking-[0.1em]">Neural Grid Active</span>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileOpen(false)}
                    className="p-3 bg-slate-100 rounded-2xl text-slate-900"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Navigation</p>
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-6 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.15em] transition-all ${location.pathname === item.path
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 translate-x-2'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      {item.name}
                      {location.pathname === item.path && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-glow" />}
                    </Link>
                  ))}

                  <div className="pt-8 border-t border-slate-200 mt-6">
                    <p className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ecosystem</p>
                    <div className="grid gap-3">
                      {careerItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold transition-all ${location.pathname === item.path
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-slate-700 hover:bg-slate-100 hover:translate-x-1'
                            }`}
                        >
                          <div className={`p-2 rounded-xl ${location.pathname === item.path ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                            <item.icon size={18} />
                          </div>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                  {!isAuthenticated ? (
                    <Link
                      to="/recruit"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center py-5 bg-indigo-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-indigo-500/30"
                    >
                      Apply Now
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        logout()
                        setMobileOpen(false)
                      }}
                      className="flex items-center justify-center gap-3 w-full py-5 bg-rose-50 text-rose-600 rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em]"
                    >
                      <LogOut size={18} />
                      Logout Account
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar
