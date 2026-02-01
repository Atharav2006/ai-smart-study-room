import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, BrainCircuit, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [roomId, setRoomId] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { user } = useAuth();

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
};

export default Home;

