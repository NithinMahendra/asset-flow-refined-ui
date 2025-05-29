
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Asset = Database['public']['Tables']['assets']['Row'];
type AssetInsert = Database['public']['Tables']['assets']['Insert'];
type AssetUpdate = Database['public']['Tables']['assets']['Update'];

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
  static async createAsset(assetData: CreateAssetData): Promise<Asset | undefined> {
    console.log('🎯 AssetService: Creating asset with data:', assetData);
    
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert({
          device_type: assetData.device_type as any,
          brand: assetData.brand,
          model: assetData.model,
          serial_number: assetData.serial_number,
          status: (assetData.status as any) || 'active',
          location: assetData.location,
          assigned_to: assetData.assigned_to,
          purchase_price: assetData.purchase_price,
          purchase_date: assetData.purchase_date,
          warranty_expiry: assetData.warranty_expiry,
          notes: assetData.notes
        })
        .select()
        .single();

      if (error) {
        console.error('❌ AssetService: Error creating asset:', error);
        throw error;
      }

      console.log('✅ AssetService: Asset created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ AssetService: Exception during asset creation:', error);
      throw error;
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
