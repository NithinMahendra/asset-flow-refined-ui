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

      // Load assets with error handling
      try {
        const { data: assetsData, error: assetsError } = await supabase
          .from('assets')
          .select('*')
          .order('created_at', { ascending: false });

        if (assetsError) {
          console.error('Error loading assets:', assetsError);
          setAssets([]);
        } else {
          // Transform data to include legacy fields and handle missing properties
          const transformedAssets = (assetsData || []).map((asset: any) => ({
            ...asset,
            // Legacy fields
            name: asset.name || `${asset.brand || 'Unknown'} ${asset.model || 'Asset'}`,
            category: asset.category || asset.device_type || 'Unknown',
            assignee: asset.assigned_to || 'Unassigned',
            value: asset.value || 0,
            last_updated: asset.created_at, // Use created_at as fallback
            // Ensure required fields exist
            purchase_price: asset.value || 0,
            updated_at: asset.created_at // Use created_at as fallback
          }));
          setAssets(transformedAssets);
          console.log('✅ Assets loaded successfully:', transformedAssets.length);
        }
      } catch (err) {
        console.error('Error in assets query:', err);
        setAssets([]);
      }

      // Load asset requests with error handling
      try {
        const { data: requestsData, error: requestsError } = await supabase
          .from('asset_requests')
          .select('*')
          .order('requested_at', { ascending: false });

        if (requestsError) {
          console.error('Error loading asset requests:', requestsError);
          setAssetRequests([]);
        } else {
          setAssetRequests(requestsData || []);
          console.log('✅ Asset requests loaded successfully:', requestsData?.length || 0);
        }
      } catch (err) {
        console.error('Error in asset requests query:', err);
        setAssetRequests([]);
      }

      // Load asset assignments with error handling
      try {
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('asset_assignments')
          .select('*')
          .order('assigned_at', { ascending: false });

        if (assignmentsError) {
          console.error('Error loading asset assignments:', assignmentsError);
          setAssetAssignments([]);
        } else {
          setAssetAssignments(assignmentsData || []);
          console.log('✅ Asset assignments loaded successfully:', assignmentsData?.length || 0);
        }
      } catch (err) {
        console.error('Error in asset assignments query:', err);
        setAssetAssignments([]);
      }

      // Load activity log with error handling
      try {
        const { data: activityData, error: activityError } = await supabase
          .from('activity_log')
          .select('*')
          .order('timestamp', { ascending: false });

        if (activityError) {
          console.error('Error loading activity log:', activityError);
          setActivityLog([]);
        } else {
          // Transform data to include legacy fields and safely handle details
          const transformedActivity = (activityData || []).map((activity: any) => {
            let safeDetails = activity.details;
            if (safeDetails && typeof safeDetails === 'object') {
              safeDetails = { ...safeDetails };
            }
            
            return {
              ...activity,
              type: activity.action?.toLowerCase().includes('assignment') ? 'assignment' :
                    activity.action?.toLowerCase().includes('maintenance') ? 'maintenance' :
                    activity.action?.toLowerCase().includes('addition') ? 'addition' : 'general',
              details: safeDetails,
              action: activity.action || 'Unknown Action',
              timestamp: activity.timestamp || new Date().toISOString()
            };
          });
          setActivityLog(transformedActivity);
          console.log('✅ Activity log loaded successfully:', transformedActivity.length);
        }
      } catch (err) {
        console.error('Error in activity log query:', err);
        setActivityLog([]);
      }

      // Load notifications with error handling
      try {
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (notificationsError) {
          console.error('Error loading notifications:', notificationsError);
          setNotifications([]);
        } else {
          // Transform data to include legacy fields
          const transformedNotifications = (notificationsData || []).map((notification: any) => ({
            ...notification,
            timestamp: notification.created_at
          }));
          setNotifications(transformedNotifications);
          console.log('✅ Notifications loaded successfully:', transformedNotifications.length);
        }
      } catch (err) {
        console.error('Error in notifications query:', err);
        setNotifications([]);
      }

      // Load employee profiles with error handling
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('employee_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          console.error('Error loading employee profiles:', profilesError);
          setProfiles([]);
        } else {
          setProfiles(profilesData || []);
          console.log('✅ Employee profiles loaded successfully:', profilesData?.length || 0);
        }
      } catch (err) {
        console.error('Error in employee profiles query:', err);
        setProfiles([]);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const addAsset = async (assetData: any): Promise<Asset | undefined> => {
    try {
      console.log('🚀 Adding asset to database:', assetData);
      
      // Transform the data to match the database schema
      const dbAssetData = {
        name: assetData.name || `${assetData.brand} ${assetData.model}`,
        category: assetData.category || assetData.device_type || 'Unknown',
        device_type: assetData.device_type,
        brand: assetData.brand,
        model: assetData.model,
        serial_number: assetData.serial_number,
        status: assetData.status || 'active',
        location: assetData.location,
        assigned_to: assetData.assigned_to,
        value: assetData.purchase_price || assetData.value,
        purchase_date: assetData.purchase_date,
        warranty_expiry: assetData.warranty_expiry,
        description: assetData.notes
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
          name: data.name || `${data.brand} ${data.model}`,
          category: data.category || data.device_type,
          assignee: data.assigned_to || 'Unassigned',
          value: data.value,
          last_updated: data.created_at,
          purchase_price: data.value || 0,
          updated_at: data.created_at
        };
        
        setAssets(prev => [transformedAsset, ...prev]);
        
        // Log activity
        await supabase
          .from('activity_log')
          .insert({
            asset_id: data.id,
            action: 'Asset Created',
            details: { 
              asset_name: data.name,
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
      
      // Transform updates to match database schema, filtering out legacy fields
      const dbUpdates: any = {};
      
      // Only include fields that exist in the database
      if (updates.device_type !== undefined) dbUpdates.device_type = updates.device_type;
      if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
      if (updates.model !== undefined) dbUpdates.model = updates.model;
      if (updates.serial_number !== undefined) dbUpdates.serial_number = updates.serial_number;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.assigned_to !== undefined) dbUpdates.assigned_to = updates.assigned_to;
      if (updates.purchase_price !== undefined) dbUpdates.value = updates.purchase_price;
      if (updates.purchase_date !== undefined) dbUpdates.purchase_date = updates.purchase_date;
      if (updates.warranty_expiry !== undefined) dbUpdates.warranty_expiry = updates.warranty_expiry;
      if (updates.notes !== undefined) dbUpdates.description = updates.notes;
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.category !== undefined) dbUpdates.category = updates.category;

      const { error } = await supabase
        .from('assets')
        .update(dbUpdates)
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

  const createAssetRequest = async (requestData: {
    asset_id?: string;
    request_type: string;
    description: string;
  }): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('asset_requests')
        .insert({
          user_id: user.id,
          asset_id: requestData.asset_id,
          request_type: requestData.request_type,
          description: requestData.description
        });

      if (error) throw error;
      
      await loadData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error creating asset request:', error);
      return false;
    }
  };

  const approveAssetRequest = async (requestId: string): Promise<boolean> => {
    try {
      // Get the request details
      const { data: request, error: requestError } = await supabase
        .from('asset_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError || !request) throw new Error('Request not found');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update request status
      const { error: updateError } = await supabase
        .from('asset_requests')
        .update({
          status: 'approved',
          processed_at: new Date().toISOString(),
          processed_by: user.id
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If this is an assignment request, assign the asset
      if (request.request_type === 'assignment' && request.asset_id) {
        // Update asset assignment
        const { error: assetError } = await supabase
          .from('assets')
          .update({
            assigned_to: request.user_id,
            status: 'active',
            assigned_date: new Date().toISOString()
          })
          .eq('id', request.asset_id);

        if (assetError) throw assetError;

        // Create assignment record
        await supabase
          .from('asset_assignments')
          .insert({
            asset_id: request.asset_id,
            user_id: request.user_id,
            assigned_by: user.id
          });

        // Log activity
        await supabase
          .from('activity_log')
          .insert({
            asset_id: request.asset_id,
            user_id: request.user_id,
            action: 'Asset Assigned',
            details: { 
              request_id: requestId,
              approved_by: user.id
            }
          });

        // Create notification for employee
        await supabase
          .from('notifications')
          .insert({
            user_id: request.user_id,
            title: 'Asset Request Approved',
            message: 'Your asset request has been approved and the asset has been assigned to you.',
            type: 'success'
          });
      }

      await loadData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error approving asset request:', error);
      return false;
    }
  };

  const rejectAssetRequest = async (requestId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('asset_requests')
        .update({
          status: 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: user.id
        })
        .eq('id', requestId);

      if (error) throw error;

      await loadData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error rejecting asset request:', error);
      return false;
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

  // Legacy functions for compatibility
  const approveAssignmentRequest = async (id: string): Promise<void> => {
    await approveAssetRequest(id);
  };

  const declineAssignmentRequest = async (id: string): Promise<void> => {
    await rejectAssetRequest(id);
  };

  // Statistics functions with error handling
  const getAssetStats = () => {
    try {
      const total = assets.length;
      const available = assets.filter(a => a.status === 'active' && !a.assigned_to).length;
      const assigned = assets.filter(a => a.assigned_to).length;
      const inRepair = assets.filter(a => a.status === 'maintenance').length;
      const retired = assets.filter(a => a.status === 'retired').length;
      const totalValue = assets.reduce((sum, asset) => sum + (Number(asset.purchase_price || asset.value) || 0), 0);

      return { total, available, assigned, inRepair, retired, totalValue };
    } catch (error) {
      console.error('Error calculating asset stats:', error);
      return { total: 0, available: 0, assigned: 0, inRepair: 0, retired: 0, totalValue: 0 };
    }
  };

  const getCategoryStats = () => {
    try {
      const categories: { [key: string]: { count: number; value: number } } = {};
      
      assets.forEach(asset => {
        const category = asset.device_type || asset.category || 'Other';
        if (!categories[category]) {
          categories[category] = { count: 0, value: 0 };
        }
        categories[category].count++;
        categories[category].value += Number(asset.purchase_price || asset.value) || 0;
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

  const getAssignmentStats = () => {
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
    
    // New request operations
    createAssetRequest,
    approveAssetRequest,
    rejectAssetRequest,
    
    // Legacy operations for compatibility
    approveAssignmentRequest,
    declineAssignmentRequest,
    
    // Statistics
    getAssetStats,
    getCategoryStats,
    getAssignmentStats,
    
    refetch: loadData
  };
};

// Re-export types for compatibility
export type { Asset, AssetRequest, AssetAssignment, ActivityLog, Notification, EmployeeProfile };
