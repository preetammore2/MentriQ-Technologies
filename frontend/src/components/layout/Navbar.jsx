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
            ? 'bg-black/80 backdrop-blur-md border-white/10 py-4'
            : 'bg-black border-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo with Glassmorphism */}
            <Link to="/" className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-white/20 transition-all">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center overflow-hidden shrink-0">
                  <img className='w-full h-full object-contain p-0.5' src="/images/logo.jpg" alt="MentriQ" />
                </div>
                <span className="text-sm font-bold text-white tracking-wider uppercase font-mono">
                  MentriQ
                </span>
              </div>
            </Link>

            {/* Desktop Nav - Auth0 Style */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-[13px] font-medium transition-colors tracking-wide ${location.pathname === item.path
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth / CTA */}
            <div className="hidden md:flex items-center gap-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                  <div className="text-right">
                    <div className="text-xs font-bold text-white mb-0.5">{user?.name?.split(' ')[0]}</div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{user?.role || 'User'}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/contact"
                  className="group flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg text-xs font-bold hover:bg-gray-200 transition-all"
                >
                  <span>Talk to Sales</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-white/10 p-4 flex flex-col space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-2xl shadow-black">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium ${location.pathname === item.path
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-white/10">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/20"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-white text-black rounded-lg text-sm font-bold"
                >
                  Talk to Sales
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
