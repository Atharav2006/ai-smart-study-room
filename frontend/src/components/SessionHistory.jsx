import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, ChevronRight, History, Calendar } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const SessionHistory = () => {
    const { roomId } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

    useEffect(() => {
        fetchHistory();
    }, [roomId]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_URL}/history/sessions/${roomId}`);
            setHistory(res.data || []);
        } catch (err) {
            console.error("Failed to fetch session history:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-8 text-slate-500">
            <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mr-3"></div>
            Loading history...
        </div>
    );

    if (history.length === 0) return (
        <div className="text-center py-8 px-4 text-slate-500 text-sm italic">
            No past sessions recorded yet.
        </div>
    );

    return (
        <div className="space-y-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest px-1 flex items-center gap-2 mb-2">
                <History size={14} /> Session History
            </h3>
            <div className="space-y-3">
                {history.map((session, i) => (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card bg-slate-800/40 hover:bg-slate-700/40 border-white/5 p-4 rounded-xl group transition-all"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-indigo-300 font-medium text-sm line-clamp-1">
                                {session.topic || "General Discussion"}
                            </span>
                            <span className="text-slate-500 text-[10px] whitespace-nowrap bg-slate-800 px-2 py-0.5 rounded-full">
                                {new Date(session.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                            <span className="flex items-center gap-1">
                                <Clock size={12} /> {session.summary_data?.stats?.duration_mins || '<1'}m
                            </span>
                            <span className="flex items-center gap-1">
                                <BookOpen size={12} /> {session.summary_data?.summary?.key_concepts?.length || 0} Concepts
                            </span>
                        </div>

                        {/* We could add a button to view full summary later, using a modal or separate route */}
                        {/* For now, just a summary snippet */}
                        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                            {session.summary_data?.summary?.summary_text || "No summary available."}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SessionHistory;
