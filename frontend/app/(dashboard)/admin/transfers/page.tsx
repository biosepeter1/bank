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
import { CheckCircle, XCircle, Loader2, ArrowRightLeft, Eye, Globe, Users, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useBranding } from '@/contexts/BrandingContext';

type Transfer = {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  receiverId: string | null;
  receiverName: string;
  receiverEmail: string;
  amount: number;
  currency: string;
  transferType: string;
  status: string;
  reference: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminTransfersPage() {
  
  const { branding } = useBranding();
const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfers/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setTransfers(data);
      } else {
        toast.error('Failed to load transfers');
      }
    } catch (error) {
      console.error('Failed to fetch transfers:', error);
      toast.error('Failed to load transfers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transferId: string) => {
    if (!confirm('Are you sure you want to approve this transfer?')) return;

    try {
      setActionLoading(prev => ({ ...prev, [transferId]: true }));
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transfers/admin/${transferId}/approve`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        toast.success('Transfer approved successfully');
        fetchTransfers();
      } else {
        toast.error('Failed to approve transfer');
      }
    } catch (error) {
      console.error('Failed to approve transfer:', error);
      toast.error('Failed to approve transfer');
    } finally {
      setActionLoading(prev => ({ ...prev, [transferId]: false }));
    }
  };

  const handleReject = async () => {
    if (!selectedTransfer) return;

    try {
      setActionLoading(prev => ({ ...prev, [selectedTransfer.id]: true }));
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transfers/admin/${selectedTransfer.id}/reject`,
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
        toast.success('Transfer rejected');
        setShowRejectModal(false);
        setRejectReason('');
        fetchTransfers();
      } else {
        toast.error('Failed to reject transfer');
      }
    } catch (error) {
      console.error('Failed to reject transfer:', error);
      toast.error('Failed to reject transfer');
    } finally {
      setActionLoading(prev => ({ ...prev, [selectedTransfer.id]: false }));
    }
  };

  const handleDelete = async (transferId: string) => {
    if (!confirm('Are you sure you want to DELETE this transfer? This action cannot be undone!')) return;

    try {
      setActionLoading(prev => ({ ...prev, [`delete_${transferId}`]: true }));
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transfers/admin/${transferId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        toast.success('Transfer deleted successfully');
        fetchTransfers();
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to delete transfer' }));
        toast.error(error.message || `Failed to delete transfer (${response.status})`);
      }
    } catch (error) {
      console.error('Failed to delete transfer:', error);
      toast.error('Failed to delete transfer');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${transferId}`]: false }));
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

  const getTransferTypeBadge = (type: string) => {
    const typeConfig = {
      LOCAL: { color: 'bg-blue-100 text-blue-800', label: 'Local', icon: Users },
      INTERNATIONAL: { color: 'bg-purple-100 text-purple-800', label: 'International', icon: Globe },
    };
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.LOCAL;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const stats = {
    total: transfers.length,
    pending: transfers.filter(t => t.status === 'PENDING').length,
    completed: transfers.filter(t => t.status === 'COMPLETED').length,
    local: transfers.filter(t => t.transferType === 'LOCAL').length,
    international: transfers.filter(t => t.transferType === 'INTERNATIONAL').length,
    totalAmount: transfers
      .filter(t => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transfer Management</h1>
        <p className="text-gray-600 mt-1">Review and approve user transfers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ArrowRightLeft className="h-8 w-8 text-blue-600" />
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
                <p className="text-sm text-gray-600">Local</p>
                <p className="text-2xl font-bold text-blue-600">{stats.local}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">International</p>
                <p className="text-2xl font-bold text-purple-600">{stats.international}</p>
              </div>
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold">{stats.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : transfers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No transfers found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{transfer.senderName}</p>
                          <p className="text-xs text-gray-500">{transfer.senderEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{transfer.receiverName}</p>
                          <p className="text-xs text-gray-500">{transfer.receiverEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {transfer.amount.toLocaleString()} {transfer.currency}
                      </TableCell>
                      <TableCell>{getTransferTypeBadge(transfer.transferType)}</TableCell>
                      <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(transfer.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTransfer(transfer);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transfer.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(transfer.id)}
                                disabled={actionLoading[transfer.id]}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {actionLoading[transfer.id] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedTransfer(transfer);
                                  setShowRejectModal(true);
                                }}
                                disabled={actionLoading[transfer.id]}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(transfer.id)}
                            disabled={actionLoading[`delete_${transfer.id}`]}
                            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-600"
                            title="Delete Transfer"
                          >
                            {actionLoading[`delete_${transfer.id}`] ? (
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transfer Details</DialogTitle>
          </DialogHeader>
          {selectedTransfer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From</Label>
                  <p className="font-medium">{selectedTransfer.senderName}</p>
                  <p className="text-sm text-gray-500">{selectedTransfer.senderEmail}</p>
                </div>
                <div>
                  <Label>To</Label>
                  <p className="font-medium">{selectedTransfer.receiverName}</p>
                  <p className="text-sm text-gray-500">{selectedTransfer.receiverEmail}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount</Label>
                  <p className="font-medium text-lg">
                    ${selectedTransfer.amount.toLocaleString()} {selectedTransfer.currency}
                  </p>
                </div>
                <div>
                  <Label>Transfer Type</Label>
                  <div className="mt-1">{getTransferTypeBadge(selectedTransfer.transferType)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTransfer.status)}</div>
                </div>
                <div>
                  <Label>Reference</Label>
                  <p className="font-mono text-sm">{selectedTransfer.reference}</p>
                </div>
              </div>
              {selectedTransfer.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm">{selectedTransfer.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Created At</Label>
                  <p className="text-sm">{new Date(selectedTransfer.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label>Updated At</Label>
                  <p className="text-sm">{new Date(selectedTransfer.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Transfer</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this transfer.
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
                disabled={!rejectReason || actionLoading[selectedTransfer?.id || '']}
              >
                {actionLoading[selectedTransfer?.id || ''] ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  'Reject Transfer'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

