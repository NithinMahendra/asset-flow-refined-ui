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
      assets: {
        Row: {
          asset_tag: string | null
          assigned_to: string | null
          brand: string
          created_at: string | null
          device_type: Database["public"]["Enums"]["device_type"]
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
        Relationships: []
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
