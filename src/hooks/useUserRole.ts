import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export type UserRole = "client" | "veterinarian" | "admin";

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  clinic_name?: string;
  license_number?: string;
  business_address?: string;
  phone_number?: string;
  years_of_experience?: number;
  specializations?: string[];
  education?: string;
  verification_documents?: string;
  verification_status?: string;
  verification_submitted_at?: string;
  verified_at?: string;
  verification_notes?: string;
  is_verified?: boolean;
  created_at?: string;
}

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUserRole = async () => {
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setUserRole(data);
    } catch (error) {
      console.error("Error fetching user role:", error);
      toast({
        title: "Error",
        description: "Failed to load user role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (updates: Partial<UserRoleData>) => {
    if (!user) throw new Error("No user found");

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .upsert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;

      setUserRole(data);
      return { data, error: null };
    } catch (error) {
      console.error("Error updating user role:", error);
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
    isVeterinarian: userRole?.role === "veterinarian",
    isAdmin: userRole?.role === "admin",
    isClient: userRole?.role === "client",
  };
};
