"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, Mail, User, KeyRound } from 'lucide-react';
import { transferApi } from '@/lib/api/transfers';
import toast from 'react-hot-toast';
import { useBranding } from '@/contexts/BrandingContext';

export default function AdminTransferCodesPage() {
  
  const { branding } = useBranding();
const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Array<{userId:string; userEmail:string; userName:string; type:'COT'|'IMF'|'TAX'; requestedAt:string}>>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await transferApi.listAdminCodeRequests();
      setItems(data);
    } catch (e:any) {
      toast.error(e?.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const approve = async (userId: string, type: 'COT'|'IMF'|'TAX') => {
    setBusy(`${userId}:${type}`);
    try {
      await transferApi.approveAdminCode(userId, type);
      toast.success(`${type} code issued and emailed`);
      await fetchItems();
    } catch (e:any) {
      toast.error(e?.response?.data?.message || 'Approval failed');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-emerald-600" /> Transfer Code Requests
        </h1>
        <p className="text-gray-600">Approve and issue COT/IMF/TAX codes. Issued codes are emailed automatically.</p>
      </div>

      <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>Users awaiting transfer codes</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No pending requests</div>
          ) : (
            <div className="space-y-3">
              {items.map((i) => (
                <div key={`${i.userId}-${i.type}`} className="flex items-center justify-between p-4 border rounded-xl bg-white">
                  <div className="flex items-center gap-4">
                    <KeyRound className="h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="font-semibold">{i.type} Code</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <User className="h-4 w-4" /> {i.userName || i.userEmail} · <Mail className="h-4 w-4" /> {i.userEmail}
                      </div>
                      <div className="text-xs text-gray-500">Requested at {new Date(i.requestedAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div>
                    <Button onClick={() => approve(i.userId, i.type)} disabled={busy === `${i.userId}:${i.type}`}
                      className="bg-emerald-600 hover:bg-emerald-700">
                      {busy === `${i.userId}:${i.type}` ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve & Issue'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
