import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await signUp(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            if (data?.user?.identities?.length === 0) {
                setError("Email address already registered.");
                setLoading(false);
            } else {
                navigate('/login');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[85vh] px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

                    <div className="text-center mb-10 relative">
                        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-purple-500/10 border border-purple-500/20 shadow-xl shadow-purple-500/10">
                            <UserPlus className="w-10 h-10 text-purple-400" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-100 tracking-tight">Join <span className="text-gradient">Collective</span></h2>
                        <p className="text-slate-500 mt-2 font-medium">Start your intelligence-paired journey</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Identity Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Explorer Name"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-900/40 border border-white/5 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Account Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-900/40 border border-white/5 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-900/40 border border-white/5 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="glass-button w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg flex items-center justify-center gap-2 group disabled:opacity-50 shadow-xl shadow-purple-500/20"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Establish Identity</>}
                        </button>
                    </form>

                    <p className="text-center mt-10 text-slate-500 text-sm font-medium">
                        Existing member?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                            Resume Session
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
