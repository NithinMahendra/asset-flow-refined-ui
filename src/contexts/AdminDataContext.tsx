import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

// Database types
type Asset = Database['public']['Tables']['assets']['Row'];
type AssetRequest = Database['public']['Tables']['asset_requests']['Row'];
type AssetAssignment = Database['public']['Tables']['asset_assignments']['Row'];
type ActivityLog = Database['public']['Tables']['activity_log']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];

interface EmployeeProfile {
  id: string;
  user_id: string;
  employee_id: string;
  first_name: string;
  email: string;
  created_at: string;
  name?: string;
  role?: string;
  department?: string;
  status?: string;
  lastActivity?: string;
}

// Enhanced asset type with legacy fields
interface EnhancedAsset extends Asset {
  name: string;
  category: string;
  assignee: string;
  value: number;
  last_updated: string;
}

// Enhanced assignment type with legacy fields
interface EnhancedAssignment extends AssetAssignment {
  employee_name: string;
  employee_email: string;
  asset_name: string;
  department: string;
  assigned_date: string;
  due_date: string;
  condition: string;
}

// Enhanced assignment request type with legacy fields
interface EnhancedAssignmentRequest extends AssetRequest {
  employee_name: string;
  employee_email: string;
  requested_asset: string;
  department: string;
  request_date: string;
  priority: string;
  manager_name: string;
  justification: string;
}

// Enhanced notification type with legacy fields
interface EnhancedNotification extends Notification {
  timestamp: string;
}

interface AdminDataContextType {
  // Assets
  assets: EnhancedAsset[];
  assetRequests: AssetRequest[];
  
  // Assignments
  assignments: EnhancedAssignment[];
  assignmentRequests: EnhancedAssignmentRequest[];
  
  // Users and Profiles
  employees: EmployeeProfile[];
  users: EmployeeProfile[];
  
  // Notifications
  notifications: EnhancedNotification[];
  
  // Activity logs
  activityLogs: ActivityLog[];
  
  // Loading states
  loading: boolean;
  
  // Methods
  addAsset: (asset: Partial<Asset>) => Promise<void>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  
  addAssignment: (assignment: Partial<AssetAssignment>) => Promise<void>;
  approveAssignmentRequest: (requestId: string) => Promise<void>;
  declineAssignmentRequest: (requestId: string) => Promise<void>;
  
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  
  // New methods for Dashboard compatibility
  getAssetStats: () => { total: number; assigned: number; available: number; inRepair: number };
  getRecentActivity: () => ActivityLog[];
  
  refreshData: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};

interface AdminDataProviderProps {
  children: ReactNode;
}

