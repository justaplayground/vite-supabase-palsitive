
import React from 'react';
import { Calendar, Clock, User, MapPin } from 'lucide-react';

interface Appointment {
  id: number;
  petName: string;
  petImage: string;
  date: string;
  time: string;
  type: string;
  vet: string;
  clinic: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img 
          src={appointment.petImage} 
          alt={appointment.petName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{appointment.petName}</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {appointment.type}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(appointment.date)}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{appointment.time}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{appointment.vet}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{appointment.clinic}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
