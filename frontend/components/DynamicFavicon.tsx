'use client';

import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function DynamicFavicon() {
  const { settings } = useSettings();

  useEffect(() => {
    // Determine which icon to use: prefer favicon, fallback to logo
    const faviconUrl = settings.general.favicon && settings.general.favicon !== '/favicon.ico'
      ? settings.general.favicon
      : settings.general.logo;

    if (faviconUrl) {
      // Remove ALL existing favicon links to ensure our dynamic one takes precedence
      const existingLinks = document.querySelectorAll("link[rel*='icon']");
      existingLinks.forEach(link => link.remove());

      // Create new favicon link with cache-busting
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = faviconUrl.includes('?') ? faviconUrl : `${faviconUrl}?v=${Date.now()}`;
      document.head.appendChild(link);

      // Also create shortcut icon for older browsers
      const shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      shortcutLink.type = 'image/png';
      shortcutLink.href = faviconUrl.includes('?') ? faviconUrl : `${faviconUrl}?v=${Date.now()}`;
      document.head.appendChild(shortcutLink);

      // Also set apple-touch-icon for iOS
      const existingApple = document.querySelector("link[rel='apple-touch-icon']");
      if (existingApple) existingApple.remove();

      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = faviconUrl;
      document.head.appendChild(appleLink);
    }
  }, [settings.general.favicon, settings.general.logo]);

  return null;
}
