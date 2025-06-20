
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SignUpData {
  role: 'client' | 'veterinarian' | 'admin';
  clinicName?: string;
  licenseNumber?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, roleData?: SignUpData) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create user role after successful signup - check for new user with session
        if (event === 'SIGNED_IN' && session?.user && !session.user.email_confirmed_at) {
          // This indicates a new signup that hasn't been confirmed yet
          setTimeout(() => {
            createUserRole(session.user);
          }, 0);
        } else if (event === 'SIGNED_IN' && session?.user?.user_metadata?.roleData) {
          // Handle confirmed signup with role data
          setTimeout(() => {
            createUserRole(session.user);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createUserRole = async (user: User) => {
    const roleData = user.user_metadata?.roleData || { role: 'client' };
    
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{
          user_id: user.id,
          role: roleData.role,
          clinic_name: roleData.clinicName || null,
          license_number: roleData.licenseNumber || null
        }]);

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        console.error('Error creating user role:', error);
      }
    } catch (error) {
      console.error('Error creating user role:', error);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, roleData?: SignUpData) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          roleData: roleData || { role: 'client' }
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
