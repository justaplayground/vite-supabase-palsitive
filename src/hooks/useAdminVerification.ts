
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface VerificationRequest {
  id: string;
  user_id: string;
  clinic_name: string;
  license_number: string;
  business_address?: string;
  phone_number?: string;
  years_of_experience?: number;
  specializations?: string[];
  education?: string;
  verification_documents?: string;
  verification_status: string;
  verification_submitted_at?: string;
  verified_at?: string;
  verification_notes?: string;
  first_name?: string;
  last_name?: string;
}

interface VerificationStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  unverified: number;
}

export const useAdminVerification = () => {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    unverified: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchVerificationRequests = async () => {
    try {
      // First get all veterinarian user roles
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'veterinarian')
        .order('verification_submitted_at', { ascending: false, nullsFirst: false });

      if (userRolesError) throw userRolesError;

      // Then get the profiles for these users
      const userIds = userRolesData.map(role => role.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const requests = userRolesData.map(role => {
        const profile = profilesData.find(p => p.id === role.user_id);
        return {
          ...role,
          first_name: profile?.first_name,
          last_name: profile?.last_name
        };
      });

      setVerificationRequests(requests);

      // Calculate stats
      const newStats = {
        total: requests.length,
        pending: requests.filter(r => r.verification_status === 'pending').length,
        verified: requests.filter(r => r.verification_status === 'verified').length,
        rejected: requests.filter(r => r.verification_status === 'rejected').length,
        unverified: requests.filter(r => r.verification_status === 'unverified').length
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      toast({
        title: "Error",
        description: "Failed to load verification requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (id: string, status: string, notes?: string) => {
    try {
      const updates: any = {
        verification_status: status,
        verification_notes: notes
      };

      if (status === 'verified') {
        updates.verified_at = new Date().toISOString();
        updates.is_verified = true;
      } else if (status === 'rejected') {
        updates.is_verified = false;
      }

      const { error } = await supabase
        .from('user_roles')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Refresh the data
      await fetchVerificationRequests();

      toast({
        title: "Success",
        description: `Verification ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchVerificationRequests();
    }
  }, [user]);

  return {
    verificationRequests,
    stats,
    loading,
    updateVerificationStatus,
    refetch: fetchVerificationRequests
  };
};
