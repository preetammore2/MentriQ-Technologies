import React, { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Instagram, Linkedin, Twitter, User, Tag, MessageSquare, MessageCircle, Sparkles } from 'lucide-react'
import { apiClient as api } from '../utils/apiClient'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const phoneNumber = "+918890301264";

  const email = "support@mentriqtechnologies.in";
  const subject = "Support Request";
  const body = "Hello, I need help with...";

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const mapsLink = "https://www.google.com/maps/place/MentriQ+Technologies/@26.8032657,75.8052318,17z/data=!4m14!1m7!3m6!1s0x396dcb785ab8c2cb:0x4bac0e52b5e07df!2s2nd+floor,+34%2F57,+Haldighati+Marg+E,+Sanganer,+Sector+3,+Pratap+Nagar,+Jaipur,+Rajasthan+302033!3b1!8m2!3d26.8032657!4d75.8052318!3m5!1s0x396dcb31ccbce14d:0x9f153a03ffb8fdd0!8m2!3d26.8023101!4d75.8047414!16s%2Fg%2F11yy2ld3gd?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D";

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 3D Tilt Logic
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = (mouseX / width) - 0.5
    const yPct = (mouseY / height) - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/contact', formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactCards = [
    {
      icon: Mail,
      title: 'Secure Email',
      value: email,
      link: mailtoLink,
      desc: 'Inquiry & Support',
      iconClass: 'bg-indigo-50 border-indigo-100 text-indigo-600',
      hoverIconClass: 'group-hover:bg-indigo-600 group-hover:text-white'
    },
    {
      icon: Phone,
      title: 'Direct Line',
      value: phoneNumber,
      link: `tel:${phoneNumber}`,
      desc: 'Priority Channel',
      iconClass: 'bg-cyan-50 border-cyan-100 text-cyan-600',
      hoverIconClass: 'group-hover:bg-cyan-600 group-hover:text-white'
    },
    {
      icon: MapPin,
      title: 'HQ Location',
      value: 'MentriQ Technologies, Sector 3, Jaipur',
      link: mapsLink,
      desc: 'Global Operations',
      iconClass: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      hoverIconClass: 'group-hover:bg-emerald-600 group-hover:text-white'
    }
  ];

  return (
    <div className="min-h-screen pt-0 bg-white selection:bg-indigo-500/20">
      {/* Contact Hero Section */}
      <section className="relative min-h-[56vh] flex items-center text-slate-900 overflow-hidden pt-32 pb-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/8 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[100px]" />
          <div className="absolute inset-0 theme-dot-grid opacity-[0.22]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 mb-8 px-6 py-2 rounded-full bg-white/90 border border-slate-200 shadow-sm backdrop-blur-md"
          >
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">Available for Consultation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter"
          >
            Let's Start a
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">
              Conversation
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl max-w-4xl mx-auto mb-12 text-slate-600 leading-relaxed font-medium"
          >
            Got a question about our programs or need career advice? <br />
            Our team of mentors is just <span className="text-slate-900">one message away</span>.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-20 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="mb-10 pt-8">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 tracking-tighter uppercase leading-none">
                Get in <span className="theme-gradient-text">Touch</span>
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-md">
                Reach out via our secure channels. Our response team is standing by for <span className="text-slate-900 font-bold">real-time</span> support.
              </p>
            </div>

            <div className="space-y-6" style={{ perspective: "1000px" }}>
              {contactCards.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.link}
                  target={item.link.startsWith('http') ? '_blank' : '_self'}
                  whileHover={{
                    x: 10,
                    scale: 1.02,
                    rotateY: -5,
                    translateZ: 30,
                    boxShadow: '0 25px 50px -12px rgba(7, 14, 30, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-6 p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/70 transition-all duration-500 group relative overflow-hidden"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Holographic Layer Accent */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 shadow-inner group-hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] relative overflow-hidden ${item.iconClass} ${item.hoverIconClass}`}>
                    <item.icon size={28} strokeWidth={2.5} className="relative z-10" />
                    {/* Pulsing Halo */}
                    <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 rounded-full transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-600 transition-colors leading-none">{item.title}</h3>
                      <div className="h-1 w-1 bg-slate-300 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-400 italic">{item.desc}</span>
                    </div>
                    <p className="text-lg md:text-xl text-slate-900 font-black tracking-tight group-hover:translate-x-1 transition-transform">{item.value}</p>
                  </div>

                  {/* Tech Grid Micro-Accent */}
                  <div className="absolute top-4 right-4 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity">
                    <Sparkles className="w-6 h-6 text-slate-900" />
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="pt-8 flex gap-4">
              {[
                { icon: Instagram, color: 'hover:bg-pink-600', link: 'https://www.instagram.com/mentriqtechnologies/' },
                { icon: Linkedin, color: 'hover:bg-blue-700', link: 'https://www.linkedin.com/company/mentriqtechnologies/' },
                { icon: Twitter, color: 'hover:bg-sky-600', link: 'https://x.com' },
                { icon: MessageCircle, color: 'hover:bg-green-600', link: 'https://wa.me/918890301264' }
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className={`w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 ${social.color} hover:text-white shadow-lg shadow-slate-200/60 transition-all duration-300`}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form - Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: "1500px" }}
          >
            {/* 3D Depth Card - Behind the main form */}
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="absolute inset-0 bg-indigo-500/5 rounded-[3rem] -translate-x-4 translate-y-4 blur-sm -z-20"
            />

            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="rounded-[2.2rem] p-8 md:p-12 bg-white border border-slate-200 shadow-2xl shadow-slate-200/70 relative overflow-hidden group"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500" />
              {/* HUD Corner Brackets - Interactive */}
              <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-indigo-500/20 rounded-tl-xl transition-all group-hover:border-indigo-500 group-hover:scale-110" />
              <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-cyan-500/20 rounded-br-xl transition-all group-hover:border-cyan-500 group-hover:scale-110" />

              <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center gap-3">
                  Send us a Message
                  <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
                </h2>
                <p className="text-slate-600 font-medium mb-10">We're ready to engineer your future.</p>

                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-20"
                  >
                    <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12">
                      <Send className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Message Sent!</h3>
                    <p className="text-lg text-slate-600 font-medium mb-12">We've received your inquiry and will reach out shortly.</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-xl shadow-indigo-500/30"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Name Field */}
                      <div className="space-y-3">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                        <div className="relative group/input">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={20} />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 transition-all font-bold text-slate-900 placeholder:text-slate-400 shadow-inner"
                            placeholder="Your Name"
                          />
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="space-y-3">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                        <div className="relative group/input">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={20} />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 transition-all font-bold text-slate-900 placeholder:text-slate-400 shadow-inner"
                            placeholder="Email"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Phone Field */}
                      <div className="space-y-3">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                        <div className="relative group/input">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={20} />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 transition-all font-bold text-slate-900 placeholder:text-slate-400 shadow-inner"
                            placeholder="Phone"
                          />
                        </div>
                      </div>

                      {/* Subject Field */}
                      <div className="space-y-3">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                        <div className="relative group/input">
                          <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={20} />
                          <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 transition-all font-bold text-slate-900 placeholder:text-slate-400 shadow-inner"
                            placeholder="Subject"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Message Field */}
                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                      <div className="relative group/input">
                        <MessageSquare className="absolute left-5 top-6 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={20} />
                        <textarea
                          rows="4"
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 transition-all font-bold text-slate-900 placeholder:text-slate-400 resize-none shadow-inner"
                          placeholder="Tell us everything..."
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 animate-shake">
                        {error}
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02, y: -2, rotateX: -5 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      className={`w-full py-5 text-white font-black rounded-[1.5rem] transition-all flex items-center justify-center gap-3 text-lg ${loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)]'
                        }`}
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={22} strokeWidth={2.5} />
                          <span>SEND SECURE MESSAGE</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
