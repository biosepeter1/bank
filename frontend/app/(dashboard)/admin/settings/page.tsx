'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Settings, Globe, DollarSign, Shield, Bell, Mail, Image as ImageIcon,
  Save, RefreshCw, Sparkles, Lock, Key, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { adminApi } from '@/lib/api/admin';
import { useSettings } from '@/contexts/SettingsContext';
import { BANK_BRANDING } from '@/lib/data/bank-branding';

type SiteSettings = {
  general: {
    siteName: string;
    siteDescription: string;
    logo: string;
    favicon: string;
    supportEmail: string;
    supportPhone: string;
    bankName?: string;
    bankCode?: string;
  };
  payment: {
    usdtWalletAddress: string;
    btcWalletAddress: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  security: {
    enableTransferCodes: boolean;
    enableTwoFactor: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    requireKycForTransactions: boolean;
    requireKycForCards: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    transactionAlerts: boolean;
    securityAlerts: boolean;
  };
  limits: {
    minDeposit: number;
    maxDeposit: number;
    minWithdrawal: number;
    maxWithdrawal: number;
    minTransfer: number;
    maxTransfer: number;
    dailyTransferLimit: number;
  };
};

export default function SiteSettingsPage() {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    general: {
      siteName: 'Banking Platform',
      siteDescription: 'Digital Banking Solution',
      logo: '/logo.png',
      favicon: '/favicon.ico',
      supportEmail: 'support@bank.com',
      supportPhone: '+234 800 000 0000',
    },
    payment: {
      usdtWalletAddress: '',
      btcWalletAddress: '',
      bankName: 'Bank',
      accountNumber: '',
      accountName: 'Banking Platform',
    },
    security: {
      enableTransferCodes: true,
      enableTwoFactor: true,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      requireKycForTransactions: true,
      requireKycForCards: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      transactionAlerts: true,
      securityAlerts: true,
    },
    limits: {
      minDeposit: 1000,
      maxDeposit: 10000000,
      minWithdrawal: 1000,
      maxWithdrawal: 5000000,
      minTransfer: 100,
      maxTransfer: 5000000,
      dailyTransferLimit: 10000000,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getSettings();
      console.log('📥 Fetched settings from API:', data);
      setSettings(data);
      // Don't show success toast on initial load, only on errors
    } catch (error: any) {
      console.error('Failed to load settings:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load settings';
      toast.error(`${errorMessage} - using defaults`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('💾 Saving settings:', settings);
      const response = await adminApi.updateSettings(settings);
      console.log('✅ Save response:', response);
      // Reload settings from server to confirm
      if (response.settings) {
        console.log('📥 Updated settings from response:', response.settings);
        setSettings(response.settings);
      } else {
        console.log('🔄 Fetching settings after save...');
        await fetchSettings();
      }
      // Refresh global settings context to update sidebar
      await refreshSettings();
      console.log('🔄 Global settings refreshed');
      
      toast.success('Settings saved! Refreshing page...');
      
      // Force page reload to ensure all components get updated settings
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('❌ Save error:', error);
      console.error('Error details:', error?.response?.data);
      
      // Handle validation errors (array of errors)
      if (Array.isArray(error?.response?.data)) {
        const validationErrors = error.response.data.map((err: any) => 
          err.message || err.msg || JSON.stringify(err)
        ).join(', ');
        toast.error(`Validation error: ${validationErrors}`);
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save settings';
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const updateGeneralSetting = (key: keyof SiteSettings['general'], value: string) => {
    setSettings(prev => ({
      ...prev,
      general: { ...prev.general, [key]: value }
    }));
  };

  const updatePaymentSetting = (key: keyof SiteSettings['payment'], value: string) => {
    setSettings(prev => ({
      ...prev,
      payment: { ...prev.payment, [key]: value }
    }));
  };

  const updateSecuritySetting = (key: keyof SiteSettings['security'], value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [key]: value }
    }));
  };

  const updateNotificationSetting = (key: keyof SiteSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const updateLimitSetting = (key: keyof SiteSettings['limits'], value: number) => {
    setSettings(prev => ({
      ...prev,
      limits: { ...prev.limits, [key]: value }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading settings...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 p-6">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl shadow-lg">
                <Settings className="h-8 w-8 text-white" />
              </div>
              Site Settings
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Configure your banking platform</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchSettings} disabled={saving}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Settings Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
          <Tabs defaultValue="general" className="w-full">
            <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-amber-50">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="general">
                  <Globe className="mr-2 h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Payment
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="limits">
                  <Zap className="mr-2 h-4 w-4" />
                  Limits
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* General Settings */}
            <TabsContent value="general" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-orange-600" />
                    General Information
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="siteName">Site Name *</Label>
                      <Input
                        id="siteName"
                        value={settings.general.siteName}
                        onChange={(e) => updateGeneralSetting('siteName', e.target.value)}
                        placeholder="Your Bank Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Textarea
                        id="siteDescription"
                        value={settings.general.siteDescription}
                        onChange={(e) => updateGeneralSetting('siteDescription', e.target.value)}
                        placeholder="Brief description of your platform"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="logo">Logo URL</Label>
                        <Input
                          id="logo"
                          value={settings.general.logo}
                          onChange={(e) => updateGeneralSetting('logo', e.target.value)}
                          placeholder="/logo.png or https://..."
                        />
                        {settings.general.logo && settings.general.logo !== '/logo.png' && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                            <p className="text-xs text-gray-600 mb-2">Logo Preview:</p>
                            <img 
                              src={settings.general.logo} 
                              alt="Logo Preview" 
                              className="h-12 w-12 object-contain bg-white rounded border"
                              onError={(e) => {
                                e.currentTarget.src = '';
                                e.currentTarget.alt = '❌ Failed to load';
                                e.currentTarget.className = 'h-12 w-12 flex items-center justify-center bg-red-50 text-red-500 rounded border border-red-200 text-xs';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="favicon">Favicon URL</Label>
                        <Input
                          id="favicon"
                          value={settings.general.favicon}
                          onChange={(e) => updateGeneralSetting('favicon', e.target.value)}
                          placeholder="/favicon.ico or https://..."
                        />
                        {settings.general.favicon && settings.general.favicon !== '/favicon.ico' && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                            <p className="text-xs text-gray-600 mb-2">Favicon Preview:</p>
                            <img 
                              src={settings.general.favicon} 
                              alt="Favicon Preview" 
                              className="h-8 w-8 object-contain bg-white rounded border"
                              onError={(e) => {
                                e.currentTarget.src = '';
                                e.currentTarget.alt = '❌ Failed to load';
                                e.currentTarget.className = 'h-8 w-8 flex items-center justify-center bg-red-50 text-red-500 rounded border border-red-200 text-xs';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="supportEmail">Support Email *</Label>
                        <Input
                          id="supportEmail"
                          type="email"
                          value={settings.general.supportEmail}
                          onChange={(e) => updateGeneralSetting('supportEmail', e.target.value)}
                          placeholder="support@yourbank.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="supportPhone">Support Phone</Label>
                        <Input
                          id="supportPhone"
                          value={settings.general.supportPhone}
                          onChange={(e) => updateGeneralSetting('supportPhone', e.target.value)}
                          placeholder="+234 800 000 0000"
                        />
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-orange-600" />
                        Bank Branding (For Transaction Receipts & Exports)
                      </h4>
                      <div>
                        <Label htmlFor="bankSelect">Select Bank *</Label>
                        <Select 
                          value={settings.general.bankCode || '011'} 
                          onValueChange={(value) => {
                            const selectedBank = BANK_BRANDING[value];
                            if (selectedBank) {
                              updateGeneralSetting('bankCode', value as any);
                              updateGeneralSetting('bankName', selectedBank.name as any);
                              console.log('🏛️ Bank selected:', selectedBank.name, 'Code:', value);
                              toast.success(`Bank set to ${selectedBank.name}`);
                            }
                          }}
                        >
                          <SelectTrigger id="bankSelect">
                            <SelectValue placeholder="Select a bank" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(BANK_BRANDING).map((bank) => (
                              <SelectItem key={bank.code} value={bank.code}>
                                {bank.name} ({bank.shortName})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                          This bank's branding (logo, colors, address) will appear on transaction receipts and PDF/image exports.
                        </p>
                        {settings.general.bankCode && BANK_BRANDING[settings.general.bankCode] && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Selected Bank Preview:</p>
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                                style={{ backgroundColor: BANK_BRANDING[settings.general.bankCode].colors.primary }}
                              >
                                {BANK_BRANDING[settings.general.bankCode].shortName}
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{BANK_BRANDING[settings.general.bankCode].name}</p>
                                <p className="text-xs text-gray-500">{BANK_BRANDING[settings.general.bankCode].tagline}</p>
                                <p className="text-xs text-gray-400 mt-1">Color: {BANK_BRANDING[settings.general.bankCode].colors.primary}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Payment Settings */}
            <TabsContent value="payment" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                    Payment Gateway Configuration
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="usdtWallet">USDT Wallet Address</Label>
                      <Input
                        id="usdtWallet"
                        value={settings.payment.usdtWalletAddress}
                        onChange={(e) => updatePaymentSetting('usdtWalletAddress', e.target.value)}
                        placeholder="Your USDT wallet address"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">For cryptocurrency deposits</p>
                    </div>
                    <div>
                      <Label htmlFor="btcWallet">Bitcoin Wallet Address</Label>
                      <Input
                        id="btcWallet"
                        value={settings.payment.btcWalletAddress}
                        onChange={(e) => updatePaymentSetting('btcWalletAddress', e.target.value)}
                        placeholder="Your Bitcoin wallet address"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">For Bitcoin deposits</p>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-3">Bank Account Details</h4>
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="bankName">Bank Name *</Label>
                          <Input
                            id="bankName"
                            value={settings.payment.bankName}
                            onChange={(e) => updatePaymentSetting('bankName', e.target.value)}
                            placeholder="Your Bank Name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="accountNumber">Account Number *</Label>
                            <Input
                              id="accountNumber"
                              value={settings.payment.accountNumber}
                              onChange={(e) => updatePaymentSetting('accountNumber', e.target.value)}
                              placeholder="0000000000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="accountName">Account Name *</Label>
                            <Input
                              id="accountName"
                              value={settings.payment.accountName}
                              onChange={(e) => updatePaymentSetting('accountName', e.target.value)}
                              placeholder="Account holder name"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    Security Configuration
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Enable Transfer Codes (COT/IMF/TAX)</Label>
                        <p className="text-sm text-gray-500">Require verification codes for international transfers</p>
                      </div>
                      <Switch
                        checked={settings.security.enableTransferCodes}
                        onCheckedChange={(checked) => updateSecuritySetting('enableTransferCodes', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Enable Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Require 2FA for all users</p>
                      </div>
                      <Switch
                        checked={settings.security.enableTwoFactor}
                        onCheckedChange={(checked) => updateSecuritySetting('enableTwoFactor', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Require KYC for Transactions</Label>
                        <p className="text-sm text-gray-500">Users must complete KYC before making transactions</p>
                      </div>
                      <Switch
                        checked={settings.security.requireKycForTransactions}
                        onCheckedChange={(checked) => updateSecuritySetting('requireKycForTransactions', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Require KYC for Card Requests</Label>
                        <p className="text-sm text-gray-500">Users must complete KYC before requesting cards</p>
                      </div>
                      <Switch
                        checked={settings.security.requireKycForCards}
                        onCheckedChange={(checked) => updateSecuritySetting('requireKycForCards', checked)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                        <Input
                          id="maxLoginAttempts"
                          type="number"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => updateSecuritySetting('maxLoginAttempts', parseInt(e.target.value))}
                          min="3"
                          max="10"
                        />
                        <p className="text-xs text-gray-500 mt-1">Before account lockout</p>
                      </div>
                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                          min="15"
                          max="120"
                        />
                        <p className="text-xs text-gray-500 mt-1">Auto logout after inactivity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Send notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) => updateNotificationSetting('emailNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Send notifications via SMS</p>
                      </div>
                      <Switch
                        checked={settings.notifications.smsNotifications}
                        onCheckedChange={(checked) => updateNotificationSetting('smsNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Send browser push notifications</p>
                      </div>
                      <Switch
                        checked={settings.notifications.pushNotifications}
                        onCheckedChange={(checked) => updateNotificationSetting('pushNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Transaction Alerts</Label>
                        <p className="text-sm text-gray-500">Notify users of all transactions</p>
                      </div>
                      <Switch
                        checked={settings.notifications.transactionAlerts}
                        onCheckedChange={(checked) => updateNotificationSetting('transactionAlerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Security Alerts</Label>
                        <p className="text-sm text-gray-500">Notify users of security events</p>
                      </div>
                      <Switch
                        checked={settings.notifications.securityAlerts}
                        onCheckedChange={(checked) => updateNotificationSetting('securityAlerts', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Transaction Limits */}
            <TabsContent value="limits" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Transaction Limits
                  </h3>
                  <div className="grid gap-6">
                    <div className="border-b pb-4">
                      <h4 className="font-semibold mb-3">Deposit Limits</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minDeposit">Minimum Deposit (₦)</Label>
                          <Input
                            id="minDeposit"
                            type="number"
                            value={settings.limits.minDeposit}
                            onChange={(e) => updateLimitSetting('minDeposit', parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxDeposit">Maximum Deposit (₦)</Label>
                          <Input
                            id="maxDeposit"
                            type="number"
                            value={settings.limits.maxDeposit}
                            onChange={(e) => updateLimitSetting('maxDeposit', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-b pb-4">
                      <h4 className="font-semibold mb-3">Withdrawal Limits</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minWithdrawal">Minimum Withdrawal (₦)</Label>
                          <Input
                            id="minWithdrawal"
                            type="number"
                            value={settings.limits.minWithdrawal}
                            onChange={(e) => updateLimitSetting('minWithdrawal', parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxWithdrawal">Maximum Withdrawal (₦)</Label>
                          <Input
                            id="maxWithdrawal"
                            type="number"
                            value={settings.limits.maxWithdrawal}
                            onChange={(e) => updateLimitSetting('maxWithdrawal', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-b pb-4">
                      <h4 className="font-semibold mb-3">Transfer Limits</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minTransfer">Minimum Transfer (₦)</Label>
                          <Input
                            id="minTransfer"
                            type="number"
                            value={settings.limits.minTransfer}
                            onChange={(e) => updateLimitSetting('minTransfer', parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxTransfer">Maximum Transfer (₦)</Label>
                          <Input
                            id="maxTransfer"
                            type="number"
                            value={settings.limits.maxTransfer}
                            onChange={(e) => updateLimitSetting('maxTransfer', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Daily Limits</h4>
                      <div>
                        <Label htmlFor="dailyTransferLimit">Daily Transfer Limit (₦)</Label>
                        <Input
                          id="dailyTransferLimit"
                          type="number"
                          value={settings.limits.dailyTransferLimit}
                          onChange={(e) => updateLimitSetting('dailyTransferLimit', parseFloat(e.target.value))}
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum total transfers per day per user</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}

