import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Users, UserCog, KanbanSquare, Code, ClipboardCheck, BookOpen, Award, Clock, CheckCircle, Star, Globe, Smartphone, Palette, Megaphone, Server, Shield, Database, Layers, Target, Sparkles, GraduationCap, Briefcase, TrendingUp, Zap, HeadphonesIcon, FileCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiClient as api } from '../utils/apiClient'
import Hero3DElement from '../components/home/Hero3DElement'
import MentorsSection from '../components/home/MentorsSection.jsx'
import { Simple3DTestimonial } from '../components/ui/simple-3d-testimonial'
import SectionErrorBoundary from '../components/common/SectionErrorBoundary'

const HomePage = () => {
    const { login, register } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [services, setServices] = useState([])
    const [statsData, setStatsData] = useState(null)
    const [dynamicPartners, setDynamicPartners] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    // Fetch all dynamic data
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [servicesRes, statsRes, partnersRes] = await Promise.all([
                    api.get('/services'),
                    api.get('/stats'),
                    api.get('/partners')
                ])

                setServices(servicesRes.data.slice(0, 6))
                setStatsData(statsRes.data)
                setDynamicPartners(partnersRes.data)
            } catch (error) {
                console.error('Failed to fetch home page data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAllData()
    }, [])

    // Icon mapping for services
    const iconMap = {
        'Globe': Globe,
        'Smartphone': Smartphone,
        'Palette': Palette,
        'Megaphone': Megaphone,
        'Server': Server,
        'Shield': Shield,
        'Database': Database,
        'Code': Code,
        'Layers': Layers
    }


    const stats = [
        { number: '2K+', icon: GraduationCap, label: 'Students Trained', color: 'from-indigo-500 to-indigo-600' },
        { number: '50+', icon: BookOpen, label: 'Live Courses', color: 'from-cyan-500 to-cyan-600' },
        { number: '98%', icon: TrendingUp, label: 'Placement Rate', color: 'from-purple-500 to-purple-600' },
        { number: '60+', icon: Users, label: 'Expert Trainers', color: 'from-blue-500 to-blue-600' }
    ]


    const features = [
        {
            title: 'Live Interactive Classes',
            description: 'Engage in real-time learning sessions with industry-leading experts',
            icon: Sparkles,
            color: 'from-blue-600 to-blue-700'
        },
        {
            title: 'Hands-on Projects',
            description: 'Build production-grade projects that showcase your expertise',
            icon: Code,
            color: 'from-indigo-600 to-indigo-700'
        },
        {
            title: 'Career Certification',
            description: 'Earn industry-recognized credentials with placement assistance',
            icon: GraduationCap,
            color: 'from-purple-600 to-purple-700'
        },
        {
            title: '24/7 Expert Support',
            description: 'Access dedicated mentorship and doubt resolution anytime',
            icon: HeadphonesIcon,
            color: 'from-cyan-600 to-cyan-700'
        },
        {
            title: 'Industry Curriculum',
            description: 'Master in-demand skills aligned with market requirements',
            icon: Target,
            color: 'from-emerald-600 to-emerald-700'
        },
        {
            title: 'Career Mentorship',
            description: 'Receive personalized guidance for accelerated growth',
            icon: Briefcase,
            color: 'from-orange-600 to-orange-700'
        },
        {
            title: 'Live Coding Labs',
            description: 'Practice through interactive coding challenges and workshops',
            icon: Zap,
            color: 'from-pink-600 to-pink-700'
        },
        {
            title: 'Assignment Reviews',
            description: 'Get detailed feedback with comprehensive solution analysis',
            icon: FileCheck,
            color: 'from-rose-600 to-rose-700'
        },
    ]

    const testimonials = [
        {
            name: "Rakshit Chasta",
            feedback: "MentriQ helped me build real projects and crack my first job.",
            image: "/images/rakshit.jpeg",
        },
        {
            name: "Bhupendra Shekhawat",
            feedback: "Live classes and mentor support were outstanding.",
            image: "/images/bhupendra.jpg",
        },
        {
            name: "Amit Naruka",
            feedback: "I gained confidence after completing hands-on projects.",
            image: "/images/amit.jpg",
        },
        {
            name: "Aryan Barot",
            feedback: "The course helped me understand core programming concepts in a very practical way.",
            image: "/images/barot.jpg",
        },
        {
            name: "Krishan Rajawat",
            feedback: "Hands-on projects made learning technology much easier and more interesting.",
            image: "/images/krishnarajawat.jpg",
        },
        {
            name: "Bhanu Pratap",
            feedback: "The instructor explained complex topics like backend and databases very clearly.",
            image: "/images/bhanu2.jpeg",
        },
        {
            name: "Disha sharma",
            feedback: "Real-world examples helped me understand how tech is used in the industry.",
            image: "/images/disha3.jpeg",
        },
        {
            name: "Saloni Choudhary",
            feedback: "The learning materials were up to date with current technologies.",
            image: "/images/saloni.jpg",
        },
        {
            name: "Garv Bhatiya",
            feedback: "I learned how frontend and backend work together in real applications.",
            image: "/images/garv.jpg",
        },
        {
            name: "Vaibhav Sharma",
            feedback: "The course structure was well-organized and beginner-friendly.",
            image: "/images/vaibhav.jpg",
        },
        {
            name: "Shikhar Singhal",
            feedback: "Mentors helped me improve my logical thinking and coding practices.",
            image: "/images/sikhar.jpg",
        },
        {
            name: "Rohit Sharma",
            feedback: "Industry-level projects gave me a clear idea of real software development.",
            image: "/images/rohit.jpg",
        },
        {
            name: "Krati Khandelwal",
            feedback: "Practical labs helped me gain hands-on experience with tools and frameworks.",
            image: "/images/krati.jpg",
        },
        {
            name: "Pratyush Shrivastav",
            feedback: "The course helped me prepare for internships and technical interviews.",
            image: "/images/praytush.jpg",
        },
        {
            name: "Aditya Pratap",
            feedback: "Support from mentors was quick and very helpful.",
            image: "/images/aditya.jpg",
        },
        {
            name: "Anushka Jain",
            feedback: "Overall, this tech course was very useful and career-oriented.",
            image: "/images/anushka.jpg",
        },
        {
            name: "Harsh Singh",
            feedback: "Regular assessments helped me track my learning progress.",
            image: "/images/harsh.jpg",
        },
        {
            name: "Mohit Kumar",
            feedback: "Doubt-clearing sessions were very helpful and interactive.",
            image: "/images/mohit.jpg",
        },
        {
            name: "Prince Sharma",
            feedback: "I enjoyed learning new technologies like React.js and Node.js through this course.",
            image: "/images/prince.jpg",
        },
        {
            name: "Kunal Pandey",
            feedback: "Learning in a project-based way made it easier to remember concepts.",
            image: "/images/kunal.jpg",
        },
    ]

    const partners = [
        { name: "HD Media Network", logo: "/images/hdmn.png" },
        { name: "SkyServer", logo: "/images/skyserver.jpg" },
        { name: "Singh Enterprises", logo: "/images/singh2.jpeg" },
        { name: "Falcons Beyond Imagination", logo: "/images/falcons.png" },
        { name: "Voltzenic Motors", logo: "/images/volt.png" },
        { name: "Ashok Infratech", logo: "/images/ashok.jpg" },
        { name: "Shekhawat Group of Industries", logo: "/images/shekhawat2.jpeg" },
        { name: "BIMPro Solutions pvt ltd", logo: "/images/bimpro2.jpeg" },
        { name: "Milan Power", logo: "/images/milanPower.png" },
        { name: "PU incent", logo: "/images/puIncent.png" },
        { name: "UPnex", logo: "/images/upnex2.jpeg" },
        { name: "NT Education", logo: "/images/nt2.jpeg" },
    ]

    const technologies = [
        { name: "HTML", logo: "/images/html.png" },
        { name: "CSS", logo: "/images/css.png" },
        { name: "JavaScript", logo: "/images/js.png" },
        { name: "React", logo: "/images/react.png" },
        { name: "Node.js", logo: "/images/Node.js_logo.svg.png" },
        { name: "Express.js", logo: "/images/express3.webp" },
        { name: "MongoDB", logo: "/images/mongodb4.png" },
        { name: "SQL", logo: "/images/sql.png" },
        { name: "DevOps", logo: "/images/deveops.svg" },
        { name: "Cyber Security", logo: "/images/security.png" },
        { name: "Java", logo: "/images/java2.webp" },
        { name: "Blockchain", logo: "/images/blockchain.png" },
        { name: "Flutter", logo: "/images/flutter5.png" },
        { name: "Python", logo: "/images/python.png" },
        { name: "Data Analyst", logo: "/images/bigdata.png" },
        { name: "Power BI", logo: "/images/powerBI.png" },
    ]

    return (
        <>
            {/* Hero Section - Premium Light Theme */}
            <section className="relative min-h-screen flex items-center bg-white text-slate-900 overflow-hidden pt-32 pb-20">
                {/* Animated Background Elements - Refined for Light Mode */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px]" />
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-ping opacity-20" />
                    <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-700 opacity-20" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
                    {/* LEFT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 backdrop-blur-sm">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Industry-Leading Tech Education</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight mb-8 text-slate-900">
                            Transform Your Career with
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">
                                MentriQ Technologies
                            </span>
                        </h1>

                        <p className="text-xl text-slate-500 max-w-2xl leading-relaxed mb-10 font-medium">
                            Master in-demand technologies through expert-led training, hands-on projects, and comprehensive placement support. Join thousands of successful graduates.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <button
                                onClick={() => navigate("/courses")}
                                className="group px-10 py-5 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Explore Courses
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => navigate("/contact")}
                                className="px-10 py-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-all duration-300 shadow-sm"
                            >
                                Schedule a Call
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-400 font-semibold">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            <span>15-Day Money Back Guarantee</span>
                        </div>
                    </motion.div>

                    {/* RIGHT 3D Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                        className="hidden lg:flex justify-center items-center"
                    >
                        <SectionErrorBoundary fallback={<div className="w-full h-[320px] rounded-3xl bg-slate-50 border border-slate-100" />}>
                            <Hero3DElement />
                        </SectionErrorBoundary>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section - Premium Light Theme */}
            <section className="py-24 relative bg-slate-50">
                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">
                            Our Impact in Numbers
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                            Join thousands of successful professionals who transformed their careers with us
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { number: statsData?.students || '2K+', icon: GraduationCap, label: 'Students Trained', color: 'from-indigo-600 to-indigo-700' },
                            { number: statsData?.courses || '50+', icon: BookOpen, label: 'Live Courses', color: 'from-cyan-600 to-cyan-700' },
                            { number: statsData?.placements || '98%', icon: TrendingUp, label: 'Placement Rate', color: 'from-purple-600 to-purple-700' },
                            { number: statsData?.trainers || '60+', icon: Users, label: 'Expert Trainers', color: 'from-blue-600 to-blue-700' }
                        ].map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    viewport={{ once: true }}
                                    className="relative bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-indigo-100 group text-center transition-all duration-500 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.1)]"
                                >
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-20 h-20 mb-8 bg-gradient-to-br ${stat.color} rounded-[1.5rem] text-white shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                        <Icon className="w-10 h-10" strokeWidth={2.5} />
                                    </div>

                                    {/* Number */}
                                    <div className="text-5xl md:text-6xl font-black text-slate-900 mb-3 tracking-tighter">
                                        {stat.number}
                                    </div>

                                    {/* Label */}
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                                        {stat.label}
                                    </div>

                                    {/* Hover Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-cyan-50/0 group-hover:from-indigo-50/20 group-hover:to-cyan-50/20 rounded-[2.5rem] transition-all duration-500 pointer-events-none" />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section - Interactive Dark Theme */}
            <section className="py-12 md:py-20 bg-gradient-to-b from-[#0f172a] via-slate-900 to-slate-800 overflow-hidden relative">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Why Choose MentriQ?
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Everything you need to launch a successful career in technology
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30, rotateX: -15 }}
                                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10, scale: 1.03, rotateY: 5 }}
                                    className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-black/20 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-500 relative overflow-hidden cursor-pointer"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Animated Border Gradient */}
                                    <motion.div
                                        animate={{
                                            rotate: [0, 360]
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: 'linear'
                                        }}
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 blur-xl opacity-30" />
                                    </motion.div>

                                    {/* Icon with Pulse */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            delay: index * 0.2
                                        }}
                                        className={`relative w-18 h-18 mb-6 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-2xl shadow-${feature.color.split('-')[1]}-500/30 group-hover:scale-110 transition-all duration-500`}
                                    >
                                        <Icon className="w-9 h-9 text-white" strokeWidth={2.5} />
                                        <div className="absolute inset-0 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-all" />
                                    </motion.div>

                                    <h3 className="relative text-xl font-black text-white mb-3 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
                                    <p className="relative text-gray-300 leading-relaxed text-[15px] group-hover:text-gray-100 transition-colors">{feature.description}</p>

                                    {/* Bottom Accent */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Services Section - Premium Light 3D Theme */}
            <section className="py-24 bg-white overflow-hidden relative">
                {/* Ambient Depth Shadows - Refined for Light Mode */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-50 to-transparent" />
                    <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <motion.div
                            className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-indigo-50 border border-indigo-100 mb-6"
                        >
                            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                            <span className="text-indigo-600 text-[10px] font-black tracking-widest uppercase">Expert Solutions</span>
                        </motion.div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Services</span>
                        </h2>
                        <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">
                            Architecting the future of intelligence with comprehensive technology stacks.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const IconComponent = iconMap[service.icon] || Code
                            const gradients = [
                                'from-blue-600 to-blue-700',
                                'from-indigo-600 to-indigo-700',
                                'from-purple-600 to-purple-700',
                                'from-cyan-600 to-cyan-700',
                                'from-emerald-600 to-emerald-700',
                                'from-rose-600 to-rose-700'
                            ]
                            const gradient = gradients[index % gradients.length]

                            return (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -12 }}
                                    onClick={() => navigate('/services')}
                                    className="group bg-white rounded-[2.5rem] p-8 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] border border-slate-100 hover:border-indigo-100 hover:shadow-[0_30px_70px_-20px_rgba(79,70,229,0.12)] transition-all duration-700 relative overflow-hidden cursor-pointer"
                                >
                                    {/* Glassy Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    {/* 3D Icon Container */}
                                    <div className="relative mb-8 pt-2">
                                        <motion.div
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.8, ease: "anticipate" }}
                                            className={`w-18 h-18 bg-gradient-to-br ${gradient} rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 relative z-10`}
                                        >
                                            <IconComponent className="w-9 h-9 text-white" strokeWidth={2.5} />
                                        </motion.div>
                                        <div className={`absolute -inset-2 bg-gradient-to-br ${gradient} rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700`} />
                                    </div>

                                    <h3 className="relative text-xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{service.title}</h3>
                                    <p className="relative text-slate-500 leading-relaxed mb-8 text-[15px] group-hover:text-slate-700 transition-colors font-medium">{service.description}</p>

                                    {service.features && service.features.length > 0 && (
                                        <div className="relative space-y-3 pt-6 border-t border-slate-50 group-hover:border-indigo-50 transition-colors">
                                            {service.features.slice(0, 3).map((feature, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    whileHover={{ x: 8 }}
                                                    className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-600 transition-all font-semibold"
                                                >
                                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full group-hover:scale-125 group-hover:bg-indigo-600 transition-all" />
                                                    <span>{feature}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Mouse-reactive Light Reflection */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden transition-opacity duration-1000">
                                        <div className="absolute top-0 -left-[100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine" />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {services.length > 6 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mt-16"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(79, 70, 229, 0.2)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/services')}
                                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:from-indigo-500 hover:to-cyan-500 transition-all duration-300"
                            >
                                View All Services
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Mentors Section - Advanced Perspective Carousel */}
            <MentorsSection />

            {/* Testimonials Section - Premium Light 3D Interactive Grid */}
            <section className="py-24 bg-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-indigo-50 border border-indigo-100 mb-6"
                    >
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        <span className="text-indigo-600 text-[10px] font-black tracking-widest uppercase">Verified Success Stories</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">
                        Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Impact</span>
                    </h2>
                </div>

                <div className="relative max-w-full">
                    <SectionErrorBoundary fallback={<div className="w-full h-40 rounded-3xl bg-slate-50 border border-slate-100" />}>
                        <Simple3DTestimonial testimonials={testimonials} />
                    </SectionErrorBoundary>
                </div>
            </section>


            {/* Partners Section - Premium Light 3D Dual-Scroller */}
            <section className="py-24 bg-white overflow-hidden relative">
                {/* Ambient Subtle Glows - Refined for Light Theme */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-cyan-50 border border-cyan-100 mb-6"
                        >
                            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                            <span className="text-cyan-600 text-[10px] font-black tracking-widest uppercase">Global Network</span>
                        </motion.div>

                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">
                            OUR HIRING <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">PARTNERS</span>
                        </h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                            Trusted by leading industry giants and high-growth technology ventures worldwide.
                        </p>
                    </motion.div>
                </div>

                <div
                    className="relative space-y-12 py-10"
                    style={{
                        perspective: '2000px',
                        maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)'
                    }}
                >
                    {/* Top Row - Scrolling Left */}
                    <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(5deg)' }}>
                        <motion.div
                            className="flex gap-8 w-max"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 40,
                                ease: "linear",
                            }}
                        >
                            {/* Dual Buffer for Seamless Loop */}
                            {(dynamicPartners.length > 0 ? [...dynamicPartners, ...dynamicPartners] : [...partners, ...partners]).map((partner, index) => (
                                <motion.div
                                    key={`top-${index}`}
                                    whileHover={{ y: -10, scale: 1.05, translateZ: 40 }}
                                    className="w-[216px] flex-shrink-0 bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-indigo-500/20 hover:bg-slate-50 shadow-xl flex flex-col items-center justify-center group transition-all duration-500 cursor-pointer overflow-hidden relative"
                                >
                                    {/* Logo Backglow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="h-20 w-full flex items-center justify-center mb-4 relative z-10">
                                        <img
                                            src={partner.logo || partner.imageUrl}
                                            alt={partner.name}
                                            className="max-h-14 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.05)]"
                                        />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors relative z-10">
                                        {partner.name}
                                    </p>

                                    {/* Scanline Overlay */}
                                    <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] pointer-events-none animate-scan" />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom Row - Scrolling Right */}
                    <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-5deg)' }}>
                        <motion.div
                            className="flex gap-8 w-max"
                            animate={{ x: ["-50%", "0%"] }}
                            transition={{
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 45,
                                ease: "linear",
                            }}
                        >
                            {/* Dual Buffer for Seamless Loop */}
                            {(dynamicPartners.length > 0 ? [...dynamicPartners, ...dynamicPartners] : [...partners, ...partners]).map((partner, index) => (
                                <motion.div
                                    key={`bottom-${index}`}
                                    whileHover={{ y: 10, scale: 1.05, translateZ: 40 }}
                                    className="w-[216px] flex-shrink-0 bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-cyan-500/20 hover:bg-slate-50 shadow-xl flex flex-col items-center justify-center group transition-all duration-500 cursor-pointer overflow-hidden relative"
                                >
                                    {/* Logo Backglow */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="h-20 w-full flex items-center justify-center mb-4 relative z-10">
                                        <img
                                            src={partner.logo || partner.imageUrl}
                                            alt={partner.name}
                                            className="max-h-14 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.05)]"
                                        />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.2em] group-hover:text-cyan-600 transition-colors relative z-10">
                                        {partner.name}
                                    </p>

                                    {/* Scanline Overlay */}
                                    <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] pointer-events-none animate-scan" />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Technologies Section - Premium Light 3D Perspective Scroller */}
            <section className="py-32 bg-white overflow-hidden relative">
                {/* Advanced Ambient Glows - Refined for Light Theme */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px]" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px]" />

                    {/* Background Tech Grid - Subtle for Light Theme */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 mb-24 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full bg-slate-50 border border-slate-100 mb-8 shadow-sm"
                    >
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                        <span className="text-indigo-600 text-[10px] font-black tracking-[0.4em] uppercase">Industry Standard Tech</span>
                        <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(8,145,178,0.5)]" />
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-none text-slate-900">
                        TECHNOLOGIES YOU'LL <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600">MASTER</span>
                    </h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Deployment-ready expertise in industry-standard tools and frameworks driving the <span className="text-slate-900">modern digital economy.</span>
                    </p>
                </div>

                {/* 3D Perspective Scroller Container */}
                <div
                    className="relative py-10"
                    style={{
                        perspective: '2000px',
                        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                    }}
                >
                    <motion.div
                        className="flex gap-8 px-4 w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 35,
                            ease: "linear",
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Dual Buffer for Seamless Loop */}
                        {[...technologies, ...technologies].map((tech, index) => (
                            <motion.div
                                key={index}
                                whileHover={{
                                    scale: 1.1,
                                    translateZ: 60,
                                    rotateX: 10,
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.08)'
                                }}
                                className="w-[180px] h-[200px] rounded-[2.5rem] bg-white/40 backdrop-blur-3xl border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-500 cursor-pointer"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* HUD Corner Accents - Refined for Light Theme */}
                                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-slate-200 rounded-tl-lg group-hover:border-indigo-400 transition-colors" />
                                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-slate-200 rounded-br-lg group-hover:border-cyan-400 transition-colors" />

                                {/* Internal Ambient Core */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Scanline Overlay - Subtle for Light Theme */}
                                <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] pointer-events-none overflow-hidden transition-opacity">
                                    <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(0,0,0,0.2)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan" />
                                </div>

                                {/* Floating Logo with Depth */}
                                <div className="relative mb-6 z-10" style={{ transform: 'translateZ(30px)' }}>
                                    <motion.img
                                        src={tech.logo}
                                        alt={tech.name}
                                        className="w-16 h-16 object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.05)] group-hover:drop-shadow-[0_10px_25px_rgba(79,70,229,0.2)] transition-all duration-500"
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, delay: (index % technologies.length) * 0.15 }}
                                    />
                                </div>

                                <div className="relative z-10 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-indigo-600 transition-colors duration-300">
                                        {tech.name}
                                    </p>
                                    <div className="w-8 h-0.5 bg-slate-100 mx-auto mt-2 rounded-full group-hover:w-12 group-hover:bg-indigo-400 transition-all duration-500" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Perspective Glow Floor - Light Theme */}
                <div className="h-24 w-full bg-gradient-to-b from-transparent to-white opacity-100 relative -top-12 z-0 pointer-events-none" />
            </section>

            {/* CTA Section - Premium Light Theme Upgrade */}
            <section className="pt-32 pb-16 bg-white relative overflow-hidden">
                {/* Background Pattern & Glows - Refined for Light Theme */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none" />

                <div className="relative max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-12 md:p-20 border border-slate-100 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden text-center group"
                    >
                        {/* Interactive Corner Brackets - Refined for Light Theme */}
                        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-slate-200 rounded-tl-xl transition-all group-hover:border-indigo-500 group-hover:scale-110" />
                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-slate-200 rounded-br-xl transition-all group-hover:border-cyan-500 group-hover:scale-110" />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div
                                className="inline-block py-1.5 px-5 rounded-full bg-indigo-50 border border-indigo-100 mb-8"
                            >
                                <span className="text-indigo-600 text-[10px] font-black tracking-[0.4em] uppercase">Phase: Launch</span>
                            </motion.div>

                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter uppercase leading-tight">
                                READY TO START <br />
                                YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 animate-gradient-x">JOURNEY?</span>
                            </h2>

                            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
                                Join <span className="text-slate-900 font-bold italic underline decoration-indigo-200">thousands</span> of students who have transformed their careers with MentriQ Technologies.
                            </p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(79, 70, 229, 0.2)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/courses")}
                                    className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black rounded-2xl shadow-xl flex items-center gap-3 group/btn uppercase tracking-widest text-sm"
                                >
                                    Explore Courses
                                    <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05, background: 'rgba(0,0,0,0.02)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/contact')}
                                    className="px-12 py-5 bg-transparent backdrop-blur-md border-2 border-slate-200 text-slate-700 font-black rounded-2xl transition-all uppercase tracking-widest text-sm"
                                >
                                    Contact Us
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* Energy Surge Overlay - Light Theme */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                </div>
            </section>
        </>
    )
}

export default HomePage
