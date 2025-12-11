'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Lock, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff,
  Loader2,
  CheckCircle,
  Activity
} from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { useBranding } from '@/contexts/BrandingContext';

export default function SettingsPage() {
  
  const { branding } = useBranding();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('security');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-6">
      {/* Modern Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-1.5 h-10 rounded-full"
            style={{ background: branding.colors.primary }}
          />
          <h1 className="text-4xl font-bold" style={{ color: branding.colors.primary }}>
            Settings
          </h1>
        </div>
        <p className="text-gray-600 text-lg ml-5">Manage your account settings and preferences</p>
      </div>

      {/* Modern Tabs */}
      <div className="mb-8">
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border-2"
          style={{ borderColor: `${branding.colors.primary}10` }}
        >
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('security')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300"
              style={{
                background: activeTab === 'security' 
                  ? `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                  : 'transparent',
                color: activeTab === 'security' ? 'white' : '#6b7280',
                boxShadow: activeTab === 'security' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <Lock className="h-4 w-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300"
              style={{
                background: activeTab === 'notifications' 
                  ? `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                  : 'transparent',
                color: activeTab === 'notifications' ? 'white' : '#6b7280',
                boxShadow: activeTab === 'notifications' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300"
              style={{
                background: activeTab === 'activity' 
                  ? `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                  : 'transparent',
                color: activeTab === 'activity' ? 'white' : '#6b7280',
                boxShadow: activeTab === 'activity' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <Activity className="h-4 w-4" />
              Activity
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'security' && <SecuritySettings branding={branding} />}
        {activeTab === 'notifications' && <NotificationSettings branding={branding} />}
        {activeTab === 'activity' && <ActivitySettings user={user} branding={branding} />}
      </div>
    </div>
  );
}

function SecuritySettings({ branding }: { branding: any }) {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(
        passwords.currentPassword,
        passwords.newPassword,
        passwords.confirmPassword
      );
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error?.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-1 h-6 rounded-full"
              style={{ background: branding.colors.primary }}
            />
            <div>
              <CardTitle className="text-xl">Change Password</CardTitle>
              <CardDescription className="mt-1">
                Update your password regularly to keep your account secure
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and number/special character
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
              }}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-1 h-6 rounded-full"
              style={{ background: branding.colors.primary }}
            />
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-5 w-5" style={{ color: branding.colors.primary }} />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription className="mt-1">
                Add an extra layer of security to your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">2FA Status</p>
              <p className="text-sm text-gray-600">
                Two-factor authentication is currently disabled
              </p>
            </div>
            <Button variant="outline" disabled>
              Enable 2FA (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationSettings({ branding }: { branding: any }) {
  const [notifications, setNotifications] = useState({
    emailTransactions: true,
    emailSecurity: true,
    emailMarketing: false,
    smsTransactions: true,
    smsSecurity: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await authApi.getUserSettings();
        setNotifications(settings);
      } catch (error: any) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load notification settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authApi.updateUserSettings(notifications);
      toast.success('Notification preferences saved!');
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      toast.error(error?.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div 
            className="w-1 h-6 rounded-full"
            style={{ background: branding.colors.primary }}
          />
          <div>
            <CardTitle className="text-xl">Notification Preferences</CardTitle>
            <CardDescription className="mt-1">
              Choose how you want to be notified about account activity
            </CardDescription>
          </div>
        </div>
      </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: branding.colors.primary }} />
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Transaction Alerts</p>
                      <p className="text-sm text-gray-600">Get notified about deposits, withdrawals, and transfers</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailTransactions}
                      onChange={(e) => setNotifications({ ...notifications, emailTransactions: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security Alerts</p>
                      <p className="text-sm text-gray-600">Login attempts, password changes, and security updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailSecurity}
                      onChange={(e) => setNotifications({ ...notifications, emailSecurity: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing & Updates</p>
                      <p className="text-sm text-gray-600">News, features, and promotional content</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailMarketing}
                      onChange={(e) => setNotifications({ ...notifications, emailMarketing: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">SMS Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Transaction Alerts</p>
                      <p className="text-sm text-gray-600">High-value transactions and withdrawals</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.smsTransactions}
                      onChange={(e) => setNotifications({ ...notifications, smsTransactions: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security Alerts</p>
                      <p className="text-sm text-gray-600">Critical security notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.smsSecurity}
                      onChange={(e) => setNotifications({ ...notifications, smsSecurity: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

        <Button 
          onClick={handleSave} 
          disabled={loading || saving} 
          className="text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          style={{
            background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
          }}
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}

function ActivitySettings({ user, branding }: { user: any; branding: any }) {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-1 h-6 rounded-full"
              style={{ background: branding.colors.primary }}
            />
            <div>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <CardDescription className="mt-1">
                View your recent login activity and active sessions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-gray-600">
                  {user?.email} • Active now
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </span>
            </div>

            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No other sessions found</p>
              <p className="text-sm mt-1">Your account is secure</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-1 h-6 rounded-full"
              style={{ background: branding.colors.primary }}
            />
            <div>
              <CardTitle className="text-xl">Login History</CardTitle>
              <CardDescription className="mt-1">
                Recent login attempts and locations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div 
              className="flex items-center justify-between p-4 border-l-4 rounded-lg"
              style={{
                borderColor: branding.colors.primary,
                background: `${branding.colors.primary}10`
              }}
            >
              <div>
                <p className="font-medium">Successful Login</p>
                <p className="text-sm text-gray-600">
                  {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Recently'}
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            
            <div className="text-center py-4 text-gray-500 text-sm">
              Showing recent activity only
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


