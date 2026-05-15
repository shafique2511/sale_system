import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  businessId: string | null;
  branchId: string | null;
  loading: boolean;
  error: string | null; // Added error state
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setBranchId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  businessId: null,
  branchId: null,
  loading: true,
  error: null, // Initial error state
  signOut: async () => {},
  refreshProfile: async () => {},
  setBranchId: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State implementation
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for userId:', userId);
    try {
      const profilePromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout - the database might be slow or unreachable')), 20000)
      );

      const result = await Promise.race([profilePromise, timeoutPromise]) as any;
      const { data, error } = result;

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('No profile found for user:', userId);
        } else {
          console.error('Error fetching profile:', error);
        }
        setProfile(null);
      } else {
        console.log('Profile fetched successfully:', data?.id);
        setProfile(data);
        setActiveBranchId(data.branch_id);
      }
    } catch (err: any) {
      console.error('Profile fetch error - likely connectivity or timeout:', err.message || err);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    const initAuth = async () => {
      const isPlaceholder = import.meta.env.VITE_SUPABASE_URL?.includes('placeholder') || !import.meta.env.VITE_SUPABASE_URL;
      
      if (isPlaceholder) {
        const msg = 'Supabase is not configured. Please set your credentials in Settings.';
        console.error('CRITICAL:', msg);
        setError(msg);
        setLoading(false);
        return;
      }

      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout - check your Supabase settings and network')), 12000)
        );

        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
        setError(err.message || 'Failed to connect to Supabase');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state change:', _event);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      businessId: profile?.business_id || null,
      branchId: activeBranchId,
      loading, 
      error, // Passing error here
      signOut,
      refreshProfile,
      setBranchId: setActiveBranchId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
