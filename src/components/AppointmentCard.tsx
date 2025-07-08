import React from "react";
import { Calendar, Clock, User, MapPin } from "lucide-react";

interface Appointment {
  id: string;
  pet_id: string;
  date: string;
  time: string;
  type: string;
  vet_name: string;
  clinic_name: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  pets?: {
    name: string;
    type: string;
    image_url?: string;
  };
}

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const petName = appointment.pets?.name || "Unknown Pet";
  const petImage =
    appointment.pets?.image_url ||
    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=face";
  const vet = appointment.vet_name;
  const clinic = appointment.clinic_name;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img src={petImage} alt={petName} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{petName}</h3>
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
              <span>{vet}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{clinic}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
