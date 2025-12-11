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
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllTransactions({ limit: 200 });
      setTransactions(data);
      
      const totalVolume = data.reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      const pending = data.filter((t: Transaction) => t.status === 'PENDING').length;
      const approved = data.filter((t: Transaction) => t.status === 'COMPLETED').length;
      const rejected = data.filter((t: Transaction) => t.status === 'FAILED').length;
      
      setStats({ totalVolume, totalTransactions: data.length, pending, approved, rejected });
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedTransaction) return;
    try {
      setProcessing(true);
      await adminApi.approveTransaction(selectedTransaction.id, { note: approvalNote });
      toast.success('Transaction approved successfully');
      setApproveDialogOpen(false);
      setApprovalNote('');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to approve transaction');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTransaction || !rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      setProcessing(true);
      await adminApi.rejectTransaction(selectedTransaction.id, { reason: rejectionReason });
      toast.success('Transaction rejected');
      setRejectDialogOpen(false);
      setRejectionReason('');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to reject transaction');
    } finally {
      setProcessing(false);
    }
  };

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

      {/* Stats Cards - Continued in next message due to length */}
      {/* Implementation continues with stats, filters, table, and dialogs */}
    </div>
  );
}

