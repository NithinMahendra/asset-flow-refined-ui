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
      activity_log: {
        Row: {
          action: string
          asset_id: string | null
          details: Json | null
          id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          asset_id?: string | null
          details?: Json | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          asset_id?: string | null
          details?: Json | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_assignments: {
        Row: {
          asset_id: string
          assigned_at: string | null
          assigned_by: string
          id: string
          returned_at: string | null
          status: Database["public"]["Enums"]["assignment_status"]
          user_id: string
        }
        Insert: {
          asset_id: string
          assigned_at?: string | null
          assigned_by: string
          id?: string
          returned_at?: string | null
          status?: Database["public"]["Enums"]["assignment_status"]
          user_id: string
        }
        Update: {
          asset_id?: string
          assigned_at?: string | null
          assigned_by?: string
          id?: string
          returned_at?: string | null
          status?: Database["public"]["Enums"]["assignment_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_assignments_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_requests: {
        Row: {
          asset_id: string | null
          description: string
          id: string
          processed_at: string | null
          processed_by: string | null
          request_type: Database["public"]["Enums"]["request_type"]
          requested_at: string | null
          status: Database["public"]["Enums"]["request_status"]
          user_id: string
        }
        Insert: {
          asset_id?: string | null
          description: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          request_type: Database["public"]["Enums"]["request_type"]
          requested_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          user_id: string
        }
        Update: {
          asset_id?: string | null
          description?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          request_type?: Database["public"]["Enums"]["request_type"]
          requested_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          user_id?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
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
          qr_code: string | null
          serial_number: string
          status: Database["public"]["Enums"]["asset_status"]
          updated_at: string | null
          warranty_expiry: string | null
        }
        Insert: {
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
          qr_code?: string | null
          serial_number: string
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Update: {
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
          qr_code?: string | null
          serial_number?: string
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Relationships: []
      }
      employee_profiles: {
        Row: {
          created_at: string | null
          email: string
          employee_id: string
          first_name: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          employee_id: string
          first_name: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          employee_id?: string
          first_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      asset_status:
        | "active"
        | "inactive"
        | "maintenance"
        | "retired"
        | "missing"
        | "damaged"
      assignment_status: "active" | "returned" | "pending"
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
      request_status: "pending" | "approved" | "denied" | "completed"
      request_type: "assignment" | "maintenance" | "replacement" | "return"
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
      asset_status: [
        "active",
        "inactive",
        "maintenance",
        "retired",
        "missing",
        "damaged",
      ],
      assignment_status: ["active", "returned", "pending"],
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
      request_status: ["pending", "approved", "denied", "completed"],
      request_type: ["assignment", "maintenance", "replacement", "return"],
    },
  },
} as const
