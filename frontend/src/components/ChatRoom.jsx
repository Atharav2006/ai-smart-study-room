import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';

const ChatRoom = ({ roomId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const scrollRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

    useEffect(() => {
        fetchHistory();

        // Subscribe to real-time changes
        const channel = supabase
            .channel(`room:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `room_id=eq.${roomId}`
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_URL}/chat/history/${roomId}`);
            setMessages(res.data || []);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading || !user) return;

        // Optimistic update not needed as we rely on Realtime, 
        // but we can disable input while sending.
        setLoading(true);

        const userMsg = {
            session_id: roomId,
            user_id: user.id,
            role: 'user',
            content: input
        };

        try {
            await axios.post(`${API_URL}/chat/send`, userMsg);
            setInput('');
            // No need to fetchHistory, realtime will catch it
        } catch (err) {
            console.error("Failed to send message:", err);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = async () => {
        if (window.confirm("Are you sure you want to clear this session's history?")) {
            try {
                await axios.delete(`${API_URL}/chat/clear/${roomId}`);
                setMessages([]);
            } catch (err) {
                console.error("Failed to clear chat:", err);
            }
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">
                        <p>No messages yet. Start your study session!</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.user_id === user?.id;
                        const isBot = msg.role !== 'user';

                        return (
                            <div
                                key={i}
                                className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isMe && (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isBot ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-400'}`}>
                                        {isBot ? <Bot size={16} /> : <User size={16} />}
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-3 rounded-2xl ${isMe
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-slate-700 text-slate-100 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                {isMe && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                                        <User size={16} />
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            <div className="p-4 bg-slate-800/80 border-t border-slate-700">
                <form onSubmit={sendMessage} className="flex gap-2">
                    <button
                        type="button"
                        onClick={clearChat}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                        title="Clear Session"
                    >
                        <Trash2 size={20} />
                    </button>
                    <input
                        type="text"
                        placeholder="Type your study notes or questions..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;
