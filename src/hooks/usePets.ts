
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  age?: string;
  weight?: string;
  color?: string;
  microchip_id?: string;
  notes?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPets = async () => {
    if (!user) {
      setPets([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (petData: Omit<Pet, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('pets')
        .insert([{ ...petData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setPets(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding pet:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchPets();
  }, [user]);

  return { pets, loading, addPet, refetch: fetchPets };
};
