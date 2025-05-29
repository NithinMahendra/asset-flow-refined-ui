
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export interface EmployeeProfile {
  id: string;
  user_id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department?: string;
  position?: string;
  manager_id?: string;
  hire_date?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetRequest {
  id: string;
  employee_id: string;
  asset_type: string;
  brand?: string;
  model?: string;
  justification: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'denied' | 'fulfilled';
  requested_date: string;
  approved_date?: string;
  fulfilled_date?: string;
  denial_reason?: string;
  notes?: string;
}

export interface EmployeeNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  related_asset_id?: string;
  related_request_id?: string;
  created_at: string;
}

type AssetRequestRow = Database['public']['Tables']['asset_requests']['Row'];
type NotificationRow = Database['public']['Tables']['notifications']['Row'];

export class EmployeeService {
  static async getEmployeeProfile(): Promise<EmployeeProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('❌ No authenticated user found');
        return null;
      }

      console.log('🔍 Looking for employee profile for user:', user.id);

      const { data, error } = await supabase
        .from('employee_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('❌ Error fetching employee profile:', error);
        
        // If profile doesn't exist, try to create one
        if (error.code === 'PGRST116') {
          console.log('🔄 No profile found, attempting to create one...');
          return await this.createEmployeeProfile(user);
        }
        
        return null;
      }

      console.log('✅ Employee profile found:', data);
      return data;
    } catch (error) {
      console.error('❌ Exception in getEmployeeProfile:', error);
      return null;
    }
  }

  static async createEmployeeProfile(user: any): Promise<EmployeeProfile | null> {
    try {
      console.log('🚀 Creating employee profile for user:', user.id);
      
      const profileData = {
        user_id: user.id,
        employee_id: `EMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || 'Unknown',
        last_name: user.user_metadata?.last_name || '',
        email: user.email,
        department: user.user_metadata?.department || 'General',
        position: user.user_metadata?.position || 'Employee'
      };

      const { data, error } = await supabase
        .from('employee_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating employee profile:', error);
        return null;
      }

      console.log('✅ Employee profile created:', data);
      return data;
    } catch (error) {
      console.error('❌ Exception in createEmployeeProfile:', error);
      return null;
    }
  }

  static async updateEmployeeProfile(updates: Partial<EmployeeProfile>): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('employee_profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating employee profile:', error);
      return false;
    }

    return true;
  }

  static async getMyAssets(): Promise<any[]> {
    const profile = await this.getEmployeeProfile();
    if (!profile) return [];

    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('employee_id', profile.id);

    if (error) {
      console.error('Error fetching employee assets:', error);
      return [];
    }

    return data || [];
  }

  static async getMyRequests(): Promise<AssetRequest[]> {
    const profile = await this.getEmployeeProfile();
    if (!profile) {
      console.error('❌ No employee profile found for requests');
      return [];
    }

    console.log('🔍 Fetching requests for employee:', profile.id);

    const { data, error } = await supabase
      .from('asset_requests')
      .select('*')
      .eq('employee_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching asset requests:', error);
      return [];
    }

    console.log('✅ Fetched asset requests:', data?.length || 0);

    // Type assertion to ensure proper typing from database
    return (data as AssetRequestRow[]).map(row => ({
      id: row.id,
      employee_id: row.employee_id,
      asset_type: row.asset_type,
      brand: row.brand,
      model: row.model,
      justification: row.justification,
      priority: (row.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
      status: (row.status || 'pending') as 'pending' | 'approved' | 'denied' | 'fulfilled',
      requested_date: row.requested_date || '',
      approved_date: row.approved_date,
      fulfilled_date: row.fulfilled_date,
      denial_reason: row.denial_reason,
      notes: row.notes
    }));
  }

  static async createAssetRequest(request: Omit<AssetRequest, 'id' | 'employee_id' | 'requested_date' | 'status'>): Promise<boolean> {
    try {
      const profile = await this.getEmployeeProfile();
      if (!profile) {
        console.error('❌ No employee profile found, cannot create request');
        return false;
      }

      console.log('🚀 Creating asset request for employee:', profile.id);
      console.log('📝 Request data:', request);

      const { error } = await supabase
        .from('asset_requests')
        .insert({
          employee_id: profile.id,
          ...request
        });

      if (error) {
        console.error('❌ Error creating asset request:', error);
        return false;
      }

      console.log('✅ Asset request created successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception in createAssetRequest:', error);
      return false;
    }
  }

  static async createAssetRequestFromScan(assetId: string, justification: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'): Promise<boolean> {
    const profile = await this.getEmployeeProfile();
    if (!profile) return false;

    // Get asset details
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('*')
      .eq('id', assetId)
      .single();

    if (assetError || !asset) {
      console.error('Error fetching asset:', assetError);
      return false;
    }

    const { error } = await supabase
      .from('asset_requests')
      .insert({
        employee_id: profile.id,
        asset_type: asset.device_type,
        brand: asset.brand,
        model: asset.model,
        justification,
        priority,
        notes: `Requested via QR scan for asset: ${asset.asset_tag}`
      });

    if (error) {
      console.error('Error creating asset request from scan:', error);
      return false;
    }

    return true;
  }

  static async getNotifications(): Promise<EmployeeNotification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    // Type assertion to ensure proper typing from database
    return (data as NotificationRow[]).map(row => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      message: row.message,
      type: (row.type || 'info') as 'info' | 'success' | 'warning' | 'error',
      is_read: row.is_read || false,
      related_asset_id: row.related_asset_id,
      related_request_id: row.related_request_id,
      created_at: row.created_at || ''
    }));
  }

  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  }

  static async getAssetByQRCode(qrData: string): Promise<any | null> {
    try {
      // Parse QR data (expecting format: asset:{asset_id})
      const assetId = qrData.replace('asset:', '');
      
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', assetId)
        .single();

      if (error) {
        console.error('Error fetching asset by QR:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error parsing QR data:', error);
      return null;
    }
  }

  static async getEmployeeStats() {
    const [assets, requests, notifications] = await Promise.all([
      this.getMyAssets(),
      this.getMyRequests(),
      this.getNotifications()
    ]);

    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const unreadNotifications = notifications.filter(n => !n.is_read).length;
    const lastActivity = requests.length > 0 ? requests[0].requested_date : null;

    return {
      assignedAssets: assets.length,
      pendingRequests,
      totalRequests: requests.length,
      unreadNotifications,
      lastActivity: lastActivity ? new Date(lastActivity).toLocaleString() : 'No activity'
    };
  }
}
