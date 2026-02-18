import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Key, ArrowRight, Loader2, Eye, EyeOff, UserRound, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const MotionDiv = motion.div;
const BUCKET_KEY = 'mentriq_admin_credential_bucket';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [credentialBucket, setCredentialBucket] = useState([]);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const from = location.state?.from?.pathname || '/admin/dashboard';

    useEffect(() => {
        try {
            const raw = localStorage.getItem(BUCKET_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setCredentialBucket(parsed);
        } catch {
            // ignore broken local data
        }
    }, []);

    const persistBucket = (nextBucket) => {
        setCredentialBucket(nextBucket);
        localStorage.setItem(BUCKET_KEY, JSON.stringify(nextBucket));
    };

    const saveCredentialToBucket = (nextEmail, nextPassword) => {
        if (!nextEmail || !nextPassword) return;
        const now = Date.now();
        const label = nextEmail.split('@')[0] || 'staff';
        const next = [
            { id: `${nextEmail}-${now}`, label, email: nextEmail, password: nextPassword, savedAt: now },
            ...credentialBucket.filter((item) => item.email !== nextEmail)
        ].slice(0, 5);
        persistBucket(next);
    };

    const applyBucketCredential = (item) => {
        setEmail(item.email);
        setPassword(item.password);
        toast.success(`Filled credentials for ${item.email}`);
    };

    const removeBucketCredential = (id) => {
        const next = credentialBucket.filter((item) => item.id !== id);
        persistBucket(next);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const sanitizedEmail = email.trim().toLowerCase();
            const result = await login(sanitizedEmail, password);
            if (result.success) {
                if (result.user.role === 'admin' || result.user.role === 'moderator') {
                    saveCredentialToBucket(sanitizedEmail, password);
                    toast.success('Staff access granted');
                    navigate(from, { replace: true });
                } else {
                    toast.error('Unauthorized: Staff access required');
                }
            } else {
                toast.error(result.message || 'Login failed');
            }
        } catch {
            toast.error('System error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 relative overflow-hidden font-inter">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'out' }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl shadow-indigo-950/50">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 ring-1 ring-white/30 overflow-hidden">
                            <img
                                src="/images/logo1.jpg"
                                alt="MentriQ Logo"
                                className="w-full h-full object-contain p-2"
                            />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Admin Portal</h1>
                        <p className="text-gray-400 text-sm">Secure access for platform administrators</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {credentialBucket.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 ml-1">Personal Bucket</label>
                                <div className="grid gap-2">
                                    {credentialBucket.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-white/10 bg-white/5">
                                            <button
                                                type="button"
                                                onClick={() => applyBucketCredential(item)}
                                                className="flex items-center gap-2 text-left text-xs text-white/90 hover:text-white transition-colors"
                                            >
                                                <UserRound size={14} className="text-indigo-300" />
                                                <span className="font-semibold">{item.email}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeBucketCredential(item.id)}
                                                className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                                                aria-label="Remove saved credential"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-1">Admin Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium"
                                    placeholder="admin@mentriqtechnologies.in"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-1">Passkey</label>
                            <div className="relative group">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium"
                                    placeholder="Enter your passkey"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <span className="uppercase tracking-widest text-xs">Verify Access</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-gray-500">Restricted area. All activities are monitored.</p>
                    </div>
                </div>
            </MotionDiv>
        </div>
    );
};

export default AdminLogin;
