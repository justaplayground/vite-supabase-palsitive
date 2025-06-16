
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Appointment {
  id: string;
  pet_id: string;
  date: string;
  time: string;
  type: string;
  vet_name: string;
  clinic_name: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  pets?: {
    name: string;
    type: string;
    image_url?: string;
  };
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets (
            name,
            type,
            image_url
          )
        `)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'pets'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ ...appointmentData, user_id: user.id }])
        .select(`
          *,
          pets (
            name,
            type,
            image_url
          )
        `)
        .single();

      if (error) throw error;
      setAppointments(prev => [...prev, data]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding appointment:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  return { appointments, loading, addAppointment, refetch: fetchAppointments };
};
