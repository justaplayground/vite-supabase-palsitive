
import React from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Stethoscope, User, Shield } from 'lucide-react';

interface RoleSelectorProps {
  value: 'client' | 'veterinarian' | 'admin';
  onChange: (value: 'client' | 'veterinarian' | 'admin') => void;
  showAdmin?: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange, showAdmin = false }) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">I am a:</Label>
      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="client" id="client" />
          <Label htmlFor="client" className="flex items-center space-x-2 cursor-pointer flex-1">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium">Pet Owner</div>
              <div className="text-sm text-gray-600">I want to manage my pets' health records</div>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="veterinarian" id="veterinarian" />
          <Label htmlFor="veterinarian" className="flex items-center space-x-2 cursor-pointer flex-1">
            <Stethoscope className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium">Veterinarian</div>
              <div className="text-sm text-gray-600">I provide veterinary services to pets</div>
            </div>
          </Label>
        </div>

        {showAdmin && (
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="admin" id="admin" />
            <Label htmlFor="admin" className="flex items-center space-x-2 cursor-pointer flex-1">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium">Administrator</div>
                <div className="text-sm text-gray-600">I manage the platform</div>
              </div>
            </Label>
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default RoleSelector;
