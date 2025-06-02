
import { supabase } from '@/integrations/supabase/client';
import { LocalAssetService, LocalAsset } from './localAssetService';

export interface EmployeeProfile {
  id: string;
  user_id: string;
  employee_id: string;
  first_name: string;
  email: string;
  created_at: string;
}

export interface AssetRequest {
  id: string;
  user_id: string;
  asset_id?: string;
  request_type: string;
  description: string;
  status: string;
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
}

export interface MyAsset {
  id: string;
  device_type: string;
  brand: string;
  model: string;
  serial_number: string;
  status: string;
  assigned_to: string;
  location?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  notes?: string;
  qr_code?: string;
}

export class EmployeeService {
  static async getEmployeeProfile(): Promise<EmployeeProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('employee_profiles' as any)
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
      .from('employee_profiles' as any)
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating employee profile:', error);
      return false;
    }

    return true;
  }

  static async getEmployeeStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
      assignedAssets: 0,
      pendingRequests: 0,
      totalRequests: 0,
      unreadNotifications: 0,
      lastActivity: 'No activity'
    };

    try {
      // Count assigned assets using user_id directly
      const { count: assignedAssets } = await supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to', user.id);

      // Count pending requests
      const { count: pendingRequests } = await supabase
        .from('asset_requests' as any)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending');

      // Count total requests
      const { count: totalRequests } = await supabase
        .from('asset_requests' as any)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Count unread notifications
      const { count: unreadNotifications } = await supabase
        .from('notifications' as any)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      return {
        assignedAssets: assignedAssets || 0,
        pendingRequests: pendingRequests || 0,
        totalRequests: totalRequests || 0,
        unreadNotifications: unreadNotifications || 0,
        lastActivity: 'Recent activity'
      };
    } catch (error) {
      console.error('Error getting employee stats:', error);
      return {
        assignedAssets: 0,
        pendingRequests: 0,
        totalRequests: 0,
        unreadNotifications: 0,
        lastActivity: 'No activity'
      };
    }
  }

  static async getMyAssets(): Promise<(MyAsset | LocalAsset)[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
      // Get database assets (only if user is authenticated)
      let dbAssets: MyAsset[] = [];
      if (user) {
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('assigned_to', user.id);

        if (!error && data) {
          dbAssets = data;
        }
      }
      
      // Get local assets using session ID
      let userId = localStorage.getItem('session_user_id');
      if (!userId) {
        userId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('session_user_id', userId);
      }
      
      const localAssets = LocalAssetService.getLocalAssets(userId);
      
      // Merge both lists
      const allAssets = [
        ...dbAssets,
        ...localAssets
      ];

      return allAssets;
    } catch (error) {
      console.error('Error fetching my assets:', error);
      // Return at least local assets if database fails
      let userId = localStorage.getItem('session_user_id');
      if (!userId) {
        userId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('session_user_id', userId);
      }
      return LocalAssetService.getLocalAssets(userId);
    }
  }

  static async getMyRequests(): Promise<AssetRequest[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('asset_requests' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching my requests:', error);
      return [];
    }
  }

  static async createAssetRequest(requestData: {
    request_type: string;
    description: string;
    asset_id?: string;
  }): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('asset_requests' as any)
        .insert({
          user_id: user.id,
          request_type: requestData.request_type,
          description: requestData.description,
          asset_id: requestData.asset_id
        });

      if (error) throw error;

      // Log activity
      await supabase
        .from('activity_log' as any)
        .insert({
          asset_id: requestData.asset_id,
          user_id: user.id,
          action: 'Asset Request Created',
          details: {
            request_type: requestData.request_type,
            description: requestData.description
          }
        });

      return true;
    } catch (error) {
      console.error('Error creating asset request:', error);
      return false;
    }
  }

  static async createAssetRequestFromScan(assetData: any): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      // Use "assignment" instead of "transfer" as it's a valid enum value
      const { error } = await supabase
        .from('asset_requests' as any)
        .insert({
          user_id: user.id,
          request_type: 'assignment',
          description: `Request for scanned asset: ${assetData?.name || 'Unknown Asset'}`,
          asset_id: assetData?.id
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating asset request from scan:', error);
      return false;
    }
  }

  static async assignAssetToEmployee(assetId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      // Update the asset to assign it to the user directly
      const { error: updateError } = await supabase
        .from('assets')
        .update({ 
          assigned_to: user.id,
          status: 'active'
        })
        .eq('id', assetId);

      if (updateError) throw updateError;

      // Log the assignment activity with simplified details
      const { error: logError } = await supabase
        .from('activity_log' as any)
        .insert({
          asset_id: assetId,
          user_id: user.id,
          action: 'Asset Assigned via QR Scan',
          details: {
            assigned_to: user.id,
            user_email: user.email,
            assignment_method: 'qr_scan'
          }
        });

      if (logError) {
        console.error('Error logging activity:', logError);
        // Don't fail the assignment if logging fails
      }

      return true;
    } catch (error) {
      console.error('Error assigning asset to employee:', error);
      return false;
    }
  }

  static async addAssetToMyLocalAssets(asset: MyAsset): Promise<boolean> {
    try {
      // Check if localStorage is available
      if (typeof Storage === 'undefined') {
        console.error('localStorage is not available');
        return false;
      }

      // Test localStorage availability (handles private browsing mode)
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
      } catch (storageError) {
        console.error('localStorage access denied:', storageError);
        return false;
      }

      // Use a simple session-based ID instead of requiring authentication
      let userId = localStorage.getItem('session_user_id');
      if (!userId) {
        // Create a simple session ID for this browser session
        userId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('session_user_id', userId);
      }

      console.log('Adding asset to local storage:', asset);
      const success = LocalAssetService.addLocalAsset(userId, asset);
      
      if (success) {
        console.log('Asset successfully added to local storage');
      } else {
        console.error('Failed to add asset to local storage');
      }
      
      return success;
    } catch (error) {
      console.error('Error in addAssetToMyLocalAssets:', error);
      return false;
    }
  }

  static async removeLocalAsset(localId: string): Promise<boolean> {
    // Use the same session-based approach for consistency
    let userId = localStorage.getItem('session_user_id');
    if (!userId) {
      userId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('session_user_id', userId);
    }

    return LocalAssetService.removeLocalAsset(userId, localId);
  }

  static async getAssetByQRCode(qrCode: string): Promise<MyAsset | null> {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('qr_code', qrCode)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching asset by QR code:', error);
      return null;
    }
  }
}
