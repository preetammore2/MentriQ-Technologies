import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react'
import { apiClient as api } from '../utils/apiClient'

const AboutPage = () => {
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const { data } = await api.get('/journey');
        if (data && data.length > 0) {
          // Map backend fields to frontend expected fields
          const formatted = data.map(m => ({
            year: m.year,
            title: m.title,
            desc: m.description
          }));
          setTimeline(formatted);
        } else {
          // Fallback to initial data if DB is empty
          setTimeline([
            { year: '2023', title: 'The Vision', desc: 'MentriQ Technologies was conceived with a mission to bridge the gap between classroom learning and industry requirements.' },
            { year: '2024', title: 'Founding & Growth', desc: 'Started our journey to skill students with cutting-edge tech. Successfully trained our first 500+ students with exceptional outcomes.' },
            { year: '2025', title: 'First Batch Impact', desc: 'Launched several high-impact Developer bootcamps achieving a peak 95% placement rate within 3 months of completion.' },
            { year: '2026', title: 'Technological Scale', desc: 'Expanded our curriculum to 50+ specialized courses, building a community of 2K+ highly skilled tech professional.' }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch journey milestones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  const [statsData, setStatsData] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats')
        setStatsData(data)
      } catch (error) {
        console.error("Failed to fetch global stats:", error)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    { number: statsData?.students || '2K+', icon: GraduationCap, label: 'Students Trained', color: 'from-indigo-500 to-indigo-600' },
    { number: statsData?.courses || '50+', icon: BookOpen, label: 'Live Courses', color: 'from-cyan-500 to-cyan-600' },
    { number: statsData?.placements || '98%', icon: TrendingUp, label: 'Placement Rate', color: 'from-purple-500 to-purple-600' },
    { number: statsData?.trainers || '60+', icon: Users, label: 'Expert Trainers', color: 'from-blue-500 to-blue-600' }
  ]

  return (
    <div className="min-h-screen pt-0 bg-white selection:bg-indigo-100">

      {/* About Hero Section */}
      <section className="relative min-h-[60vh] flex items-center bg-[#0f172a] text-white overflow-hidden pt-32 pb-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 mb-8 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Empowering Future Innovators</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-glow"
          >
            The Story of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              MentriQ
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 text-gray-400 leading-relaxed font-medium"
          >
            Since our inception in 2023, MentriQ has been the catalyst for transformation in the tech industry.
            We don't just teach code; <span className="text-white">we build careers</span>.
          </motion.p>
        </div>
      </section>

      {/* Stats - Premium Glassmorphism */}
      <section className="py-12 md:py-20 relative z-20 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-indigo-500/5 group text-center"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br ${stat.color} rounded-2xl text-white shadow-lg shadow-indigo-200 transform group-hover:rotate-12 transition-transform`}>
                    <Icon className="w-8 h-8" strokeWidth={2.5} />
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{stat.number}</div>
                  <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
                Our Mission & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Vision for 2030</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                Our relentless mission is to empower 1 million students globally with high-impact, job-ready tech skills.
                We are building the future of education where practical application meets expert mentorship.
              </p>

              <div className="space-y-6">
                {[
                  { text: 'Live Intensity Classes', color: 'indigo' },
                  { text: 'Portfolio-Ready Industrial Projects', color: 'cyan' },
                  { text: 'Elite Placement Assistance Program', color: 'indigo' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-3xl hover:bg-indigo-50 transition-colors group">
                    <div className={`w-12 h-12 rounded-2xl bg-${item.color}-100 flex items-center justify-center text-${item.color}-600 shrink-0 group-hover:scale-110 transition-transform`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* Decorative Background */}
              <div className="absolute -z-10 -top-20 -right-20 w-80 h-80 bg-indigo-50 rounded-full blur-[80px] opacity-60" />
              <div className="absolute -z-10 -bottom-20 -left-20 w-80 h-80 bg-cyan-50 rounded-full blur-[80px] opacity-60" />

              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img src='/images/About.webp' alt="About Team" className="w-full h-auto group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Journey - Modernized Timeline */}
      <section className="py-12 md:py-20 bg-[#f8fafc] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 md:mb-6 mb-4">Our Journey</h2>
            <div className="w-24 h-2 bg-indigo-600 mx-auto rounded-full" />
          </div>

          <div className="relative">
            {/* Center glowing line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-indigo-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="w-full h-1/2 bg-gradient-to-b from-transparent via-indigo-600 to-transparent"
              />
            </div>

            <div className="space-y-16">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Content Card */}
                  <div className="flex-1 w-full pl-16 md:pl-0">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all relative ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}
                    >
                      {/* Year badge */}
                      <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 mb-4`}>
                        {item.year}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 leading-tight">{item.title}</h3>
                      <p className="text-lg text-gray-600 leading-relaxed font-medium">{item.desc}</p>

                      {/* Anchor arrow for desktop */}
                      <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-gray-100 rotate-45 z-0 ${index % 2 === 0 ? '-right-2 border-l-0 border-b-0' : '-left-2 border-r-0 border-t-0'}`} />
                    </motion.div>
                  </div>

                  {/* 3D Dot Connector */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-indigo-600 shadow-xl flex items-center justify-center relative z-10 transition-transform hover:scale-125 duration-300">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-ping" />
                    </div>
                  </div>

                  {/* Spacer for empty side */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
