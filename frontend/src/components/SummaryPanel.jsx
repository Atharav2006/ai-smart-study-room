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
        <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" /> Study Summary
                </h3>
                <button
                    onClick={fetchSummary}
                    disabled={loading}
                    className="p-2 hover:bg-slate-700 rounded-full transition-colors disabled:animate-spin"
                >
                    <RefreshCcw size={16} className="text-slate-400" />
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                </div>
            ) : summary ? (
                <div className="prose prose-invert max-w-none text-sm text-slate-300">
                    <div className="whitespace-pre-wrap leading-relaxed">
                        {summary.summary_text || "Summarizing your session..."}
                    </div>

                    {summary.key_points && (
                        <div className="mt-4">
                            <h4 className="text-white font-semibold mb-2">Key Takeaways</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {summary.key_points.map((pt, i) => (
                                    <li key={i}>{pt}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-slate-500 text-sm">Session summaries will appear here as you study.</p>
            )}
        </div>
    );
};

export default SummaryPanel;
