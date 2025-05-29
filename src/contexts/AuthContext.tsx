
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Transform Supabase user to our User type
          const transformedUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.first_name || session.user.email?.split('@')[0] || '',
            role: session.user.user_metadata?.role || 'employee',
            createdAt: new Date(session.user.created_at)
          };
          setUser(transformedUser);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Initial session check:', session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        const transformedUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.first_name || session.user.email?.split('@')[0] || '',
          role: session.user.user_metadata?.role || 'employee',
          createdAt: new Date(session.user.created_at)
        };
        setUser(transformedUser);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'employee'): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('🚀 Attempting login for:', email, 'as', role);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Login error:', error.message);
        return false;
      }

      if (data.user) {
        console.log('✅ Login successful for:', data.user.email);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Login exception:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'admin' | 'employee'): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('🚀 Attempting signup for:', email, 'as', role, 'with name:', name);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name,
            role: role,
            department: role === 'admin' ? 'Administration' : 'General'
          }
        }
      });

      if (error) {
        console.error('❌ Signup error:', error.message);
        // Check for specific database errors and provide helpful messages
        if (error.message.includes('Database error saving new user')) {
          console.error('Database trigger failed - this might be due to missing sequence');
          return false;
        }
        return false;
      }

      if (data.user) {
        console.log('✅ Signup successful for:', data.user.email);
        console.log('User created with ID:', data.user.id);
        
        // Wait a moment for the trigger to complete, then verify profile creation
        setTimeout(async () => {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('employee_profiles')
              .select('*')
              .eq('user_id', data.user.id)
              .single();
            
            if (profileError || !profile) {
              console.log('⚠️ Profile not found, trigger might have failed. Creating manually...');
              // Fallback: create profile manually if trigger failed
              const { error: insertError } = await supabase
                .from('employee_profiles')
                .insert({
                  user_id: data.user.id,
                  employee_id: `EMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                  first_name: name,
                  last_name: '',
                  email: email,
                  department: role === 'admin' ? 'Administration' : 'General'
                });
              
              if (insertError) {
                console.error('❌ Failed to create profile manually:', insertError);
              } else {
                console.log('✅ Profile created manually');
              }
            } else {
              console.log('✅ Profile created by trigger:', profile);
            }
          } catch (error) {
            console.error('Error checking/creating profile:', error);
          }
        }, 1000);
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Signup exception:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out user:', user?.email);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
