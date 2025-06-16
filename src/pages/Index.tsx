
import React, { useState } from 'react';
import { Calendar, Plus, User, Clock, MapPin, Phone } from 'lucide-react';
import PetCard from '../components/PetCard';
import AppointmentCard from '../components/AppointmentCard';
import BookingModal from '../components/BookingModal';
import PetModal from '../components/PetModal';
import { Button } from '../components/ui/button';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);

  const pets = [
    {
      id: 1,
      name: 'Luna',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: '3 years',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=face',
      lastVisit: '2024-05-15'
    },
    {
      id: 2,
      name: 'Whiskers',
      type: 'Cat',
      breed: 'Persian',
      age: '2 years',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop&crop=face',
      lastVisit: '2024-04-20'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      petName: 'Luna',
      petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=face',
      date: '2024-06-20',
      time: '10:00 AM',
      type: 'Check-up',
      vet: 'Dr. Sarah Johnson',
      clinic: 'PetCare Central'
    },
    {
      id: 2,
      petName: 'Whiskers',
      petImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop&crop=face',
      date: '2024-06-22',
      time: '2:30 PM',
      type: 'Vaccination',
      vet: 'Dr. Mike Chen',
      clinic: 'Healthy Paws Clinic'
    }
  ];

  const renderHome = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="opacity-90">Your pets' health is our priority</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => setShowBookingModal(true)}
          className="h-20 bg-green-500 hover:bg-green-600 flex flex-col items-center justify-center space-y-2"
        >
          <Calendar className="w-6 h-6" />
          <span className="text-sm">Book Appointment</span>
        </Button>
        <Button 
          onClick={() => setShowPetModal(true)}
          className="h-20 bg-blue-500 hover:bg-blue-600 flex flex-col items-center justify-center space-y-2"
        >
          <Plus className="w-6 h-6" />
          <span className="text-sm">Add Pet</span>
        </Button>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-3">
          {upcomingAppointments.map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <h3 className="font-semibold text-red-800 mb-2">Emergency Contact</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-red-700">
            <Phone className="w-4 h-4" />
            <span>24/7 Emergency Line</span>
          </div>
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            Call Now
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Pets</h1>
        <Button onClick={() => setShowPetModal(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Pet
        </Button>
      </div>
      
      <div className="grid gap-4">
        {pets.map(pet => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button onClick={() => setShowBookingModal(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Book New
        </Button>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming</h2>
        {upcomingAppointments.map(appointment => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-12 h-12 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold">John Smith</h1>
        <p className="text-gray-600">Pet Parent</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold mb-2">Contact Information</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>123 Main St, Anytown, USA</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold mb-2">Preferences</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Notifications</span>
              <span className="text-green-600">Enabled</span>
            </div>
            <div className="flex justify-between">
              <span>Reminders</span>
              <span className="text-green-600">24h before</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHome();
      case 'pets': return renderPets();
      case 'appointments': return renderAppointments();
      case 'profile': return renderProfile();
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="pb-20 px-4 pt-6">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {[
            { id: 'home', icon: Calendar, label: 'Home' },
            { id: 'pets', icon: User, label: 'Pets' },
            { id: 'appointments', icon: Clock, label: 'Appointments' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <BookingModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)}
        pets={pets}
      />
      <PetModal 
        isOpen={showPetModal} 
        onClose={() => setShowPetModal(false)}
      />
    </div>
  );
};

export default Index;
