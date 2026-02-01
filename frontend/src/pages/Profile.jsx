import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { User, Camera, Mail, Save, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user, profile, updateProfile } = useAuth();
    const [name, setName] = useState(profile?.name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showRecentAvatars, setShowRecentAvatars] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    useEffect(() => {
        if (profile?.name) setName(profile.name);
    }, [profile]);

    const handleUpdateName = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const { error } = await updateProfile({ name });
        if (error) {
            setMessage({ type: 'error', content: 'Failed to update name' });
        } else {
            setMessage({ type: 'success', content: 'Name updated successfully!' });
        }
        setIsSaving(false);
        setTimeout(() => setMessage({ type: '', content: '' }), 3000);
    };

    const handleUploadAvatar = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('profile')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profile')
                .getPublicUrl(filePath);

            // 3. Update Profile
            const updatedRecent = [publicUrl, ...(profile?.avatars || [])].slice(0, 5);
            await updateProfile({
                avatar_url: publicUrl,
                avatars: updatedRecent
            });

            setMessage({ type: 'success', content: 'Profile picture updated!' });
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', content: 'Failed to upload image' });
        } finally {
            setIsUploading(false);
            setTimeout(() => setMessage({ type: '', content: '' }), 3000);
        }
    };

    const selectRecentAvatar = async (url) => {
        const { error } = await updateProfile({ avatar_url: url });
        if (!error) {
            setMessage({ type: 'success', content: 'Avatar changed!' });
            setShowRecentAvatars(false);
        }
        setTimeout(() => setMessage({ type: '', content: '' }), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in p-4 md:p-0">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gradient">Your Profile</h1>
                    <p className="text-slate-400">Manage your account and preferences</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Avatar Section */}
                <div className="lg:col-span-1">
                    <div className="glass-card rounded-3xl p-8 flex flex-col items-center text-center space-y-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-indigo-500/20 bg-slate-800 flex items-center justify-center relative shadow-2xl">
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt="Profile"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-slate-500" />
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                                    </div>
                                )}
                            </div>

                            <label className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl cursor-pointer shadow-lg transition-all active:scale-90 group-hover:translate-x-1 group-hover:-translate-y-1">
                                <Camera className="w-5 h-5 text-white" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleUploadAvatar}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>

                        <div className="space-y-4 w-full">
                            <button
                                onClick={() => setShowRecentAvatars(!showRecentAvatars)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium"
                            >
                                <ImageIcon className="w-4 h-4" />
                                Recent Avatars
                            </button>

                            <AnimatePresence>
                                {showRecentAvatars && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-3 gap-3 pt-2">
                                            {profile?.avatars?.length > 0 ? (
                                                profile.avatars.map((url, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => selectRecentAvatar(url)}
                                                        className={`relative rounded-lg overflow-hidden h-16 ring-2 transition-all hover:scale-105 ${profile.avatar_url === url ? 'ring-indigo-500' : 'ring-transparent'}`}
                                                    >
                                                        <img src={url} alt={`Recent ${i}`} className="w-full h-full object-cover" />
                                                        {profile.avatar_url === url && (
                                                            <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                                                                <Check className="w-6 h-6 text-white bg-indigo-600 rounded-full p-1" />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="col-span-3 text-xs text-slate-500 italic">No recent avatars</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleUpdateName} className="glass-card rounded-3xl p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="premium-input pl-12"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Email Address (ReadOnly)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        readOnly
                                        className="premium-input pl-12 bg-slate-900 cursor-not-allowed opacity-70"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <AnimatePresence>
                                {message.content && (
                                    <motion.p
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 10, opacity: 0 }}
                                        className={`text-sm font-medium ${message.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}
                                    >
                                        {message.content}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isSaving || name === profile?.name}
                                className="glass-button flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                Save Changes
                            </button>
                        </div>
                    </form>

                    <div className="glass-card rounded-3xl p-8">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4">Account Security</h3>
                        <p className="text-slate-400 text-sm mb-6">Your email is managed by Supabase Auth and cannot be changed here for security reasons.</p>
                        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                            <p className="text-xs text-indigo-300 leading-relaxed">
                                Tip: You can change your profile picture as many times as you like. We keep up to 5 recent versions for quick swapping!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
