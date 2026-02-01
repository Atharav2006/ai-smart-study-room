import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Brain, BookOpen, CheckCircle, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


const Summary = () => {
    const { roomId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

    useEffect(() => {
        const fetchSessionSummary = async () => {
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
            } finally {
                setLoading(false);
            }
        };
        fetchSessionSummary();
    }, [roomId]);

    if (loading) return <div className="p-10 text-center">Loading Session Masterpiece...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-slate-700 rounded-3xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-yellow-500/20 rounded-2xl">
                        <Trophy className="text-yellow-500 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Session Accomplished!</h1>
                        <p className="text-slate-400 font-mono">Room: {roomId}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
                        <p className="text-slate-400 text-sm mb-1">Messages</p>
                        <p className="text-2xl font-bold">{data.stats?.message_count || 0}</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
                        <p className="text-slate-400 text-sm mb-1">AI Insights</p>
                        <p className="text-2xl font-bold text-indigo-400">{data.stats?.insight_count || 0}</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
                        <p className="text-slate-400 text-sm mb-1">Duration</p>
                        <p className="text-2xl font-bold">{data.stats?.duration_mins || '< 1'}m</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-2xl">
                        <h3 className="flex items-center gap-2 font-bold mb-4">
                            <BookOpen size={18} className="text-indigo-400" /> Executive Summary
                        </h3>
                        <p className="text-slate-300 leading-relaxed italic">
                            "{data.summary?.summary_text || 'No summary generated for this session.'}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white/5 rounded-2xl">
                            <h3 className="flex items-center gap-2 font-bold mb-4">
                                <Brain size={18} className="text-purple-400" /> Mastery Profile
                            </h3>
                            <div className="space-y-4">
                                {data.skills.map((skill, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>{skill.name}</span>
                                            <span>Level {skill.level}/5</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 transition-all duration-1000"
                                                style={{ width: `${(skill.level / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-2xl">
                            <h3 className="flex items-center gap-2 font-bold mb-4">
                                <HelpCircle size={18} className="text-orange-400" /> Learning Gaps
                            </h3>
                            <ul className="space-y-2">
                                {(data.summary?.suggested_topics || ['No gaps detected']).map((topic, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                                        {topic}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <Link to={`/room/${roomId}`} className="text-indigo-400 hover:text-indigo-300 font-medium">
                    Need to study more? Return to Room
                </Link>
            </div>
        </div>
    );
};

export default Summary;
