export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: number;
          title: string | null;
        };
        Insert: {
          id?: number;
          title?: string | null;
        };
        Update: {
          id?: number;
          title?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string | null;
          handle: string | null;
          id: string;
          profile_img_url: string | null;
          providers: string | null;
          user_name: string;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          handle?: string | null;
          id?: string;
          profile_img_url?: string | null;
          providers?: string | null;
          user_name: string;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          handle?: string | null;
          id?: string;
          profile_img_url?: string | null;
          providers?: string | null;
          user_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      recipes: {
        Row: {
          coffee_amount: number;
          created_at: string;
          grind_step: number;
          grind_step_memo: string | null;
          id: number;
          image_url: string | null;
          is_hot: boolean;
          is_ice: boolean;
          is_no_bloom: boolean;
          pour_count: number;
          raw_brewing_info: Json;
          recipe_description: string;
          recipe_name: string;
          updated_at: string | null;
          use_dripper: string;
          use_filter: string;
          user_id: string;
          water_amount: number;
          water_temperature: number;
          profiles?: Database["public"]["Tables"]["profiles"]["Row"];
        };
        Insert: {
          coffee_amount: number;
          created_at?: string;
          grind_step: number;
          grind_step_memo?: string | null;
          id?: number;
          image_url?: string | null;
          is_hot?: boolean;
          is_ice?: boolean;
          is_no_bloom: boolean;
          pour_count: number;
          raw_brewing_info: Json;
          recipe_description: string;
          recipe_name: string;
          updated_at?: string | null;
          use_dripper: string;
          use_filter: string;
          user_id: string;
          water_amount: number;
          water_temperature: number;
        };
        Update: {
          coffee_amount?: number;
          created_at?: string;
          grind_step?: number;
          grind_step_memo?: string | null;
          id?: number;
          image_url?: string | null;
          is_hot?: boolean;
          is_ice?: boolean;
          is_no_bloom?: boolean;
          pour_count?: number;
          raw_brewing_info?: Json;
          recipe_description?: string;
          recipe_name?: string;
          updated_at?: string | null;
          use_dripper?: string;
          use_filter?: string;
          user_id?: string;
          water_amount?: number;
          water_temperature?: number;
        };
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
