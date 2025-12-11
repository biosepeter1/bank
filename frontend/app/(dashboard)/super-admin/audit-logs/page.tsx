'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  Shield, 
  User, 
  CreditCard, 
  DollarSign, 
  Search, 
  Filter,
  Download,
  Eye,
  AlertTriangle,
  Calendar,
  Clock,
  Trash2,
  Activity,
  TrendingUp,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import apiClient from '@/lib/api/client';
import { toast } from 'react-hot-toast';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  actorEmail: string;
  actorRole: 'USER' | 'BANK_ADMIN' | 'SUPER_ADMIN';
  description: string;
  metadata: Record<string, any>;
  ipAddress: string;
  createdAt: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [stats, setStats] = useState<any>(null);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [actionFilter, roleFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (actionFilter !== 'ALL') params.action = actionFilter;
      if (roleFilter !== 'ALL') params.actorRole = roleFilter;
      
      const response = await apiClient.get('/audit/logs', { params });
      
      // Map severity based on action type (since it's not stored in DB)
      const logsWithSeverity = response.data.map((log: any) => ({
        ...log,
        severity: getSeverityFromAction(log.action),
      }));
      
      setLogs(logsWithSeverity);
    } catch (error: any) {
      console.error('Failed to fetch audit logs:', error);
      toast.error(error?.response?.data?.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/audit/stats');
      setStats(response.data);
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const getSeverityFromAction = (action: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
    const criticalActions = ['BALANCE_ADJUSTED', 'ACCOUNT_FROZEN', 'SETTINGS_CHANGED'];
    const highActions = ['ACCOUNT_UNFROZEN', 'KYC_REJECTED', 'CARD_BLOCKED', 'TRANSACTION_FLAGGED'];
    const mediumActions = ['KYC_APPROVED', 'USER_UPDATED', 'CARD_CREATED'];
    
    if (criticalActions.some(a => action.includes(a))) return 'CRITICAL';
    if (highActions.some(a => action.includes(a))) return 'HIGH';
    if (mediumActions.some(a => action.includes(a))) return 'MEDIUM';
    return 'LOW';
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'default';
      case 'MEDIUM': return 'secondary';
      case 'HIGH': return 'destructive';
      case 'CRITICAL': return 'destructive';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'HIGH': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'MEDIUM': return <Eye className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('USER')) return <User className="h-4 w-4" />;
    if (action.includes('TRANSACTION')) return <DollarSign className="h-4 w-4" />;
    if (action.includes('CARD')) return <CreditCard className="h-4 w-4" />;
    if (action.includes('ADMIN') || action.includes('SETTINGS')) return <Shield className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'ALL' || log.action.includes(actionFilter);
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    const matchesRole = roleFilter === 'ALL' || log.actorRole === roleFilter;

    return matchesSearch && matchesAction && matchesSeverity && matchesRole;
  });

  const handleDeleteLog = async (logId: string) => {
    if (!confirm('Are you sure you want to delete this audit log?')) return;
    
    try {
      await apiClient.delete(`/audit/logs/${logId}`);
      setLogs(logs.filter(log => log.id !== logId));
      toast.success('Audit log deleted successfully');
      fetchStats(); // Refresh stats
    } catch (error: any) {
      console.error('Failed to delete audit log:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete audit log');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedLogs.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedLogs.length} audit log(s)?`)) return;
    
    try {
      await apiClient.delete('/audit/logs', { data: { ids: selectedLogs } });
      setLogs(logs.filter(log => !selectedLogs.includes(log.id)));
      setSelectedLogs([]);
      toast.success(`${selectedLogs.length} audit log(s) deleted successfully`);
      fetchStats(); // Refresh stats
    } catch (error: any) {
      console.error('Failed to delete audit logs:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete audit logs');
    }
  };

  const toggleSelectLog = (logId: string) => {
    setSelectedLogs(prev =>
      prev.includes(logId) ? prev.filter(id => id !== logId) : [...prev, logId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLogs.length === filteredLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(filteredLogs.map(log => log.id));
    }
  };

  const exportLogs = () => {
    // Simulate CSV export
    const csvContent = [
      'Date,Action,Entity,Actor,Severity,IP Address,Description',
      ...filteredLogs.map(log => 
        `${new Date(log.createdAt).toISOString()},${log.action},${log.entity},${log.actorEmail},${log.severity},${log.ipAddress},"${log.description}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 space-y-6">      
      {/* Header with Gradient */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Audit Logs
          </h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Monitor system activities and security events in real-time
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedLogs.length > 0 && (
            <Button 
              onClick={handleDeleteSelected} 
              variant="destructive"
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selectedLogs.length})
            </Button>
          )}
          <Button 
            onClick={fetchLogs} 
            variant="outline"
            className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            onClick={exportLogs} 
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Beautiful Stats Cards with Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/90">Total Events</CardTitle>
            <Activity className="h-8 w-8 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{stats?.totalLogs || logs.length}</div>
            <p className="text-xs text-white/70 mt-1">All recorded activities</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/90">Critical Events</CardTitle>
            <AlertTriangle className="h-8 w-8 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">
              {stats?.criticalActions || logs.filter(l => l.severity === 'CRITICAL').length}
            </div>
            <p className="text-xs text-white/70 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/90">High Priority</CardTitle>
            <TrendingUp className="h-8 w-8 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">
              {logs.filter(l => l.severity === 'HIGH').length}
            </div>
            <p className="text-xs text-white/70 mt-1">Important security events</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-white/90">Today's Events</CardTitle>
            <Clock className="h-8 w-8 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">
              {stats?.todayLogs || logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length}
            </div>
            <p className="text-xs text-white/70 mt-1">Activities in last 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters Card */}
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search logs by description, actor, or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48 h-11 shadow-sm border-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Actions</SelectItem>
                <SelectItem value="USER">User Actions</SelectItem>
                <SelectItem value="TRANSACTION">Transactions</SelectItem>
                <SelectItem value="KYC">KYC Events</SelectItem>
                <SelectItem value="CARD">Card Events</SelectItem>
                <SelectItem value="ADMIN">Admin Actions</SelectItem>
                <SelectItem value="LOGIN">Authentication</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40 h-11 shadow-sm border-gray-200">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Levels</SelectItem>
                <SelectItem value="CRITICAL">🔴 Critical</SelectItem>
                <SelectItem value="HIGH">🟠 High</SelectItem>
                <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                <SelectItem value="LOW">🟢 Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 h-11 shadow-sm border-gray-200">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="BANK_ADMIN">Bank Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Security & Activity Logs
          </CardTitle>
          <CardDescription className="text-base">
            Comprehensive audit trail of all system activities • Showing {filteredLogs.length} of {logs.length} events
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedLogs.includes(log.id)}
                      onChange={() => toggleSelectLog(log.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <div>
                        <div>{new Date(log.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs">{new Date(log.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <div>
                        <div className="font-medium text-sm">{log.action.replace(/_/g, ' ')}</div>
                        <div className="text-xs text-gray-500">{log.entity}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{log.actorEmail}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {log.actorRole.replace('_', ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(log.severity)}
                      <Badge variant={getSeverityBadgeVariant(log.severity)}>
                        {log.severity}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {log.ipAddress}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <div className="text-sm">{log.description}</div>
                      {Object.keys(log.metadata).length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Metadata: {Object.keys(log.metadata).length} fields
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>    </div>
  );
}


