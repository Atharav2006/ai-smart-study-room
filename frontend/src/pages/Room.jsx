import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MessageSquare, Layout, Sparkles, AlertCircle, LogOut, Loader2 } from 'lucide-react';
import axios from 'axios';
import ChatRoom from '../components/ChatRoom';
import SummaryPanel from '../components/SummaryPanel';
import SkillSignals from '../components/SkillSignals';

const Room = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'insights'
    const [isEnding, setIsEnding] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

    const handleEndSession = async () => {
        if (!window.confirm("Are you sure you want to end this session and generate the final report?")) return;

        setIsEnding(true);
        try {
            // 1. Generate the analysis
            const genRes = await axios.post(`${API_URL}/summary/generate`, {
                session_id: roomId,
                target_language: "English"
            });

            // 2. Save the analysis
            await axios.post(`${API_URL}/summary/save`, {
                session_id: roomId,
                analysis_data: genRes.data
            });

            // 3. Navigate to summary page
            navigate(`/summary/${roomId}`);
        } catch (err) {
            console.error("Failed to end session:", err);
            alert("Failed to generate summary. Please make sure the AI service is configured.");
            setIsEnding(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
            {/* Left Sidebar - Navigation / Info */}
            <div className="hidden lg:flex flex-col gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                        Study Room
                    </h2>
                    <div className="flex items-center gap-2 mb-2 p-2 bg-indigo-500/10 rounded text-indigo-400">
                        <Layout className="w-4 h-4" />
                        <span className="font-mono text-sm">{roomId}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                        Share this code with teammates to join the session.
                    </p>
                </div>

                <nav className="flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'
                            }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span>Discussion</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'insights' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'
                            }`}
                    >
                        <Sparkles className="w-5 h-5" />
                        <span>AI Insights</span>
                    </button>
                </nav>

                <button
                    onClick={handleEndSession}
                    disabled={isEnding}
                    className="mt-auto flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors text-red-400 disabled:opacity-50"
                >
                    {isEnding ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <LogOut className="w-5 h-5" />
                    )}
                    {isEnding ? 'Finalizing...' : 'End Session'}
                </button>
            </div>


            {/* Main Content Area */}
            <div className="lg:col-span-3 bg-slate-800/30 rounded-2xl border border-slate-700 overflow-hidden flex flex-col">
                {activeTab === 'chat' ? (
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                            <h3 className="font-bold flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Discussion Room
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-green-400">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                Live Analysis Active
                            </div>
                        </div>
                        <ChatRoom roomId={roomId} />
                    </div>
                ) : (
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <SummaryPanel roomId={roomId} />
                            </div>
                            <div className="space-y-6">
                                <SkillSignals roomId={roomId} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Room;
