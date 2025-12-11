import { useState, useEffect } from 'react';
import api from '@/src/services/api';
import { useAuthStore } from '@/stores/authStore';

interface AdminCounts {
  pendingLoans: number;
  pendingCardRequests: number;
  pendingKyc: number;
  pendingTransferCodes: number;
  openSupportTickets: number;
}

export function useAdminCounts() {
  const { user } = useAuthStore();
  const [counts, setCounts] = useState<AdminCounts>({
    pendingLoans: 0,
    pendingCardRequests: 0,
    pendingKyc: 0,
    pendingTransferCodes: 0,
    openSupportTickets: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCounts = async () => {
    try {
      const response = await api.get('/admin/sidebar-counts');
      setCounts(response.data || {
        pendingLoans: 0,
        pendingCardRequests: 0,
        pendingKyc: 0,
        pendingTransferCodes: 0,
        openSupportTickets: 0,
      });
    } catch (error) {
      // Silently fail - don't block the UI if endpoint fails
      console.error('Error fetching admin counts:', error);
      setCounts({
        pendingLoans: 0,
        pendingCardRequests: 0,
        pendingKyc: 0,
        pendingTransferCodes: 0,
        openSupportTickets: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if on client side AND user is BANK_ADMIN
    if (typeof window !== 'undefined' && user?.role === 'BANK_ADMIN') {
      fetchCounts();
      
      // Refresh counts every 30 seconds
      const interval = setInterval(fetchCounts, 30000);
      
      return () => clearInterval(interval);
    } else {
      // For non-admin users, just mark as done loading
      setLoading(false);
    }
  }, [user]);

  return { counts, loading, refetch: fetchCounts };
}
