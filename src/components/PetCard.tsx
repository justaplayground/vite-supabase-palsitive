
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  image: string;
  lastVisit: string;
}

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <img 
          src={pet.image} 
          alt={pet.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{pet.name}</h3>
          <p className="text-gray-600 text-sm">{pet.breed} • {pet.age}</p>
          <div className="flex items-center space-x-1 mt-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">Last visit: {pet.lastVisit}</span>
          </div>
        </div>
        <div className="text-right">
          <div className={`w-3 h-3 rounded-full ${
            pet.type === 'Dog' ? 'bg-blue-500' : 'bg-purple-500'
          }`} />
          <span className="text-xs text-gray-500 mt-1 block">{pet.type}</span>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
