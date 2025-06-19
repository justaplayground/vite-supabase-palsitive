
import React from 'react';
import { Label } from './ui/label';

interface VeterinarianFieldsProps {
  clinicName: string;
  licenseNumber: string;
  onClinicNameChange: (value: string) => void;
  onLicenseNumberChange: (value: string) => void;
}

const VeterinarianFields: React.FC<VeterinarianFieldsProps> = ({
  clinicName,
  licenseNumber,
  onClinicNameChange,
  onLicenseNumberChange
}) => {
  return (
    <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-xl">
      <div className="flex items-center space-x-2 text-green-800">
        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
        <span className="text-sm font-medium">Veterinarian Information</span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Clinic/Practice Name *
          </Label>
          <input
            type="text"
            value={clinicName}
            onChange={(e) => onClinicNameChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Animal Care Clinic"
            required
          />
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            License Number *
          </Label>
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => onLicenseNumberChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="VET123456"
            required
          />
        </div>
      </div>
      
      <p className="text-xs text-green-700">
        This information helps us verify your veterinary credentials and provide appropriate access.
      </p>
    </div>
  );
};

export default VeterinarianFields;
