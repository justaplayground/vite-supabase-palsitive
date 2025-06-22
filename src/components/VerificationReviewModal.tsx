
import React, { useState } from 'react';
import { X, CheckCircle, XCircle, FileText, Phone, MapPin, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface VerificationReviewModalProps {
  verification: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string, notes?: string) => Promise<void>;
}

const VerificationReviewModal: React.FC<VerificationReviewModalProps> = ({
  verification,
  isOpen,
  onClose,
  onStatusUpdate
}) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleStatusUpdate = async (status: string) => {
    setLoading(true);
    try {
      await onStatusUpdate(verification.id, status, notes || undefined);
      toast({
        title: "Success",
        description: `Verification ${status} successfully`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold">Verification Review</h2>
            <p className="text-gray-600">Dr. {verification.first_name} {verification.last_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge className={`${getStatusColor(verification.verification_status)} flex items-center gap-1`}>
              {verification.verification_status?.toUpperCase()}
            </Badge>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-900">Dr. {verification.first_name} {verification.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{verification.phone_number || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Years of Experience</label>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{verification.years_of_experience || 'Not specified'} years</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Professional Information</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Clinic/Practice Name</label>
                  <p className="text-gray-900">{verification.clinic_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">License Number</label>
                  <p className="text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                    {verification.license_number}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Business Address</label>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <p className="text-gray-900">{verification.business_address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specializations */}
          {verification.specializations && verification.specializations.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg border-b pb-2 mb-3">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {verification.specializations.map((spec: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {verification.education && (
            <div>
              <h3 className="font-semibold text-lg border-b pb-2 mb-3">Education & Qualifications</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{verification.education}</p>
              </div>
            </div>
          )}

          {/* Verification Documents */}
          {verification.verification_documents && (
            <div>
              <h3 className="font-semibold text-lg border-b pb-2 mb-3">Verification Documents</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Documents referenced: {verification.verification_documents}</span>
              </div>
            </div>
          )}

          {/* Submission Details */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Submission Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {verification.verification_submitted_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Submitted: {new Date(verification.verification_submitted_at).toLocaleString()}</span>
                </div>
              )}
              {verification.verified_at && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Verified: {new Date(verification.verified_at).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this verification decision..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Previous Notes */}
          {verification.verification_notes && (
            <div>
              <h3 className="font-semibold text-lg border-b pb-2 mb-3">Previous Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{verification.verification_notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={loading}
          >
            Close
          </Button>
          
          {verification.verification_status === 'pending' && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleStatusUpdate('rejected')}
                variant="outline"
                disabled={loading}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleStatusUpdate('verified')}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationReviewModal;
