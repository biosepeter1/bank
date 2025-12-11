'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Key, CheckCircle, XCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import apiClient from '@/lib/api/client';

interface TransferCode {
  id: string;
  type: 'COT' | 'IMF' | 'TAX';
  code: string;
  amount: number;
  isActive: boolean;
  isVerified: boolean;
  description: string | null;
  activatedAt: string | null;
  verifiedAt: string | null;
}

interface TransferCodesDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export default function TransferCodesDialog({ open, onClose, userId, userName }: TransferCodesDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [codes, setCodes] = useState<TransferCode[]>([]);
  const [editingCode, setEditingCode] = useState<TransferCode | null>(null);

  useEffect(() => {
    if (open && userId) {
      fetchTransferCodes();
    }
  }, [open, userId]);

  const fetchTransferCodes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/admin/users/${userId}/transfer-codes`);
      setCodes(response.data);
    } catch (err: any) {
      console.error('Transfer codes fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch transfer codes');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (code: TransferCode) => {
    setEditingCode({ ...code });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!editingCode) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await apiClient.patch(
        `/admin/users/${userId}/transfer-codes/${editingCode.type}`,
        {
          code: editingCode.code,
          amount: editingCode.amount,
          isActive: editingCode.isActive,
          isVerified: editingCode.isVerified,
          description: editingCode.description || undefined,
        }
      );

      setSuccess(`${editingCode.type} code updated successfully`);
      setEditingCode(null);
      await fetchTransferCodes();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Transfer code update error:', err);
      setError(err.response?.data?.message || 'Failed to update transfer code');
    } finally {
      setSaving(false);
    }
  };

  const getCodeIcon = (type: string) => {
    const icons = {
      COT: '💸',
      IMF: '🏦',
      TAX: '📊',
    };
    return icons[type as keyof typeof icons] || '🔑';
  };

  const getCodeDescription = (type: string) => {
    const descriptions = {
      COT: 'Cost of Transfer',
      IMF: 'International Monetary Fund',
      TAX: 'Tax Code',
    };
    return descriptions[type as keyof typeof descriptions];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transfer Codes Management</DialogTitle>
          <DialogDescription>
            Manage COT, IMF, and TAX codes for {userName}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4">
            {codes.map((code) => (
              <div key={code.id} className="border rounded-lg p-4 bg-gray-50">
                {editingCode?.id === code.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCodeIcon(code.type)}</span>
                        <div>
                          <h3 className="font-semibold text-lg">{code.type}</h3>
                          <p className="text-sm text-gray-600">{getCodeDescription(code.type)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Code Value</Label>
                        <Input
                          value={editingCode.code}
                          onChange={(e) => setEditingCode({ ...editingCode, code: e.target.value })}
                          placeholder="Enter code"
                        />
                      </div>

                      <div>
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingCode.amount}
                          onChange={(e) => setEditingCode({ ...editingCode, amount: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description (Optional)</Label>
                      <Textarea
                        value={editingCode.description || ''}
                        onChange={(e) => setEditingCode({ ...editingCode, description: e.target.value })}
                        placeholder="Add notes about this code"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${code.id}`}>Active Status</Label>
                        {editingCode.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <Switch
                        id={`active-${code.id}`}
                        checked={editingCode.isActive}
                        onCheckedChange={(checked) => setEditingCode({ ...editingCode, isActive: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`verified-${code.id}`}>Verified Status</Label>
                        {editingCode.isVerified ? (
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <Switch
                        id={`verified-${code.id}`}
                        checked={editingCode.isVerified}
                        onCheckedChange={(checked) => setEditingCode({ ...editingCode, isVerified: checked })}
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingCode(null)}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCodeIcon(code.type)}</span>
                        <div>
                          <h3 className="font-semibold text-lg">{code.type}</h3>
                          <p className="text-sm text-gray-600">{getCodeDescription(code.type)}</p>
                        </div>
                      </div>
                      <Button onClick={() => handleEdit(code)} size="sm">
                        <Key className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-500 mb-1">Code</p>
                        <p className="font-mono font-semibold">{code.code}</p>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-500 mb-1">Amount</p>
                        <p className="font-semibold">${code.amount.toFixed(2)}</p>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-500 mb-1">Active</p>
                        <div className="flex items-center gap-2">
                          {code.isActive ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Yes</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">No</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-500 mb-1">Verified</p>
                        <div className="flex items-center gap-2">
                          {code.isVerified ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">Yes</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">No</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {code.description && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <p className="text-xs text-gray-500 mb-1">Description</p>
                        <p className="text-sm">{code.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

