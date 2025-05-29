
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export class EmployeeService {
  static async getEmployeeProfile(): Promise<EmployeeProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('employee_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching employee profile:', error);
      return null;
    }

    return data;
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
    if (!profile) return [];

    const { data, error } = await supabase
      .from('asset_requests')
      .select('*')
      .eq('employee_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching asset requests:', error);
      return [];
    }

    return data || [];
  }

  static async createAssetRequest(request: Omit<AssetRequest, 'id' | 'employee_id' | 'requested_date' | 'status'>): Promise<boolean> {
    const profile = await this.getEmployeeProfile();
    if (!profile) return false;

    const { error } = await supabase
      .from('asset_requests')
      .insert({
        employee_id: profile.id,
        ...request
      });

    if (error) {
      console.error('Error creating asset request:', error);
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

    return data || [];
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
