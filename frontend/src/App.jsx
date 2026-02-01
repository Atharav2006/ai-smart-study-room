import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import Summary from './pages/Summary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogOut, User as UserIcon, LogIn, Menu, X, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                        AI
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Smart Study Room
                    </h1>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all group"
                            >
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} className="w-6 h-6 rounded-full object-cover" alt="Avatar" />
                                ) : (
                                    <UserIcon className="w-4 h-4 text-indigo-400" />
                                )}
                                <span className="text-sm font-medium text-slate-200">{profile?.name || user.email.split('@')[0]}</span>
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="p-2 rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-500/20"
                        >
                            <LogIn className="w-4 h-4" />
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-slate-400 hover:text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-800 bg-slate-900 animate-fade-in">
                    <div className="flex flex-col p-4 space-y-4">
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-800"
                                >
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                            <UserIcon className="w-6 h-6 text-indigo-400" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-200">{profile?.name || 'User'}</span>
                                        <span className="text-xs text-slate-500">{user.email}</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold"
                            >
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

const Footer = () => (
    <footer className="border-t border-white/5 bg-slate-900/30 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">AI</div>
                    <span className="font-bold text-slate-300">Smart Study Room</span>
                </div>
                <p className="text-slate-500 text-sm max-w-xs text-center md:text-left">
                    Empowering modern learners with AI-driven collaboration and deep session insights.
                </p>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-400">
                <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-indigo-400 transition-colors">Docs</a>
            </div>
            <p className="text-slate-600 text-xs">
                © 2024 AI Smart Study. Built with ✨
            </p>
        </div>
    </footer>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-indigo-500/30 flex flex-col">
                    <Navbar />

                    <main className="flex-1 max-w-7xl mx-auto w-full p-4 pt-8 md:pt-12">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/room/:roomId" element={<Room />} />
                            <Route path="/summary/:roomId" element={<Summary />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
