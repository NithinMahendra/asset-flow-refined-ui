import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AssetCreationService, CreateAssetData } from '@/services/assetCreationService';

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

export type EmployeeProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastActivity: string;
};

interface AssetStats {
  total: number;
  available: number;
  assigned: number;
  inRepair: number;
  retired: number;
  totalValue: number;
}

interface CategoryStat {
  name: string;
  count: number;
  value: number;
}

interface AssignmentStats {
  active: number;
  pending: number;
  overdue: number;
  completed: number;
}

interface AdminDataContextType {
  // Data
  assets: Asset[];
  assetRequests: AssetRequest[];
  assetAssignments: AssetAssignment[];
  activityLog: ActivityLog[];
  notifications: Notification[];
  profiles: EmployeeProfile[];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  addAsset: (assetData: CreateAssetData) => Promise<void>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  
  // Statistics
  getAssetStats: () => AssetStats;
  getCategoryStats: () => CategoryStat[];
  getAssignmentStats: () => AssignmentStats;
  getRecentActivity: () => ActivityLog[];
  
  // Utility
  refetch: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);
  const [assetAssignments, setAssetAssignments] = useState<AssetAssignment[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profiles, setProfiles] = useState<EmployeeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading data from Supabase...');

      // Load all data in parallel
      const [
        assetsResult,
        requestsResult,
        assignmentsResult,
        activityResult,
        notificationsResult,
        profilesResult
      ] = await Promise.allSettled([
        supabase.from('assets').select('*').order('created_at', { ascending: false }),
        supabase.from('asset_requests').select('*').order('requested_at', { ascending: false }),
        supabase.from('asset_assignments').select('*').order('assigned_at', { ascending: false }),
        supabase.from('activity_log').select('*').order('timestamp', { ascending: false }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }),
        supabase.from('employee_profiles').select('*').order('created_at', { ascending: false })
      ]);

      // Process assets
      if (assetsResult.status === 'fulfilled' && !assetsResult.value.error) {
        const assetsData = assetsResult.value.data || [];
        const transformedAssets = assetsData.map((asset: any) => ({
          ...asset,
          // Add legacy fields for compatibility
          name: `${asset.brand || 'Unknown'} ${asset.model || 'Asset'}`,
          category: asset.device_type || 'Unknown',
          assignee: asset.assigned_to || 'Unassigned',
          value: asset.purchase_price || 0,
          last_updated: asset.updated_at || asset.created_at
        }));
        setAssets(transformedAssets);
        console.log('✅ Assets loaded:', transformedAssets.length);
      } else {
        console.error('❌ Error loading assets:', assetsResult.status === 'fulfilled' ? assetsResult.value.error : assetsResult.reason);
        setAssets([]);
      }

      // Process other data
      if (requestsResult.status === 'fulfilled' && !requestsResult.value.error) {
        setAssetRequests(requestsResult.value.data || []);
      }

      if (assignmentsResult.status === 'fulfilled' && !assignmentsResult.value.error) {
        setAssetAssignments(assignmentsResult.value.data || []);
      }

      if (activityResult.status === 'fulfilled' && !activityResult.value.error) {
        const activityData = activityResult.value.data || [];
        const transformedActivity = activityData.map((activity: any) => ({
          ...activity,
          type: activity.action?.toLowerCase().includes('assignment') ? 'assignment' :
                activity.action?.toLowerCase().includes('maintenance') ? 'maintenance' :
                activity.action?.toLowerCase().includes('addition') ? 'addition' : 'general'
        }));
        setActivityLog(transformedActivity);
      }

      if (notificationsResult.status === 'fulfilled' && !notificationsResult.value.error) {
        const notificationsData = notificationsResult.value.data || [];
        const transformedNotifications = notificationsData.map((notification: any) => ({
          ...notification,
          timestamp: notification.created_at
        }));
        setNotifications(transformedNotifications);
      }

      if (profilesResult.status === 'fulfilled' && !profilesResult.value.error) {
        setProfiles(profilesResult.value.data || []);
      }

    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const addAsset = async (assetData: CreateAssetData): Promise<void> => {
    try {
      console.log('🚀 AdminDataContext: Adding asset...', assetData);
      
      const result = await AssetCreationService.createAndStoreAsset(assetData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create asset');
      }
      
      if (result.asset) {
        // Transform the asset to include legacy fields
        const transformedAsset = {
          ...result.asset,
          name: `${result.asset.brand} ${result.asset.model}`,
          category: result.asset.device_type,
          assignee: result.asset.assigned_to || 'Unassigned',
          value: result.asset.purchase_price || 0,
          last_updated: result.asset.updated_at || result.asset.created_at
        };
        
        setAssets(prev => [transformedAsset, ...prev]);
        
        toast({
          title: 'Success!',
          description: 'Asset created successfully',
        });
      }
      
    } catch (error) {
      console.error('❌ AdminDataContext: Error adding asset:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create asset';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      
      throw error;
    }
  };

  const updateAsset = async (id: string, updates: Partial<Asset>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setAssets(prev => prev.map(asset => 
        asset.id === id ? { ...asset, ...updates } : asset
      ));
      
      toast({
        title: 'Success',
        description: 'Asset updated successfully'
      });
    } catch (error) {
      console.error('Error updating asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to update asset',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteAsset = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAssets(prev => prev.filter(asset => asset.id !== id));
      
      toast({
        title: 'Success',
        description: 'Asset deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete asset',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const getAssetStats = (): AssetStats => {
    try {
      const total = assets.length;
      const available = assets.filter(a => a.status === 'active' && !a.assigned_to).length;
      const assigned = assets.filter(a => a.assigned_to && a.assigned_to !== 'Unassigned').length;
      const inRepair = assets.filter(a => a.status === 'maintenance').length;
      const retired = assets.filter(a => a.status === 'retired').length;
      const totalValue = assets.reduce((sum, asset) => sum + (Number(asset.purchase_price) || 0), 0);

      return { total, available, assigned, inRepair, retired, totalValue };
    } catch (error) {
      console.error('Error calculating asset stats:', error);
      return { total: 0, available: 0, assigned: 0, inRepair: 0, retired: 0, totalValue: 0 };
    }
  };

  const getCategoryStats = (): CategoryStat[] => {
    try {
      const categories: { [key: string]: { count: number; value: number } } = {};
      
      assets.forEach(asset => {
        const category = asset.device_type || 'Other';
        if (!categories[category]) {
          categories[category] = { count: 0, value: 0 };
        }
        categories[category].count++;
        categories[category].value += Number(asset.purchase_price) || 0;
      });

      return Object.entries(categories).map(([name, stats]) => ({
        name,
        count: stats.count,
        value: stats.value
      }));
    } catch (error) {
      console.error('Error calculating category stats:', error);
      return [];
    }
  };

  const getAssignmentStats = (): AssignmentStats => {
    try {
      return {
        active: assetAssignments.filter(a => a.status === 'active').length,
        pending: assetRequests.filter(r => r.status === 'pending').length,
        overdue: 0,
        completed: assetAssignments.filter(a => a.status === 'returned').length
      };
    } catch (error) {
      console.error('Error calculating assignment stats:', error);
      return { active: 0, pending: 0, overdue: 0, completed: 0 };
    }
  };

  const getRecentActivity = (): ActivityLog[] => {
    return activityLog.slice(0, 10);
  };

  useEffect(() => {
    loadData();
  }, []);

  const value: AdminDataContextType = {
    assets,
    assetRequests,
    assetAssignments,
    activityLog,
    notifications,
    profiles,
    loading,
    error,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetStats,
    getCategoryStats,
    getAssignmentStats,
    getRecentActivity,
    refetch: loadData
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = (): AdminDataContextType => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
