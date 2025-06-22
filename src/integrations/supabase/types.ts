export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_notes: string | null
          clinic_name: string
          completed_at: string | null
          created_at: string | null
          date: string
          id: string
          notes: string | null
          pet_id: string
          status: string | null
          time: string
          type: string
          updated_at: string | null
          user_id: string
          vet_name: string
        }
        Insert: {
          appointment_notes?: string | null
          clinic_name: string
          completed_at?: string | null
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          pet_id: string
          status?: string | null
          time: string
          type: string
          updated_at?: string | null
          user_id: string
          vet_name: string
        }
        Update: {
          appointment_notes?: string | null
          clinic_name?: string
          completed_at?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          pet_id?: string
          status?: string | null
          time?: string
          type?: string
          updated_at?: string | null
          user_id?: string
          vet_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: string | null
          breed: string | null
          color: string | null
          created_at: string | null
          id: string
          image_url: string | null
          microchip_id: string | null
          name: string
          notes: string | null
          type: string
          updated_at: string | null
          user_id: string
          weight: string | null
        }
        Insert: {
          age?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          microchip_id?: string | null
          name: string
          notes?: string | null
          type: string
          updated_at?: string | null
          user_id: string
          weight?: string | null
        }
        Update: {
          age?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          microchip_id?: string | null
          name?: string
          notes?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
          weight?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          business_address: string | null
          clinic_name: string | null
          created_at: string | null
          education: string | null
          id: string
          is_verified: boolean | null
          license_number: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          specializations: string[] | null
          user_id: string
          verification_documents: string | null
          verification_notes: string | null
          verification_status: string | null
          verification_submitted_at: string | null
          verified_at: string | null
          verified_by: string | null
          years_of_experience: number | null
        }
        Insert: {
          business_address?: string | null
          clinic_name?: string | null
          created_at?: string | null
          education?: string | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specializations?: string[] | null
          user_id: string
          verification_documents?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verification_submitted_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
          years_of_experience?: number | null
        }
        Update: {
          business_address?: string | null
          clinic_name?: string | null
          created_at?: string | null
          education?: string | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specializations?: string[] | null
          user_id?: string
          verification_documents?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verification_submitted_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      vaccinations: {
        Row: {
          created_at: string | null
          date_administered: string
          id: string
          next_due_date: string | null
          notes: string | null
          pet_id: string
          reminder_enabled: boolean | null
          updated_at: string | null
          vaccine_name: string
          veterinarian_name: string
        }
        Insert: {
          created_at?: string | null
          date_administered: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          pet_id: string
          reminder_enabled?: boolean | null
          updated_at?: string | null
          vaccine_name: string
          veterinarian_name: string
        }
        Update: {
          created_at?: string | null
          date_administered?: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          pet_id?: string
          reminder_enabled?: boolean | null
          updated_at?: string | null
          vaccine_name?: string
          veterinarian_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccinations_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      verified_veterinarians: {
        Row: {
          business_address: string | null
          clinic_name: string | null
          education: string | null
          first_name: string | null
          id: string | null
          is_verified: boolean | null
          last_name: string | null
          license_number: string | null
          phone_number: string | null
          specializations: string[] | null
          user_id: string | null
          verified_at: string | null
          years_of_experience: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "client" | "veterinarian" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["client", "veterinarian", "admin"],
    },
  },
} as const
