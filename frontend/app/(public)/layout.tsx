'use client';

import { SettingsProvider } from '@/contexts/SettingsContext';
import { DynamicTitle } from '@/components/DynamicTitle';
import { DynamicFavicon } from '@/components/DynamicFavicon';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <DynamicTitle />
      <DynamicFavicon />
      {children}
    </SettingsProvider>
  );
}


