
import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppointments } from '@/hooks/useAppointments';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const VeterinarianDashboard = () => {
  const { appointments, loading } = useAppointments();
  const [filter, setFilter] = useState('upcoming');
  const { toast } = useToast();

  const updateAppointmentStatus = async (appointmentId: string, status: string, notes?: string) => {
    try {
      const updates: any = { status };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }
      if (notes) {
        updates.appointment_notes = notes;
      }

      const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Appointment marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    }
  };

  const sendNotification = async (clientEmail: string, petName: string) => {
    // For now, just show a toast. In a real app, this would integrate with email service
    toast({
      title: "Notification Sent",
      description: `Reminder sent to client about ${petName}'s appointment`,
    });
  };

  const getFilteredAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'upcoming':
        return appointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= today && apt.status === 'scheduled';
        });
      case 'completed':
        return appointments.filter(apt => apt.status === 'completed');
      case 'missed':
        return appointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate < today && apt.status === 'scheduled';
        });
      case 'all':
      default:
        return appointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Veterinarian Dashboard</h1>
          <p className="opacity-90">Manage your appointments and client communications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">
                  {appointments.filter(apt => {
                    const aptDate = new Date(apt.date);
                    const today = new Date();
                    return aptDate >= today && apt.status === 'scheduled';
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter(apt => apt.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Missed</p>
                <p className="text-2xl font-bold text-red-600">
                  {appointments.filter(apt => {
                    const aptDate = new Date(apt.date);
                    const today = new Date();
                    return aptDate < today && apt.status === 'scheduled';
                  }).length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-600">{appointments.length}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'completed', label: 'Completed' },
              { id: 'missed', label: 'Missed' },
              { id: 'all', label: 'All' }
            ].map((filterOption) => (
              <Button
                key={filterOption.id}
                variant={filter === filterOption.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(filterOption.id)}
              >
                {filterOption.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No appointments found</h3>
              <p className="text-gray-500">No appointments match the current filter.</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={appointment.pets?.image_url || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=face'}
                      alt={appointment.pets?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{appointment.pets?.name}</h3>
                      <p className="text-gray-600">{appointment.pets?.type}</p>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Dr. {appointment.vet_name}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {appointment.status === 'scheduled' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, 'rescheduled')}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendNotification('client@example.com', appointment.pets?.name || 'Pet')}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Notify Client
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {appointment.type && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm"><strong>Appointment Type:</strong> {appointment.type}</p>
                    {appointment.notes && (
                      <p className="text-sm mt-1"><strong>Notes:</strong> {appointment.notes}</p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VeterinarianDashboard;
