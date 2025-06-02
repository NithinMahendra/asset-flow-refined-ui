import { supabase } from '@/integrations/supabase/client';

export interface CreateAssetData {
  device_type: string;
  brand: string;
  model: string;
  serial_number: string;
  status?: string;
  location?: string;
  assigned_to?: string;
  purchase_price?: number;
  purchase_date?: string;
  warranty_expiry?: string;
  notes?: string;
}

export class AssetService {
  static async createAsset(assetData: CreateAssetData): Promise<{ success: boolean; asset?: any; error?: string }> {
    console.log('🎯 AssetService: Creating asset with data:', assetData);
    
    try {
      // Transform data to match database schema
      const dbData = {
        name: `${assetData.brand} ${assetData.model}`,
        category: assetData.device_type || 'Other',
        device_type: assetData.device_type,
        brand: assetData.brand,
        model: assetData.model,
        serial_number: assetData.serial_number,
        status: assetData.status || 'active',
        location: assetData.location,
        assigned_to: null, // Set to null to avoid UUID validation issues
        value: assetData.purchase_price,
        purchase_date: assetData.purchase_date || new Date().toISOString().split('T')[0],
        warranty_expiry: assetData.warranty_expiry,
        description: assetData.notes
      };

      const { data, error } = await supabase
        .from('assets')
        .insert(dbData)
        .select()
        .single();

      if (error) {
        console.error('❌ AssetService: Database error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ AssetService: Asset created successfully:', data);
      return { success: true, asset: data };
    } catch (error) {
      console.error('❌ AssetService: Unexpected error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  static async getAllAssets(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }

    return data || [];
  }

  static async updateAsset(id: string, updates: Partial<AssetUpdate>): Promise<void> {
    const { error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  }

  static async deleteAsset(id: string): Promise<void> {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  }
}

export type { Asset, AssetInsert, AssetUpdate };
