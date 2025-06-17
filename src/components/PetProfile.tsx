
import React, { useState } from 'react';
import { ArrowLeft, User, Calendar, FileText, Syringe } from 'lucide-react';
import { Button } from './ui/button';
import VaccinationTab from './VaccinationTab';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  image: string;
  lastVisit: string;
}

interface PetProfileProps {
  pet: Pet;
  onBack: () => void;
}

const PetProfile: React.FC<PetProfileProps> = ({ pet, onBack }) => {
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', label: 'General Info', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'vaccinations', label: 'Vaccinations', icon: Syringe },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold mb-4">Pet Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Type:</p>
                  <p className="font-medium">{pet.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Breed:</p>
                  <p className="font-medium">{pet.breed}</p>
                </div>
                <div>
                  <p className="text-gray-600">Age:</p>
                  <p className="font-medium">{pet.age}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Visit:</p>
                  <p className="font-medium">{new Date(pet.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'vaccinations':
        return <VaccinationTab petId={pet.id.toString()} />;
      case 'appointments':
        return (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Appointment history coming soon...</p>
          </div>
        );
      case 'notes':
        return (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Pet notes coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center space-x-4">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{pet.name}</h1>
            <p className="text-gray-600">{pet.type} • {pet.breed}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PetProfile;
