
import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPetAdded: (petData: any) => Promise<{ data: any; error: any }>;
}

const PetModal: React.FC<PetModalProps> = ({ isOpen, onClose, onPetAdded }) => {
  const [petData, setPetData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    weight: '',
    color: '',
    microchip_id: '',
    notes: ''
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setPetData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!petData.name || !petData.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in the pet's name and type",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await onPetAdded({
        ...petData,
        image_url: selectedImage || undefined
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add pet. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success!",
          description: `${petData.name} has been added to your pets`,
        });
        handleClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPetData({
      name: '',
      type: '',
      breed: '',
      age: '',
      weight: '',
      color: '',
      microchip_id: '',
      notes: ''
    });
    setSelectedImage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-in-right">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Add New Pet</h2>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pet Photo */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Pet Photo</label>
            <div className="flex items-center justify-center">
              <label className="relative cursor-pointer">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                  {selectedImage ? (
                    <img 
                      src={selectedImage} 
                      alt="Pet" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pet Name *</label>
              <input
                type="text"
                value={petData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter pet's name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select
                  value={petData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="text"
                  value={petData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2 years"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Breed</label>
              <input
                type="text"
                value={petData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter breed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Weight</label>
                <input
                  type="text"
                  value={petData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 15 lbs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                  type="text"
                  value={petData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Primary color"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Microchip ID</label>
              <input
                type="text"
                value={petData.microchip_id}
                onChange={(e) => handleInputChange('microchip_id', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="15-digit microchip number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={petData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Any special notes about your pet..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!petData.name || !petData.type || loading}
              className="flex-1"
            >
              {loading ? 'Adding...' : 'Add Pet'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetModal;
