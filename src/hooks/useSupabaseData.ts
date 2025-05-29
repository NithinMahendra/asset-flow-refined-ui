import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

export interface Asset {
  id: string;
  device_type: string;
  status: 'active' | 'inactive' | 'maintenance' | 'retired' | 'missing' | 'damaged';
  assigned_to: string | null;
  purchase_price: number | null;
  location: string | null;
  updated_at: string;
  serial_number: string;
  purchase_date: string | null;
  warranty_expiry: string | null;
  brand: string;
  model: string;
  notes: string | null;
  asset_tag: string | null;
  // Computed fields for compatibility
  name: string;
  category: string;
  assignee: string;
  value: number;
  last_updated: string;
  qr_code: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
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

  // Transform database asset to UI asset format
  const transformAsset = (dbAsset: any): Asset => ({
    id: dbAsset.id,
    device_type: dbAsset.device_type,
    status: dbAsset.status || 'active',
    assigned_to: dbAsset.assigned_to,
    purchase_price: dbAsset.purchase_price,
    location: dbAsset.location,
    updated_at: dbAsset.updated_at,
    serial_number: dbAsset.serial_number,
    purchase_date: dbAsset.purchase_date,
    warranty_expiry: dbAsset.warranty_expiry,
    brand: dbAsset.brand,
    model: dbAsset.model,
    notes: dbAsset.notes,
    asset_tag: dbAsset.asset_tag,
    // Computed fields
    name: `${dbAsset.brand} ${dbAsset.model}`,
    category: dbAsset.device_type,
    assignee: dbAsset.assigned_to || '-',
    value: dbAsset.purchase_price || 0,
    last_updated: dbAsset.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    qr_code: dbAsset.asset_tag || `QR${dbAsset.serial_number}`,
    condition: 'Good',
    department: '',
    description: dbAsset.notes
  });

  // Fetch all data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch assets from Supabase
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .order('updated_at', { ascending: false });

      if (assetsError) {
        console.error('Error fetching assets:', assetsError);
        // Fallback to mock data if database fails
        setAssets([
          {
            id: '1',
            device_type: 'laptop',
            status: 'active',
            assigned_to: 'John Doe',
            purchase_price: 2499,
            location: 'Office Floor 2',
            updated_at: '2024-01-15T00:00:00Z',
            serial_number: 'MP-2024-001',
            purchase_date: '2024-01-01',
            warranty_expiry: '2027-01-01',
            brand: 'Apple',
            model: 'MacBook Pro M3',
            notes: 'Engineering laptop',
            asset_tag: 'QR001-AST001-2024',
            name: 'MacBook Pro M3',
            category: 'Laptop',
            assignee: 'John Doe',
            value: 2499,
            last_updated: '2024-01-15',
            qr_code: 'QR001-AST001-2024',
            condition: 'Excellent',
            department: 'Engineering'
          },
          {
            id: '2',
            device_type: 'laptop',
            status: 'active',
            assigned_to: null,
            purchase_price: 1299,
            location: 'Warehouse A',
            updated_at: '2024-01-10T00:00:00Z',
            serial_number: 'DX-2024-002',
            purchase_date: '2024-01-05',
            warranty_expiry: '2027-01-05',
            brand: 'Dell',
            model: 'XPS 13',
            notes: null,
            asset_tag: 'QR002-AST002-2024',
            name: 'Dell XPS 13',
            category: 'Laptop',
            assignee: '-',
            value: 1299,
            last_updated: '2024-01-10',
            qr_code: 'QR002-AST002-2024',
            condition: 'Excellent',
            department: ''
          }
        ]);
      } else {
        const transformedAssets = assetsData?.map(transformAsset) || [];
        setAssets(transformedAssets);
      }

