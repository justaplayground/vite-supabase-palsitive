
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import RoleSelector from './RoleSelector';
import VeterinarianFields from './VeterinarianFields';
import { Loader2, Save } from 'lucide-react';

const RoleManagement: React.FC = () => {
  const { userRole, updateUserRole, loading: roleLoading } = useUserRole();
  const [selectedRole, setSelectedRole] = useState<'client' | 'veterinarian' | 'admin'>(
    userRole?.role || 'client'
  );
  const [clinicName, setClinicName] = useState(userRole?.clinic_name || '');
  const [licenseNumber, setLicenseNumber] = useState(userRole?.license_number || '');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (selectedRole === 'veterinarian' && (!clinicName || !licenseNumber)) {
      toast({
        title: "Missing Information",
        description: "Please provide clinic name and license number for veterinarian role",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const roleData = {
        role: selectedRole,
        clinic_name: selectedRole === 'veterinarian' ? clinicName : undefined,
        license_number: selectedRole === 'veterinarian' ? licenseNumber : undefined
      };

      const { error } = await updateUserRole(roleData);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update role. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Your role has been updated successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const hasChanges = 
    selectedRole !== userRole?.role ||
    (selectedRole === 'veterinarian' && (
      clinicName !== (userRole?.clinic_name || '') ||
      licenseNumber !== (userRole?.license_number || '')
    ));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Role Management</h3>
        <p className="text-gray-600 text-sm mb-4">
          Change your account type and update your professional information
        </p>
      </div>

      <RoleSelector 
        value={selectedRole} 
        onChange={setSelectedRole}
        showAdmin={userRole?.role === 'admin'}
      />

      {selectedRole === 'veterinarian' && (
        <VeterinarianFields
          clinicName={clinicName}
          licenseNumber={licenseNumber}
          onClinicNameChange={setClinicName}
          onLicenseNumberChange={setLicenseNumber}
        />
      )}

      {hasChanges && (
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      )}

      {userRole && (
        <div className="text-xs text-gray-500 mt-4">
          Current role: <span className="font-medium capitalize">{userRole.role}</span>
          {userRole.role === 'veterinarian' && userRole.clinic_name && (
            <span> • {userRole.clinic_name}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
