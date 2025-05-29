
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Export types from the database
export type Asset = Database['public']['Tables']['assets']['Row'];
export type AssetRequest = Database['public']['Tables']['asset_requests']['Row'];
export type AssetAssignment = Database['public']['Tables']['asset_assignments']['Row'];
export type ActivityLog = Database['public']['Tables']['activity_log']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type EmployeeProfile = Database['public']['Tables']['employee_profiles']['Row'];

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

      // Load all data in parallel
      const [
        assetsResult,
        requestsResult,
        assignmentsResult,
        activityResult,
        notificationsResult,
        profilesResult
      ] = await Promise.all([
        supabase.from('assets').select('*').order('created_at', { ascending: false }),
        supabase.from('asset_requests').select('*').order('requested_at', { ascending: false }),
        supabase.from('asset_assignments').select('*').order('assigned_at', { ascending: false }),
        supabase.from('activity_log').select('*').order('timestamp', { ascending: false }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }),
        supabase.from('employee_profiles').select('*').order('created_at', { ascending: false })
      ]);

      if (assetsResult.error) throw assetsResult.error;
      if (requestsResult.error) throw requestsResult.error;
      if (assignmentsResult.error) throw assignmentsResult.error;
      if (activityResult.error) throw activityResult.error;
      if (notificationsResult.error) throw notificationsResult.error;
      if (profilesResult.error) throw profilesResult.error;

      setAssets(assetsResult.data || []);
      setAssetRequests(requestsResult.data || []);
      setAssetAssignments(assignmentsResult.data || []);
      setActivityLog(activityResult.data || []);
      setNotifications(notificationsResult.data || []);
      setProfiles(profilesResult.data || []);

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addAsset = async (assetData: any): Promise<Asset | undefined> => {
    const { data, error } = await supabase
      .from('assets')
      .insert(assetData)
      .select()
      .single();

    if (error) throw error;
    
    if (data) {
      setAssets(prev => [data, ...prev]);
    }
    
    return data;
  };

  const updateAsset = async (id: string, updates: Partial<Asset>): Promise<void> => {
    const { error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, ...updates } : asset
    ));
  };

  const deleteAsset = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const addUser = async (user: Omit<User, 'id'>): Promise<void> => {
    console.log('Adding user:', user);
  };

  const addAssignment = async (assignment: Omit<Assignment, 'id'>): Promise<void> => {
    console.log('Adding assignment:', assignment);
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .insert(notification);

    if (error) throw error;
    await loadData();
  };

  const markNotificationAsRead = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
    await loadData();
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
