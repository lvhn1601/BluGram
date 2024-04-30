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
      comment_likes: {
        Row: {
          commentId: string
          created_at: string
          userId: string
        }
        Insert: {
          commentId: string
          created_at?: string
          userId: string
        }
        Update: {
          commentId?: string
          created_at?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "LikeComment_commentId_fkey"
            columns: ["commentId"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "LikeComment_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          created_at: string
          details: string | null
          id: string
          postId: string | null
          userId: string | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          postId?: string | null
          userId?: string | null
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          postId?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Comments_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comments_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          followBy: string
          userId: string
        }
        Insert: {
          created_at?: string
          followBy: string
          userId: string
        }
        Update: {
          created_at?: string
          followBy?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followBy_fkey"
            columns: ["followBy"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          postId: string
          userId: string
        }
        Insert: {
          created_at?: string
          postId: string
          userId: string
        }
        Update: {
          created_at?: string
          postId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "LikesPost_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "LikesPost_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          caption: string | null
          created_at: string
          creator: string | null
          id: string
          imagePath: string | null
          imageUrl: string | null
          location: string | null
          tags: string[] | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          creator?: string | null
          id?: string
          imagePath?: string | null
          imageUrl?: string | null
          location?: string | null
          tags?: string[] | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          creator?: string | null
          id?: string
          imagePath?: string | null
          imageUrl?: string | null
          location?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "Posts_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saves: {
        Row: {
          created_at: string
          postId: string
          userId: string
        }
        Insert: {
          created_at?: string
          postId: string
          userId: string
        }
        Update: {
          created_at?: string
          postId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Saves_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Saves_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          accountId: string | null
          bio: string | null
          created_at: string
          email: string
          id: string
          imageId: string | null
          imageUrl: string | null
          name: string | null
          username: string | null
        }
        Insert: {
          accountId?: string | null
          bio?: string | null
          created_at?: string
          email: string
          id?: string
          imageId?: string | null
          imageUrl?: string | null
          name?: string | null
          username?: string | null
        }
        Update: {
          accountId?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          id?: string
          imageId?: string | null
          imageUrl?: string | null
          name?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Users_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "users"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

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
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

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
    : never
