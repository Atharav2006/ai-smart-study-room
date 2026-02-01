import React, { useState, useEffect } from 'react';
import { Target, Zap } from 'lucide-react';
import axios from 'axios';

const SkillSignals = ({ roomId }) => {
    const [skills, setSkills] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(`${API_URL}/analytics/signals/${roomId}`);
                setSkills(res.data.signals || []);
            } catch (err) {
                console.error("Failed to fetch signals:", err);
            }
        };
        fetchAnalytics();
    }, [roomId]);

    return (
        <div className="glass-card p-8 rounded-3xl border-white/5 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/10 blur-3xl rounded-full"></div>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Target className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                    Skill Signals
                </h3>
            </div>

            {skills.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></div>
                    <p className="text-sm font-medium tracking-wide italic">Identifying your strengths...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {skills.map((skill, i) => (
                        <div key={i} className="group p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                        <Zap size={14} className="text-purple-400" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-200 uppercase tracking-tight">{skill.name}</span>
                                </div>
                                <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">
                                    LVL {skill.level}
                                </span>
                            </div>

                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div
                                        key={s}
                                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-out ${s <= skill.level
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                                                : 'bg-slate-800'
                                            }`}
                                        style={{ transitionDelay: `${s * 50}ms` }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SkillSignals;
