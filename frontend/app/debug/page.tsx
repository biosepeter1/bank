'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    // Check localStorage on mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      setTokenInfo({
        hasAccessToken: !!token,
        hasRefreshToken: !!refreshToken,
        accessTokenLength: token?.length || 0,
        accessTokenPreview: token ? `${token.substring(0, 30)}...` : 'none',
      });
      
      addLog(`Initial token check - Access: ${!!token}, Refresh: ${!!refreshToken}`);
    }
  }, []);

  const testLogin = async () => {
    addLog('Starting login test...');
    try {
      const response = await authApi.login({
        email: 'test@example.com',
        password: 'Test123!',
      });
      
      addLog(`Login response received: ${JSON.stringify(response)}`);
      
      // Save tokens manually
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        addLog('Tokens saved to localStorage');
        
        // Update token info
        setTokenInfo({
          hasAccessToken: true,
          hasRefreshToken: true,
          accessTokenLength: response.accessToken.length,
          accessTokenPreview: `${response.accessToken.substring(0, 30)}...`,
        });
      }
    } catch (error: any) {
      addLog(`Login error: ${error.message}`);
      addLog(`Error details: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const testGetProfile = async () => {
    addLog('Testing /auth/me endpoint...');
    
    const token = localStorage.getItem('accessToken');
    addLog(`Current token: ${token ? `${token.substring(0, 30)}...` : 'none'}`);
    
    try {
      const profile = await authApi.getProfile();
      addLog(`Profile fetched successfully: ${JSON.stringify(profile)}`);
    } catch (error: any) {
      addLog(`Profile fetch error: ${error.message}`);
      addLog(`Error status: ${error.response?.status}`);
      addLog(`Error data: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const testDirectFetch = async () => {
    addLog('Testing direct fetch with token...');
    
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      addLog(`Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        addLog(`Response data: ${JSON.stringify(data)}`);
      } else {
        const errorText = await response.text();
        addLog(`Error response: ${errorText}`);
      }
    } catch (error: any) {
      addLog(`Fetch error: ${error.message}`);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setTokenInfo(null);
    addLog('Tokens cleared from localStorage');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Token Information</CardTitle>
          </CardHeader>
          <CardContent>
            {tokenInfo ? (
              <div className="space-y-2 font-mono text-sm">
                <p>Has Access Token: {tokenInfo.hasAccessToken ? '✅' : '❌'}</p>
                <p>Has Refresh Token: {tokenInfo.hasRefreshToken ? '✅' : '❌'}</p>
                <p>Access Token Length: {tokenInfo.accessTokenLength}</p>
                <p className="break-all">Token Preview: {tokenInfo.accessTokenPreview}</p>
              </div>
            ) : (
              <p>No token information available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={testLogin}>Test Login</Button>
              <Button onClick={testGetProfile} variant="secondary">
                Test Get Profile
              </Button>
              <Button onClick={testDirectFetch} variant="secondary">
                Test Direct Fetch
              </Button>
              <Button onClick={clearTokens} variant="destructive">
                Clear Tokens
              </Button>
              <Button onClick={clearLogs} variant="outline">
                Clear Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Console Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-xs h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p>No logs yet. Click a test button to start.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>1. First, register a user at /register or use existing credentials</p>
          <p>2. Click "Test Login" to authenticate and save tokens</p>
          <p>3. Click "Test Get Profile" to verify the token works with the API client</p>
          <p>4. Click "Test Direct Fetch" to verify raw fetch works with the token</p>
          <p>5. Check the console logs to see detailed information about each request</p>
        </CardContent>
      </Card>
    </div>
  );
}


