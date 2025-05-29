
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export interface EmployeeProfile {
  id: string;
  user_id: string;
  employee_id: string;
  first_name: string;
  email: string;
  created_at: string;
}

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
        email: user.email
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

  static async getEmployeeStats() {
    const profile = await this.getEmployeeProfile();
    
    return {
      assignedAssets: 0, // No assets table anymore
      pendingRequests: 0, // No requests table anymore
      totalRequests: 0, // No requests table anymore
      unreadNotifications: 0, // No notifications table anymore
      lastActivity: profile?.created_at ? new Date(profile.created_at).toLocaleString() : 'No activity'
    };
  }
}
