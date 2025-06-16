
import React, { useState } from 'react';
import { X, Calendar, Clock, User, MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  image: string;
  lastVisit: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pets: Pet[];
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, pets }) => {
  const [step, setStep] = useState(1);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedVet, setSelectedVet] = useState('');

  const appointmentTypes = [
    'Annual Check-up',
    'Vaccination',
    'Emergency Visit',
    'Dental Cleaning',
    'Surgery Consultation',
    'Grooming'
  ];

  const vets = [
    { name: 'Dr. Sarah Johnson', specialty: 'General Practice', clinic: 'PetCare Central' },
    { name: 'Dr. Mike Chen', specialty: 'Surgery', clinic: 'Healthy Paws Clinic' },
    { name: 'Dr. Emma Davis', specialty: 'Dermatology', clinic: 'Animal Health Center' }
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const resetForm = () => {
    setStep(1);
    setSelectedPet(null);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedType('');
    setSelectedVet('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBooking = () => {
    // Here you would typically send the booking data to your backend
    console.log('Booking appointment:', {
      pet: selectedPet,
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
      vet: selectedVet
    });
    handleClose();
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Your Pet</h3>
            <div className="space-y-2">
              {pets.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => setSelectedPet(pet)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl border transition-colors ${
                    selectedPet?.id === pet.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-medium">{pet.name}</p>
                    <p className="text-sm text-gray-600">{pet.breed}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Appointment Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {appointmentTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`p-3 rounded-xl border text-sm transition-colors ${
                    selectedType === type 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Veterinarian</h3>
            <div className="space-y-2">
              {vets.map(vet => (
                <button
                  key={vet.name}
                  onClick={() => setSelectedVet(vet.name)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl border transition-colors ${
                    selectedVet === vet.name 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{vet.name}</p>
                    <p className="text-sm text-gray-600">{vet.specialty}</p>
                    <p className="text-xs text-gray-500">{vet.clinic}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Date & Time</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg border text-sm transition-colors ${
                        selectedTime === time 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Confirm Appointment</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedPet?.image} 
                  alt={selectedPet?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{selectedPet?.name}</p>
                  <p className="text-sm text-gray-600">{selectedPet?.breed}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{selectedTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{selectedVet}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{selectedType}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedPet !== null;
      case 2: return selectedType !== '';
      case 3: return selectedVet !== '';
      case 4: return selectedDate !== '' && selectedTime !== '';
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-in-right">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Book Appointment</h2>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i <= step ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex space-x-3 mt-6">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={step === 5 ? handleBooking : () => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1"
            >
              {step === 5 ? 'Confirm Booking' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
