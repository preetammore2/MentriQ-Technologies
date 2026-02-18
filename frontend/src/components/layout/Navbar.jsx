import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, LogOut, ChevronRight } from 'lucide-react'
import AuthModal from '../auth/AuthModal'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const {
    user,
    logout,
    isAuthenticated,
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

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
          ? 'bg-white/95 backdrop-blur-md border-slate-200 py-4 shadow-sm'
          : 'bg-white border-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="group relative flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 overflow-hidden text-white">
                <img className='w-full h-full object-contain p-1.5' src="/images/logo.jpg" alt="MentriQ" />
                {/* Note: If logo.jpg is dark, this white bg might need adjustment, but user asked for "solid white bg" for navbar */}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                  MentriQ
                </span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                  Technologies
                </span>
              </div>
            </Link>

            {/* Desktop Nav - Light Theme */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-[14px] font-medium transition-colors tracking-wide ${location.pathname === item.path
                    ? 'text-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-indigo-600'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth / CTA */}
            <div className="hidden md:flex items-center gap-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 mb-0.5">{user?.name?.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{user?.role || 'User'}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/contact"
                  className="group relative flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-slate-900/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:animate-shine" />
                  <span className="relative z-10 flex items-center gap-2">
                    Contact
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-slate-600 hover:text-indigo-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-4 flex flex-col space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-xl">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium ${location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-lg active:scale-95 transition-transform"
                >
                  Contact
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar
