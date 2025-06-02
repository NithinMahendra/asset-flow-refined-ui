
// Updated type definitions for asset management tables
// These match the actual database schema that was just created

export interface Asset {
  id: string;
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
  created_at: string;
  updated_at: string;
  // Legacy fields for compatibility
  name: string;
  category: string;
  assignee: string;
  value?: number;
  last_updated: string; // Add this field for backward compatibility
}

export interface AssetRequest {
  id: string;
  user_id: string;
  asset_id?: string;
  request_type: string;
  description: string;
  status: string;
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
}

export interface AssetAssignment {
  id: string;
  asset_id: string;
  user_id: string;
  assigned_at: string;
  assigned_by: string;
  returned_at?: string;
  status: string;
}

export interface ActivityLog {
  id: string;
  asset_id?: string;
  user_id?: string;
  action: string;
  details?: any;
  timestamp: string;
  // Legacy fields for compatibility
  type?: string;
}

export interface Notification {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  // Legacy fields for compatibility
  timestamp: string;
}

export interface EmployeeProfile {
  id: string;
  user_id: string;
  employee_id: string;
  first_name: string;
  email: string;
  created_at?: string;
}