export const AdminDataProvider: React.FC<AdminDataProviderProps> = ({ children }) => {
  const [assets, setAssets] = useState<EnhancedAsset[]>([]);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);
  const [assignments, setAssignments] = useState<EnhancedAssignment[]>([]);
  const [assignmentRequests, setAssignmentRequests] = useState<EnhancedAssignmentRequest[]>([]);
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  const loadAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform assets to include legacy fields
      const enhancedAssets: EnhancedAsset[] = (data || []).map(asset => ({
        ...asset,
        name: `${asset.brand || 'Unknown'} ${asset.model || 'Asset'}`,
        category: asset.device_type || 'other',
        assignee: asset.assigned_to || 'Unassigned',
        value: Number(asset.purchase_price) || 0,
        last_updated: asset.updated_at || asset.created_at
      }));
      
      setAssets(enhancedAssets);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load assets',
        variant: 'destructive'
      });
    }
  };

  const loadActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(emp => ({
        ...emp,
        name: emp.first_name,
        role: 'Employee',
        department: 'General',
        status: 'active',
        lastActivity: 'Recent'
      }));
      
      setEmployees(transformedData);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('asset_requests')
        .select('*')
        .order('requested_at', { ascending: false });
      
      if (error) throw error;
      setAssetRequests(data || []);
      
      // Transform assignment requests to include legacy fields
      const enhancedRequests: EnhancedAssignmentRequest[] = (data || []).map(request => ({
        ...request,
        employee_name: 'Unknown Employee',
        employee_email: 'unknown@example.com',
        requested_asset: request.description || 'Asset Request',
        department: 'General',
        request_date: request.requested_at || new Date().toISOString(),
        priority: 'medium',
        manager_name: 'System',
        justification: request.description || 'No justification provided'
      }));
      
      setAssignmentRequests(enhancedRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const loadAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('asset_assignments')
        .select('*')
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform assignments to include legacy fields
      const enhancedAssignments: EnhancedAssignment[] = (data || []).map(assignment => ({
        ...assignment,
        employee_name: 'Unknown Employee',
        employee_email: 'unknown@example.com',
        asset_name: 'Unknown Asset',
        department: 'General',
        assigned_date: assignment.assigned_at || new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        condition: 'good'
      }));
      
      setAssignments(enhancedAssignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform notifications to include legacy timestamp field
      const enhancedNotifications: EnhancedNotification[] = (data || []).map(notification => ({
        ...notification,
        timestamp: notification.created_at
      }));
      
      setNotifications(enhancedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAssets(),
        loadEmployees(),
        loadRequests(),
        loadAssignments(),
        loadNotifications(),
        loadActivityLogs()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addAsset = async (assetData: Partial<Asset>) => {
    try {
      console.log('🚀 AdminDataContext: Adding asset:', assetData);
      
      // Ensure required fields are present
      const requiredAssetData = {
        brand: assetData.brand || '',
        model: assetData.model || '',
        device_type: assetData.device_type || 'other',
        serial_number: assetData.serial_number || '',
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
        .insert(requiredAssetData)
        .select()
        .single();

      if (error) {
        console.error('❌ AdminDataContext: Error adding asset:', error);
        throw error;
      }

      console.log('✅ AdminDataContext: Asset added successfully:', data);
      
      // Transform the new asset and add to state
      const enhancedAsset: EnhancedAsset = {
        ...data,
        name: `${data.brand || 'Unknown'} ${data.model || 'Asset'}`,
        category: data.device_type || 'other',
        assignee: data.assigned_to || 'Unassigned',
        value: Number(data.purchase_price) || 0,
        last_updated: data.updated_at || data.created_at
      };
      
      setAssets(prev => [enhancedAsset, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Asset created successfully',
      });

      await loadActivityLogs();
    } catch (error: any) {
      console.error('❌ AdminDataContext: Asset creation failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create asset',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Transform the updated asset
      const enhancedAsset: EnhancedAsset = {
        ...data,
        name: `${data.brand || 'Unknown'} ${data.model || 'Asset'}`,
        category: data.device_type || 'other',
        assignee: data.assigned_to || 'Unassigned',
        value: Number(data.purchase_price) || 0,
        last_updated: data.updated_at || data.created_at
      };

      setAssets(prev => prev.map(asset => asset.id === id ? enhancedAsset : asset));
      
      toast({
        title: 'Success',
        description: 'Asset updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update asset',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAssets(prev => prev.filter(asset => asset.id !== id));
      
      toast({
        title: 'Success',
        description: 'Asset deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete asset',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const addAssignment = async (assignmentData: Partial<AssetAssignment>) => {
    try {
      // Ensure required fields are present
      const requiredAssignmentData = {
        asset_id: assignmentData.asset_id || '',
        user_id: assignmentData.user_id || '',
        assigned_by: assignmentData.assigned_by || '',
        status: assignmentData.status || 'active',
        assigned_at: assignmentData.assigned_at,
        returned_at: assignmentData.returned_at
      };

      const { data, error } = await supabase
        .from('asset_assignments')
        .insert(requiredAssignmentData)
        .select()
        .single();

      if (error) throw error;

      // Transform the new assignment
      const enhancedAssignment: EnhancedAssignment = {
        ...data,
        employee_name: 'Unknown Employee',
        employee_email: 'unknown@example.com',
        asset_name: 'Unknown Asset',
        department: 'General',
        assigned_date: data.assigned_at || new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        condition: 'good'
      };

      setAssignments(prev => [enhancedAssignment, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Assignment created successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create assignment',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const approveAssignmentRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('asset_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (error) throw error;

      await loadRequests();
      
      toast({
        title: 'Success',
        description: 'Request approved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve request',
        variant: 'destructive'
      });
    }
  };

  const declineAssignmentRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('asset_requests')
        .update({ status: 'denied' })
        .eq('id', requestId);

      if (error) throw error;

      await loadRequests();
      
      toast({
        title: 'Success',
        description: 'Request declined successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to decline request',
        variant: 'destructive'
      });
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getAssetStats = () => {
    const total = assets.length;
    const assigned = assets.filter(a => a.assigned_to).length;
    const available = assets.filter(a => a.status === 'active' && !a.assigned_to).length;
    const inRepair = assets.filter(a => a.status === 'maintenance').length;
    
    return { total, assigned, available, inRepair };
  };

  const getRecentActivity = () => {
    return activityLogs.slice(0, 10); // Return the 10 most recent activities
  };

  const value: AdminDataContextType = {
    assets,
    assetRequests,
    assignments,
    assignmentRequests,
    employees,
    users: employees, // Alias for backward compatibility
    notifications,
    activityLogs,
    loading,
    addAsset,
    updateAsset,
    deleteAsset,
    addAssignment,
    approveAssignmentRequest,
    declineAssignmentRequest,
    markNotificationAsRead,
    getAssetStats,
    getRecentActivity,
    refreshData
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};
