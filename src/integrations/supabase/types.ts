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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      exercises: {
        Row: {
          cadence: string
          created_at: string
          id: string
          methods: string | null
          name: string
          order_index: number
          series: string
          workout_day_id: string
        }
        Insert: {
          cadence: string
          created_at?: string
          id?: string
          methods?: string | null
          name: string
          order_index?: number
          series: string
          workout_day_id: string
        }
        Update: {
          cadence?: string
          created_at?: string
          id?: string
          methods?: string | null
          name?: string
          order_index?: number
          series?: string
          workout_day_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_day_id_fkey"
            columns: ["workout_day_id"]
            isOneToOne: false
            referencedRelation: "workout_days"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          age: number
          bmi: number | null
          body_fat: number | null
          created_at: string
          gender: string
          id: string
          muscle_mass: number | null
          name: string
          objective: string
          restrictions: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          age: number
          bmi?: number | null
          body_fat?: number | null
          created_at?: string
          gender: string
          id?: string
          muscle_mass?: number | null
          name: string
          objective: string
          restrictions?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          age?: number
          bmi?: number | null
          body_fat?: number | null
          created_at?: string
          gender?: string
          id?: string
          muscle_mass?: number | null
          name?: string
          objective?: string
          restrictions?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      workout_days: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          workout_plan_id: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
          workout_plan_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_days_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string
          id: string
          recommendations: string | null
          student_id: string
          training_methods: string | null
          updated_at: string
          week_day1: string | null
          week_day2: string | null
          week_day3: string | null
          week_day4: string | null
          week_day5: string | null
          week1_reps: string | null
          week1_rest: string | null
          week2_reps: string | null
          week2_rest: string | null
          week3_reps: string | null
          week3_rest: string | null
          week4_reps: string | null
          week4_rest: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          recommendations?: string | null
          student_id: string
          training_methods?: string | null
          updated_at?: string
          week_day1?: string | null
          week_day2?: string | null
          week_day3?: string | null
          week_day4?: string | null
          week_day5?: string | null
          week1_reps?: string | null
          week1_rest?: string | null
          week2_reps?: string | null
          week2_rest?: string | null
          week3_reps?: string | null
          week3_rest?: string | null
          week4_reps?: string | null
          week4_rest?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          recommendations?: string | null
          student_id?: string
          training_methods?: string | null
          updated_at?: string
          week_day1?: string | null
          week_day2?: string | null
          week_day3?: string | null
          week_day4?: string | null
          week_day5?: string | null
          week1_reps?: string | null
          week1_rest?: string | null
          week2_reps?: string | null
          week2_rest?: string | null
          week3_reps?: string | null
          week3_rest?: string | null
          week4_reps?: string | null
          week4_rest?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
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
