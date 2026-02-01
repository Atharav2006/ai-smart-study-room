import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Trash2, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';

const ChatRoom = ({ roomId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, profile } = useAuth();
    const scrollRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

    useEffect(() => {
        fetchHistory();

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
        <div className="flex flex-col h-full bg-[#020617]/50">
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50 p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <p className="font-medium">No messages yet. Start your study session!</p>
                        <p className="text-xs mt-2">AI is listening and ready to help.</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.user_id === user?.id;
                        const isBot = msg.role !== 'user';

                        return (
                            <div
                                key={i}
                                className={`flex gap-3 items-end ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
                            >
                                <div className="flex-shrink-0 mb-1">
                                    {isBot ? (
                                        <div className="w-8 h-8 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white">
                                            <Bot size={16} className="animate-pulse" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5 shadow-md">
                                            {isMe && profile?.avatar_url ? (
                                                <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Me" />
                                            ) : (
                                                <User size={16} className="text-slate-400" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm ${isMe
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : isBot
                                        ? 'bg-slate-800/80 text-indigo-100 rounded-bl-none border border-indigo-500/20'
                                        : 'bg-slate-800 text-slate-100 rounded-bl-none border border-white/5'
                                    }`}>
                                    {isBot && <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">AI Assistant</div>}
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap selection:bg-white/20">{msg.content}</p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            <div className="p-4 md:p-6 bg-white/5 backdrop-blur-xl border-t border-white/5">
                <form onSubmit={sendMessage} className="flex gap-3 max-w-5xl mx-auto">
                    <button
                        type="button"
                        onClick={clearChat}
                        className="p-3 text-slate-500 hover:text-red-400 transition-all rounded-xl hover:bg-red-500/10 flex-shrink-0"
                        title="Clear Session"
                    >
                        <Trash2 size={20} />
                    </button>
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            placeholder="Type your study notes or questions..."
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all pr-12 text-slate-100 placeholder:text-slate-500"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-2 top-1.5 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all disabled:opacity-30 flex items-center justify-center shadow-lg shadow-indigo-600/20"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;
