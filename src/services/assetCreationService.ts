
import { supabase } from '@/integrations/supabase/client';
import { EmployeeService } from './employeeService';
import { Database } from '@/integrations/supabase/types';

export interface CreateAssetData {
  device_type: Database['public']['Enums']['device_type'];
  brand: string;
  model: string;
  serial_number: string;
  status: Database['public']['Enums']['asset_status'];
  location?: string;
  assigned_to?: string;
  purchase_price?: number;
  purchase_date?: string;
  warranty_expiry?: string;
  notes?: string;
  qr_code?: string;
}

export class AssetCreationService {
  static async createAndStoreAsset(assetData: CreateAssetData): Promise<{ success: boolean; asset?: any; error?: string }> {
    try {
      console.log('Creating asset in database:', assetData);
      
      // Step 1: Create asset in database
      const { data: createdAsset, error: createError } = await supabase
        .from('assets')
        .insert(assetData)
        .select()
        .single();

      if (createError) {
        console.error('Error creating asset in database:', createError);
        return { success: false, error: createError.message };
      }

      console.log('Asset created in database:', createdAsset);

      // Step 2: Store in local storage
      const localStorageSuccess = await EmployeeService.addAssetToMyLocalAssets(createdAsset);
      
      if (!localStorageSuccess) {
        console.warn('Failed to store asset in local storage, but database creation succeeded');
        // Don't fail the entire operation if local storage fails
      }

      return { success: true, asset: createdAsset };
    } catch (error) {
      console.error('Error in createAndStoreAsset:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}
