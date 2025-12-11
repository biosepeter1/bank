'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search, 
  CreditCard, 
  Eye, 
  Lock, 
  Unlock, 
  Loader2,
  TrendingUp,
  Users,
  Activity,
  AlertTriangle,
  Wifi,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { cardsApi } from '@/lib/api/cards';
import { toast } from 'react-hot-toast';
import AuthDebug from '@/components/auth/AuthDebug';
import { useSettings } from '@/contexts/SettingsContext';
import { useBranding } from '@/contexts/BrandingContext';

type CardData = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  cardNumber: string;
  cardType: string;
  cardBrand: 'VISA' | 'MASTERCARD' | 'AMERICAN_EXPRESS' | 'DISCOVER';
  status: string;
  expiryDate: string;
  cardholderName: string;
  createdAt: string;
  lastUsed?: string;
};

export default function AdminCardsPage() {
  
  const { branding } = useBranding();
const { settings } = useSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<'cards' | 'requests'>('cards');

  const [cards, setCards] = useState<CardData[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [cardDetailsOpen, setCardDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  // Stats
  const [stats, setStats] = useState({
    totalCards: 0,
    activeCards: 0,
    blockedCards: 0,
    virtualCards: 0,
    physicalCards: 0,
  });

  useEffect(() => {
    fetchCards();
  }, []);

  // On mount, read the tab from the URL and set state
  useEffect(() => {
    const urlTab = new URLSearchParams(window.location.search).get('tab');
    if (urlTab === 'requests') setTab('requests');
  }, []);

  // When tab changes, sync it back to the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (tab) {
      params.set('tab', tab);
      router.replace(`/admin/cards?${params.toString()}`);
    }
  }, [tab, router]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      console.log('🎴 Fetching admin cards...');

      // Try real cards endpoint first via raw fetch; if unavailable, fall back to card requests
      let cardsData: any[] = [];
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/admin/all`, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          });
          if (response.ok) {
            cardsData = await response.json();
          }
        }
      } catch (_) {}

      // Always fetch requests for the Requests tab
      const requestsList = await cardsApi.getAllCardRequests().catch(() => []);
      setRequests(requestsList);
      if (!Array.isArray(cardsData) || cardsData.length === 0) {
        // If there are no active cards, we still show requests in the Requests tab
        const requests = requestsList;
        if (Array.isArray(requests) && requests.length > 0) {
          cardsData = requests.map((r: any) => ({
            id: r.id,
            userId: r.userId,
            userName: `${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim(),
            userEmail: r.user?.email || '',
            cardNumber: '—',
            cardType: r.cardType || 'VIRTUAL',
            cardBrand: 'VISA',
            status: r.status || 'PENDING',
            expiryDate: '—',
            cardholderName: `${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim(),
            createdAt: r.createdAt,
            lastUsed: undefined,
            isRequest: true,
          }));
        }
      }

      setCards(cardsData as any);

      // Stats (requests fallback treats APPROVED as active)
      const totalCards = cardsData.length;
      const isRequestsMode = totalCards > 0 && (cardsData as any[]).every((c: any) => c.cardNumber === '—');
      const activeCards = isRequestsMode
        ? cardsData.filter((c: any) => (c.status || '').toUpperCase() === 'APPROVED').length
        : cardsData.filter((c: any) => (c.status || '').toUpperCase() === 'ACTIVE').length;
      const blockedCards = isRequestsMode
        ? 0
        : cardsData.filter((c: any) => (c.status || '').toUpperCase() === 'BLOCKED').length;
      const virtualCards = cardsData.filter((c: any) => (c.cardType || '').toUpperCase() === 'VIRTUAL').length;
      const physicalCards = cardsData.filter((c: any) => (c.cardType || '').toUpperCase() === 'PHYSICAL').length;
      setStats({ totalCards, activeCards, blockedCards, virtualCards, physicalCards });
    } finally {
      setLoading(false);
    }
  };

  const handleCardAction = async (cardId: string, action: 'block' | 'unblock') => {
    if (!confirm(`Are you sure you want to ${action} this card?`)) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [cardId]: true }));
      const token = localStorage.getItem('accessToken');

      if (!token) {
        toast.error('Not authenticated');
        return;
      }
      
      const endpoint = action === 'block' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/cards/admin/${cardId}/block`
        : `${process.env.NEXT_PUBLIC_API_URL}/cards/admin/${cardId}/unblock`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `Failed to ${action} card` }));
        throw new Error(error.message);
      }

      const data = await response.json();
      console.log(`✅ Card ${action}ed:`, data);
      
      const newStatus = action === 'block' ? 'BLOCKED' : 'ACTIVE';
      
      // Update card status in local state
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === cardId
            ? { ...card, status: newStatus }
            : card
        )
      );
      
      // Update selected card if it's the one being modified
      if (selectedCard && selectedCard.id === cardId) {
        setSelectedCard(prev => prev ? { ...prev, status: newStatus } : null);
      }
      
      // Update stats
      setStats(prev => {
        const activeChange = action === 'block' ? -1 : 1;
        const blockedChange = action === 'block' ? 1 : -1;
        return {
          ...prev,
          activeCards: prev.activeCards + activeChange,
          blockedCards: prev.blockedCards + blockedChange,
        };
      });
      
      toast.success(data.message || `Card ${action}ed successfully`);
    } catch (error: any) {
      console.error(`❌ Failed to ${action} card:`, error);
      toast.error(error.message || `Failed to ${action} card`);
    } finally {
      setActionLoading(prev => ({ ...prev, [cardId]: false }));
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [`approve_${requestId}`]: true }));
      await cardsApi.approveCardRequest(requestId);
      toast.success('Card request approved');
      fetchCards();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to approve request');
    } finally {
      setActionLoading(prev => ({ ...prev, [`approve_${requestId}`]: false }));
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const reason = prompt('Enter rejection reason');
    if (!reason) return;
    try {
      setActionLoading(prev => ({ ...prev, [`reject_${requestId}`]: true }));
      await cardsApi.rejectCardRequest(requestId, reason);
      toast.success('Card request rejected');
      fetchCards();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to reject request');
    } finally {
      setActionLoading(prev => ({ ...prev, [`reject_${requestId}`]: false }));
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to DELETE this card? This action cannot be undone!')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [`delete_${cardId}`]: true }));
      const token = localStorage.getItem('accessToken');

      if (!token) {
        toast.error('Not authenticated');
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/admin/${cardId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to delete card' }));
        throw new Error(error.message);
      }

      const data = await response.json();
      console.log('✅ Card deleted:', data);
      
      // Find the card to get its type and status before removing
      const deletedCard = cards.find(c => c.id === cardId);
      
      // Remove card from local state
      setCards(prevCards => prevCards.filter(card => card.id !== cardId));
      
      // Close dialog if the deleted card was selected
      if (selectedCard && selectedCard.id === cardId) {
        setSelectedCard(null);
        setCardDetailsOpen(false);
      }
      
      // Update stats
      if (deletedCard) {
        setStats(prev => ({
          ...prev,
          totalCards: prev.totalCards - 1,
          activeCards: deletedCard.status === 'ACTIVE' ? prev.activeCards - 1 : prev.activeCards,
          blockedCards: deletedCard.status === 'BLOCKED' ? prev.blockedCards - 1 : prev.blockedCards,
          virtualCards: deletedCard.cardType === 'VIRTUAL' ? prev.virtualCards - 1 : prev.virtualCards,
          physicalCards: deletedCard.cardType === 'PHYSICAL' ? prev.physicalCards - 1 : prev.physicalCards,
        }));
      }
      
      toast.success(data.message || 'Card deleted successfully');
    } catch (error: any) {
      console.error('❌ Failed to delete card:', error);
      toast.error(error.message || 'Failed to delete card');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${cardId}`]: false }));
    }
  };

  const viewCardDetails = (card: CardData) => {
    setSelectedCard(card);
    setCardDetailsOpen(true);
  };

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      searchTerm === '' ||
      card.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.cardholderName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    const matchesType = typeFilter === 'all' || card.cardType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      BLOCKED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      VIRTUAL: 'bg-purple-100 text-purple-800',
      PHYSICAL: 'bg-blue-100 text-blue-800',
    };
    return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Card Management</h1>
          <p className="text-gray-600 mt-2">Manage active cards and review requests</p>
        </div>
        <div className="inline-flex border rounded-lg overflow-hidden">
          <button className={`px-4 py-2 text-sm ${tab==='cards' ? 'bg-blue-600 text-white' : 'bg-white'}`} onClick={() => setTab('cards')}>Active Cards</button>
          <button className={`px-4 py-2 text-sm ${tab==='requests' ? 'bg-blue-600 text-white' : 'bg-white'}`} onClick={() => setTab('requests')}>Requests</button>
        </div>
      </div>

      {/* Stats */}
      {tab === 'cards' ? (
        <div className="grid gap-6 md:grid-cols-5 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{stats.totalCards}</p>
                <p className="text-sm text-gray-600">Total Cards</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-600">{stats.activeCards}</p>
                <p className="text-sm text-gray-600">Active Cards</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <p className="text-2xl font-bold text-red-600">{stats.blockedCards}</p>
                <p className="text-sm text-gray-600">Blocked Cards</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-purple-600">{stats.virtualCards}</p>
                <p className="text-sm text-gray-600">Virtual Cards</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-600">{stats.physicalCards}</p>
                <p className="text-sm text-gray-600">Physical Cards</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        (() => {
          const requestStats = {
            total: requests.length,
            pending: requests.filter((r:any) => (r.status || '').toUpperCase() === 'PENDING').length,
            approved: requests.filter((r:any) => (r.status || '').toUpperCase() === 'APPROVED').length,
            rejected: requests.filter((r:any) => (r.status || '').toUpperCase() === 'REJECTED').length,
          };
          return (
            <div className="grid gap-6 md:grid-cols-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold">{requestStats.total}</p>
                    <p className="text-sm text-gray-600">Total Requests</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-2xl font-bold text-yellow-600">{requestStats.pending}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">{requestStats.approved}</p>
                    <p className="text-sm text-gray-600">Approved</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <p className="text-2xl font-bold text-red-600">{requestStats.rejected}</p>
                    <p className="text-sm text-gray-600">Rejected</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })()
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by user name, email, or card number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Card Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Card Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="VIRTUAL">Virtual</SelectItem>
                <SelectItem value="PHYSICAL">Physical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {tab === 'cards' ? `Cards (${filteredCards.length})` : `Requests (${requests.filter(r => r.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())).length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tab === 'cards' && filteredCards.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No cards found</p>
            </div>
          )}

          {tab === 'cards' && filteredCards.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cardholder</TableHead>
                    <TableHead>Card Details</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{card.userName}</p>
                          <p className="text-sm text-gray-500">{card.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm">{card.cardNumber}</p>
                          <p className="text-xs text-gray-500">Exp: {card.expiryDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(card.cardType)}`}>
                          {card.cardType}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(card.status)}`}>
                          {card.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{new Date(card.createdAt).toLocaleDateString()}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {card.lastUsed ? new Date(card.lastUsed).toLocaleDateString() : 'Never'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {card.cardNumber === '—' ? (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={actionLoading[`approve_${card.id}`]} onClick={() => handleApproveRequest(card.id)}>Approve</Button>
                              <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" disabled={actionLoading[`reject_${card.id}`]} onClick={() => handleRejectRequest(card.id)}>Reject</Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => viewCardDetails(card)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {card.status === 'ACTIVE' ? (
                                <Button size="sm" variant="outline" onClick={() => handleCardAction(card.id, 'block')} disabled={actionLoading[card.id]}>
                                  <Lock className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => handleCardAction(card.id, 'unblock')} disabled={actionLoading[card.id]}>
                                  <Unlock className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline" onClick={() => handleDeleteCard(card.id)} disabled={actionLoading[`delete_${card.id}`]}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {tab === 'requests' && (
            (() => {
              // Show only pending requests by default; still respect search
              const filtered = requests.filter((r:any) => {
                const matchesSearch = searchTerm === '' || r.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesSearch && ((r.status || '').toUpperCase() === 'PENDING');
              });
              if (filtered.length === 0) {
                return (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No pending card requests</p>
                  </div>
                );
              }
              return (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((r:any) => (
                        <TableRow key={r.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{`${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim()}</p>
                              <p className="text-sm text-gray-500">{r.user?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell><span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge((r.cardType || 'VIRTUAL').toUpperCase())}`}>{r.cardType || 'VIRTUAL'}</span></TableCell>
                          <TableCell><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge((r.status || 'PENDING').toUpperCase())}`}>{r.status}</span></TableCell>
                          <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {(r.status || '').toUpperCase() === 'PENDING' && (
                                <>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={actionLoading[`approve_${r.id}`]} onClick={() => handleApproveRequest(r.id)}>Approve</Button>
                                  <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" disabled={actionLoading[`reject_${r.id}`]} onClick={() => handleRejectRequest(r.id)}>Reject</Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })()
          )}
        </CardContent>
      </Card>

      {/* Card Details Dialog */}
      <Dialog open={cardDetailsOpen} onOpenChange={setCardDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Card Details</DialogTitle>
            <DialogDescription>Complete information about this card</DialogDescription>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-6 py-4">
              {/* Card Visual */}
              <div className={`relative h-52 rounded-xl bg-gradient-to-br ${
                selectedCard.cardBrand === 'VISA' ? 'from-blue-600 via-blue-700 to-indigo-800' :
                selectedCard.cardBrand === 'MASTERCARD' ? 'from-red-500 via-orange-600 to-amber-700' :
                selectedCard.cardBrand === 'AMERICAN_EXPRESS' ? 'from-cyan-600 via-teal-700 to-emerald-800' :
                selectedCard.cardBrand === 'DISCOVER' ? 'from-orange-500 via-orange-600 to-orange-700' :
                'from-gray-600 via-gray-700 to-gray-800'
              } p-6 text-white shadow-lg`}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-xs opacity-80">Card Type</p>
                    <p className="font-semibold">{selectedCard.cardType}</p>
                  </div>
                  <CreditCard className="h-8 w-8 opacity-80" />
                </div>

                <div className="mb-4">
                  <p className="text-xs opacity-80 mb-1">Card Number</p>
                  <p className="text-lg font-mono tracking-wider">{selectedCard.cardNumber}</p>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-80">Cardholder</p>
                    <p className="text-sm font-semibold uppercase">{selectedCard.cardholderName}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Expires</p>
                    <p className="text-sm font-semibold">{selectedCard.expiryDate}</p>
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedCard.status)}`}>
                    {selectedCard.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Type</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(selectedCard.cardType)}`}>
                    {selectedCard.cardType}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">{new Date(selectedCard.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Used</p>
                  <p className="font-medium">
                    {selectedCard.lastUsed ? new Date(selectedCard.lastUsed).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div>
                <h3 className="font-semibold mb-3">Cardholder Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{selectedCard.userName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{selectedCard.userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {selectedCard.status === 'ACTIVE' ? (
                  <Button
                    variant="outline"
                    onClick={() => handleCardAction(selectedCard.id, 'block')}
                    disabled={actionLoading[selectedCard.id]}
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    {actionLoading[selectedCard.id] ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    Block Card
                  </Button>
                ) : selectedCard.status === 'BLOCKED' ? (
                  <Button
                    variant="outline"
                    onClick={() => handleCardAction(selectedCard.id, 'unblock')}
                    disabled={actionLoading[selectedCard.id]}
                    className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                  >
                    {actionLoading[selectedCard.id] ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Unlock className="mr-2 h-4 w-4" />
                    )}
                    Unblock Card
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  onClick={() => handleDeleteCard(selectedCard.id)}
                  disabled={actionLoading[`delete_${selectedCard.id}`]}
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-600"
                >
                  {actionLoading[`delete_${selectedCard.id}`] ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete Card
                </Button>
                <Button variant="outline" onClick={() => setCardDetailsOpen(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

