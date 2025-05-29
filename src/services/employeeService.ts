
import { supabase } from '@/integrations/supabase/client';

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

  static async getEmployeeStats() {
    return {
      assignedAssets: 0,
      pendingRequests: 0,
      totalRequests: 0,
      unreadNotifications: 0,
      lastActivity: 'No activity'
    };
  }
}
