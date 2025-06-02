
import { supabase } from '@/integrations/supabase/client';
import { EmployeeService } from './employeeService';

export interface CreateAssetData {
  device_type: string;
  brand: string;
  model: string;
  serial_number: string;
  status: string;
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
      
      // Transform data to match the database schema
      const dbAssetData = {
        name: `${assetData.brand} ${assetData.model}`,
        category: assetData.device_type || 'Other',
        device_type: assetData.device_type,
        brand: assetData.brand,
        model: assetData.model,
        serial_number: assetData.serial_number,
        status: assetData.status,
        location: assetData.location,
        // Only include assigned_to if it's a valid UUID, otherwise leave it null
        assigned_to: null, // Set to null for now to avoid UUID validation errors
        value: assetData.purchase_price,
        purchase_date: assetData.purchase_date || new Date().toISOString().split('T')[0],
        warranty_expiry: assetData.warranty_expiry,
        description: assetData.notes,
        qr_code: assetData.qr_code
      };

      // Step 1: Create asset in database
      const { data: createdAsset, error: createError } = await supabase
        .from('assets')
        .insert(dbAssetData)
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
