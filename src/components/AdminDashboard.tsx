
import React, { useState } from 'react';
import { Shield, Users, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminVerification } from '@/hooks/useAdminVerification';
import VerificationReviewModal from './VerificationReviewModal';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const { verificationRequests, stats, loading, updateVerificationStatus } = useAdminVerification();

  const filteredRequests = verificationRequests.filter(request => {
    const matchesSearch = request.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.verification_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="opacity-90">Manage veterinarian verifications and system administration</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Verification</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verified Vets</p>
                  <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by clinic name or veterinarian name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No verification requests found</h3>
                <p className="text-gray-500">No requests match the current search and filter criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            Dr. {request.first_name} {request.last_name}
                          </h3>
                          <Badge className={`${getStatusColor(request.verification_status)} flex items-center gap-1`}>
                            {getStatusIcon(request.verification_status)}
                            {request.verification_status?.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Clinic:</strong> {request.clinic_name}</p>
                            <p><strong>License:</strong> {request.license_number}</p>
                            <p><strong>Experience:</strong> {request.years_of_experience} years</p>
                          </div>
                          <div>
                            <p><strong>Phone:</strong> {request.phone_number}</p>
                            <p><strong>Address:</strong> {request.business_address}</p>
                            {request.verification_submitted_at && (
                              <p><strong>Submitted:</strong> {new Date(request.verification_submitted_at).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                        {request.specializations && request.specializations.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-1"><strong>Specializations:</strong></p>
                            <div className="flex flex-wrap gap-1">
                              {request.specializations.map((spec, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedVerification(request)}
                        className="whitespace-nowrap"
                      >
                        Review Details
                      </Button>
                      {request.verification_status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => updateVerificationStatus(request.id, 'verified')}
                            className="bg-green-600 hover:bg-green-700 text-xs px-2"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateVerificationStatus(request.id, 'rejected')}
                            className="text-red-600 border-red-300 hover:bg-red-50 text-xs px-2"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Verification Review Modal */}
      {selectedVerification && (
        <VerificationReviewModal
          verification={selectedVerification}
          isOpen={!!selectedVerification}
          onClose={() => setSelectedVerification(null)}
          onStatusUpdate={updateVerificationStatus}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
