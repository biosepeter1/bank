'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, CheckCircle, XCircle, Clock, AlertTriangle, Shield, Sparkles, Zap, UserCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { kycApi, SubmitKycData } from '@/lib/api/kyc';
import { toast } from 'react-hot-toast';
import { getCountryByCode, COUNTRIES } from '@/lib/config/countries';

export default function KYCPage() {
  
  const { branding } = useBranding();
const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [uploading, setUploading] = useState({
    idDocument: false,
    proofOfAddress: false,
    selfie: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    idDocument: null as File | null,
    proofOfAddress: null as File | null,
    selfie: null as File | null,
  });
  
  // Get user's country from localStorage (saved during registration)
  const getUserCountry = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userCountry') || 'NG';
    }
    return 'NG';
  };
  
  const [userCountryCode] = useState(getUserCountry());
  const userCountry = getCountryByCode(userCountryCode) || getCountryByCode('NG')!;
  
  const [formData, setFormData] = useState<SubmitKycData>({
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    country: userCountryCode, // Send country code (NG, US, etc.) not name
    postalCode: '',
    idType: userCountry.kycDocuments[0].value,
    idNumber: '',
    idDocumentUrl: '',
    proofOfAddressUrl: '',
    selfieUrl: '',
  });

  useEffect(() => {
    checkKycStatus();
  }, []);

  const checkKycStatus = async () => {
    try {
      const status = await kycApi.getStatus();
      setKycStatus(status);
    } catch (error) {
      console.error('Error checking KYC status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleInputChange = (field: keyof SubmitKycData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (type: 'idDocument' | 'proofOfAddress' | 'selfie', file: File) => {
    // Validate file type
    const allowedTypes = type === 'selfie' 
      ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));
    setUploadedFiles(prev => ({ ...prev, [type]: file }));

    try {
      let response;
      if (type === 'idDocument') {
        response = await kycApi.uploadIdDocument(file);
      } else if (type === 'proofOfAddress') {
        response = await kycApi.uploadProofOfAddress(file);
      } else {
        response = await kycApi.uploadSelfie(file);
      }

      // Update form data with the URL
      const urlField = `${type}Url` as keyof SubmitKycData;
      setFormData(prev => ({ ...prev, [urlField]: response.url }));
      
      toast.success(`${type === 'idDocument' ? 'ID Document' : type === 'proofOfAddress' ? 'Proof of Address' : 'Selfie'} uploaded successfully!`);
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(error?.response?.data?.message || `Failed to upload ${type}`);
      setUploadedFiles(prev => ({ ...prev, [type]: null }));
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleFileRemove = (type: 'idDocument' | 'proofOfAddress' | 'selfie') => {
    setUploadedFiles(prev => ({ ...prev, [type]: null }));
    const urlField = `${type}Url` as keyof SubmitKycData;
    setFormData(prev => ({ ...prev, [urlField]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.dateOfBirth || !formData.address || !formData.city || !formData.state || 
        !formData.country || !formData.postalCode || !formData.idNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await kycApi.submitKyc(formData);
      toast.success('KYC submitted successfully! It will be reviewed shortly.');
      setTimeout(() => {
        checkKycStatus();
      }, 1000);
    } catch (error: any) {
      console.error('Error submitting KYC:', error);
      toast.error(error?.response?.data?.message || 'Failed to submit KYC. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="h-16 w-16 animate-spin text-emerald-600 mb-4" />
          <p className="text-gray-600 font-medium">Loading KYC status...</p>
        </motion.div>
      </div>
    );
  }

  // Show status if KYC is already submitted
  if (kycStatus && kycStatus.status !== 'NOT_SUBMITTED') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">        
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                KYC Verification
              </h1>
              <p className="text-gray-600 mt-3 text-lg">Your identity verification status</p>
            </div>
            <div className="hidden md:flex gap-4">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <UserCheck className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Verified</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <Shield className="h-6 w-6 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Secure</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {kycStatus.status === 'APPROVED' && <CheckCircle className="h-6 w-6 text-green-600" />}
              {kycStatus.status === 'PENDING' && <Clock className="h-6 w-6 text-yellow-600" />}
              {kycStatus.status === 'REJECTED' && <XCircle className="h-6 w-6 text-red-600" />}
              KYC Status: {kycStatus.status}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {kycStatus.status === 'PENDING' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-yellow-900 text-lg mb-1">Under Review</h3>
                    <p className="text-yellow-800">
                      Your KYC is being reviewed. This usually takes 1-3 business days.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {kycStatus.status === 'APPROVED' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900 text-lg mb-1">Verified!</h3>
                    <p className="text-green-800">
                      Your identity has been verified! You now have full access to all features.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {kycStatus.status === 'REJECTED' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-6 rounded-2xl shadow-lg space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-red-900 text-lg mb-1">Verification Rejected</h3>
                    <p className="text-red-800 mb-2">
                      Your KYC submission was rejected. Please review and resubmit.
                    </p>
                    {kycStatus.rejectionReason && (
                      <div className="bg-red-100 p-3 rounded-lg mt-3">
                        <p className="text-red-900 text-sm font-medium">
                          <strong>Reason:</strong> {kycStatus.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                  onClick={() => setKycStatus({ status: 'NOT_SUBMITTED' })}
                >
                  Resubmit KYC
                </Button>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-gray-100">
              <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Submitted At
                </p>
                <p className="font-bold text-gray-900">{new Date(kycStatus.submittedAt).toLocaleString()}</p>
              </div>
              {kycStatus.reviewedAt && (
                <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Reviewed At
                  </p>
                  <p className="font-bold text-gray-900">{new Date(kycStatus.reviewedAt).toLocaleString()}</p>
                </div>
              )}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">ID Type</p>
                <p className="font-bold text-gray-900">{kycStatus.idType}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">ID Number</p>
                <p className="font-bold text-gray-900">{kycStatus.idNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">      
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              KYC Verification
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Complete your identity verification to unlock all features</p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Fast</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <Shield className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Secure</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Identity Verification Form - {userCountry.flag} {userCountry.name}</CardTitle>
          <CardDescription>
            Please provide accurate information for {userCountry.name}. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address Information</h3>
              
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Lagos"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">{userCountry.addressFields.stateLabel} *</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder={`Enter ${userCountry.addressFields.stateLabel.toLowerCase()}`}
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    type="text"
                    value={userCountry.name}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Based on your registration country
                  </p>
                </div>

                <div>
                  <Label htmlFor="postalCode">{userCountry.addressFields.postalCodeLabel} *</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder={`Enter ${userCountry.addressFields.postalCodeLabel.toLowerCase()}`}
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* ID Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Identification Document</h3>
              
              <div>
                <Label htmlFor="idType">ID Type *</Label>
                <Select
                  value={formData.idType}
                  onValueChange={(value) => handleInputChange('idType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    {userCountry.kycDocuments.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Accepted documents for {userCountry.name}
                </p>
              </div>

              <div>
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  type="text"
                  placeholder="Enter your ID number"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supporting Documents (Optional)</h3>
              <p className="text-sm text-gray-600">
                You can upload documents now or skip this step and upload later.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ID Document Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {!uploadedFiles.idDocument ? (
                    <label className="cursor-pointer block text-center">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('idDocument', file);
                        }}
                        disabled={uploading.idDocument}
                      />
                      {uploading.idDocument ? (
                        <Loader2 className="h-8 w-8 mx-auto mb-2 text-blue-500 animate-spin" />
                      ) : (
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      )}
                      <p className="text-sm font-medium">{uploading.idDocument ? 'Uploading...' : 'ID Document'}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                    </label>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm font-medium text-green-600">Uploaded</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{uploadedFiles.idDocument.name}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-600 hover:text-red-700"
                        onClick={() => handleFileRemove('idDocument')}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                {/* Proof of Address Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {!uploadedFiles.proofOfAddress ? (
                    <label className="cursor-pointer block text-center">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('proofOfAddress', file);
                        }}
                        disabled={uploading.proofOfAddress}
                      />
                      {uploading.proofOfAddress ? (
                        <Loader2 className="h-8 w-8 mx-auto mb-2 text-blue-500 animate-spin" />
                      ) : (
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      )}
                      <p className="text-sm font-medium">{uploading.proofOfAddress ? 'Uploading...' : 'Proof of Address'}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                    </label>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm font-medium text-green-600">Uploaded</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{uploadedFiles.proofOfAddress.name}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-600 hover:text-red-700"
                        onClick={() => handleFileRemove('proofOfAddress')}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                {/* Selfie Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {!uploadedFiles.selfie ? (
                    <label className="cursor-pointer block text-center">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('selfie', file);
                        }}
                        disabled={uploading.selfie}
                      />
                      {uploading.selfie ? (
                        <Loader2 className="h-8 w-8 mx-auto mb-2 text-blue-500 animate-spin" />
                      ) : (
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      )}
                      <p className="text-sm font-medium">{uploading.selfie ? 'Uploading...' : 'Selfie Photo'}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                    </label>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm font-medium text-green-600">Uploaded</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{uploadedFiles.selfie.name}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-600 hover:text-red-700"
                        onClick={() => handleFileRemove('selfie')}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Please ensure all information provided is accurate. Providing false information may result in account suspension.
                </span>
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/user/profile')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Submitting...' : 'Submit KYC'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}