      // Set mock data for other entities (to be replaced with real Supabase queries later)
      setUsers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@company.com',
          role: 'Employee',
          department: 'Engineering',
          join_date: '2023-01-15',
          status: 'Active'
        },
        {
          id: '2',
          name: 'Sarah Smith',
          email: 'sarah.smith@company.com',
          role: 'Manager',
          department: 'Marketing',
          join_date: '2022-03-10',
          status: 'Active'
        }
      ]);

      setAssignments([
        {
          id: '1',
          employee_id: '1',
          employee_name: 'John Doe',
          employee_email: 'john.doe@company.com',
          asset_id: '1',
          asset_name: 'MacBook Pro M3',
          assigned_date: '2024-01-15',
          due_date: '2024-12-31',
          status: 'Active',
          department: 'Engineering',
          condition: 'Excellent'
        }
      ]);

      setAssignmentRequests([
        {
          id: '1',
          employee_id: '2',
          employee_name: 'Sarah Smith',
          employee_email: 'sarah.smith@company.com',
          requested_asset: 'iPad Pro',
          request_date: '2024-01-20',
          priority: 'Medium',
          justification: 'Need for client presentations',
          department: 'Marketing',
          manager_id: '3',
          manager_name: 'Mike Manager',
          status: 'Pending'
        }
      ]);

      setNotifications([
        {
          id: '1',
          type: 'warning',
          title: 'Warranty Expiring Soon',
          message: 'MacBook Pro M3 warranty expires in 30 days',
          timestamp: new Date().toISOString(),
          is_read: false,
          asset_id: '1'
        }
      ]);

      setActivityLog([
        {
          id: '1',
          action: 'Asset Assignment',
          details: 'MacBook Pro M3 assigned to John Doe',
          timestamp: new Date().toISOString(),
          type: 'assignment',
          asset_id: '1',
          user_id: '1'
        }
      ]);

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

  // Add asset to Supabase
  const addAsset = async (assetData: Omit<Asset, 'id' | 'last_updated' | 'qr_code' | 'name' | 'category' | 'assignee' | 'value'>) => {
    try {
      const assetTag = `QR${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const dbAssetData = {
        device_type: assetData.device_type,
        status: assetData.status || 'active',
        assigned_to: assetData.assigned_to,
        purchase_price: assetData.purchase_price,
        location: assetData.location,
        serial_number: assetData.serial_number,
        purchase_date: assetData.purchase_date,
        warranty_expiry: assetData.warranty_expiry,
        brand: assetData.brand,
        model: assetData.model,
        notes: assetData.notes,
        asset_tag: assetTag
      };

      const { data, error } = await supabase
        .from('assets')
        .insert([dbAssetData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newAsset = transformAsset(data);
      setAssets(prev => [newAsset, ...prev]);
      
      await logActivity('New Asset Added', `${newAsset.name} added to inventory`, 'addition', newAsset.id);
      
      toast({
        title: 'Success',
        description: `${newAsset.name} has been added to inventory`
      });

      return newAsset;
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

  // Update asset in Supabase
  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    try {
      const dbUpdates: any = {};
      
      // Map UI fields to database fields
      if (updates.device_type) dbUpdates.device_type = updates.device_type;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.assigned_to !== undefined) dbUpdates.assigned_to = updates.assigned_to;
      if (updates.purchase_price !== undefined) dbUpdates.purchase_price = updates.purchase_price;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.serial_number) dbUpdates.serial_number = updates.serial_number;
      if (updates.purchase_date !== undefined) dbUpdates.purchase_date = updates.purchase_date;
      if (updates.warranty_expiry !== undefined) dbUpdates.warranty_expiry = updates.warranty_expiry;
      if (updates.brand) dbUpdates.brand = updates.brand;
      if (updates.model) dbUpdates.model = updates.model;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      const { data, error } = await supabase
        .from('assets')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedAsset = transformAsset(data);
      setAssets(prev => prev.map(asset => 
        asset.id === id ? updatedAsset : asset
      ));
      
      await logActivity('Asset Updated', `${updatedAsset.name} information updated`, 'update', id);
      
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

  // Delete asset from Supabase
  const deleteAsset = async (id: string) => {
    try {
      const asset = assets.find(a => a.id === id);
      
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      
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
      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9)
      };

      setUsers(prev => [...prev, newUser]);
      
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
      const newAssignment: Assignment = {
        ...assignmentData,
        id: Math.random().toString(36).substr(2, 9)
      };

      setAssignments(prev => [...prev, newAssignment]);

      await updateAsset(assignmentData.asset_id, { 
        status: 'active',
        assigned_to: assignmentData.employee_name,
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
      const newActivity: ActivityLog = {
        id: Math.random().toString(36).substr(2, 9),
        action,
        details,
        type,
        asset_id: assetId,
        user_id: userId,
        timestamp: new Date().toISOString()
      };

      setActivityLog(prev => [newActivity, ...prev.slice(0, 49)]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Add notification
  const addNotification = async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'is_read'>) => {
    try {
      const newNotification: Notification = {
        ...notificationData,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        is_read: false
      };

      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (id: string) => {
    try {
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
    const available = assets.filter(a => a.status === 'active' && (a.assignee === '-' || !a.assigned_to)).length;
    const assigned = assets.filter(a => a.assignee !== '-' && a.assigned_to).length;
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

  // Set up real-time subscriptions
  useEffect(() => {
    fetchData();

    // Subscribe to asset changes
    const assetsSubscription = supabase
      .channel('assets-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assets'
      }, (payload) => {
        console.log('Asset change detected:', payload);
        fetchData(); // Refresh data on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(assetsSubscription);
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
