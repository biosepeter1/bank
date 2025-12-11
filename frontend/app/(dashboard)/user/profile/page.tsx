'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api/auth';
import { useBranding } from '@/contexts/BrandingContext';
import { User, Mail, Phone, Calendar, Shield, CheckCircle, Eye, EyeOff, Loader2, Lock, Activity, Key, Edit2, Save, X, Camera, Upload, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ProfilePage() {
  const { branding } = useBranding();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [showImageUrlDialog, setShowImageUrlDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [otpId, setOtpId] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // Refresh profile data on mount to ensure we have latest data
    useAuthStore.getState().fetchProfile().catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement profile update API call
      // await profileApi.updateProfile(formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    setIsEditing(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setChangingPassword(true);
    try {
      // TODO: Implement password change API
      // await authApi.changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password changed successfully!');
      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
    setChangingPassword(false);
    }
  };

  const handleSendVerificationCode = async () => {
    setSendingCode(true);
    try {
      const response = await authApi.sendVerificationEmail();
      setOtpId(response.otpId);
      
      toast.success('Verification code sent! Check your email.');
      setShowVerificationDialog(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to send verification email');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setVerifying(true);
    try {
      await authApi.verifyEmail(otpId, verificationCode);
      
      toast.success('✅ Email verified successfully!');
      setShowVerificationDialog(false);
      setVerificationCode('');
      
      // Refresh user data to update verification status
      await useAuthStore.getState().fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Invalid verification code');
    } finally {
      setVerifying(false);
    }
  };

  const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingPicture(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);

      // TODO: Upload to server
      // const formData = new FormData();
      // formData.append('profilePicture', file);
      // await profileApi.uploadPicture(formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload picture');
      setProfilePicture(null);
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleImageUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setUploadingPicture(true);
    try {
      // Test if image loads
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      setProfilePicture(imageUrl);
      
      // TODO: Save to server
      // await profileApi.updateProfilePicture({ imageUrl });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success('Profile picture updated successfully!');
      setShowImageUrlDialog(false);
      setImageUrl('');
    } catch (error: any) {
      toast.error('Failed to load image from URL. Please check the URL and try again.');
    } finally {
      setUploadingPicture(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative overflow-hidden rounded-3xl p-8 shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/90 text-lg">Manage your personal information and security settings</p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group mb-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl relative overflow-hidden"
                    style={{
                      background: profilePicture ? 'transparent' : `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                    }}
                  >
                    {profilePicture ? (
                      <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl"></div>
                        <span className="relative z-10">{user.firstName?.[0]}{user.lastName?.[0]}</span>
                      </>
                    )}
                  </motion.div>
                  
                  {/* Upload Button Overlay */}
                  <label 
                    htmlFor="profile-picture-upload"
                    className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {uploadingPicture ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-white mx-auto mb-1" />
                        <span className="text-xs text-white font-medium">Change</span>
                      </div>
                    )}
                  </label>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePictureUpload}
                    disabled={uploadingPicture}
                    className="hidden"
                  />
                </div>
                
                {/* Upload Options */}
                <button
                  onClick={() => setShowImageUrlDialog(true)}
                  className="mb-3 px-4 py-2 rounded-lg text-sm font-semibold border-2 hover:scale-105 transition-all flex items-center gap-2"
                  style={{
                    borderColor: branding.colors.primary,
                    color: branding.colors.primary
                  }}
                >
                  <LinkIcon className="w-4 h-4" />
                  Upload from URL
                </button>
                
                <h3 className="text-2xl font-bold bg-clip-text text-transparent" style={{
                  backgroundImage: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                }}>
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>

                <div className="w-full space-y-3 mt-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 rounded-xl shadow-md border-l-4"
                    style={{ 
                      background: `${branding.colors.primary}08`,
                      borderColor: branding.colors.primary
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${branding.colors.primary}20` }}>
                        <Shield className="h-5 w-5" style={{ color: branding.colors.primary }} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Account Status</span>
                    </div>
                    <span className="text-sm font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                      {user.accountStatus}
                    </span>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 rounded-xl shadow-md border-l-4"
                    style={{ 
                      background: `${branding.colors.secondary}08`,
                      borderColor: branding.colors.secondary
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${branding.colors.secondary}20` }}>
                        <CheckCircle className="h-5 w-5" style={{ color: branding.colors.secondary }} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 block">Email Verified</span>
                        {!user.isEmailVerified && (
                          <button
                            onClick={handleSendVerificationCode}
                            disabled={sendingCode}
                            className="text-xs font-semibold hover:underline mt-1 transition-colors disabled:opacity-50"
                            style={{ color: branding.colors.secondary }}
                          >
                            {sendingCode ? 'Sending...' : 'Verify email now'}
                          </button>
                        )}
                      </div>
                    </div>
                    <span className="text-xl">
                      {user.isEmailVerified ? '✅' : '❌'}
                    </span>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 rounded-xl shadow-md border-l-4"
                    style={{ 
                      background: `${branding.colors.primary}08`,
                      borderColor: branding.colors.primary
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${branding.colors.primary}20` }}>
                        <User className="h-5 w-5" style={{ color: branding.colors.primary }} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">User Role</span>
                    </div>
                    <span className="text-sm font-bold capitalize px-3 py-1 rounded-full" style={{
                      background: `${branding.colors.primary}20`,
                      color: branding.colors.primary
                    }}>
                      {user.role}
                    </span>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                }}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Personal Information</CardTitle>
              </div>
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                  }}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                      style={{
                        background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex-1 border-2 font-semibold hover:scale-[1.02] transition-all"
                      style={{
                        borderColor: branding.colors.primary,
                        color: branding.colors.primary
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="mt-6 border-0 shadow-xl">
            <CardHeader className="border-b pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                }}>
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Security Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-5 rounded-xl shadow-md border-l-4"
                style={{ 
                  background: `${branding.colors.primary}05`,
                  borderColor: branding.colors.primary
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${branding.colors.primary}20` }}>
                    <Key className="w-6 h-6" style={{ color: branding.colors.primary }} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Password</p>
                    <p className="text-sm text-gray-600">
                      Last changed 30 days ago
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordDialog(true)}
                  className="border-2 font-semibold hover:scale-105 transition-all"
                  style={{
                    borderColor: branding.colors.primary,
                    color: branding.colors.primary
                  }}
                >
                  Change Password
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-5 rounded-xl shadow-md border-l-4"
                style={{ 
                  background: `${branding.colors.secondary}05`,
                  borderColor: branding.colors.secondary
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${branding.colors.secondary}20` }}>
                    <Shield className="w-6 h-6" style={{ color: branding.colors.secondary }} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShow2FADialog(true)}
                  className="border-2 font-semibold hover:scale-105 transition-all"
                  style={{
                    borderColor: branding.colors.secondary,
                    color: branding.colors.secondary
                  }}
                >
                  Enable 2FA
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-5 rounded-xl shadow-md border-l-4"
                style={{ 
                  background: `${branding.colors.primary}05`,
                  borderColor: branding.colors.primary
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${branding.colors.primary}20` }}>
                    <Activity className="w-6 h-6" style={{ color: branding.colors.primary }} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Login Activity</p>
                    <p className="text-sm text-gray-600">
                      View recent login history
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowActivityDialog(true)}
                  className="border-2 font-semibold hover:scale-105 transition-all"
                  style={{
                    borderColor: branding.colors.primary,
                    color: branding.colors.primary
                  }}
                >
                  View Activity
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to keep your account secure
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  disabled={changingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  disabled={changingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  disabled={changingPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={changingPassword} className="flex-1">
                {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)} disabled={changingPassword} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2FA Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Add an extra layer of security to your account
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">2FA Coming Soon</p>
            <p className="text-sm text-gray-600 mb-4">
              Two-factor authentication will be available in a future update to provide enhanced security for your account.
            </p>
            <Button onClick={() => setShow2FADialog(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Activity</DialogTitle>
            <DialogDescription>
              Recent login history and active sessions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-gray-600">
                  {user?.email} • Active now
                </p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Active
              </span>
            </div>
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">No other sessions found</p>
              <p className="text-xs mt-1">Your account is secure</p>
            </div>
            <Button onClick={() => setShowActivityDialog(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" style={{ color: branding.colors.primary }} />
              Verify Your Email
            </DialogTitle>
            <DialogDescription>
              We've sent a 6-digit verification code to your email address
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerifyEmail} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="verificationCode" className="text-center block">Enter Verification Code</Label>
              <Input
                id="verificationCode"
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-bold"
                style={{
                  borderColor: `${branding.colors.primary}30`,
                }}
                required
                disabled={verifying}
              />
              <p className="text-xs text-gray-500 text-center">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={sendingCode}
                  className="font-semibold hover:underline disabled:opacity-50"
                  style={{ color: branding.colors.primary }}
                >
                  Resend
                </button>
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="submit" 
                disabled={verifying || verificationCode.length !== 6}
                className="flex-1 text-white shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                }}
              >
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify Email
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowVerificationDialog(false);
                  setVerificationCode('');
                }}
                disabled={verifying}
                className="flex-1 border-2"
                style={{
                  borderColor: branding.colors.primary,
                  color: branding.colors.primary
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image URL Dialog */}
      <Dialog open={showImageUrlDialog} onOpenChange={setShowImageUrlDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" style={{ color: branding.colors.primary }} />
              Upload Profile Picture from URL
            </DialogTitle>
            <DialogDescription>
              Enter the URL of your profile picture image
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleImageUrlSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="border-2"
                style={{
                  borderColor: `${branding.colors.primary}30`,
                }}
                required
                disabled={uploadingPicture}
              />
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF, WebP
              </p>
            </div>
            
            {/* Preview */}
            {imageUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg border-2" style={{ borderColor: `${branding.colors.primary}20` }}>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4" style={{ borderColor: branding.colors.primary }}>
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '';
                        e.currentTarget.alt = 'Invalid image';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                disabled={uploadingPicture || !imageUrl}
                className="flex-1 text-white shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                }}
              >
                {uploadingPicture ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowImageUrlDialog(false);
                  setImageUrl('');
                }}
                disabled={uploadingPicture}
                className="flex-1 border-2"
                style={{
                  borderColor: branding.colors.primary,
                  color: branding.colors.primary
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


