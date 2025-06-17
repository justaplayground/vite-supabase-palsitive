
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Vaccination {
  id: string;
  pet_id: string;
  vaccine_name: string;
  date_administered: string;
  veterinarian_name: string;
  notes?: string;
  next_due_date?: string;
  reminder_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useVaccinations = (petId?: string) => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchVaccinations = async () => {
    if (!user) {
      setVaccinations([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase.from('vaccinations').select('*');
      
      if (petId) {
        query = query.eq('pet_id', petId);
      }
      
      const { data, error } = await query.order('date_administered', { ascending: false });

      if (error) throw error;
      setVaccinations(data || []);
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVaccination = async (vaccinationData: Omit<Vaccination, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('vaccinations')
        .insert([vaccinationData])
        .select()
        .single();

      if (error) throw error;
      setVaccinations(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding vaccination:', error);
      return { data: null, error };
    }
  };

  const updateVaccination = async (id: string, updates: Partial<Vaccination>) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('vaccinations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setVaccinations(prev => prev.map(v => v.id === id ? data : v));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating vaccination:', error);
      return { data: null, error };
    }
  };

  const deleteVaccination = async (id: string) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('vaccinations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVaccinations(prev => prev.filter(v => v.id !== id));
      return { data: true, error: null };
    } catch (error) {
      console.error('Error deleting vaccination:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchVaccinations();
  }, [user, petId]);

  return { 
    vaccinations, 
    loading, 
    addVaccination, 
    updateVaccination, 
    deleteVaccination, 
    refetch: fetchVaccinations 
  };
};
