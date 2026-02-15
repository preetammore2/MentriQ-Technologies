import { motion } from 'framer-motion'
import React, { useState } from 'react'
import {
    Users,
    Target,
    Award,
    Zap,
    CheckCircle2,
    Building2,
    Send,
    Code2,
    PieChart,
    Palette,
    LineChart,
    MapPin,
    Clock,
    Briefcase,
    ExternalLink
} from 'lucide-react'
import { useEffect } from 'react'
import { apiClient as api } from '../utils/apiClient'

const RecruitPage = () => {
    const [jobs, setJobs] = useState([])
    const [jobsLoading, setJobsLoading] = useState(true)
    const [formData, setFormData] = useState({
        company: '',
        name: '',
        email: '',
        hiringNeeds: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get('/jobs?isActive=true')
                setJobs(data)
            } catch (err) {
                console.error("Failed to fetch jobs:", err)
            } finally {
                setJobsLoading(false)
            }
        }
        fetchJobs()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        setSubmitted(true)
    }

    const whyRecruit = [
        {
            title: 'Pre-Vetted Talent',
            desc: 'Every student undergo rigorous technical assessments and project-based evaluations.',
            icon: Target,
            color: 'indigo'
        },
        {
            title: 'Industry-Ready Skills',
            desc: 'Our curriculum is designed by industry experts with a focus on real-world tools.',
            icon: Zap,
            color: 'cyan'
        },
        {
            title: 'Zero Hiring Costs',
            desc: 'Access our talent pool at no cost to your organization. We focus on impact.',
            icon: Award,
            color: 'purple'
        },
        {
            title: 'Scalable Solutions',
            desc: 'From interns to full-time professionals, find the right fit for your team.',
            icon: Users,
            color: 'blue'
        }
    ]

    const talentDomains = [
        { name: 'Full Stack Development', icon: Code2, students: '120+' },
        { name: 'Data Analytics', icon: PieChart, students: '85+' },
        { name: 'UI/UX Design', icon: Palette, students: '45+' },
        { name: 'Business Analysis', icon: LineChart, students: '60+' }
    ]

    const steps = [
        { number: '01', title: 'Post Requirement', desc: 'Share your hiring needs and job descriptions with us.' },
        { number: '02', title: 'Talent Shortlisting', desc: 'We filter the best candidates based on your criteria.' },
        { number: '03', title: 'Direct Interviews', desc: 'Schedule and conduct interviews with our pre-vetted students.' },
        { number: '04', title: 'Seamless Onboarding', desc: 'Welcome your new team members and start building.' }
    ]

    return (
        <div className="min-h-screen pt-0 bg-white selection:bg-indigo-100">
            {/* Recruit Hero Section */}
            <section className="relative min-h-[70vh] flex items-center bg-[#0f172a] text-white overflow-hidden pt-32 pb-20">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px]" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center space-x-2 mb-8 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                            >
                                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Hire Top Tier Talent</span>
                            </motion.div>

                            <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
                                Build Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                    Dream Team
                                </span>
                            </h1>

                            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
                                Connect with pre-vetted, industry-ready professionals trained in the latest technologies. No hiring fees, just exceptional talent.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#hire-form"
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 group shadow-xl shadow-indigo-600/20"
                                >
                                    Start Hiring Now
                                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <div className="flex -space-x-3 items-center ml-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-gray-800 flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                        </div>
                                    ))}
                                    <span className="ml-6 text-sm text-gray-500 font-bold uppercase tracking-widest pl-4">
                                        500+ Students Placed
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="hidden lg:block relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-[80px]" />
                            <div className="relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-[2rem] p-10">
                                <div className="grid grid-cols-2 gap-6">
                                    {talentDomains.map((domain, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                            <domain.icon size={32} className="text-indigo-400 mb-4" />
                                            <div className="text-white font-black text-2xl">{domain.students}</div>
                                            <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">{domain.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Active Opportunities Section */}
            <section className="py-24 bg-white relative z-20 -mt-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                        <div className="text-left">
                            <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs">Current Openings</span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 tracking-tight">
                                Active <span className="text-indigo-600">Opportunities</span>
                            </h2>
                        </div>
                        <p className="text-gray-500 font-medium max-w-md text-sm md:text-base">
                            Explore career-defining roles from our top corporate partners. Pre-vetted roles for MentriQ students.
                        </p>
                    </div>

                    {jobsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-gray-100 rounded-[2rem] animate-pulse" />
                            ))}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <Briefcase className="text-gray-300" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">New roles coming soon!</h3>
                            <p className="text-gray-500">We're curating exclusive opportunities for you.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {jobs.map((job, idx) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                            <Briefcase size={28} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100">
                                            {job.type}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="text-gray-500 font-bold text-sm mb-6 flex items-center gap-2">
                                        <Building2 size={16} className="text-indigo-400" />
                                        {job.company}
                                    </div>

                                    <div className="space-y-3 mb-8 flex-1">
                                        <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                            <MapPin size={16} className="text-gray-300" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                            <Clock size={16} className="text-gray-300" />
                                            Posted {new Date(job.postedDate).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <a
                                        href={job.applicationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors group/btn"
                                    >
                                        Apply Now
                                        <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-16 tracking-tight">
                        Why Employers <span className="text-indigo-600">Choose MentriQ</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whyRecruit.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <item.icon className={`text-${item.color}-600`} size={28} />
                                </div>
                                <h3 className="text-xl font-extrabold text-gray-900 mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs">Seamless Experience</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 tracking-tight">
                            Our Hiring <span className="text-indigo-600">Process</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-[60px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-100 to-transparent" />

                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative z-10 group"
                            >
                                <div className="w-20 h-20 rounded-full bg-white border-2 border-indigo-100 shadow-xl flex items-center justify-center mb-8 mx-auto lg:mx-0 group-hover:border-indigo-600 transition-colors">
                                    <span className="text-3xl font-black text-indigo-600">{step.number}</span>
                                </div>
                                <h4 className="text-xl font-extrabold text-gray-900 mb-4 text-center lg:text-left">{step.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed text-center lg:text-left">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hire Form Section */}
            <section id="hire-form" className="py-24 bg-[#0f172a] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />

                <div className="relative max-w-5xl mx-auto px-6">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[3rem] p-8 md:p-16 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div>
                                <h2 className="text-4xl font-black text-white mb-8 tracking-tighter">
                                    Connect with <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic font-medium">
                                        The Best Talent
                                    </span>
                                </h2>
                                <p className="text-gray-400 mb-10 leading-relaxed font-medium">
                                    Fill out the form and our specialized recruitment partnership team will get in touch within 24 hours to help you find the perfect match.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { icon: CheckCircle2, text: 'Customized talent curations' },
                                        { icon: CheckCircle2, text: 'Direct access to student profiles' },
                                        { icon: CheckCircle2, text: 'Dedicated partnership manager' }
                                    ].map((feat, i) => (
                                        <div key={i} className="flex items-center gap-4 text-white font-bold tracking-tight">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                <feat.icon size={16} className="text-cyan-400" />
                                            </div>
                                            {feat.text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full flex flex-col items-center justify-center text-center p-10 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
                                            <Send size={32} className="text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-2">Message Received!</h3>
                                        <p className="text-indigo-200">Our team will contact you shortly.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-5">
                                            <div>
                                                <label className="text-xs font-black uppercase tracking-widest text-indigo-300 block mb-2 px-1">Company</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Acme Corp"
                                                    value={formData.company}
                                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:bg-white/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-black uppercase tracking-widest text-indigo-300 block mb-2 px-1">Your Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:bg-white/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-indigo-300 block mb-2 px-1">Work Email</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="john@company.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:bg-white/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-indigo-300 block mb-2 px-1">Hiring Needs</label>
                                            <select
                                                value={formData.hiringNeeds}
                                                onChange={e => setFormData({ ...formData, hiringNeeds: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:bg-white/10 focus:border-indigo-500 outline-none transition-all font-medium appearance-none"
                                            >
                                                <option className="bg-[#0f172a]">Full Stack Interns</option>
                                                <option className="bg-[#0f172a]">Full-time Software Engineers</option>
                                                <option className="bg-[#0f172a]">Data Analysts</option>
                                                <option className="bg-[#0f172a]">UI/UX Designers</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-indigo-300 block mb-2 px-1">Message (Optional)</label>
                                            <textarea
                                                rows="4"
                                                placeholder="Tell us about your requirements..."
                                                value={formData.message}
                                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:bg-white/10 focus:border-indigo-500 outline-none transition-all font-medium resize-none"
                                            />
                                        </div>
                                        <button
                                            disabled={isSubmitting}
                                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Sending...' : 'Register as Partner'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default RecruitPage
