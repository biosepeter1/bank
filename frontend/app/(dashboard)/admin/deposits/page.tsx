'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2, DollarSign, Eye, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useBranding } from '@/contexts/BrandingContext';

type Deposit = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  proofUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminDepositsPage() {
  
  const { branding } = useBranding();
const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deposits/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setDeposits(data);
      } else {
        toast.error('Failed to load deposits');
      }
    } catch (error) {
      console.error('Failed to fetch deposits:', error);
      toast.error('Failed to load deposits');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (depositId: string) => {
    if (!confirm('Are you sure you want to approve this deposit?')) return;

    try {
      setActionLoading(prev => ({ ...prev, [depositId]: true }));
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deposits/admin/${depositId}/approve`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        toast.success('Deposit approved successfully');
        fetchDeposits();
      } else {
        toast.error('Failed to approve deposit');
      }
    } catch (error) {
      console.error('Failed to approve deposit:', error);
      toast.error('Failed to approve deposit');
    } finally {
      setActionLoading(prev => ({ ...prev, [depositId]: false }));
    }
  };

  const handleReject = async () => {
    if (!selectedDeposit) return;

    try {
      setActionLoading(prev => ({ ...prev, [selectedDeposit.id]: true }));
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deposits/admin/${selectedDeposit.id}/reject`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: rejectReason }),
        }
      );

      if (response.ok) {
        toast.success('Deposit rejected');
        setShowRejectModal(false);
        setRejectReason('');
        fetchDeposits();
      } else {
        toast.error('Failed to reject deposit');
      }
    } catch (error) {
      console.error('Failed to reject deposit:', error);
      toast.error('Failed to reject deposit');
    } finally {
      setActionLoading(prev => ({ ...prev, [selectedDeposit.id]: false }));
    }
  };

  const handleDelete = async (depositId: string) => {
    if (!confirm('Are you sure you want to DELETE this deposit? This action cannot be undone!')) return;

    try {
      setActionLoading(prev => ({ ...prev, [`delete_${depositId}`]: true }));
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deposits/admin/${depositId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        toast.success('Deposit deleted successfully');
        fetchDeposits();
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to delete deposit' }));
        toast.error(error.message || `Failed to delete deposit (${response.status})`);
      }
    } catch (error) {
      console.error('Failed to delete deposit:', error);
      toast.error('Failed to delete deposit');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${depositId}`]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      PROCESSING: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      FAILED: { color: 'bg-red-100 text-red-800', label: 'Failed' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const stats = {
    total: deposits.length,
    pending: deposits.filter(d => d.status === 'PENDING' || d.status === 'PROCESSING').length,
    completed: deposits.filter(d => d.status === 'COMPLETED').length,
    totalAmount: deposits
      .filter(d => d.status === 'COMPLETED')
      .reduce((sum, d) => sum + d.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Deposit Management</h1>
        <p className="text-gray-600 mt-1">Review and approve user deposits</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deposits</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Loader2 className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">{stats.totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deposits Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : deposits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No deposits found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{deposit.userName}</p>
                        <p className="text-sm text-gray-500">{deposit.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {deposit.amount.toLocaleString()} {deposit.currency}
                    </TableCell>
                    <TableCell>{deposit.method}</TableCell>
                    <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                    <TableCell>{new Date(deposit.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedDeposit(deposit);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(deposit.status === 'PENDING' || deposit.status === 'PROCESSING') && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(deposit.id)}
                              disabled={actionLoading[deposit.id]}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {actionLoading[deposit.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedDeposit(deposit);
                                setShowRejectModal(true);
                              }}
                              disabled={actionLoading[deposit.id]}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(deposit.id)}
                          disabled={actionLoading[`delete_${deposit.id}`]}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-600"
                          title="Delete Deposit"
                        >
                          {actionLoading[`delete_${deposit.id}`] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit Details</DialogTitle>
          </DialogHeader>
          {selectedDeposit && (
            <div className="space-y-4">
              <div>
                <Label>User</Label>
                <p className="font-medium">{selectedDeposit.userName}</p>
                <p className="text-sm text-gray-500">{selectedDeposit.userEmail}</p>
              </div>
              <div>
                <Label>Amount</Label>
                <p className="font-medium">
                  ${selectedDeposit.amount.toLocaleString()} {selectedDeposit.currency}
                </p>
              </div>
              <div>
                <Label>Method</Label>
                <p className="font-medium">{selectedDeposit.method}</p>
              </div>
              <div>
                <Label>Status</Label>
                <div className="mt-1">{getStatusBadge(selectedDeposit.status)}</div>
              </div>
              <div>
                <Label>Created At</Label>
                <p className="font-medium">{new Date(selectedDeposit.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Deposit</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this deposit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason || actionLoading[selectedDeposit?.id || '']}
              >
                {actionLoading[selectedDeposit?.id || ''] ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  'Reject Deposit'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

