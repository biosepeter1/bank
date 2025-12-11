'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Search, Eye, CheckCircle, XCircle, Clock, ArrowDownCircle, ArrowUpCircle,
  ArrowRightLeft, Image as ImageIcon, Download, Activity, Sparkles, Shield, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api/admin';
import { toast } from 'react-hot-toast';
import { useBranding } from '@/contexts/BrandingContext';

type Transaction = {
  id: string;
  type: string;
  amount: number;
  status: string;
  currency: string;
  description: string;
  createdAt: string;
  proofOfPayment?: string;
  reference?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function EnhancedAdminTransactionsPage() {

  const { branding } = useBranding();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState({
    totalVolume: 0,
    totalTransactions: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllTransactions({ limit: 200 });
      const processed = (data || []).map((t: any) => ({
        ...t,
        amount: typeof t.signedAmount === 'number' ? t.signedAmount : Number(t.amount) || 0,
      }));
      setTransactions(processed);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const s = await adminApi.getTransactionStats();
      setStats({
        totalVolume: Number(s?.totalVolume || 0),
        totalTransactions: Number(s?.totalTransactions || 0),
        pending: Number(s?.pending || 0),
        approved: Number(s?.approved || 0),
        rejected: Number(s?.rejected || 0),
      });
    } catch (_) {
      // ignore
    }
  };

  // Approve/Reject hooks intentionally omitted here; backend may not support generic approvals.

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = searchTerm === '' ||
      transaction.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return <ArrowDownCircle className="h-4 w-4 text-green-600" />;
      case 'WITHDRAWAL': return <ArrowUpCircle className="h-4 w-4 text-red-600" />;
      case 'TRANSFER': return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading transactions...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              Transaction Management
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Review and approve all platform transactions</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="border-none shadow-lg bg-white/90"><CardContent className="pt-6"><p className="text-sm text-gray-500">Total Volume</p><p className="text-2xl font-bold">{stats.totalVolume.toLocaleString()}</p></CardContent></Card>
        <Card className="border-none shadow-lg bg-white/90"><CardContent className="pt-6"><p className="text-sm text-gray-500">Total Transactions</p><p className="text-2xl font-bold">{stats.totalTransactions}</p></CardContent></Card>
        <Card className="border-none shadow-lg bg-white/90"><CardContent className="pt-6"><p className="text-sm text-gray-500">Pending (UI)</p><p className="text-2xl font-bold">{stats.pending}</p></CardContent></Card>
      </motion.div>

      {/* Filters */}
      <Card className="border-none shadow-lg bg-white/90 mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input placeholder="Search name, email, reference..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="md:w-48"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="DEPOSIT">Deposit</SelectItem>
                <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-48"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-none shadow-xl bg-white/90">
        <CardHeader><CardTitle>All Transactions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((t) => (
                  <TableRow key={t.id} className="hover:bg-emerald-50/40">
                    <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{t.user?.firstName} {t.user?.lastName}<div className="text-xs text-gray-500">{t.user?.email}</div></TableCell>
                    <TableCell className="flex items-center gap-2">{getTypeIcon(t.type)}{t.type}</TableCell>
                    <TableCell className="text-right font-medium">{t.currency} {Math.abs(Number(t.amount)).toLocaleString()}</TableCell>
                    <TableCell><span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadge(t.status)}`}>{t.status}</span></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

