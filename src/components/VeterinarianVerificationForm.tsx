
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Clock, XCircle, FileText, Save } from 'lucide-react';

const SPECIALIZATION_OPTIONS = [
  'Small Animal Medicine',
  'Large Animal Medicine',
  'Emergency Medicine',
  'Surgery',
  'Cardiology',
  'Dermatology',
  'Oncology',
  'Orthopedics',
  'Ophthalmology',
  'Exotic Animal Medicine',
  'Dentistry',
  'Neurology',
  'Internal Medicine',
  'Behavioral Medicine',
  'Pathology'
];

const VeterinarianVerificationForm = () => {
  const { userRole, updateUserRole } = useUserRole();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    business_address: userRole?.business_address || '',
    phone_number: userRole?.phone_number || '',
    years_of_experience: userRole?.years_of_experience || 0,
    education: userRole?.education || '',
    verification_documents: userRole?.verification_documents || '',
    specializations: userRole?.specializations || []
  });
  
  const [loading, setLoading] = useState(false);

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        ...formData,
        verification_status: 'pending',
        verification_submitted_at: new Date().toISOString()
      };

      const { error } = await updateUserRole(updateData);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Verification Submitted",
        description: "Your verification request has been submitted for review. We'll notify you once it's processed.",
      });
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        title: "Error",
        description: "Failed to submit verification request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = () => {
    switch (userRole?.verification_status) {
      case 'verified':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          text: 'Verified',
          color: 'bg-green-100 text-green-800',
          description: 'Your veterinary credentials have been verified.'
        };
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          text: 'Pending Review',
          color: 'bg-yellow-100 text-yellow-800',
          description: 'Your verification is under review. We\'ll notify you once processed.'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          text: 'Rejected',
          color: 'bg-red-100 text-red-800',
          description: 'Your verification was rejected. Please update your information and resubmit.'
        };
      default:
        return {
          icon: <FileText className="w-5 h-5 text-gray-600" />,
          text: 'Not Submitted',
          color: 'bg-gray-100 text-gray-800',
          description: 'Complete and submit your verification to get verified status.'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const canEdit = userRole?.verification_status !== 'pending';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>Verification Status</span>
            <Badge className={`${statusInfo.color} flex items-center gap-1`}>
              {statusInfo.icon}
              {statusInfo.text}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{statusInfo.description}</p>
          {userRole?.verified_at && (
            <p className="text-sm text-green-600 mt-2">
              Verified on: {new Date(userRole.verified_at).toLocaleDateString()}
            </p>
          )}
          {userRole?.verification_notes && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-1">Admin Notes:</p>
              <p className="text-sm text-blue-700">{userRole.verification_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Form */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Verification Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <textarea
                  value={formData.business_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_address: e.target.value }))}
                  placeholder="Full business address including city, state, zip"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="(555) 123-4567"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!canEdit}
                />
              </div>
            </div>

            {/* Professional Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.years_of_experience}
                onChange={(e) => setFormData(prev => ({ ...prev, years_of_experience: parseInt(e.target.value) || 0 }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!canEdit}
              />
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Specializations (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SPECIALIZATION_OPTIONS.map((spec) => (
                  <label
                    key={spec}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.specializations.includes(spec)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(spec)}
                      onChange={() => handleSpecializationToggle(spec)}
                      className="sr-only"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education & Qualifications *
              </label>
              <textarea
                value={formData.education}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                placeholder="List your veterinary education, degrees, certifications, and other relevant qualifications..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
                disabled={!canEdit}
              />
            </div>

            {/* Verification Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Documents Reference
              </label>
              <textarea
                value={formData.verification_documents}
                onChange={(e) => setFormData(prev => ({ ...prev, verification_documents: e.target.value }))}
                placeholder="Describe or reference any supporting documents (license scans, certificates, etc.). In a full system, you would upload these files."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                disabled={!canEdit}
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: In a production system, you would upload actual documents here.
              </p>
            </div>

            {canEdit && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {loading ? 'Submitting...' : 'Submit for Verification'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VeterinarianVerificationForm;
