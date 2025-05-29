export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      asset_requests: {
        Row: {
          approved_by: string | null
          approved_date: string | null
          asset_type: string
          brand: string | null
          created_at: string | null
          denial_reason: string | null
          employee_id: string
          fulfilled_by: string | null
          fulfilled_date: string | null
          id: string
          justification: string
          model: string | null
          notes: string | null
          priority: string | null
          requested_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          approved_date?: string | null
          asset_type: string
          brand?: string | null
          created_at?: string | null
          denial_reason?: string | null
          employee_id: string
          fulfilled_by?: string | null
          fulfilled_date?: string | null
          id?: string
          justification: string
          model?: string | null
          notes?: string | null
          priority?: string | null
          requested_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          approved_date?: string | null
          asset_type?: string
          brand?: string | null
          created_at?: string | null
          denial_reason?: string | null
          employee_id?: string
          fulfilled_by?: string | null
          fulfilled_date?: string | null
          id?: string
          justification?: string
          model?: string | null
          notes?: string | null
          priority?: string | null
          requested_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_requests_fulfilled_by_fkey"
            columns: ["fulfilled_by"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_tag: string | null
          assigned_to: string | null
          brand: string
          created_at: string | null
          device_type: Database["public"]["Enums"]["device_type"]
          employee_id: string | null
          id: string
          location: string | null
          model: string
          notes: string | null
          purchase_date: string | null
          purchase_price: number | null
          serial_number: string
          status: Database["public"]["Enums"]["device_status"] | null
          updated_at: string | null
          warranty_expiry: string | null
        }
        Insert: {
          asset_tag?: string | null
          assigned_to?: string | null
          brand: string
          created_at?: string | null
          device_type: Database["public"]["Enums"]["device_type"]
          employee_id?: string | null
          id?: string
          location?: string | null
          model: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number: string
          status?: Database["public"]["Enums"]["device_status"] | null
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Update: {
          asset_tag?: string | null
          assigned_to?: string | null
          brand?: string
          created_at?: string | null
          device_type?: Database["public"]["Enums"]["device_type"]
          employee_id?: string | null
          id?: string
          location?: string | null
          model?: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string
          status?: Database["public"]["Enums"]["device_status"] | null
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      device_components: {
        Row: {
          asset_id: string | null
          component_name: string
          component_type: string
          created_at: string | null
          id: string
          is_replaceable: boolean | null
          specifications: Json | null
        }
        Insert: {
          asset_id?: string | null
          component_name: string
          component_type: string
          created_at?: string | null
          id?: string
          is_replaceable?: boolean | null
          specifications?: Json | null
        }
        Update: {
          asset_id?: string | null
          component_name?: string
          component_type?: string
          created_at?: string | null
          id?: string
          is_replaceable?: boolean | null
          specifications?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "device_components_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          employee_id: string
          first_name: string
          hire_date: string | null
          id: string
          last_name: string
          manager_id: string | null
          phone: string | null
          position: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          employee_id: string
          first_name: string
          hire_date?: string | null
          id?: string
          last_name: string
          manager_id?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          employee_id?: string
          first_name?: string
          hire_date?: string | null
          id?: string
          last_name?: string
          manager_id?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          asset_id: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          id: string
          maintenance_date: string
          maintenance_type: string
          performed_by: string | null
        }
        Insert: {
          asset_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          maintenance_date: string
          maintenance_type: string
          performed_by?: string | null
        }
        Update: {
          asset_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          maintenance_date?: string
          maintenance_type?: string
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_asset_id: string | null
          related_request_id: string | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_asset_id?: string | null
          related_request_id?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_asset_id?: string | null
          related_request_id?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_asset_id_fkey"
            columns: ["related_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_request_id_fkey"
            columns: ["related_request_id"]
            isOneToOne: false
            referencedRelation: "asset_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_history: {
        Row: {
          asset_id: string | null
          created_at: string | null
          id: string
          scan_confidence: number | null
          scan_data: Json | null
          scanned_by: string | null
        }
        Insert: {
          asset_id?: string | null
          created_at?: string | null
          id?: string
          scan_confidence?: number | null
          scan_data?: Json | null
          scanned_by?: string | null
        }
        Update: {
          asset_id?: string | null
          created_at?: string | null
          id?: string
          scan_confidence?: number | null
          scan_data?: Json | null
          scanned_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_history_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      device_status:
        | "active"
        | "inactive"
        | "maintenance"
        | "retired"
        | "missing"
        | "damaged"
      device_type:
        | "laptop"
        | "desktop"
        | "server"
        | "monitor"
        | "tablet"
        | "smartphone"
        | "network_switch"
        | "router"
        | "printer"
        | "scanner"
        | "projector"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      device_status: [
        "active",
        "inactive",
        "maintenance",
        "retired",
        "missing",
        "damaged",
      ],
      device_type: [
        "laptop",
        "desktop",
        "server",
        "monitor",
        "tablet",
        "smartphone",
        "network_switch",
        "router",
        "printer",
        "scanner",
        "projector",
        "other",
      ],
    },
  },
} as const
