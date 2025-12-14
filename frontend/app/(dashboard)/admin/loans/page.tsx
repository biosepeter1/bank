"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { loansApi } from "@/lib/api/loans";
import toast from "react-hot-toast";
import { Loader2, Check, X, DollarSign, Send, ArrowDownToLine, CreditCard, Eye } from "lucide-react";
import { useBranding } from "@/contexts/BrandingContext";

interface AdminLoanRow {
  id: string;
  user: { id: string; email: string; firstName: string; lastName: string };
  userId: string;
  amount: number;
  currency: string;
  duration: number;
  purpose: string;
  status: "PENDING" | "FEE_PENDING" | "FEE_PAID" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED" | "DEFAULTED";
  processingFee?: number;
  feeDescription?: string;
  cryptoWalletAddress?: string;
  cryptoType?: string;
  feePaymentProof?: string;
  feePaidAt?: string;
  approvalNote?: string | null;
  rejectionReason?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

export default function AdminLoansPage() {

  const { branding } = useBranding();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<AdminLoanRow[]>([]);
  const [status, setStatus] = useState<string>("PENDING");

  // Propose modal
  const [proposeOpen, setProposeOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [proposedAmount, setProposedAmount] = useState<string>("");
  const [proposeNote, setProposeNote] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Reject modal
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Fee Request modal
  const [feeOpen, setFeeOpen] = useState(false);
  const [feeData, setFeeData] = useState({
    processingFee: "",
    feeDescription: "",
    cryptoWalletAddress: "",
    cryptoType: "USDT",
    approvalNote: "",
  });

  // View payment proof modal
  const [proofOpen, setProofOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState("");

  const fetchRows = async () => {
    setLoading(true);
    try {
      const data = await loansApi.adminList(status === 'ALL' ? undefined : status);
      setRows(data || []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const formatMoney = (n: number, ccy?: string) => {
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency: ccy || "NGN" }).format(n); } catch { return `${n.toLocaleString()} ${ccy || ""}`.trim(); }
  };

  const onOpenPropose = (id: string) => {
    setActiveId(id);
    setProposedAmount("");
    setProposeNote("");
    setProposeOpen(true);
  };

  const doPropose = async () => {
    if (!activeId) return;
    const amt = Number(proposedAmount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    try {
      setSubmitting(true);
      await loansApi.adminPropose(activeId, amt, proposeNote || undefined);
      toast.success("Offer proposed to user");
      setProposeOpen(false);
      await fetchRows();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to propose");
    } finally {
      setSubmitting(false);
    }
  };

  const doApprove = async (id: string) => {
    try {
      setSubmitting(true);
      await loansApi.adminApprove(id, undefined);
      toast.success("Loan approved");
      await fetchRows();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Approve failed");
    } finally {
      setSubmitting(false);
    }
  };

  const onOpenReject = (id: string) => {
    setActiveId(id);
    setRejectReason("");
    setRejectOpen(true);
  };

  const doReject = async () => {
    if (!activeId) return;
    if (!rejectReason.trim()) { toast.error("Please provide a reason"); return; }
    try {
      setSubmitting(true);
      await loansApi.adminReject(activeId, rejectReason.trim());
      toast.success("Loan rejected");
      setRejectOpen(false);
      await fetchRows();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Reject failed");
    } finally {
      setSubmitting(false);
    }
  };

  const doDisburse = async (id: string) => {
    try {
      setSubmitting(true);
      await loansApi.adminDisburse(id);
      toast.success("Disbursed to user wallet");
      await fetchRows();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Disburse failed");
    } finally {
      setSubmitting(false);
    }
  };

  const onOpenFeeRequest = (id: string) => {
    setActiveId(id);
    setFeeData({
      processingFee: "",
      feeDescription: "To process your loan application, a processing fee is required. Please complete the payment using the crypto wallet provided below.",
      cryptoWalletAddress: "",
      cryptoType: "USDT",
      approvalNote: "",
    });
    setFeeOpen(true);
  };

  const doRequestFee = async () => {
    if (!activeId) return;
    const fee = Number(feeData.processingFee);
    if (!fee || fee <= 0) { toast.error("Enter a valid fee amount"); return; }
    if (!feeData.cryptoWalletAddress.trim()) { toast.error("Enter crypto wallet address"); return; }
    if (!feeData.feeDescription.trim()) { toast.error("Enter fee description"); return; }

    try {
      setSubmitting(true);
      await loansApi.adminRequestFee(activeId, {
        processingFee: fee,
        feeDescription: feeData.feeDescription.trim(),
        cryptoWalletAddress: feeData.cryptoWalletAddress.trim(),
        cryptoType: feeData.cryptoType,
        approvalNote: feeData.approvalNote.trim() || undefined,
      });
      toast.success("Processing fee requested. User has been notified via email.");
      setFeeOpen(false);
      await fetchRows();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to request fee");
    } finally {
      setSubmitting(false);
    }
  };

  const onViewProof = (id: string, proofUrl: string) => {
    setActiveId(id);
    setProofUrl(proofUrl);
    setProofOpen(true);
  };

  const doVerifyFee = async (id: string) => {
    try {
      setSubmitting(true);
      await loansApi.adminVerifyFee(id);
      toast.success("Payment verified and loan approved!");
      setProofOpen(false);
      await fetchRows();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-bold">Loans Review</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 sm:h-10"><SelectValue placeholder="Status filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FEE_PENDING">Fee Pending</SelectItem>
              <SelectItem value="FEE_PAID">Fee Paid</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="DEFAULTED">Defaulted</SelectItem>
              <SelectItem value="ALL">All</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchRows} disabled={loading} size="sm" className="h-9 sm:h-10">
            {loading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Loading</>) : "Refresh"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Duration</TableHead>
                <TableHead className="hidden md:table-cell">Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead className="hidden xl:table-cell">Reviewed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{r.user.firstName} {r.user.lastName}</span>
                      <span className="text-xs text-gray-500 truncate max-w-[100px] sm:max-w-[150px]">{r.user.email}</span>
                      <span className="text-xs text-gray-400 sm:hidden">{r.duration}mo</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{formatMoney(Number(r.amount), r.currency)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{r.duration} mo</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[150px] truncate text-sm" title={r.purpose}>{r.purpose}</TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-full text-xs border">
                      {r.status}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="hidden xl:table-cell text-sm">{r.reviewedAt ? new Date(r.reviewedAt).toLocaleDateString() : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-1 sm:gap-2">
                      {r.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => onOpenFeeRequest(r.id)} className="h-7 sm:h-8 px-1.5 sm:px-2" title="Request Fee">
                            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden lg:inline ml-1 text-xs">Fee</span>
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => onOpenPropose(r.id)} className="h-7 sm:h-8 px-1.5 sm:px-2 hidden sm:flex" title="Propose">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => doApprove(r.id)} disabled={submitting} className="h-7 sm:h-8 px-1.5 sm:px-2" title="Approve">
                            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => onOpenReject(r.id)} className="h-7 sm:h-8 px-1.5 sm:px-2" title="Reject">
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </>
                      )}
                      {r.status === 'FEE_PAID' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => onViewProof(r.id, r.feePaymentProof || '')} className="h-7 sm:h-8 px-1.5 sm:px-2" title="View Proof">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button size="sm" onClick={() => doVerifyFee(r.id)} disabled={submitting} className="h-7 sm:h-8 px-1.5 sm:px-2" title="Verify & Approve">
                            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden md:inline ml-1 text-xs">Verify</span>
                          </Button>
                        </>
                      )}
                      {r.status === 'APPROVED' && (
                        <Button size="sm" onClick={() => doDisburse(r.id)} disabled={submitting} className="h-7 sm:h-8 px-1.5 sm:px-2" title="Disburse">
                          <ArrowDownToLine className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline ml-1 text-xs">Disburse</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {rows.length === 0 && <TableCaption>No applications found.</TableCaption>}
          </Table>
        </CardContent>
      </Card>

      {/* Propose Modal */}
      <Dialog open={proposeOpen} onOpenChange={(o) => { setProposeOpen(o); if (!o) { setActiveId(null); setProposedAmount(""); setProposeNote(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propose revised offer</DialogTitle>
            <DialogDescription>Send a new amount to the user for acceptance.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Amount</Label>
              <Input type="number" min={1000} step={1} value={proposedAmount} onChange={(e) => setProposedAmount(e.target.value)} placeholder="e.g. 25000" />
            </div>
            <div>
              <Label>Note (optional)</Label>
              <Input value={proposeNote} onChange={(e) => setProposeNote(e.target.value)} placeholder="Any note for the user" />
            </div>
            <div className="flex gap-2">
              <Button onClick={doPropose} disabled={submitting}>
                {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</>) : (<><Send className="h-4 w-4 mr-2" />Send Offer</>)}
              </Button>
              <Button variant="outline" onClick={() => setProposeOpen(false)} disabled={submitting}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectOpen} onOpenChange={(o) => { setRejectOpen(o); if (!o) { setActiveId(null); setRejectReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject application</DialogTitle>
            <DialogDescription>Provide a reason. The user will be notified.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Reason</Label>
              <Input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter reason" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={submitting}>Cancel</Button>
              <Button onClick={doReject} disabled={submitting}>
                {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Rejecting...</>) : (<><X className="h-4 w-4 mr-2" />Reject</>)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fee Request Modal */}
      <Dialog open={feeOpen} onOpenChange={(o) => { setFeeOpen(o); if (!o) { setActiveId(null); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Processing Fee</DialogTitle>
            <DialogDescription>Set the processing fee and provide crypto wallet for payment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Processing Fee Amount</Label>
                <Input type="number" min={1} step={0.01} value={feeData.processingFee} onChange={(e) => setFeeData({ ...feeData, processingFee: e.target.value })} placeholder="e.g. 50" />
              </div>
              <div>
                <Label>Crypto Type</Label>
                <Select value={feeData.cryptoType} onValueChange={(v) => setFeeData({ ...feeData, cryptoType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT">USDT (Tether)</SelectItem>
                    <SelectItem value="BTC">BTC (Bitcoin)</SelectItem>
                    <SelectItem value="ETH">ETH (Ethereum)</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Crypto Wallet Address</Label>
              <Input value={feeData.cryptoWalletAddress} onChange={(e) => setFeeData({ ...feeData, cryptoWalletAddress: e.target.value })} placeholder="Enter wallet address" className="font-mono text-sm" />
            </div>
            <div>
              <Label>Fee Description</Label>
              <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={feeData.feeDescription} onChange={(e) => setFeeData({ ...feeData, feeDescription: e.target.value })} placeholder="Explain why the fee is required" />
            </div>
            <div>
              <Label>Approval Note (Optional)</Label>
              <Input value={feeData.approvalNote} onChange={(e) => setFeeData({ ...feeData, approvalNote: e.target.value })} placeholder="Any additional note" />
            </div>
            <div className="flex gap-2">
              <Button onClick={doRequestFee} disabled={submitting}>
                {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</>) : (<><CreditCard className="h-4 w-4 mr-2" />Request Fee</>)}
              </Button>
              <Button variant="outline" onClick={() => setFeeOpen(false)} disabled={submitting}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Proof Modal */}
      <Dialog open={proofOpen} onOpenChange={(o) => { setProofOpen(o); if (!o) { setProofUrl(""); setActiveId(null); } }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>Review the payment proof submitted by the user.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              {proofUrl ? (
                <img src={proofUrl} alt="Payment Proof" className="w-full rounded-lg" onError={(e) => { (e.target as any).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==' }} />
              ) : (
                <div className="text-center py-8 text-gray-500">No proof available</div>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => activeId && doVerifyFee(activeId)} disabled={submitting || !activeId}>
                {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying...</>) : (<><Check className="h-4 w-4 mr-2" />Verify & Approve Loan</>)}
              </Button>
              <Button variant="outline" onClick={() => setProofOpen(false)} disabled={submitting}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

