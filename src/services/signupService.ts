
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
    try {
      console.log('🚀 [SignupService] Starting employee account creation');
      console.log('📧 [SignupService] Email:', email);
      console.log('👤 [SignupService] First name:', firstName);

      // Step 1: Create the user account
      console.log('📝 [SignupService] Step 1: Creating user account...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            first_name: firstName.trim(),
            role: 'employee',
            department: 'General'
          }
        }
      });

      if (authError) {
        console.error('❌ [SignupService] Auth error:', authError);
        return {
          success: false,
          error: this.parseAuthError(authError)
        };
      }

      if (!authData.user) {
        console.error('❌ [SignupService] No user data returned');
        return {
          success: false,
          error: 'Failed to create user account'
        };
      }

      console.log('✅ [SignupService] User created successfully:', authData.user.id);

      // Step 2: Verify profile creation (with fallback)
      console.log('🔍 [SignupService] Step 2: Verifying profile creation...');
      const profileCreated = await this.ensureProfileExists(authData.user.id, email, firstName);

      if (!profileCreated) {
        console.warn('⚠️ [SignupService] Profile creation failed, but user account exists');
        // Don't fail the signup if profile creation fails - user can still log in
      }

      console.log('🎉 [SignupService] Account creation completed successfully');
      return {
        success: true,
        userId: authData.user.id
      };

    } catch (error: any) {
      console.error('💥 [SignupService] Unexpected error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  private static async ensureProfileExists(
    userId: string, 
    email: string, 
    firstName: string
  ): Promise<boolean> {
    try {
      // Wait a moment for triggers to process
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('🔍 [SignupService] Checking if profile exists...');
      const { data: existingProfile, error: checkError } = await supabase
        .from('employee_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) {
        console.error('❌ [SignupService] Error checking profile:', checkError);
        return false;
      }

      if (existingProfile) {
        console.log('✅ [SignupService] Profile already exists');
        return true;
      }

      console.log('📝 [SignupService] Creating profile manually...');
      const { error: insertError } = await supabase
        .from('employee_profiles')
        .insert({
          user_id: userId,
          employee_id: `EMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          first_name: firstName,
          last_name: '',
          email: email,
          department: 'General'
        });

      if (insertError) {
        console.error('❌ [SignupService] Error creating profile:', insertError);
        return false;
      }

      console.log('✅ [SignupService] Profile created successfully');
      return true;

    } catch (error) {
      console.error('💥 [SignupService] Error in profile creation:', error);
      return false;
    }
  }

  private static parseAuthError(error: any): string {
    if (!error?.message) {
      return 'An unexpected error occurred';
    }

    const message = error.message.toLowerCase();

    if (message.includes('email') && message.includes('invalid')) {
      return 'This email address is not supported. Please use a standard email provider like Gmail, Outlook, or Yahoo.';
    }

    if (message.includes('user already registered')) {
      return 'An account with this email already exists. Please try logging in instead.';
    }

    if (message.includes('password')) {
      return 'Password must be at least 6 characters long.';
    }

    if (message.includes('weak password')) {
      return 'Password is too weak. Please use a stronger password with at least 6 characters.';
    }

    // Return the original error message if we can't parse it
    return error.message;
  }
}
