
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'maintenance' | 'retired' | 'missing' | 'damaged';
  assignee: string;
  value: number;
  location: string;
  last_updated: string;
  qr_code: string;
  serial_number: string;
  purchase_date: string;
  warranty_expiry: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  brand?: string;
  model?: string;
  department?: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Employee' | 'Manager' | 'Admin';
  department: string;
  join_date: string;
  status: 'Active' | 'Inactive';
}

export interface Assignment {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  asset_id: string;
  asset_name: string;
  assigned_date: string;
  due_date: string;
  status: 'Active' | 'Pending Return' | 'Returned' | 'Overdue';
  department: string;
  condition: string;
}

export interface AssignmentRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  requested_asset: string;
  request_date: string;
  priority: 'High' | 'Medium' | 'Low';
  justification: string;
  department: string;
  manager_id: string;
  manager_name: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  asset_id?: string;
  user_id?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'assignment' | 'addition' | 'maintenance' | 'return' | 'update';
  user_id?: string;
  asset_id?: string;
}

export const useSupabaseData = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentRequests, setAssignmentRequests] = useState<AssignmentRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [assetsRes, usersRes, assignmentsRes, requestsRes, notificationsRes, activityRes] = await Promise.all([
        supabase.from('assets').select('*'),
        supabase.from('users').select('*'),
        supabase.from('assignments').select('*'),
        supabase.from('assignment_requests').select('*'),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false })
      ]);

      if (assetsRes.error) throw assetsRes.error;
      if (usersRes.error) throw usersRes.error;
      if (assignmentsRes.error) throw assignmentsRes.error;
      if (requestsRes.error) throw requestsRes.error;
      if (notificationsRes.error) throw notificationsRes.error;
      if (activityRes.error) throw activityRes.error;

      setAssets(assetsRes.data || []);
      setUsers(usersRes.data || []);
      setAssignments(assignmentsRes.data || []);
      setAssignmentRequests(requestsRes.data || []);
      setNotifications(notificationsRes.data || []);
      setActivityLog(activityRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data from database',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add asset
  const addAsset = async (assetData: Omit<Asset, 'id' | 'last_updated' | 'qr_code'>) => {
    try {
      const qrCode = `QR${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('assets')
        .insert([{
          ...assetData,
          qr_code: qrCode,
          last_updated: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) throw error;

      setAssets(prev => [...prev, data]);
      
      // Log activity
      await logActivity('New Asset Added', `${data.name} added to inventory`, 'addition', data.id);
      
      toast({
        title: 'Success',
        description: `${data.name} has been added to inventory`
      });

      return data;
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to add asset',
        variant: 'destructive'
      });
      throw error;
    }
  };

  // Update asset
  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .update({
          ...updates,
          last_updated: new Date().toISOString().split('T')[0]
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAssets(prev => prev.map(asset => asset.id === id ? data : asset));
      
      await logActivity('Asset Updated', `${data.name} information updated`, 'update', id);
      
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
    }
  };

  // Delete asset
  const deleteAsset = async (id: string) => {
    try {
      const asset = assets.find(a => a.id === id);
      
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAssets(prev => prev.filter(asset => asset.id !== id));
      
      if (asset) {
        await logActivity('Asset Removed', `${asset.name} removed from inventory`, 'update', id);
      }
      
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
    }
  };

  // Add user
  const addUser = async (userData: Omit<User, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;

      setUsers(prev => [...prev, data]);
      
      toast({
        title: 'Success',
        description: 'User added successfully'
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: 'Failed to add user',
        variant: 'destructive'
      });
    }
  };

  // Add assignment
  const addAssignment = async (assignmentData: Omit<Assignment, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([assignmentData])
        .select()
        .single();

      if (error) throw error;

      setAssignments(prev => [...prev, data]);

      // Update asset status
      await updateAsset(assignmentData.asset_id, { 
        status: 'assigned' as any,
        assignee: assignmentData.employee_name,
        department: assignmentData.department
      });

      await logActivity('Asset Assignment', `${assignmentData.asset_name} assigned to ${assignmentData.employee_name}`, 'assignment', assignmentData.asset_id);
      
      toast({
        title: 'Success',
        description: 'Assignment created successfully'
      });
    } catch (error) {
      console.error('Error adding assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create assignment',
        variant: 'destructive'
      });
    }
  };

  // Log activity
  const logActivity = async (action: string, details: string, type: ActivityLog['type'], assetId?: string, userId?: string) => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert([{
          action,
          details,
          type,
          asset_id: assetId,
          user_id: userId
        }])
        .select()
        .single();

      if (error) throw error;

      setActivityLog(prev => [data, ...prev.slice(0, 49)]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Add notification
  const addNotification = async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'is_read'>) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notificationData,
          is_read: false
        }])
        .select()
        .single();

      if (error) throw error;

      setNotifications(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, is_read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Get asset stats
  const getAssetStats = () => {
    const total = assets.length;
    const available = assets.filter(a => a.status === 'active').length;
    const assigned = assets.filter(a => a.status === 'assigned').length;
    const inRepair = assets.filter(a => a.status === 'maintenance').length;
    const retired = assets.filter(a => a.status === 'retired').length;
    const totalValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);

    return { total, available, assigned, inRepair, retired, totalValue };
  };

  // Get category stats
  const getCategoryStats = () => {
    const categories = assets.reduce((acc, asset) => {
      const category = asset.category || 'Other';
      if (!acc[category]) {
        acc[category] = { count: 0, value: 0 };
      }
      acc[category].count++;
      acc[category].value += asset.value || 0;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);

    return Object.entries(categories).map(([name, data]) => ({
      name,
      count: data.count,
      value: data.value
    }));
  };

  // Get assignment stats
  const getAssignmentStats = () => {
    const active = assignments.filter(a => a.status === 'Active').length;
    const pending = assignmentRequests.filter(r => r.status === 'Pending').length;
    const overdue = assignments.filter(a => {
      const dueDate = new Date(a.due_date);
      return dueDate < new Date() && a.status === 'Active';
    }).length;
    const completed = assignments.filter(a => a.status === 'Returned').length;

    return { active, pending, overdue, completed };
  };

  // Initialize data and set up real-time subscriptions
  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
    const assetsSubscription = supabase
      .channel('assets-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets' }, () => {
        fetchData();
      })
      .subscribe();

    const assignmentsSubscription = supabase
      .channel('assignments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(assetsSubscription);
      supabase.removeChannel(assignmentsSubscription);
    };
  }, []);

  return {
    assets,
    users,
    assignments,
    assignmentRequests,
    notifications,
    activityLog,
    loading,
    addAsset,
    updateAsset,
    deleteAsset,
    addUser,
    addAssignment,
    addNotification,
    markNotificationAsRead,
    logActivity,
    getAssetStats,
    getCategoryStats,
    getAssignmentStats,
    refetch: fetchData
  };
};
