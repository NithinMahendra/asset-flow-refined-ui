
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
      
      // Prepare data for database insertion
      const dbAssetData = {
        device_type: assetData.device_type,
        brand: assetData.brand,
        model: assetData.model,
        serial_number: assetData.serial_number,
        status: assetData.status,
        location: assetData.location || null,
        assigned_to: assetData.assigned_to || null,
        purchase_price: assetData.purchase_price || null,
        purchase_date: assetData.purchase_date || null,
        warranty_expiry: assetData.warranty_expiry || null,
        notes: assetData.notes || null,
        qr_code: assetData.qr_code || null
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

      // Step 2: Log the activity
      await supabase
        .from('activity_log')
        .insert({
          asset_id: createdAsset.id,
          action: 'Asset Created',
          details: {
            asset_name: `${createdAsset.brand} ${createdAsset.model}`,
            serial_number: createdAsset.serial_number,
            device_type: createdAsset.device_type
          }
        });

      // Step 3: Store in local storage (optional, for offline support)
      try {
        await EmployeeService.addAssetToMyLocalAssets(createdAsset);
      } catch (localError) {
        console.warn('Failed to store asset in local storage:', localError);
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
