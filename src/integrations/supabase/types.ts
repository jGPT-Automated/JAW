export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          agent_id: string | null
          agent_name: string
          created_at: string
          event_type: string
          id: string
          message: string
          metadata: Json | null
        }
        Insert: {
          agent_id?: string | null
          agent_name: string
          created_at?: string
          event_type?: string
          id?: string
          message: string
          metadata?: Json | null
        }
        Update: {
          agent_id?: string | null
          agent_name?: string
          created_at?: string
          event_type?: string
          id?: string
          message?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_credentials: {
        Row: {
          agent_id: string
          inbound_token: string | null
          telegram_bot_token: string | null
          updated_at: string
          webhook_secret: string | null
        }
        Insert: {
          agent_id: string
          inbound_token?: string | null
          telegram_bot_token?: string | null
          updated_at?: string
          webhook_secret?: string | null
        }
        Update: {
          agent_id?: string
          inbound_token?: string | null
          telegram_bot_token?: string | null
          updated_at?: string
          webhook_secret?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_credentials_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_messages: {
        Row: {
          channel: string
          content: string
          conversation_id: string
          created_at: string
          from_agent_id: string | null
          from_kind: string
          from_label: string | null
          id: string
          metadata: Json
          parent_message_id: string | null
          to_agent_id: string | null
          to_kind: string
          to_label: string | null
        }
        Insert: {
          channel: string
          content: string
          conversation_id?: string
          created_at?: string
          from_agent_id?: string | null
          from_kind: string
          from_label?: string | null
          id?: string
          metadata?: Json
          parent_message_id?: string | null
          to_agent_id?: string | null
          to_kind: string
          to_label?: string | null
        }
        Update: {
          channel?: string
          content?: string
          conversation_id?: string
          created_at?: string
          from_agent_id?: string | null
          from_kind?: string
          from_label?: string | null
          id?: string
          metadata?: Json
          parent_message_id?: string | null
          to_agent_id?: string | null
          to_kind?: string
          to_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_from_agent_id_fkey"
            columns: ["from_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "agent_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_messages_to_agent_id_fkey"
            columns: ["to_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          avatar_url: string | null
          connections: string[] | null
          created_at: string
          current_task: string | null
          daily_message_limit: number
          description: string | null
          id: string
          is_user_added: boolean
          last_heartbeat: string | null
          min_seconds_between_messages: number
          model: string | null
          name: string
          provider: string
          reports_to: string | null
          status: string
          success_rate: number | null
          system_instructions: string | null
          tasks_completed: number | null
          telegram_chat_id: string | null
          telegram_enabled: boolean
          type: string
          uptime_hours: number | null
          webhook_enabled: boolean
          webhook_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          connections?: string[] | null
          created_at?: string
          current_task?: string | null
          daily_message_limit?: number
          description?: string | null
          id?: string
          is_user_added?: boolean
          last_heartbeat?: string | null
          min_seconds_between_messages?: number
          model?: string | null
          name: string
          provider?: string
          reports_to?: string | null
          status?: string
          success_rate?: number | null
          system_instructions?: string | null
          tasks_completed?: number | null
          telegram_chat_id?: string | null
          telegram_enabled?: boolean
          type?: string
          uptime_hours?: number | null
          webhook_enabled?: boolean
          webhook_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          connections?: string[] | null
          created_at?: string
          current_task?: string | null
          daily_message_limit?: number
          description?: string | null
          id?: string
          is_user_added?: boolean
          last_heartbeat?: string | null
          min_seconds_between_messages?: number
          model?: string | null
          name?: string
          provider?: string
          reports_to?: string | null
          status?: string
          success_rate?: number | null
          system_instructions?: string | null
          tasks_completed?: number | null
          telegram_chat_id?: string | null
          telegram_enabled?: boolean
          type?: string
          uptime_hours?: number | null
          webhook_enabled?: boolean
          webhook_url?: string | null
        }
        Relationships: []
      }
      message_queue: {
        Row: {
          agent_id: string
          attempts: number
          conversation_id: string | null
          created_at: string
          from_agent_id: string | null
          id: string
          last_error: string | null
          parent_message_id: string | null
          payload: string
          reply_channel: string
          reply_chat_id: string | null
          scheduled_for: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          attempts?: number
          conversation_id?: string | null
          created_at?: string
          from_agent_id?: string | null
          id?: string
          last_error?: string | null
          parent_message_id?: string | null
          payload: string
          reply_channel?: string
          reply_chat_id?: string | null
          scheduled_for?: string
          source: string
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          attempts?: number
          conversation_id?: string | null
          created_at?: string
          from_agent_id?: string | null
          id?: string
          last_error?: string | null
          parent_message_id?: string | null
          payload?: string
          reply_channel?: string
          reply_chat_id?: string | null
          scheduled_for?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_queue_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_queue_from_agent_id_fkey"
            columns: ["from_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_queue_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "agent_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_tasks: {
        Row: {
          assigned_agent: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          progress: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_agent?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          progress?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_agent?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          progress?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      telegram_bot_state: {
        Row: {
          agent_id: string
          last_polled_at: string
          update_offset: number
        }
        Insert: {
          agent_id: string
          last_polled_at?: string
          update_offset?: number
        }
        Update: {
          agent_id?: string
          last_polled_at?: string
          update_offset?: number
        }
        Relationships: [
          {
            foreignKeyName: "telegram_bot_state_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agents"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
