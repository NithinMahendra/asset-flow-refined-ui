
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  Asset, 
  AssetRequest, 
  AssetAssignment, 
  ActivityLog, 
  Notification, 
  EmployeeProfile 
} from '@/types/database';

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

export const useSupabaseData = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);
  const [assetAssignments, setAssetAssignments] = useState<AssetAssignment[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profiles, setProfiles] = useState<EmployeeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Legacy data structures for compatibility
  const [users] = useState<User[]>([]);
  const [assignments] = useState<Assignment[]>([]);
  const [assignmentRequests] = useState<AssignmentRequest[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load data with error handling for missing tables
      const results = await Promise.allSettled([
        supabase.from('assets').select('*').order('created_at', { ascending: false }),
        supabase.from('asset_requests').select('*').order('requested_at', { ascending: false }),
        supabase.from('asset_assignments').select('*').order('assigned_at', { ascending: false }),
        supabase.from('activity_log').select('*').order('timestamp', { ascending: false }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }),
        supabase.from('employee_profiles').select('*').order('created_at', { ascending: false })
      ]);

      // Handle assets
      if (results[0].status === 'fulfilled' && !results[0].value.error) {
        const assetsData = results[0].value.data || [];
        // Transform data to include legacy fields
        const transformedAssets = assetsData.map((asset: any) => ({
          ...asset,
          name: `${asset.brand} ${asset.model}`,
          category: asset.device_type,
          assignee: asset.assigned_to || 'Unassigned',
          value: asset.purchase_price,
          last_updated: asset.updated_at // Add last_updated for compatibility
        }));
        setAssets(transformedAssets);
        console.log('✅ Assets loaded successfully:', transformedAssets.length);
      } else {
        console.error('Error loading assets:', results[0].status === 'fulfilled' ? results[0].value.error : results[0].reason);
        setAssets([]);
      }

      // Handle asset requests
      if (results[1].status === 'fulfilled' && !results[1].value.error) {
        setAssetRequests(results[1].value.data || []);
        console.log('✅ Asset requests loaded successfully:', results[1].value.data?.length || 0);
      } else {
        console.error('Error loading asset requests:', results[1].status === 'fulfilled' ? results[1].value.error : results[1].reason);
        setAssetRequests([]);
      }

      // Handle asset assignments
      if (results[2].status === 'fulfilled' && !results[2].value.error) {
        setAssetAssignments(results[2].value.data || []);
        console.log('✅ Asset assignments loaded successfully:', results[2].value.data?.length || 0);
      } else {
        console.error('Error loading asset assignments:', results[2].status === 'fulfilled' ? results[2].value.error : results[2].reason);
        setAssetAssignments([]);
      }

      // Handle activity log
      if (results[3].status === 'fulfilled' && !results[3].value.error) {
        const activityData = results[3].value.data || [];
        // Transform data to include legacy fields
        const transformedActivity = activityData.map((activity: any) => ({
          ...activity,
          type: activity.action?.toLowerCase().includes('assignment') ? 'assignment' :
                activity.action?.toLowerCase().includes('maintenance') ? 'maintenance' :
                activity.action?.toLowerCase().includes('addition') ? 'addition' : 'general'
        }));
        setActivityLog(transformedActivity);
        console.log('✅ Activity log loaded successfully:', transformedActivity.length);
      } else {
        console.error('Error loading activity log:', results[3].status === 'fulfilled' ? results[3].value.error : results[3].reason);
        setActivityLog([]);
      }

      // Handle notifications
      if (results[4].status === 'fulfilled' && !results[4].value.error) {
        const notificationsData = results[4].value.data || [];
        // Transform data to include legacy fields
        const transformedNotifications = notificationsData.map((notification: any) => ({
          ...notification,
          timestamp: notification.created_at
        }));
        setNotifications(transformedNotifications);
        console.log('✅ Notifications loaded successfully:', transformedNotifications.length);
      } else {
        console.error('Error loading notifications:', results[4].status === 'fulfilled' ? results[4].value.error : results[4].reason);
        setNotifications([]);
      }

      // Handle employee profiles
      if (results[5].status === 'fulfilled' && !results[5].value.error) {
        setProfiles(results[5].value.data || []);
        console.log('✅ Employee profiles loaded successfully:', results[5].value.data?.length || 0);
      } else {
        console.error('Error loading employee profiles:', results[5].status === 'fulfilled' ? results[5].value.error : results[5].reason);
        setProfiles([]);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addAsset = async (assetData: any): Promise<Asset | undefined> => {
    try {
      console.log('🚀 Adding asset to database:', assetData);
      
      // Transform the data to match the database schema
      const dbAssetData = {
        device_type: assetData.device_type,
        brand: assetData.brand,
        model: assetData.model,
        serial_number: assetData.serial_number,
        status: assetData.status || 'active',
        location: assetData.location,
        assigned_to: assetData.assigned_to,
        purchase_price: assetData.purchase_price,
        purchase_date: assetData.purchase_date,
        warranty_expiry: assetData.warranty_expiry,
        notes: assetData.notes
      };

      const { data, error } = await supabase
        .from('assets')
        .insert(dbAssetData)
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      
      if (data) {
        console.log('✅ Asset created successfully:', data);
        
        // Transform data to include legacy fields
        const transformedAsset = {
          ...data,
          name: `${data.brand} ${data.model}`,
          category: data.device_type,
          assignee: data.assigned_to || 'Unassigned',
          value: data.purchase_price,
          last_updated: data.updated_at
        };
        
        setAssets(prev => [transformedAsset, ...prev]);
        
        // Log activity
        await supabase
          .from('activity_log')
          .insert({
            asset_id: data.id,
            action: 'Asset Created',
            details: { 
              asset_name: `${data.brand} ${data.model}`,
              serial_number: data.serial_number
            }
          });
          
        return transformedAsset;
      }
    } catch (error) {
      console.error('❌ Error adding asset:', error);
      throw error;
    }
  };

  const updateAsset = async (id: string, updates: Partial<Asset>): Promise<void> => {
    try {
      console.log('🔄 Updating asset:', id, updates);
      
      const { error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      
      setAssets(prev => prev.map(asset => 
        asset.id === id ? { ...asset, ...updates } : asset
      ));
      
      console.log('✅ Asset updated successfully');
    } catch (error) {
      console.error('❌ Error updating asset:', error);
      throw error;
    }
  };

  const deleteAsset = async (id: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting asset:', id);
      
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      
      setAssets(prev => prev.filter(asset => asset.id !== id));
      console.log('✅ Asset deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting asset:', error);
      throw error;
    }
  };

  const addUser = async (user: Omit<User, 'id'>): Promise<void> => {
    console.log('Adding user:', user);
  };

  const addAssignment = async (assignment: Omit<Assignment, 'id'>): Promise<void> => {
    console.log('Adding assignment:', assignment);
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert(notification);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  // Statistics functions
  const getAssetStats = () => {
    const total = assets.length;
    const available = assets.filter(a => a.status === 'active' && !a.assigned_to).length;
    const assigned = assets.filter(a => a.assigned_to).length;
    const inRepair = assets.filter(a => a.status === 'maintenance').length;
    const retired = assets.filter(a => a.status === 'retired').length;
    const totalValue = assets.reduce((sum, asset) => sum + (asset.purchase_price || 0), 0);

    return { total, available, assigned, inRepair, retired, totalValue };
  };

  const getCategoryStats = () => {
    const categories: { [key: string]: { count: number; value: number } } = {};
    
    assets.forEach(asset => {
      const category = asset.device_type || 'Other';
      if (!categories[category]) {
        categories[category] = { count: 0, value: 0 };
      }
      categories[category].count++;
      categories[category].value += asset.purchase_price || 0;
    });

    return Object.entries(categories).map(([name, stats]) => ({
      name,
      count: stats.count,
      value: stats.value
    }));
  };

  const getAssignmentStats = () => {
    return {
      active: assetAssignments.filter(a => a.status === 'active').length,
      pending: assetRequests.filter(r => r.status === 'pending').length,
      overdue: 0,
      completed: assetAssignments.filter(a => a.status === 'returned').length
    };
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    // New data structure
    assets,
    assetRequests,
    assetAssignments,
    activityLog,
    notifications,
    profiles,
    
    // Legacy data structure for compatibility
    users,
    assignments,
    assignmentRequests,
    
    loading,
    error,
    
    // CRUD operations
    addAsset,
    updateAsset,
    deleteAsset,
    addUser,
    addAssignment,
    addNotification,
    markNotificationAsRead,
    
    // Statistics
    getAssetStats,
    getCategoryStats,
    getAssignmentStats,
    
    refetch: loadData
  };
};

// Re-export types for compatibility
export type { Asset, AssetRequest, AssetAssignment, ActivityLog, Notification, EmployeeProfile };

