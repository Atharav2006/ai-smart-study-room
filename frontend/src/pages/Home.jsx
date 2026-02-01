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
            // Check if room exists
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
            // Generate a cleaner, more readable ID (6 chars)
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
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full"
            >
                <BrainCircuit className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                    Level Up Your Study Sessions
                </h1>
                <p className="text-slate-400 text-lg md:text-xl mb-12">
                    A privacy-first collaborative space where AI helps you learn faster,
                    identifies gaps, and summaries your growth.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
                    <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <BookOpen className="w-8 h-8 text-purple-400 mb-4" />
                        <h3 className="font-bold mb-2 text-lg">Smart Summaries</h3>
                        <p className="text-sm text-slate-400">Auto-generated notes from your study discussions effectively.</p>
                    </div>
                    <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <Users className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="font-bold mb-2 text-lg">Real-time Collab</h3>
                        <p className="text-sm text-slate-400">Seamless chat with privacy-first data handling.</p>
                    </div>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                    <form onSubmit={handleJoin} className="flex gap-2 relative">
                        <input
                            type="text"
                            placeholder="Enter Room Code"
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                            disabled={isJoining}
                        />
                        <button
                            type="submit"
                            disabled={isJoining || !roomId.trim()}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isJoining ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Join"
                            )}
                        </button>
                    </form>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm"
                        >
                            {error}
                        </motion.p>
                    )}

                    <div className="pt-2">
                        <span className="text-slate-500 text-sm">Or </span>
                        <button
                            onClick={createRoom}
                            disabled={isCreating}
                            className="text-indigo-400 hover:text-indigo-300 font-medium underline disabled:opacity-50 inline-flex items-center gap-2"
                        >
                            {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                            create a new study room
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;

