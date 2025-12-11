'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AuthDebug() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setTokenInfo({ exists: false, message: 'No token found' });
      return;
    }

    try {
      // Decode JWT token (just the payload, not verifying signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        setTokenInfo({ exists: true, valid: false, message: 'Invalid token format' });
        return;
      }

      const payload = JSON.parse(atob(parts[1]));
      const now = Date.now() / 1000;
      const expired = payload.exp && payload.exp < now;

      setTokenInfo({
        exists: true,
        valid: !expired,
        expired,
        payload,
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'Unknown',
        userId: payload.sub || payload.id,
        email: payload.email,
        role: payload.role,
      });
    } catch (error) {
      setTokenInfo({ exists: true, valid: false, message: 'Failed to decode token' });
    }
  };

  const clearToken = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    checkToken();
  };

  if (!tokenInfo) return null;

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-sm mb-2">🔐 Auth Debug Info</p>
            {!tokenInfo.exists ? (
              <p className="text-red-600 text-sm">❌ No token found in localStorage</p>
            ) : tokenInfo.valid === false ? (
              <div>
                <p className="text-red-600 text-sm">❌ {tokenInfo.message || 'Invalid token'}</p>
                {tokenInfo.expired && (
                  <p className="text-xs text-red-500 mt-1">Token expired at: {tokenInfo.expiresAt}</p>
                )}
              </div>
            ) : (
              <div className="text-sm space-y-1">
                <p className="text-green-600">✅ Valid token found</p>
                <p className="text-xs text-gray-600">User: {tokenInfo.email}</p>
                <p className="text-xs text-gray-600">Role: {tokenInfo.role}</p>
                <p className="text-xs text-gray-600">Expires: {tokenInfo.expiresAt}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={checkToken}>
              Refresh
            </Button>
            {tokenInfo.exists && (
              <Button size="sm" variant="destructive" onClick={clearToken}>
                Clear Token
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

