
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AssetInsert = Database['public']['Tables']['assets']['Insert'];
type AssetRow = Database['public']['Tables']['assets']['Row'];

export interface CreateAssetData {
  device_type: string;
  brand: string;
  model: string;
  serial_number: string;
  status: string;
  location?: string | null;
  assigned_to?: string | null;
  purchase_price?: number | null;
  purchase_date?: string | null;
  warranty_expiry?: string | null;
  notes?: string | null;
}

export class AssetService {
  private static validateEnums(data: CreateAssetData): void {
    const validDeviceTypes = [
      'laptop', 'desktop', 'server', 'monitor', 'tablet', 'smartphone',
      'network_switch', 'router', 'printer', 'scanner', 'projector', 'other'
    ];
    
    const validStatuses = [
      'active', 'inactive', 'maintenance', 'retired', 'missing', 'damaged'
    ];

    if (!validDeviceTypes.includes(data.device_type)) {
      throw new Error(`Invalid device type: ${data.device_type}`);
    }

    if (!validStatuses.includes(data.status)) {
      throw new Error(`Invalid status: ${data.status}`);
    }
  }

  private static validateRequiredFields(data: CreateAssetData): void {
    if (!data.device_type?.trim()) {
      throw new Error('Device type is required');
    }
    if (!data.brand?.trim()) {
      throw new Error('Brand is required');
    }
    if (!data.model?.trim()) {
      throw new Error('Model is required');
    }
    if (!data.serial_number?.trim()) {
      throw new Error('Serial number is required');
    }
    if (!data.status?.trim()) {
      throw new Error('Status is required');
    }
  }

  static async createAsset(data: CreateAssetData): Promise<AssetRow> {
    console.log('🔧 AssetService: Starting asset creation with data:', data);

    try {
      // Validate input data
      this.validateRequiredFields(data);
      this.validateEnums(data);

      // Generate unique asset tag
      const assetTag = `AST-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Prepare data for database insertion
      const assetData: AssetInsert = {
        device_type: data.device_type as Database['public']['Enums']['device_type'],
        status: data.status as Database['public']['Enums']['device_status'],
        brand: data.brand.trim(),
        model: data.model.trim(),
        serial_number: data.serial_number.trim(),
        location: data.location?.trim() || null,
        assigned_to: data.assigned_to?.trim() || null,
        purchase_price: data.purchase_price || null,
        purchase_date: data.purchase_date || null,
        warranty_expiry: data.warranty_expiry || null,
        notes: data.notes?.trim() || null,
        asset_tag: assetTag,
      };

      console.log('💾 AssetService: Inserting asset data:', assetData);

      // Insert into database
      const { data: insertedAsset, error } = await supabase
        .from('assets')
        .insert(assetData)
        .select()
        .single();

      if (error) {
        console.error('❌ AssetService: Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!insertedAsset) {
        throw new Error('No data returned from database after insertion');
      }

      console.log('✅ AssetService: Asset created successfully:', insertedAsset);
      return insertedAsset;

    } catch (error) {
      console.error('❌ AssetService: Asset creation failed:', error);
      throw error;
    }
  }

  static async getAllAssets(): Promise<AssetRow[]> {
    console.log('📥 AssetService: Fetching all assets...');

    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ AssetService: Error fetching assets:', error);
        throw new Error(`Failed to fetch assets: ${error.message}`);
      }

      console.log('✅ AssetService: Fetched assets:', data?.length || 0);
      return data || [];

    } catch (error) {
      console.error('❌ AssetService: Failed to fetch assets:', error);
      throw error;
    }
  }

  static async updateAsset(id: string, updates: Partial<AssetInsert>): Promise<AssetRow> {
    console.log('🔄 AssetService: Updating asset:', id, updates);

    try {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ AssetService: Update error:', error);
        throw new Error(`Failed to update asset: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from update operation');
      }

      console.log('✅ AssetService: Asset updated successfully:', data);
      return data;

    } catch (error) {
      console.error('❌ AssetService: Update failed:', error);
      throw error;
    }
  }

  static async deleteAsset(id: string): Promise<void> {
    console.log('🗑️ AssetService: Deleting asset:', id);

    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ AssetService: Delete error:', error);
        throw new Error(`Failed to delete asset: ${error.message}`);
      }

      console.log('✅ AssetService: Asset deleted successfully');

    } catch (error) {
      console.error('❌ AssetService: Delete failed:', error);
      throw error;
    }
  }
}
