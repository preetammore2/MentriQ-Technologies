import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, ArrowRight } from 'lucide-react'
import CourseCard from '../components/courses/CourseCard'
import { apiClient } from '../utils/apiClient'
import { useNavigate } from 'react-router-dom'

const CoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get('/courses')
        const data = Array.isArray(response.data) ? response.data : []
        const regularCourses = data.filter(c => c.category !== 'Training')
        setCourses(regularCourses)
      } catch (error) {
        console.log(error);
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-0 bg-white">
      {/* Premium Light Hero Section */}
      <section className="relative min-h-[50vh] flex items-center bg-white overflow-hidden pt-28 pb-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              x: [0, 80, 0],
              y: [0, 40, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] left-1/4 w-[600px] h-[600px] bg-indigo-100/60 rounded-full blur-[140px]"
          />
          <motion.div
            animate={{
              x: [0, -60, 0],
              y: [0, 70, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] right-1/4 w-[600px] h-[600px] bg-cyan-100/50 rounded-full blur-[140px]"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 mb-8 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100"
            >
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">New Courses Added</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] mb-6 tracking-tighter uppercase font-display text-slate-900">
              MASTER MODERN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">
                TECHNOLOGIES.
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-500 max-w-xl leading-relaxed mb-8 font-medium">
              Unlock your potential with our curated selection of high-impact courses. Hand-picked lessons from industry titans designed to <span className="text-slate-900 font-bold">skyrocket your career</span>.
            </p>

            <div className="flex flex-wrap gap-5">
              <button onClick={() => navigate("/contact")} className="group px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                Start Learning Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 font-bold hover:bg-slate-200 transition-all duration-300">
                Browse Path
              </button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE with 3D Depth */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="hidden lg:flex justify-end perspective-1000"
          >
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000" />

              <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl transform transition-all duration-700 group-hover:scale-105 group-hover:-rotate-2">
                <img
                  src="/images/learning4.jpg"
                  alt="Premium Course Learning"
                  className="w-full max-w-lg object-cover"
                />
                {/* Glass Overlays */}
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/40 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">98%</div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none mb-1">Success Rate</p>
                      <p className="text-xs text-indigo-600 font-bold">Industry standards verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-16">
          {/* Search Bar with 3D depth */}
          <div className="relative flex-1 max-w-2xl w-full group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5 group-hover:scale-110 transition-transform" />
              <input
                type="text"
                placeholder="Search for your next skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-indigo-500/5 focus:shadow-indigo-500/10 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-300 text-lg placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Stats with Glass Effect */}
          <motion.div
            whileHover={{ y: -5 }}
            className="flex items-center space-x-5 bg-white/80 backdrop-blur-md p-3 pr-8 rounded-3xl border border-white shadow-xl shadow-indigo-500/5"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 tracking-tight">{filteredCourses.length}</div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest opacity-80">Available Courses</div>
            </div>
          </motion.div>
        </div>


        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-100 rounded-3xl h-96"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        )}

        {/* No courses */}
        {filteredCourses.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-8">Try adjusting your search terms</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CoursesPage