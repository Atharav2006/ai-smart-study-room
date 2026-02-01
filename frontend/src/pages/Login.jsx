import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Chrome, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await signIn(email, password);
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        const { error } = await signInWithGoogle();
        if (error) setError(error.message);
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
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

                    <div className="text-center mb-10 relative">
                        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-xl shadow-indigo-500/10">
                            <LogIn className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-100 tracking-tight">Welcome <span className="text-gradient">Back</span></h2>
                        <p className="text-slate-500 mt-2 font-medium">Rejoin your study collective</p>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Account Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-900/40 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-900/40 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
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
                            className="glass-button w-full py-4 text-white font-bold text-lg flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Sign In Now</>}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest leading-none">
                            <span className="bg-[#0f172a] px-4 text-slate-500">or use social</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group"
                    >
                        <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Continue with Google
                    </button>

                    <p className="text-center mt-10 text-slate-500 text-sm font-medium">
                        New explorer?{' '}
                        <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                            Initialize Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
