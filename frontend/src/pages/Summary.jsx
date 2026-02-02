import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Trophy, ArrowLeft, Brain, BookOpen, CheckCircle, HelpCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


const Summary = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const [data, setData] = useState({ stats: {}, skills: [], summary: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

    useEffect(() => {
        const fetchSessionSummary = async () => {
            // If we came from "End Session", we might have data in state
            if (location.state?.analysis) {
                const analysis = location.state.analysis;
                setData({
                    stats: analysis.stats || {},
                    skills: analysis.skills || [],
                    summary: analysis, // The whole object or parts of it
                });
                setLoading(false);
                return;
            }

            try {
                const stats = await axios.get(`${API_URL}/analytics/stats/${roomId}`);
                const skills = await axios.get(`${API_URL}/analytics/signals/${roomId}`);
                const summary = await axios.get(`${API_URL}/summary/${roomId}`);

                setData({
                    stats: stats.data,
                    skills: skills.data.signals || [],
                    summary: summary.data
                });
            } catch (err) {
                console.error("Error fetching summary data:", err);
                setError("Failed to load summary. API might be unreachable.");
            } finally {
                setLoading(false);
            }
        };
        fetchSessionSummary();
    }, [roomId, location.state]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-slate-400 font-medium animate-pulse">Generating your session masterpiece...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                <HelpCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Oops! Something went wrong</h2>
            <p className="text-slate-400 max-w-md">{error}</p>
            <Link to="/" className="mt-4 px-6 py-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 transition-colors">
                Return Home
            </Link>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 md:px-0 animate-fade-in">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 mb-8 transition-colors font-medium group text-sm">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Link>

            <div className="glass-card rounded-[2.5rem] overflow-hidden mb-12">
                <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-transparent p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
                        <div className="w-20 h-20 bg-yellow-500/10 rounded-3xl flex items-center justify-center shadow-lg shadow-yellow-500/10 border border-yellow-500/20 rotate-3">
                            <Trophy className="text-yellow-500 w-10 h-10 -rotate-3" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Session <span className="text-gradient">Accomplished!</span></h1>
                            <div className="flex items-center gap-2 text-slate-500 font-mono text-sm">
                                <span className="bg-slate-800 px-2 py-1 rounded">ROOM ID: {roomId}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
                        <div className="glass-card bg-white/5 p-6 rounded-3xl text-center border-white/5 hover:border-indigo-500/20 transition-all">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Messages</p>
                            <p className="text-3xl font-black text-slate-100">{data.stats?.message_count || 0}</p>
                        </div>
                        <div className="glass-card bg-white/5 p-6 rounded-3xl text-center border-white/5 hover:border-purple-500/20 transition-all">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">AI Insights</p>
                            <p className="text-3xl font-black text-indigo-400">{data.stats?.insight_count || 0}</p>
                        </div>
                        <div className="glass-card bg-white/5 p-6 rounded-3xl text-center border-white/5 hover:border-blue-500/20 transition-all">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Duration</p>
                            <p className="text-3xl font-black text-slate-100">{data.stats?.duration_mins || '< 1'}m</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="glass-card bg-slate-900/40 p-8 rounded-3xl border-white/5">
                            <h3 className="flex items-center gap-3 font-bold text-xl mb-6">
                                <BookOpen size={24} className="text-indigo-400" />
                                <span className="text-gradient">Executive Summary</span>
                            </h3>
                            <p className="text-slate-300 text-lg leading-relaxed italic">
                                "{data.summary?.summary_text || data.summary?.summary?.summary_text || 'No summary generated for this session.'}"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass-card bg-slate-900/40 p-8 rounded-3xl border-white/5">
                                <h3 className="flex items-center gap-3 font-bold text-xl mb-6">
                                    <Brain size={24} className="text-purple-400" /> Mastery Profile
                                </h3>
                                <div className="space-y-6">
                                    {data.skills.length > 0 ? data.skills.map((skill, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-slate-300">{skill.name}</span>
                                                <span className="text-indigo-400 font-mono">Lvl {skill.level}/5</span>
                                            </div>
                                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(skill.level / 5) * 100}%` }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                                                ></motion.div>
                                            </div>
                                        </div>
                                    )) : <p className="text-slate-500 italic text-sm">No specific skills detected yet.</p>}
                                </div>
                            </div>

                            <div className="glass-card bg-slate-900/40 p-8 rounded-3xl border-white/5">
                                <h3 className="flex items-center gap-3 font-bold text-xl mb-6">
                                    <HelpCircle size={24} className="text-orange-400" /> Learning Gaps
                                </h3>
                                <div className="space-y-4">
                                    {(data.summary?.suggested_topics || data.summary?.summary?.suggested_topics || ['No gaps detected']).map((topic, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
                                            <span className="text-slate-300 font-medium">{topic}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center pb-12">
                <Link to={`/room/${roomId}`} className="glass-card px-8 py-4 rounded-2xl text-indigo-400 hover:text-white hover:bg-indigo-600/10 transition-all font-bold group inline-flex items-center gap-2">
                    Need more focus? Return to study room
                </Link>
            </div>
        </div>
    );
};

export default Summary;
