import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Award } from 'lucide-react'
import CourseCard from '../components/courses/CourseCard'
import { apiClient } from '../utils/apiClient'

const TrainingPage = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, internshipsRes] = await Promise.all([
                    apiClient.get('/courses'),
                    apiClient.get('/internships')
                ])

                const trainingCourses = coursesRes.data.filter(c => c.category === 'Training').map(c => ({ ...c, type: 'course', baseUrl: '/training' }))
                const internships = internshipsRes.data.filter(i => i.status === 'Active').map(i => ({
                    ...i,
                    type: 'internship',
                    baseUrl: '/internship/apply',
                    // Internships are paid programs, not stipend-based
                    duration: i.duration,
                    level: i.company
                }))

                setItems([...trainingCourses, ...internships])
            } catch (error) {
                console.log('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="min-h-screen pt-0 bg-white">
            {/* Training Hero Section */}
            <section className="relative min-h-[70vh] flex items-center bg-[#0f172a] text-white overflow-hidden pt-32 pb-20">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] opacity-50" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 mb-8 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                    >
                        <Award size={16} className="text-cyan-400" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Certifications Included</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-glow"
                    >
                        Professional
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            Training
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 text-gray-400 leading-relaxed font-medium"
                    >
                        Accelerate your career with elite-level training programs. Master complex systems through
                        <span className="text-white"> hands-on deep dives</span> and expert guidance.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        {[
                            { icon: BookOpen, text: 'Live Intensity', color: 'indigo' },
                            { icon: Award, text: 'Degree Equivalent', color: 'cyan' },
                            { icon: Search, text: 'Global Placement', color: 'indigo' }
                        ].map((item, idx) => {
                            const Icon = item.icon
                            return (
                                <span key={idx} className="group px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-gray-200 flex items-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                                    <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="font-bold tracking-tight">{item.text}</span>
                                </span>
                            )
                        })}
                    </motion.div>
                </div>
            </section>


            {/* Search + Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-glow">
                <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-20">
                    {/* Search Bar with 3D depth */}
                    <div className="relative flex-1 max-w-2xl w-full group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5 group-hover:scale-110 transition-transform" />
                            <input
                                type="text"
                                placeholder="Search training programs..."
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
                            <div className="text-3xl font-black text-gray-900 tracking-tight">{filteredItems.length}</div>
                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest opacity-80">Opportunities</div>
                        </div>
                    </motion.div>
                </div>


                {/* Courses Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-gray-100 rounded-3xl h-96"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <CourseCard course={item} baseUrl={item.baseUrl} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* No courses */}
                {filteredItems.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 col-span-full"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No training found</h3>
                        <p className="text-gray-500 mb-8">Try different search term</p>
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

export default TrainingPage
