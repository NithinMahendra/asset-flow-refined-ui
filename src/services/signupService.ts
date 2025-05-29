
import { supabase } from '@/integrations/supabase/client';

export interface SignupResult {
  success: boolean;
  error?: string;
  userId?: string;
}

export class SignupService {
  static async createEmployeeAccount(
    email: string, 
    password: string, 
    firstName: string
  ): Promise<SignupResult> {
    console.log('🚀 [SignupService] Starting minimal signup');
    console.log('📧 [SignupService] Email:', email);
    console.log('👤 [SignupService] First name:', firstName);

    // Direct Supabase signup call with minimal options
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName
        }
      }
    });

    console.log('📝 [SignupService] Raw Supabase response data:', data);
    console.log('❌ [SignupService] Raw Supabase error:', error);

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    if (data.user) {
      console.log('✅ [SignupService] User created:', data.user.id);
      return {
        success: true,
        userId: data.user.id
      };
    }

    return {
      success: false,
      error: 'No user data returned'
    };
  }
}
