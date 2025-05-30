
import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import type { Asset, AssetRequest, AssetAssignment, Notification, ActivityLog } from '@/types/database';

// Legacy types for compatibility
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastActivity: string;
};

export type Assignment = {
  id: string;
  employee_name: string;
  employee_email: string;
  asset_name: string;
  asset_id: string;
  department: string;
  assigned_date: string;
  due_date: string;
  status: string;
  condition: string;
};

export type AssignmentRequest = {
  id: string;
  employee_name: string;
  employee_email: string;
  requested_asset: string;
  department: string;
  request_date: string;
  priority: string;
  manager_name: string;
  status: string;
  justification: string;
};

interface AdminDataContextType {
  assets: Asset[];
  users: User[];
  assignments: Assignment[];
  assignmentRequests: AssignmentRequest[];
  notifications: Notification[];
  activityLog: ActivityLog[];
  loading: boolean;
  addAsset: (asset: any) => Promise<Asset | undefined>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  approveAssignmentRequest: (id: string) => Promise<void>;
  declineAssignmentRequest: (id: string) => Promise<void>;
  generateQRCode: (assetId: string) => string;
  refetch: () => Promise<void>;
  getAssetStats: () => {
    total: number;
    available: number;
    assigned: number;
    inRepair: number;
    retired: number;
    totalValue: number;
  };
  getCategoryStats: () => Array<{
    name: string;
    count: number;
    value: number;
  }>;
  getAssignmentStats: () => {
    active: number;
    pending: number;
    overdue: number;
    completed: number;
  };
  getUtilizationRate: () => number;
  getMaintenanceRate: () => number;
  getAverageAssetAge: () => number;
  getUpcomingWarrantyExpiries: () => Asset[];
  getOverdueMaintenanceAssets: () => Asset[];
  getRecentActivity: () => ActivityLog[];
  getUpcomingTasks: () => Array<{
    task: string;
    due: string;
    priority: 'high' | 'medium' | 'low';
    count?: number;
  }>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};

export const AdminDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabaseData = useSupabaseData();

  const generateQRCode = (assetId: string) => {
    const timestamp = Date.now();
    return `QR${timestamp}-${assetId}-${new Date().getFullYear()}`;
  };

  const approveAssignmentRequest = async (id: string) => {
    console.log('Approving request:', id);
  };

  const declineAssignmentRequest = async (id: string) => {
    console.log('Declining request:', id);
  };

  const getUtilizationRate = () => {
    const total = supabaseData.assets.length;
    const inUse = supabaseData.assets.filter(a => a.assigned_to !== null && a.assigned_to !== '').length;
    return total > 0 ? (inUse / total) * 100 : 0;
  };

  const getMaintenanceRate = () => {
    const total = supabaseData.assets.length;
    const inRepair = supabaseData.assets.filter(a => a.status === 'maintenance').length;
    return total > 0 ? (inRepair / total) * 100 : 0;
  };

  const getAverageAssetAge = () => {
    if (supabaseData.assets.length === 0) return 0;
    
    const currentDate = new Date();
    const totalAge = supabaseData.assets.reduce((sum, asset) => {
      if (!asset.purchase_date) return sum;
      const purchaseDate = new Date(asset.purchase_date);
      const ageInYears = (currentDate.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return sum + ageInYears;
    }, 0);

    return totalAge / supabaseData.assets.length;
  };

  const getUpcomingWarrantyExpiries = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return supabaseData.assets.filter(asset => {
      if (!asset.warranty_expiry) return false;
      const warrantyDate = new Date(asset.warranty_expiry);
      const today = new Date();
      return warrantyDate > today && warrantyDate <= thirtyDaysFromNow;
    });
  };

  const getOverdueMaintenanceAssets = () => {
    return supabaseData.assets.filter(asset => asset.status === 'maintenance');
  };

  const getRecentActivity = () => {
    return supabaseData.activityLog.slice(0, 10);
  };

  const getUpcomingTasks = () => {
    const tasks = [];
    
    const upcomingWarranties = getUpcomingWarrantyExpiries();
    if (upcomingWarranties.length > 0) {
      tasks.push({
        task: 'Warranty Renewals Due',
        due: `${upcomingWarranties.length} assets expiring soon`,
        priority: 'high' as const,
        count: upcomingWarranties.length
      });
    }

    const overdueAssets = getOverdueMaintenanceAssets();
    if (overdueAssets.length > 0) {
      tasks.push({
        task: 'Maintenance Required',
        due: `${overdueAssets.length} assets need attention`,
        priority: 'high' as const,
        count: overdueAssets.length
      });
    }

    const pendingRequests = supabaseData.assetRequests.filter(r => r.status === 'pending');
    if (pendingRequests.length > 0) {
      tasks.push({
        task: 'Pending Assignment Requests',
        due: `${pendingRequests.length} requests awaiting approval`,
        priority: 'medium' as const,
        count: pendingRequests.length
      });
    }

    return tasks.slice(0, 6);
  };

  const value: AdminDataContextType = {
    ...supabaseData,
    approveAssignmentRequest,
    declineAssignmentRequest,
    generateQRCode,
    getUtilizationRate,
    getMaintenanceRate,
    getAverageAssetAge,
    getUpcomingWarrantyExpiries,
    getOverdueMaintenanceAssets,
    getRecentActivity,
    getUpcomingTasks
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};
