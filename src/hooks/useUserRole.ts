
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = 'client' | 'veterinarian' | 'admin';

interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  clinic_name?: string;
  license_number?: string;
  created_at: string;
}

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserRole = async () => {
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // If no role exists, create default client role
      if (!data) {
        const { data: newRole, error: insertError } = await supabase
          .from('user_roles')
          .insert([{ user_id: user.id, role: 'client' as UserRole }])
          .select()
          .single();

        if (insertError) throw insertError;
        setUserRole(newRole);
      } else {
        setUserRole(data);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (roleData: { role: UserRole; clinic_name?: string; license_number?: string }) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .upsert([{ user_id: user.id, ...roleData }])
        .select()
        .single();

      if (error) throw error;
      setUserRole(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  return { 
    userRole, 
    loading, 
    updateUserRole, 
    refetch: fetchUserRole,
    isVeterinarian: userRole?.role === 'veterinarian',
    isClient: userRole?.role === 'client',
    isAdmin: userRole?.role === 'admin'
  };
};
