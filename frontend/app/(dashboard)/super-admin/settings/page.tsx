'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Shield, 
  DollarSign, 
  Mail, 
  Bell, 
  Database,
  Server,
  Key,
  AlertTriangle,
  Save,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminApi } from '@/lib/api/admin';

interface SystemSettings {
  // Transaction Settings
  dailyTransactionLimit: number;
  monthlyTransactionLimit: number;
  minimumTransferAmount: number;
  maximumTransferAmount: number;
  withdrawalFeeRate: number;
  depositFeeRate: number;
  
  // Security Settings
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  twoFactorRequired: boolean;
  
  // Email Settings
  emailService: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  emailFromAddress: string;
  emailFromName: string;
  
  // Notification Settings
  notifyOnLargeTransactions: boolean;
  notifyOnFailedLogins: boolean;
  notifyOnAccountCreation: boolean;
  notifyOnKYCSubmissions: boolean;
  largeTransactionThreshold: number;
  
  // System Settings
  maintenanceMode: boolean;
  maintenanceMessage: string;
  systemName: string;
  systemVersion: string;
  supportEmail: string;
  supportPhone: string;
}

export default function SystemSettingsPage() {
  const [initialLoad, setInitialLoad] = useState(true);
  const [settings, setSettings] = useState<SystemSettings>({
    // Transaction Settings
    dailyTransactionLimit: 500000,
    monthlyTransactionLimit: 2000000,
    minimumTransferAmount: 100,
    maximumTransferAmount: 1000000,
    withdrawalFeeRate: 1.0,
    depositFeeRate: 0,
    
    // Security Settings
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 30,
    twoFactorRequired: false,
    
    // Email Settings
    emailService: 'SMTP',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    emailFromAddress: 'noreply@rdn.bank',
    emailFromName: 'RDN Banking',
    
    // Notification Settings
    notifyOnLargeTransactions: true,
    notifyOnFailedLogins: true,
    notifyOnAccountCreation: true,
    notifyOnKYCSubmissions: true,
    largeTransactionThreshold: 100000,
    
    // System Settings
    maintenanceMode: false,
    maintenanceMessage: 'System is currently under maintenance. Please try again later.',
    systemName: 'RDN Banking Platform',
    systemVersion: '1.0.0',
    supportEmail: 'support@rdn.bank',
    supportPhone: '+234-800-RDN-BANK',
  });

  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getSettings();
      if (data) {
        // Map backend settings to frontend format
        const mappedSettings: SystemSettings = {
          dailyTransactionLimit: data.limits?.dailyTransferLimit || 500000,
          monthlyTransactionLimit: data.limits?.dailyTransferLimit * 4 || 2000000,
          minimumTransferAmount: data.limits?.minTransfer || 100,
          maximumTransferAmount: data.limits?.maxTransfer || 1000000,
          withdrawalFeeRate: 1.0,
          depositFeeRate: 0,
          passwordMinLength: 8,
          passwordRequireSpecialChars: true,
          sessionTimeoutMinutes: data.security?.sessionTimeout || 60,
          maxLoginAttempts: data.security?.maxLoginAttempts || 5,
          lockoutDurationMinutes: 30,
          twoFactorRequired: data.security?.enableTwoFactor || false,
          emailService: data.email?.provider || 'SMTP',
          smtpHost: data.email?.smtpHost || '',
          smtpPort: data.email?.smtpPort || 587,
          smtpUsername: data.email?.smtpUser || '',
          smtpPassword: '',
          emailFromAddress: data.email?.fromAddress || data.general?.supportEmail || 'noreply@rdn.bank',
          emailFromName: data.email?.fromName || data.general?.siteName || 'RDN Banking',
          notifyOnLargeTransactions: data.notifications?.transactionAlerts || true,
          notifyOnFailedLogins: data.notifications?.securityAlerts || true,
          notifyOnAccountCreation: true,
          notifyOnKYCSubmissions: true,
          largeTransactionThreshold: 100000,
          maintenanceMode: false,
          maintenanceMessage: 'System is currently under maintenance. Please try again later.',
          systemName: data.general?.siteName || 'RDN Banking Platform',
          systemVersion: '1.0.0',
          supportEmail: data.general?.supportEmail || 'support@rdn.bank',
          supportPhone: data.general?.supportPhone || '+234-800-RDN-BANK',
        };
        setSettings(mappedSettings);
        setOriginalSettings(mappedSettings);
        if (initialLoad) {
          setInitialLoad(false);
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      if (!initialLoad) {
        toast.error('Failed to load settings');
      }
      setInitialLoad(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Map frontend settings to backend format
      const backendSettings = {
        general: {
          siteName: settings.systemName,
          supportEmail: settings.supportEmail,
          supportPhone: settings.supportPhone,
        },
        security: {
          enableTwoFactor: settings.twoFactorRequired,
          maxLoginAttempts: settings.maxLoginAttempts,
          sessionTimeout: settings.sessionTimeoutMinutes,
        },
        notifications: {
          emailNotifications: true,
          transactionAlerts: settings.notifyOnLargeTransactions,
          securityAlerts: settings.notifyOnFailedLogins,
        },
        limits: {
          minTransfer: settings.minimumTransferAmount,
          maxTransfer: settings.maximumTransferAmount,
          dailyTransferLimit: settings.dailyTransactionLimit,
        },
        email: {
          provider: settings.emailService,
          smtpHost: settings.smtpHost,
          smtpPort: settings.smtpPort,
          smtpUser: settings.smtpUsername,
          smtpPass: settings.smtpPassword || undefined,
          fromAddress: settings.emailFromAddress,
          fromName: settings.emailFromName,
        },
      };
      
      const response = await adminApi.updateSettings(backendSettings);
      setOriginalSettings({ ...settings });
      toast.success('System settings saved successfully!');
      await fetchSettings(); // Refresh settings from server
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings({ ...originalSettings });
      toast.info('Settings reset to last saved state');
    }
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (initialLoad && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500 mt-1">Configure platform-wide settings and policies</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const to = window.prompt('Enter test recipient email (leave empty to use Support Email):') || undefined;
                await adminApi.testEmail(to);
                toast.success('Test email requested. Check the inbox/spam.');
              } catch (err: any) {
                toast.error(err?.response?.data?.message || 'Failed to send test email');
              }
            }}
            className="flex items-center gap-2"
          >
            Send Test Email
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Transaction Settings */}
        <TabsContent value="transactions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Limits</CardTitle>
                <CardDescription>Set daily and monthly transaction limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dailyLimit">Daily Transaction Limit (₦)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={settings.dailyTransactionLimit}
                    onChange={(e) => updateSetting('dailyTransactionLimit', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyLimit">Monthly Transaction Limit (₦)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    value={settings.monthlyTransactionLimit}
                    onChange={(e) => updateSetting('monthlyTransactionLimit', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="minTransfer">Minimum Transfer Amount (₦)</Label>
                  <Input
                    id="minTransfer"
                    type="number"
                    value={settings.minimumTransferAmount}
                    onChange={(e) => updateSetting('minimumTransferAmount', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxTransfer">Maximum Transfer Amount (₦)</Label>
                  <Input
                    id="maxTransfer"
                    type="number"
                    value={settings.maximumTransferAmount}
                    onChange={(e) => updateSetting('maximumTransferAmount', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Fees</CardTitle>
                <CardDescription>Configure fee rates for different transaction types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="withdrawalFee">Withdrawal Fee Rate (%)</Label>
                  <Input
                    id="withdrawalFee"
                    type="number"
                    step="0.1"
                    value={settings.withdrawalFeeRate}
                    onChange={(e) => updateSetting('withdrawalFeeRate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="depositFee">Deposit Fee Rate (%)</Label>
                  <Input
                    id="depositFee"
                    type="number"
                    step="0.1"
                    value={settings.depositFeeRate}
                    onChange={(e) => updateSetting('depositFeeRate', parseFloat(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>Configure password requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="passwordLength">Minimum Password Length</Label>
                  <Input
                    id="passwordLength"
                    type="number"
                    min="6"
                    max="32"
                    value={settings.passwordMinLength}
                    onChange={(e) => updateSetting('passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.passwordRequireSpecialChars}
                    onCheckedChange={(checked) => updateSetting('passwordRequireSpecialChars', checked)}
                  />
                  <Label>Require Special Characters</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.twoFactorRequired}
                    onCheckedChange={(checked) => updateSetting('twoFactorRequired', checked)}
                  />
                  <Label>Require Two-Factor Authentication</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session & Security</CardTitle>
                <CardDescription>Configure session timeouts and login security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeoutMinutes}
                    onChange={(e) => updateSetting('sessionTimeoutMinutes', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="lockoutDuration">Account Lockout Duration (minutes)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={settings.lockoutDurationMinutes}
                    onChange={(e) => updateSetting('lockoutDurationMinutes', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>Configure email server settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => updateSetting('smtpHost', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => updateSetting('smtpPort', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={(e) => updateSetting('smtpUsername', e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <div className="relative">
                    <Input
                      id="smtpPassword"
                      type={showPasswords ? "text" : "password"}
                      value={settings.smtpPassword}
                      onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Identity</CardTitle>
                <CardDescription>Configure sender information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fromEmail">From Email Address</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.emailFromAddress}
                    onChange={(e) => updateSetting('emailFromAddress', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.emailFromName}
                    onChange={(e) => updateSetting('emailFromName', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure automatic notifications for various events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifyOnLargeTransactions}
                      onCheckedChange={(checked) => updateSetting('notifyOnLargeTransactions', checked)}
                    />
                    <Label>Notify on Large Transactions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifyOnFailedLogins}
                      onCheckedChange={(checked) => updateSetting('notifyOnFailedLogins', checked)}
                    />
                    <Label>Notify on Failed Login Attempts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifyOnAccountCreation}
                      onCheckedChange={(checked) => updateSetting('notifyOnAccountCreation', checked)}
                    />
                    <Label>Notify on New Account Creation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.notifyOnKYCSubmissions}
                      onCheckedChange={(checked) => updateSetting('notifyOnKYCSubmissions', checked)}
                    />
                    <Label>Notify on KYC Submissions</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="largeTransactionThreshold">Large Transaction Threshold (₦)</Label>
                  <Input
                    id="largeTransactionThreshold"
                    type="number"
                    value={settings.largeTransactionThreshold}
                    onChange={(e) => updateSetting('largeTransactionThreshold', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Basic system configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => updateSetting('systemName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="systemVersion">System Version</Label>
                  <Input
                    id="systemVersion"
                    value={settings.systemVersion}
                    onChange={(e) => updateSetting('systemVersion', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => updateSetting('supportEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => updateSetting('supportPhone', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
                <CardDescription>Control system availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                  />
                  <Label>Enable Maintenance Mode</Label>
                </div>
                {settings.maintenanceMode && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">System in Maintenance Mode</span>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Users will be unable to access the platform while maintenance mode is enabled.
                    </p>
                  </div>
                )}
                <div>
                  <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={settings.maintenanceMessage}
                    onChange={(e) => updateSetting('maintenanceMessage', e.target.value)}
                    rows={4}
                    placeholder="Enter the message users will see during maintenance..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>    </div>
  );
}


