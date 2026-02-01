import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            console.error("Supabase client not initialized.");
            setLoading(false);
            return;
        }

        // Check active sessions and sets the user
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                setUser(session?.user ?? null);
                if (session?.user) {
                    fetchProfile(session.user.id);
                }
            } catch (error) {
                console.error('Error getting session:', error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchProfile(currentUser.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const signUp = (email, password) => supabase.auth.signUp({ email, password });

    const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });

    const signInWithGoogle = () => {
        if (!supabase) {
            console.error("Supabase client not initialized - missing env vars");
            return { error: { message: "Configuration error: missing API keys" } };
        }
        return supabase.auth.signInWithOAuth({ provider: 'google' });
    };

    const signOut = () => supabase.auth.signOut();

    const updateProfile = async (updates) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setProfile(data);
                return { data, error: null };
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            return { data: null, error };
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
