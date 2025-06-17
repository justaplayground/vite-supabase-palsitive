
-- Add vaccination tracking table
CREATE TABLE public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  vaccine_name TEXT NOT NULL,
  date_administered DATE NOT NULL,
  veterinarian_name TEXT NOT NULL,
  notes TEXT,
  next_due_date DATE,
  reminder_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles enum and table for veterinarians
CREATE TYPE public.user_role AS ENUM ('client', 'veterinarian', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  clinic_name TEXT,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Update appointments table to support status management
ALTER TABLE public.appointments 
ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN appointment_notes TEXT;

-- Enable RLS for new tables
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vaccinations
CREATE POLICY "Pet owners can view vaccinations" ON public.vaccinations
  FOR SELECT USING (
    pet_id IN (
      SELECT id FROM public.pets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Pet owners can manage vaccinations" ON public.vaccinations
  FOR ALL USING (
    pet_id IN (
      SELECT id FROM public.pets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Veterinarians can view all vaccinations" ON public.vaccinations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'veterinarian'
    )
  );

CREATE POLICY "Veterinarians can manage all vaccinations" ON public.vaccinations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'veterinarian'
    )
  );

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own roles" ON public.user_roles
  FOR ALL USING (auth.uid() = user_id);

-- Create helper function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update appointments policies to allow veterinarians to view all appointments
CREATE POLICY "Veterinarians can view all appointments" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'veterinarian'
    )
  );

CREATE POLICY "Veterinarians can manage all appointments" ON public.appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'veterinarian'
    )
  );
