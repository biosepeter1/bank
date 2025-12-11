'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Search,
  UserCheck,
  UserX,
  Eye,
  Mail,
  DollarSign,
  Key,
  Ban,
  CheckCircle,
  Plus,
  Minus,
  Shield,
  Users as UsersIcon,
  Sparkles,
  Zap,
  BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { adminApi } from '@/lib/api/admin';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountStatus: string;
  kycStatus: string;
  balance?: number;
  createdAt: string;
  lastLogin?: string;
};

export default function EnhancedAdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  
  // Dialog states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [creditDebitOpen, setCreditDebitOpen] = useState(false);
  const [blockUnblockOpen, setBlockUnblockOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  
  // Form states
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');
  const [transactionReason, setTransactionReason] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Create user form states
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserCountry, setNewUserCountry] = useState('NG');
  const [newUserAccountType, setNewUserAccountType] = useState('savings');
  const [newUserCurrency, setNewUserCurrency] = useState('NGN');
  const [newUserTransactionPin, setNewUserTransactionPin] = useState('');
  const [newUserInitialBalance, setNewUserInitialBalance] = useState('0');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      // Map the API response to match our User type
      const mappedUsers = data.map((user: any) => ({
        ...user,
        balance: user.wallet?.balance || 0,
        kycStatus: user.kyc?.status || null,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreditDebit = async () => {
    if (!selectedUser || !transactionAmount || parseFloat(transactionAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setProcessing(true);
      // API call to credit/debit user account
      await adminApi.adjustUserBalance(selectedUser.id, {
        type: transactionType,
        amount: parseFloat(transactionAmount),
        reason: transactionReason,
      });
      
      toast.success(`Successfully ${transactionType}ed ${transactionAmount} to ${selectedUser.firstName}'s account`);
      setCreditDebitOpen(false);
      setTransactionAmount('');
      setTransactionReason('');
      fetchUsers();
    } catch (error) {
      toast.error(`Failed to ${transactionType} account`);
    } finally {
      setProcessing(false);
    }
  };

  const handleBlockUnblock = async () => {
    if (!selectedUser) return;

    const isBlocking = selectedUser.accountStatus === 'ACTIVE';
    
    try {
      setProcessing(true);
      await adminApi.updateUserStatus(selectedUser.id, {
        status: isBlocking ? 'SUSPENDED' : 'ACTIVE',
        reason: blockReason,
      });
      
      toast.success(`User ${isBlocking ? 'blocked' : 'unblocked'} successfully`);
      setBlockUnblockOpen(false);
      setBlockReason('');
      fetchUsers();
    } catch (error) {
      toast.error(`Failed to ${isBlocking ? 'block' : 'unblock'} user`);
    } finally {
      setProcessing(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    try {
      setProcessing(true);
      await adminApi.resetUserPassword(selectedUser.id);
      toast.success('Password reset email sent successfully');
      setResetPasswordOpen(false);
    } catch (error) {
      toast.error('Failed to reset password');
    } finally {
      setProcessing(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedUser || !emailSubject || !emailMessage) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setProcessing(false);
      await adminApi.sendUserEmail(selectedUser.id, {
        subject: emailSubject,
        message: emailMessage,
      });
      
      toast.success('Email sent successfully');
      setSendEmailOpen(false);
      setEmailSubject('');
      setEmailMessage('');
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserFirstName || !newUserLastName || !newUserEmail || !newUserPhone || !newUserPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (newUserPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setProcessing(true);
      await adminApi.createUser({
        firstName: newUserFirstName,
        lastName: newUserLastName,
        username: newUserUsername || undefined,
        email: newUserEmail,
        phone: newUserPhone,
        password: newUserPassword,
        country: newUserCountry,
        accountType: newUserAccountType,
        currency: newUserCurrency,
        transactionPin: newUserTransactionPin || undefined,
        initialBalance: parseFloat(newUserInitialBalance) || 0,
      });
      
      toast.success('User created successfully!');
      setCreateUserOpen(false);
      setNewUserFirstName('');
      setNewUserLastName('');
      setNewUserUsername('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserPassword('');
      setNewUserCountry('NG');
      setNewUserAccountType('savings');
      setNewUserCurrency('NGN');
      setNewUserTransactionPin('');
      setNewUserInitialBalance('0');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setProcessing(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === '' ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.accountStatus === statusFilter;
    const matchesKYC = kycFilter === 'all' || user.kycStatus === kycFilter;

    return matchesSearch && matchesStatus && matchesKYC;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      SUSPENDED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  const getKYCBadge = (status: string) => {
    const styles = {
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800',
      NOT_SUBMITTED: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || styles.NOT_SUBMITTED;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading users...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">      
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
              User Management
            </h1>
            <p className="text-gray-600 mt-3 text-lg">View and manage all user accounts</p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <Sparkles className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Control</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <Shield className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Secure</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mb-6 border-none shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px] h-12">
                  <SelectValue placeholder="Account Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={kycFilter} onValueChange={setKycFilter}>
                <SelectTrigger className="w-full md:w-[200px] h-12">
                  <SelectValue placeholder="KYC Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All KYC</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-12" onClick={() => setCreateUserOpen(true)}><Plus className="h-4 w-4 mr-2" />Create User</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <UsersIcon className="h-6 w-6 text-blue-600" />
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">User</TableHead>
                    <TableHead className="font-bold">Email</TableHead>
                    <TableHead className="font-bold">Phone</TableHead>
                    <TableHead className="font-bold">Balance</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">KYC</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-blue-50/50 transition-colors">
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell className="font-bold text-blue-600">
                        ₦{user.balance?.toLocaleString() || '0.00'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.accountStatus)}`}>
                          {user.accountStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getKYCBadge(user.kycStatus || 'NOT_SUBMITTED')}`}>
                          {user.kycStatus || 'NOT_SUBMITTED'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setUserDetailsOpen(true);
                            }}
                            className="hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setCreditDebitOpen(true);
                            }}
                            className="hover:bg-green-50"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setBlockUnblockOpen(true);
                            }}
                            className={user.accountStatus === 'ACTIVE' ? 'hover:bg-red-50' : 'hover:bg-green-50'}
                          >
                            {user.accountStatus === 'ACTIVE' ? (
                              <Ban className="h-4 w-4 text-red-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setSendEmailOpen(true);
                            }}
                            className="hover:bg-purple-50"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Credit/Debit Dialog */}
      <Dialog open={creditDebitOpen} onOpenChange={setCreditDebitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Credit/Debit User Account
            </DialogTitle>
            <DialogDescription>
              Adjust {selectedUser?.firstName}'s account balance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Transaction Type</Label>
              <Select value={transactionType} onValueChange={(value: 'credit' | 'debit') => setTransactionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-600" />
                      Credit (Add Funds)
                    </div>
                  </SelectItem>
                  <SelectItem value="debit">
                    <div className="flex items-center gap-2">
                      <Minus className="h-4 w-4 text-red-600" />
                      Debit (Remove Funds)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount (₦)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
              />
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea
                placeholder="Enter reason for this transaction..."
                value={transactionReason}
                onChange={(e) => setTransactionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreditDebitOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreditDebit}
              disabled={processing}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {processing ? 'Processing...' : `${transactionType === 'credit' ? 'Credit' : 'Debit'} Account`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block/Unblock Dialog */}
      <Dialog open={blockUnblockOpen} onOpenChange={setBlockUnblockOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedUser?.accountStatus === 'ACTIVE' ? (
                <>
                  <Ban className="h-5 w-5 text-red-600" />
                  Block User Account
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Unblock User Account
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.accountStatus === 'ACTIVE'
                ? `Block ${selectedUser?.firstName}'s account and prevent access`
                : `Restore ${selectedUser?.firstName}'s account access`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason</Label>
              <Textarea
                placeholder="Enter reason for this action..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockUnblockOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBlockUnblock}
              disabled={processing}
              className={selectedUser?.accountStatus === 'ACTIVE'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'}
            >
              {processing ? 'Processing...' : selectedUser?.accountStatus === 'ACTIVE' ? 'Block User' : 'Unblock User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={sendEmailOpen} onOpenChange={setSendEmailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-600" />
              Send Email to User
            </DialogTitle>
            <DialogDescription>
              Send a direct email to {selectedUser?.firstName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Input
                placeholder="Email subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                placeholder="Email message..."
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendEmailOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={processing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {processing ? 'Sending...' : 'Send Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Create New User
            </DialogTitle>
            <DialogDescription>
              Fill in the details to create a new user account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={newUserFirstName}
                  onChange={(e) => setNewUserFirstName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={newUserLastName}
                  onChange={(e) => setNewUserLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="username">Username (Optional)</Label>
              <Input
                id="username"
                placeholder="johndoe"
                value={newUserUsername}
                onChange={(e) => setNewUserUsername(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+2341234567890"
                value={newUserPhone}
                onChange={(e) => setNewUserPhone(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 8 characters"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={newUserCountry} onValueChange={setNewUserCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NG">Nigeria (NG)</SelectItem>
                    <SelectItem value="US">United States (US)</SelectItem>
                    <SelectItem value="GB">United Kingdom (GB)</SelectItem>
                    <SelectItem value="GH">Ghana (GH)</SelectItem>
                    <SelectItem value="KE">Kenya (KE)</SelectItem>
                    <SelectItem value="ZA">South Africa (ZA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Select value={newUserAccountType} onValueChange={setNewUserAccountType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="checking">Checking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={newUserCurrency} onValueChange={setNewUserCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN (₦)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GHS">GHS (₵)</SelectItem>
                  <SelectItem value="KES">KES (KSh)</SelectItem>
                  <SelectItem value="ZAR">ZAR (R)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transactionPin">Transaction PIN (4 digits, Optional)</Label>
              <Input
                id="transactionPin"
                type="text"
                placeholder="0000"
                value={newUserTransactionPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setNewUserTransactionPin(value);
                }}
                maxLength={4}
                className="text-center text-lg tracking-widest font-mono"
              />
            </div>

            <div>
              <Label htmlFor="initialBalance">Initial Balance (Optional)</Label>
              <Input
                id="initialBalance"
                type="number"
                placeholder="0.00"
                value={newUserInitialBalance}
                onChange={(e) => setNewUserInitialBalance(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={processing} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              {processing ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              User Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Name</Label>
                  <p className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-semibold">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Phone</Label>
                  <p className="font-semibold">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Balance</Label>
                  <p className="font-semibold text-blue-600">₦{selectedUser.balance?.toLocaleString() || '0.00'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Account Status</Label>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedUser.accountStatus)}`}>
                    {selectedUser.accountStatus}
                  </span>
                </div>
                <div>
                  <Label className="text-gray-500">KYC Status</Label>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getKYCBadge(selectedUser.kycStatus)}`}>
                    {selectedUser.kycStatus}
                  </span>
                </div>
                <div>
                  <Label className="text-gray-500">Created At</Label>
                  <p className="font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Last Login</Label>
                  <p className="font-semibold">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    setUserDetailsOpen(false);
                    setResetPasswordOpen(true);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Reset Password
                </Button>
                <Button
                  onClick={() => {
                    setUserDetailsOpen(false);
                    setSendEmailOpen(true);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-orange-600" />
              Reset User Password
            </DialogTitle>
            <DialogDescription>
              Send a password reset email to {selectedUser?.firstName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This will send a password reset link to <strong>{selectedUser?.email}</strong>. 
              The user will be able to create a new password using this link.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={processing}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {processing ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


