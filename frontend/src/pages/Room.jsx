import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MessageSquare, Layout, Sparkles, AlertCircle, LogOut, Loader2, History } from 'lucide-react';
import axios from 'axios';
import ChatRoom from '../components/ChatRoom';
import SummaryPanel from '../components/SummaryPanel';
import SkillSignals from '../components/SkillSignals';
import SessionHistory from '../components/SessionHistory';

const Room = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'insights', or 'history'
    const [isEnding, setIsEnding] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

    const handleEndSession = async () => {
        if (!window.confirm("Are you sure you want to end this session and generate the final report?")) return;

        setIsEnding(true);
        try {
            const genRes = await axios.post(`${API_URL}/summary/generate`, {
                session_id: roomId,
                target_language: "English"
            });

            await axios.post(`${API_URL}/summary/save`, {
                session_id: roomId,
                analysis_data: genRes.data
            });

            navigate(`/summary/${roomId}`);
        } catch (err) {
            console.error("Failed to end session:", err);
            alert("Failed to generate summary. Please make sure the AI service is configured.");
            setIsEnding(false);
        }
    };

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 h-[calc(100vh-140px)] md:h-[calc(100vh-160px)]">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-col gap-4">
                <div className="glass-card p-6 rounded-3xl">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                        Room Identity
                    </h2>
                    <div className="flex items-center gap-2 mb-3 p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                        <Layout className="w-4 h-4" />
                        <span className="font-mono font-bold">{roomId}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-medium tracking-tight">
                        Share code for group session
                    </p>
                </div>

                <nav className="flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'chat'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-slate-400 hover:bg-slate-800/50'
                            }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-semibold">Discussion</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'insights'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-slate-400 hover:bg-slate-800/50'
                            }`}
                    >
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">AI Insights</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'history'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-slate-400 hover:bg-slate-800/50'
                            }`}
                    >
                        <History className="w-5 h-5" />
                        <span className="font-semibold">History</span>
                    </button>
                </nav>

                <button
                    onClick={handleEndSession}
                    disabled={isEnding}
                    className="mt-auto flex items-center justify-center gap-2 px-4 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all text-red-400 disabled:opacity-50 font-bold"
                >
                    {isEnding ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <LogOut className="w-5 h-5" />
                    )}
                    {isEnding ? 'Analyzing...' : 'End Session'}
                </button>
            </div>

            {/* Mobile Header Tabs */}
            <div className="lg:hidden flex gap-2 p-1 bg-slate-900/50 rounded-2xl border border-slate-800">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'
                        }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Chat</span>
                </button>
                <button
                    onClick={() => setActiveTab('insights')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeTab === 'insights' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'
                        }`}
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI</span>
                </button>
                <button
                    onClick={handleEndSession}
                    className="w-12 flex items-center justify-center bg-red-500/10 text-red-400 rounded-xl"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 glass-card rounded-3xl overflow-hidden flex flex-col relative group">
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>

                {activeTab === 'chat' ? (
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-md">
                            <h3 className="font-bold text-slate-200 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-indigo-400" />
                                <span className="hidden sm:inline">Discussion Room</span>
                                <span className="sm:hidden text-xs">Chat</span>
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                Live AI Active
                            </div>
                        </div>
                        <ChatRoom roomId={roomId} />
                    </div>
                ) : activeTab === 'insights' ? (
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-8 animate-fade-in">
                                <SummaryPanel roomId={roomId} />
                            </div>
                            <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                <SkillSignals roomId={roomId} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                        <SessionHistory roomId={roomId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Room;
