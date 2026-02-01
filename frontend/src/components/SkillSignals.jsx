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
        <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700">
            <h3 className="font-bold flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-purple-400" /> Skill Signals
            </h3>

            {skills.length === 0 ? (
                <p className="text-slate-500 text-sm">Identifying your strengths...</p>
            ) : (
                <div className="space-y-3">
                    {skills.map((skill, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Zap size={14} className="text-indigo-400" />
                                </div>
                                <span className="text-sm font-medium">{skill.name}</span>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div
                                        key={s}
                                        className={`h-1 w-4 rounded-full ${s <= skill.level ? 'bg-indigo-500' : 'bg-slate-700'
                                            }`}
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
