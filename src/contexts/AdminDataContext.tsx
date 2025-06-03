
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

interface AdminDataContextType {
  // Assets
  assets: Asset[];
  assetRequests: AssetRequest[];
  
  // Assignments
  assignments: AssetAssignment[];
  assignmentRequests: AssetRequest[];
  
  // Users and Profiles
  employees: EmployeeProfile[];
  users: EmployeeProfile[];
  
  // Notifications
  notifications: Notification[];
  
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
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);
  const [assignments, setAssignments] = useState<AssetAssignment[]>([]);
  const [assignmentRequests, setAssignmentRequests] = useState<AssetRequest[]>([]);
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
      setAssets(data || []);
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
        .order('created_at', { ascending: false })
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
        .order('requested_date', { ascending: false });
      
      if (error) throw error;
      setAssetRequests(data || []);
      setAssignmentRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const loadAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('asset_assignments')
        .select('*')
        .order('assigned_date', { ascending: false });
      
      if (error) throw error;
      setAssignments(data || []);
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
      setNotifications(data || []);
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
      
      const { data, error } = await supabase
        .from('assets')
        .insert([assetData])
        .select()
        .single();

      if (error) {
        console.error('❌ AdminDataContext: Error adding asset:', error);
        throw error;
      }

      console.log('✅ AdminDataContext: Asset added successfully:', data);
      
      setAssets(prev => [data, ...prev]);
      
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

      setAssets(prev => prev.map(asset => asset.id === id ? data : asset));
      
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
      const { data, error } = await supabase
        .from('asset_assignments')
        .insert([assignmentData])
        .select()
        .single();

      if (error) throw error;

      setAssignments(prev => [data, ...prev]);
      
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
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
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
    refreshData
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};
