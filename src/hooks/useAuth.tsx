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
  signOut: async () => {},
  refreshProfile: async () => {},
  setBranchId: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
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
        setTimeout(() => reject(new Error('Profile fetch timeout')), 15000)
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
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 10000)
        );

        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
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
      signOut,
      refreshProfile,
      setBranchId: setActiveBranchId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
