import React, { useState, useEffect } from 'react';
import { FileText, RefreshCcw } from 'lucide-react';
import axios from 'axios';

const SummaryPanel = ({ roomId }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/summary/${roomId}`);
            setSummary(res.data);
        } catch (err) {
            console.error("Failed to fetch summary:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, [roomId]);

    return (
        <div className="glass-card p-8 rounded-3xl border-white/5 relative group">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={fetchSummary}
                    disabled={loading}
                    className="p-2 hover:bg-white/5 rounded-xl transition-all disabled:animate-spin text-slate-500 hover:text-indigo-400"
                    title="Refresh Summary"
                >
                    <RefreshCcw size={18} />
                </button>
            </div>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                    Study Summary
                </h3>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-white/5 rounded-full w-full"></div>
                    <div className="h-4 bg-white/5 rounded-full w-5/6"></div>
                    <div className="h-4 bg-white/5 rounded-full w-4/6"></div>
                </div>
            ) : summary ? (
                <div className="space-y-8">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500/20 rounded-full"></div>
                        <p className="text-slate-300 leading-relaxed text-sm md:text-base italic pl-2">
                            {summary.summary_text || "Summarizing your session..."}
                        </p>
                    </div>

                    {summary.key_points && summary.key_points.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Key Takeaways</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {summary.key_points.map((pt, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group/item">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                        <span className="text-sm text-slate-300 font-medium leading-normal">{pt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 px-6 rounded-2xl bg-white/5 border border-dashed border-white/10">
                    <p className="text-slate-500 text-sm font-medium">Session summaries will appear here as you study.</p>
                </div>
            )}
        </div>
    );
};

export default SummaryPanel;
