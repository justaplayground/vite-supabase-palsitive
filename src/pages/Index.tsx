import React, { useState } from "react";
import { Calendar, Plus, User, Clock, MapPin, Phone, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePets } from "@/hooks/usePets";
import { useAppointments } from "@/hooks/useAppointments";
import PetCard from "../components/PetCard";
import AppointmentCard from "../components/AppointmentCard";
import BookingModal from "../components/BookingModal";
import PetModal from "../components/PetModal";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);

  const { user, signOut } = useAuth();
  const { pets, loading: petsLoading, addPet } = usePets();
  const { appointments, loading: appointmentsLoading, addAppointment } = useAppointments();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Transform pets data for compatibility with existing components
  const transformedPets = pets.map((pet) => ({
    id: parseInt(pet.id.slice(-8), 16), // Convert UUID to number for compatibility
    name: pet.name,
    type: pet.type,
    breed: pet.breed || "",
    age: pet.age || "",
    image:
      pet.image_url ||
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=face",
    lastVisit: new Date(pet.created_at).toISOString().split("T")[0],
  }));

  // Transform appointments data for compatibility
  const transformedAppointments = appointments.map((appointment) => ({
    id: parseInt(appointment.id.slice(-8), 16),
    petName: appointment.pets?.name || "Unknown Pet",
    petImage:
      appointment.pets?.image_url ||
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=face",
    date: appointment.date,
    time: appointment.time,
    type: appointment.type,
    vet: appointment.vet_name,
    clinic: appointment.clinic_name,
  }));

  const renderHome = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
            <p className="opacity-90">Your pets' health is our priority</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm" className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 relative">
        <Button
          onClick={() => setShowBookingModal(true)}
          className="h-20 bg-green-500 hover:bg-green-600 flex flex-col items-center justify-center space-y-2"
          disabled={pets.length === 0}
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
        {appointmentsLoading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : transformedAppointments.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No upcoming appointments</p>
            <p className="text-sm">Book your first appointment above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transformedAppointments.slice(0, 3).map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
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

      {petsLoading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading pets...</p>
        </div>
      ) : transformedPets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No pets yet</h3>
          <p className="mb-4">Add your first pet to get started</p>
          <Button onClick={() => setShowPetModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Pet
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {transformedPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button onClick={() => setShowBookingModal(true)} size="sm" disabled={pets.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Book New
        </Button>
      </div>

      {appointmentsLoading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      ) : transformedAppointments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No appointments scheduled</h3>
          <p className="mb-4">Book your first appointment</p>
          {pets.length > 0 ? (
            <Button onClick={() => setShowBookingModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          ) : (
            <p className="text-sm">Add a pet first to book appointments</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upcoming</h2>
          {transformedAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-12 h-12 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold">{user?.email}</h1>
        <p className="text-gray-600">Pet Parent</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold mb-2">Account Information</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Member since:</span>
              <span>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold mb-2">Quick Stats</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total Pets:</span>
              <span className="text-blue-600 font-semibold">{pets.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Appointments:</span>
              <span className="text-green-600 font-semibold">{appointments.length}</span>
            </div>
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

        <Button onClick={handleSignOut} variant="outline" className="text-destructive w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return renderHome();
      case "pets":
        return renderPets();
      case "appointments":
        return renderAppointments();
      case "profile":
        return renderProfile();
      default:
        return renderHome();
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      {/* Main Content */}
      <div className="h-full max-h-screen overflow-auto pb-20 px-4 pt-6">{renderContent()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-l border-r border-gray-200 px-4 py-2 rounded-t-2xl mx-1">
        <div className="flex justify-around rounded-t-xl">
          {[
            { id: "home", icon: Calendar, label: "Home" },
            { id: "pets", icon: User, label: "Pets" },
            { id: "appointments", icon: Clock, label: "Appointments" },
            { id: "profile", icon: User, label: "Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800"
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
        pets={transformedPets}
        onBookingComplete={addAppointment}
      />
      <PetModal isOpen={showPetModal} onClose={() => setShowPetModal(false)} onPetAdded={addPet} />
    </div>
  );
};

export default Index;
