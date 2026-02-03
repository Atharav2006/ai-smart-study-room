import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, BrainCircuit, Loader2, Clock, TrendingUp, Calendar, ChevronRight, Sparkles, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Home = () => {
    const [roomId, setRoomId] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [sessions, setSessions] = useState([]);
    const [stats, setStats] = useState({
        totalSessions: 0,
        totalRooms: 0,
        totalStudyTime: 0,
        avgDuration: 0
    });
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

    useEffect(() => {
        if (user) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            // Fetch user's session history
            const res = await axios.get(`${API_URL}/history/user`, {
                headers: {
                    'X-User-ID': user.id
                }
            });

            const userSessions = res.data || [];
            setSessions(userSessions);

            // Calculate statistics
            const uniqueRooms = new Set(userSessions.map(s => s.room_id)).size;
            const totalTime = userSessions.reduce((acc, s) => {
                return acc + (s.summary_data?.stats?.duration_mins || 0);
            }, 0);
            const avgTime = userSessions.length > 0 ? Math.round(totalTime / userSessions.length) : 0;

            setStats({
                totalSessions: userSessions.length,
                totalRooms: uniqueRooms,
                totalStudyTime: totalTime,
                avgDuration: avgTime
            });
        } catch (err) {
            console.error("Failed to fetch user data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        setError('');

        if (!roomId.trim()) return;

        setIsJoining(true);
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('room_id')
                .eq('room_id', roomId)
                .single();

            if (error || !data) {
                setError('Room not found. Please check the code.');
                setIsJoining(false);
                return;
            }

            navigate(`/room/${roomId}`);
        } catch (err) {
            setError('Failed to join room. Please try again.');
        } finally {
            setIsJoining(false);
        }
    };

    const createRoom = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setIsCreating(true);
        setError('');

        try {
            const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();

            const { error } = await supabase
                .from('rooms')
                .insert([
                    {
                        room_id: newRoomId,
                        created_by: user.id,
                        host_id: user.id,
                        name: 'Study Room ' + newRoomId,
                        is_active: true
                    }
                ]);

            if (error) throw error;

            navigate(`/room/${newRoomId}`);
        } catch (err) {
            console.error('Error creating room:', err);
            setError('Could not create room. Try again.');
        } finally {
            setIsCreating(false);
        }
    };

    if (!user) {
        // Landing page for non-authenticated users
        return (
            <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl w-full"
                >
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 -z-10 animate-pulse"></div>
                        <BrainCircuit className="w-20 h-20 text-indigo-500 mx-auto" />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                        Level Up Your <span className="text-gradient">Study Sessions</span>
                    </h1>

                    <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                        A privacy-first collaborative space where AI helps you learn faster,
                        identifies gaps, and summarizes your growth.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass-card p-8 rounded-3xl"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                                <BookOpen className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="font-bold mb-2 text-xl text-slate-100">Smart Summaries</h3>
                            <p className="text-slate-400 leading-relaxed">Auto-generated notes from your study discussions effectively using advanced AI.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass-card p-8 rounded-3xl"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="font-bold mb-2 text-xl text-slate-100">Real-time Collab</h3>
                            <p className="text-slate-400 leading-relaxed">Seamlessly collaborate with your peers in real-time with full data privacy.</p>
                        </motion.div>
                    </div>

                    <div className="max-w-md mx-auto space-y-6">
                        <div className="glass-card p-2 rounded-2xl flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                placeholder="Enter Room Code"
                                className="flex-1 bg-transparent border-none rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0 disabled:opacity-50 text-center sm:text-left"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                disabled={isJoining}
                            />
                            <button
                                onClick={handleJoin}
                                disabled={isJoining || !roomId.trim()}
                                className="glass-button w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                {isJoining ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>Join Room</>
                                )}
                            </button>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-red-400 text-sm font-medium"
                            >
                                {error}
                            </motion.p>
                        )}

                        <div className="pt-2 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-4 w-full max-w-xs">
                                <div className="h-px bg-slate-800 flex-1"></div>
                                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Or</span>
                                <div className="h-px bg-slate-800 flex-1"></div>
                            </div>

                            <button
                                onClick={createRoom}
                                disabled={isCreating}
                                className="group flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold transition-all"
                            >
                                {isCreating ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                                        <BrainCircuit className="w-5 h-5" />
                                    </div>
                                )}
                                Initialize New Study Room
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Dashboard for authenticated users
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Section with Quick Actions */}
            <div className="glass-card rounded-3xl p-8 md:p-12 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black mb-2">
                            Welcome back, <span className="text-gradient">{user.email.split('@')[0]}</span>
                        </h1>
                        <p className="text-slate-400">Ready to continue your learning journey?</p>
                    </div>
                    <button
                        onClick={createRoom}
                        disabled={isCreating}
                        className="glass-button flex items-center gap-2 whitespace-nowrap"
                    >
                        {isCreating ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                New Study Room
                            </>
                        )}
                    </button>
                </div>

                <div className="glass-card p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-2xl">
                    <input
                        type="text"
                        placeholder="Enter Room Code to Join"
                        className="flex-1 bg-transparent border-none rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0 disabled:opacity-50"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                        disabled={isJoining}
                    />
                    <button
                        onClick={handleJoin}
                        disabled={isJoining || !roomId.trim()}
                        className="glass-button w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                        {isJoining ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>Join</>
                        )}
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-3xl hover:border-indigo-500/30 transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                            <Award className="w-6 h-6 text-indigo-400" />
                        </div>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-3xl font-black text-slate-100 mb-1">{stats.totalSessions}</p>
                    <p className="text-slate-500 text-sm font-medium">Total Sessions</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-3xl hover:border-purple-500/30 transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-100 mb-1">{stats.totalRooms}</p>
                    <p className="text-slate-500 text-sm font-medium">Unique Rooms</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-3xl hover:border-blue-500/30 transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                            <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-100 mb-1">{stats.totalStudyTime}</p>
                    <p className="text-slate-500 text-sm font-medium">Minutes Studied</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 rounded-3xl hover:border-orange-500/30 transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-all">
                            <Calendar className="w-6 h-6 text-orange-400" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-100 mb-1">{stats.avgDuration}</p>
                    <p className="text-slate-500 text-sm font-medium">Avg Duration (min)</p>
                </motion.div>
            </div>

            {/* Session History */}
            <div className="glass-card rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-100">Your Study History</h2>
                    <span className="text-sm text-slate-500 font-medium">{sessions.length} sessions</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 font-medium mb-2">No sessions yet</p>
                        <p className="text-slate-600 text-sm">Start a study session to see your history here!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sessions.slice(0, 10).map((session, i) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => navigate(`/summary/${session.room_id}`)}
                                className="glass-card bg-slate-800/40 hover:bg-slate-700/40 border-white/5 p-4 rounded-2xl group transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-indigo-300 font-semibold text-sm truncate">
                                                {session.topic || "General Discussion"}
                                            </span>
                                            <span className="text-slate-600 text-xs">•</span>
                                            <span className="text-slate-500 text-xs font-mono">
                                                {session.room_id}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(session.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {session.summary_data?.stats?.duration_mins || '<1'}m
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <BookOpen size={12} />
                                                {session.summary_data?.summary?.key_concepts?.length || 0} concepts
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
