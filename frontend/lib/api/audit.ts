import apiClient from './client';

export const auditApi = {
  // Get all audit logs
  getAuditLogs: async (params?: {
    action?: string;
    entity?: string;
    actorRole?: string;
    limit?: number;
  }) => {
    const response = await apiClient.get('/audit/logs', { params });
    return response.data;
  },

  // Get audit log statistics
  getAuditStats: async () => {
    const response = await apiClient.get('/audit/stats');
    return response.data;
  },

  // Delete single audit log (Super Admin only)
  deleteAuditLog: async (logId: string) => {
    const response = await apiClient.delete(`/audit/logs/${logId}`);
    return response.data;
  },

  // Delete multiple audit logs (Super Admin only)
  deleteAuditLogs: async (logIds: string[]) => {
    const response = await apiClient.delete('/audit/logs', {
      data: { ids: logIds },
    });
    return response.data;
  },
};
