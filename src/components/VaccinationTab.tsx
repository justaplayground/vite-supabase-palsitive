
import React, { useState } from 'react';
import { Plus, Syringe, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useToast } from './ui/use-toast';

interface VaccinationTabProps {
  petId: string;
}

const VaccinationTab: React.FC<VaccinationTabProps> = ({ petId }) => {
  const { vaccinations, loading, addVaccination, updateVaccination, deleteVaccination } = useVaccinations(petId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    vaccine_name: '',
    date_administered: '',
    veterinarian_name: '',
    notes: '',
    next_due_date: '',
    reminder_enabled: false
  });

  const resetForm = () => {
    setFormData({
      vaccine_name: '',
      date_administered: '',
      veterinarian_name: '',
      notes: '',
      next_due_date: '',
      reminder_enabled: false
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const vaccinationData = {
      ...formData,
      pet_id: petId
    };

    let result;
    if (editingId) {
      result = await updateVaccination(editingId, formData);
    } else {
      result = await addVaccination(vaccinationData);
    }

    if (result.error) {
      toast({
        title: "Error",
        description: `Failed to ${editingId ? 'update' : 'add'} vaccination`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `Vaccination ${editingId ? 'updated' : 'added'} successfully`
      });
      resetForm();
    }
  };

  const handleEdit = (vaccination: any) => {
    setFormData({
      vaccine_name: vaccination.vaccine_name,
      date_administered: vaccination.date_administered,
      veterinarian_name: vaccination.veterinarian_name,
      notes: vaccination.notes || '',
      next_due_date: vaccination.next_due_date || '',
      reminder_enabled: vaccination.reminder_enabled
    });
    setEditingId(vaccination.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteVaccination(id);
    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to delete vaccination",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Vaccination deleted successfully"
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-600">Loading vaccinations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vaccination History</h3>
        <Button onClick={() => setShowAddForm(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Vaccination
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h4 className="font-medium">{editingId ? 'Edit' : 'Add'} Vaccination</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vaccine Name</label>
                <input
                  type="text"
                  value={formData.vaccine_name}
                  onChange={(e) => setFormData({...formData, vaccine_name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date Administered</label>
                <input
                  type="date"
                  value={formData.date_administered}
                  onChange={(e) => setFormData({...formData, date_administered: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Veterinarian Name</label>
                <input
                  type="text"
                  value={formData.veterinarian_name}
                  onChange={(e) => setFormData({...formData, veterinarian_name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Next Due Date</label>
                <input
                  type="date"
                  value={formData.next_due_date}
                  onChange={(e) => setFormData({...formData, next_due_date: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-2 border rounded-lg h-20"
                placeholder="Optional notes about the vaccination..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reminder"
                checked={formData.reminder_enabled}
                onChange={(e) => setFormData({...formData, reminder_enabled: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="reminder" className="text-sm font-medium">Enable reminder notifications</label>
            </div>
            <div className="flex space-x-2">
              <Button type="submit">
                {editingId ? 'Update' : 'Add'} Vaccination
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Vaccination List */}
      {vaccinations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Syringe className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-semibold mb-2">No vaccinations recorded</h4>
          <p className="mb-4">Keep track of your pet's vaccination history</p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Vaccination
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {vaccinations.map((vaccination) => (
            <div key={vaccination.id} className="bg-white rounded-lg p-4 border shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Syringe className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold">{vaccination.vaccine_name}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Date:</strong> {new Date(vaccination.date_administered).toLocaleDateString()}</p>
                      <p><strong>Veterinarian:</strong> {vaccination.veterinarian_name}</p>
                    </div>
                    <div>
                      {vaccination.next_due_date && (
                        <p><strong>Next Due:</strong> {new Date(vaccination.next_due_date).toLocaleDateString()}</p>
                      )}
                      {vaccination.reminder_enabled && (
                        <p className="text-green-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Reminder enabled
                        </p>
                      )}
                    </div>
                  </div>
                  {vaccination.notes && (
                    <p className="mt-2 text-sm text-gray-700">{vaccination.notes}</p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(vaccination)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(vaccination.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaccinationTab;
