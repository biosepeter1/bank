'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, FileText, User, Calendar, Loader2, Mail, Phone, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { toast } from 'react-hot-toast';
import { useBranding } from '@/contexts/BrandingContext';

type KYCDocument = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  documentType: string;
  documentNumber: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  dateOfBirth?: string;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  idDocumentUrl?: string;
  proofOfAddressUrl?: string;
  selfieUrl?: string;
};

export default function AdminKYCPage() {
  
  const { branding } = useBranding();
const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  // Get base URL without /api suffix for static files
  const getFileUrl = (path: string) => {
    if (!path) return '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Remove /api from the end if it exists
    const cleanBaseUrl = baseUrl.replace(/\/api$/, '');
    return `${cleanBaseUrl}${path}`;
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    
    try {
      console.log('🔄 Fetching KYC documents from API');
      
      const data = await adminApi.getAllKYC();
      
      console.log('✅ API Response:', data);
      
      if (data && Array.isArray(data)) {
        // Map API data to component format
        const mappedDocs: KYCDocument[] = data.map((doc: any) => ({
          id: doc.id,
          userId: doc.userId,
          userName: `${doc.user?.firstName || ''} ${doc.user?.lastName || ''}`.trim(),
          userEmail: doc.user?.email || '',
          userPhone: doc.user?.phone,
          documentType: doc.idType,
          documentNumber: doc.idNumber,
          address: doc.address,
          city: doc.city,
          state: doc.state,
          country: doc.country,
          dateOfBirth: doc.dateOfBirth,
          status: doc.status,
          submittedAt: doc.submittedAt,
          reviewedAt: doc.reviewedAt,
          reviewedBy: doc.reviewedBy,
          rejectionReason: doc.rejectionReason,
          idDocumentUrl: doc.idDocumentUrl,
          proofOfAddressUrl: doc.proofOfAddressUrl,
          selfieUrl: doc.selfieUrl,
        }));
      
        setDocuments(mappedDocs);
        
        if (mappedDocs.length === 0) {
          toast('No KYC documents found in database', { icon: 'ℹ️' });
        } else {
          toast.success(`Loaded ${mappedDocs.length} KYC document${mappedDocs.length > 1 ? 's' : ''}`);
        }
      } else {
        setDocuments([]);
        toast.error('Invalid data format received from API');
      }
    } catch (apiError: any) {
      console.error('❌ API Error:', apiError);
      setDocuments([]);
      toast.error(apiError?.response?.data?.message || 'Failed to fetch KYC documents');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (docId: string) => {
    if (!confirm('Are you sure you want to approve this KYC document? This will activate the user account.')) {
      return;
    }

    try {
      await adminApi.approveKYC(docId);
      toast.success('KYC document approved successfully! User account is now active.');
      fetchDocuments();
    } catch (error: any) {
      console.error('Approve error:', error);
      toast.error(error?.response?.data?.message || 'Failed to approve KYC document');
    }
  };

  const openRejectDialog = (docId: string) => {
    setSelectedDocId(docId);
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setRejecting(true);
    try {
      await adminApi.rejectKYC(selectedDocId, rejectionReason);
      toast.success('KYC document rejected');
      setRejectDialogOpen(false);
      setRejectionReason('');
      fetchDocuments();
    } catch (error: any) {
      console.error('Reject error:', error);
      toast.error(error?.response?.data?.message || 'Failed to reject KYC document');
    } finally {
      setRejecting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  const filteredDocs = filter === 'ALL' ? documents : documents.filter(d => d.status === filter);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">KYC Document Review</h1>
        <p className="text-gray-600 mt-2">Review and approve customer identification documents</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card
          className={`cursor-pointer ${filter === 'ALL' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <p className="text-2xl font-bold">{documents.length}</p>
              <p className="text-sm text-gray-600">Total Documents</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer ${filter === 'PENDING' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => setFilter('PENDING')}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">
                {documents.filter(d => d.status === 'PENDING').length}
              </p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer ${filter === 'APPROVED' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setFilter('APPROVED')}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">
                {documents.filter(d => d.status === 'APPROVED').length}
              </p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer ${filter === 'REJECTED' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setFilter('REJECTED')}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold">
                {documents.filter(d => d.status === 'REJECTED').length}
              </p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No KYC documents found</p>
            </CardContent>
          </Card>
        ) : (
          filteredDocs.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Header Section with User Info and Status */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {doc.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">{doc.userName}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {doc.userEmail}
                          </span>
                          {doc.userPhone && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5" />
                              {doc.userPhone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${getStatusBadge(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-6 space-y-6">
                  {/* Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">ID Type</p>
                      <p className="font-semibold text-gray-900">{doc.documentType}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">ID Number</p>
                      <p className="font-semibold text-gray-900">{doc.documentNumber}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Date of Birth</p>
                      <p className="font-semibold text-gray-900">
                        {doc.dateOfBirth ? new Date(doc.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Submitted</p>
                      <p className="font-semibold text-gray-900">{new Date(doc.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Address */}
                  {doc.address && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-xs font-medium text-blue-700 uppercase mb-2 flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        Address
                      </p>
                      <p className="text-sm text-gray-700">
                        {doc.address}, {doc.city}, {doc.state}, {doc.country}
                      </p>
                    </div>
                  )}

                  {/* Uploaded Documents */}
                  {(doc.idDocumentUrl || doc.proofOfAddressUrl || doc.selfieUrl) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Document Attachments</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {doc.idDocumentUrl && (
                          <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all">
                            <div className="absolute top-2 right-2 z-10">
                              <a
                                href={getFileUrl(doc.idDocumentUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-md hover:bg-blue-50 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4 text-blue-600" />
                              </a>
                            </div>
                            {doc.idDocumentUrl.endsWith('.pdf') ? (
                              <div className="h-48 bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center">
                                <FileText className="h-16 w-16 text-red-500 mb-2" />
                                <p className="text-sm font-medium text-gray-700">PDF Document</p>
                              </div>
                            ) : (
                              <img
                                src={getFileUrl(doc.idDocumentUrl)}
                                alt="ID Document"
                                className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                                onClick={() => window.open(getFileUrl(doc.idDocumentUrl), '_blank')}
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-image.png';
                                }}
                              />
                            )}
                            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t">
                              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 text-blue-600" />
                                ID Document
                              </p>
                            </div>
                          </div>
                        )}

                        {doc.proofOfAddressUrl && (
                          <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-green-400 hover:shadow-lg transition-all">
                            <div className="absolute top-2 right-2 z-10">
                              <a
                                href={getFileUrl(doc.proofOfAddressUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-md hover:bg-green-50 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4 text-green-600" />
                              </a>
                            </div>
                            {doc.proofOfAddressUrl.endsWith('.pdf') ? (
                              <div className="h-48 bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center">
                                <FileText className="h-16 w-16 text-red-500 mb-2" />
                                <p className="text-sm font-medium text-gray-700">PDF Document</p>
                              </div>
                            ) : (
                              <img
                                src={getFileUrl(doc.proofOfAddressUrl)}
                                alt="Proof of Address"
                                className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                                onClick={() => window.open(getFileUrl(doc.proofOfAddressUrl), '_blank')}
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-image.png';
                                }}
                              />
                            )}
                            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-t">
                              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 text-green-600" />
                                Proof of Address
                              </p>
                            </div>
                          </div>
                        )}

                        {doc.selfieUrl && (
                          <div className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-400 hover:shadow-lg transition-all">
                            <div className="absolute top-2 right-2 z-10">
                              <a
                                href={getFileUrl(doc.selfieUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-md hover:bg-purple-50 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4 text-purple-600" />
                              </a>
                            </div>
                            <img
                              src={getFileUrl(doc.selfieUrl)}
                              alt="Selfie"
                              className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                              onClick={() => window.open(getFileUrl(doc.selfieUrl), '_blank')}
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.png';
                              }}
                            />
                            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-t">
                              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                <ImageIcon className="h-3.5 w-3.5 text-purple-600" />
                                Selfie Photo
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      {!doc.idDocumentUrl && !doc.proofOfAddressUrl && !doc.selfieUrl && (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">No documents uploaded</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {doc.status === 'REJECTED' && doc.rejectionReason && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 mb-1">Rejection Reason</p>
                          <p className="text-sm text-red-700">{doc.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {doc.status === 'PENDING' && (
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        onClick={() => handleApprove(doc.id)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => openRejectDialog(doc.id)}
                        className="border-2 border-red-600 text-red-600 hover:bg-red-50 px-6"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {doc.status === 'APPROVED' && (
                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => openRejectDialog(doc.id)}
                        className="border-2 border-red-600 text-red-600 hover:bg-red-50 px-6"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Revoke & Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject KYC Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this KYC document. The user will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Rejection Reason *</Label>
            <Input
              id="reason"
              placeholder="e.g., Document is not clear, Information does not match"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
              disabled={rejecting}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason('');
              }}
              disabled={rejecting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejecting || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {rejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


