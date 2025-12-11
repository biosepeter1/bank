'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBranding } from '@/contexts/BrandingContext';

export default function AdminCardRequestsPage() {
  
  const { branding } = useBranding();
const router = useRouter();
  useEffect(() => {
    router.replace('/admin/cards?tab=requests');
  }, [router]);
  return null;
}

