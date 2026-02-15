import Navbar from './Navbar'
import React from 'react'
import Footer from './Footer'
import Chatbot from '../common/Chatbot'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col theme-shell relative overflow-hidden">
      <div className="absolute inset-0 theme-dot-grid opacity-[0.18] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[420px] bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <Navbar />
      <main className="flex-1 pt-16 relative z-10">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default Layout
