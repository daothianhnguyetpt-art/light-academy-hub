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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academic_verifications: {
        Row: {
          credential_name: string
          end_date: string | null
          evidence_hash: string | null
          evidence_url: string | null
          field_of_study: string | null
          id: string
          institution_id: string | null
          rejection_reason: string | null
          requested_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          start_date: string | null
          status: string | null
          user_id: string
          verification_type: string
        }
        Insert: {
          credential_name: string
          end_date?: string | null
          evidence_hash?: string | null
          evidence_url?: string | null
          field_of_study?: string | null
          id?: string
          institution_id?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string | null
          status?: string | null
          user_id: string
          verification_type: string
        }
        Update: {
          credential_name?: string
          end_date?: string | null
          evidence_hash?: string | null
          evidence_url?: string | null
          field_of_study?: string | null
          id?: string
          institution_id?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string | null
          status?: string | null
          user_id?: string
          verification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_verifications_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_verifications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appreciates: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appreciates_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appreciates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          course_id: string | null
          course_name: string
          holder_id: string
          id: string
          institution: string | null
          issued_at: string | null
          issuing_institution_id: string | null
          metadata: Json | null
          recognition_count: number | null
          score: number | null
          token_id: string | null
          verified: boolean | null
        }
        Insert: {
          course_id?: string | null
          course_name: string
          holder_id: string
          id?: string
          institution?: string | null
          issued_at?: string | null
          issuing_institution_id?: string | null
          metadata?: Json | null
          recognition_count?: number | null
          score?: number | null
          token_id?: string | null
          verified?: boolean | null
        }
        Update: {
          course_id?: string | null
          course_name?: string
          holder_id?: string
          id?: string
          institution?: string | null
          issued_at?: string | null
          issuing_institution_id?: string | null
          metadata?: Json | null
          recognition_count?: number | null
          score?: number | null
          token_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_holder_id_fkey"
            columns: ["holder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_issuing_institution_id_fkey"
            columns: ["issuing_institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      class_registrations: {
        Row: {
          attended: boolean | null
          class_id: string
          id: string
          registered_at: string | null
          reminder_enabled: boolean | null
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          class_id: string
          id?: string
          registered_at?: string | null
          reminder_enabled?: boolean | null
          user_id: string
        }
        Update: {
          attended?: boolean | null
          class_id?: string
          id?: string
          registered_at?: string | null
          reminder_enabled?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_registrations_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "live_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          accessible_to: string | null
          accreditation_status: string | null
          category: string | null
          created_at: string | null
          description: string | null
          duration_hours: number | null
          id: string
          institution: string | null
          institution_id: string | null
          instructor_id: string | null
          level: string | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          accessible_to?: string | null
          accreditation_status?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          institution?: string | null
          institution_id?: string | null
          instructor_id?: string | null
          level?: string | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          accessible_to?: string | null
          accreditation_status?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          institution?: string | null
          institution_id?: string | null
          instructor_id?: string | null
          level?: string | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cross_border_recognitions: {
        Row: {
          certificate_id: string
          equivalent_credential: string | null
          id: string
          notes: string | null
          recognition_type: string
          recognized_at: string | null
          recognized_by: string | null
          recognizing_institution_id: string
          valid_until: string | null
        }
        Insert: {
          certificate_id: string
          equivalent_credential?: string | null
          id?: string
          notes?: string | null
          recognition_type: string
          recognized_at?: string | null
          recognized_by?: string | null
          recognizing_institution_id: string
          valid_until?: string | null
        }
        Update: {
          certificate_id?: string
          equivalent_credential?: string | null
          id?: string
          notes?: string | null
          recognition_type?: string
          recognized_at?: string | null
          recognized_by?: string | null
          recognizing_institution_id?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cross_border_recognitions_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_border_recognitions_recognized_by_fkey"
            columns: ["recognized_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_border_recognitions_recognizing_institution_id_fkey"
            columns: ["recognizing_institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_members: {
        Row: {
          department: string | null
          id: string
          institution_id: string
          joined_at: string | null
          member_role: string
          title: string | null
          user_id: string
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          department?: string | null
          id?: string
          institution_id: string
          joined_at?: string | null
          member_role: string
          title?: string | null
          user_id: string
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          department?: string | null
          id?: string
          institution_id?: string
          joined_at?: string | null
          member_role?: string
          title?: string | null
          user_id?: string
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institution_members_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_members_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          address: string | null
          city: string | null
          contribution_score: number | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          founding_year: number | null
          id: string
          institution_type: string
          logo_url: string | null
          metadata: Json | null
          name: string
          phone: string | null
          region: string | null
          updated_at: string | null
          verified: boolean | null
          wallet_address: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contribution_score?: number | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          founding_year?: number | null
          id?: string
          institution_type: string
          logo_url?: string | null
          metadata?: Json | null
          name: string
          phone?: string | null
          region?: string | null
          updated_at?: string | null
          verified?: boolean | null
          wallet_address?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contribution_score?: number | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          founding_year?: number | null
          id?: string
          institution_type?: string
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          phone?: string | null
          region?: string | null
          updated_at?: string | null
          verified?: boolean | null
          wallet_address?: string | null
          website?: string | null
        }
        Relationships: []
      }
      library_resources: {
        Row: {
          author: string | null
          category: string | null
          created_at: string | null
          description: string | null
          downloads: number | null
          file_url: string | null
          id: string
          page_count: number | null
          rating: number | null
          resource_type: string | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_url?: string | null
          id?: string
          page_count?: number | null
          rating?: number | null
          resource_type?: string | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          author?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_url?: string | null
          id?: string
          page_count?: number | null
          rating?: number | null
          resource_type?: string | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      live_classes: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          instructor_id: string | null
          livestream_url: string | null
          max_participants: number | null
          meeting_platform: string | null
          meeting_url: string | null
          recording_url: string | null
          scheduled_at: string
          status: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_id?: string | null
          livestream_url?: string | null
          max_participants?: number | null
          meeting_platform?: string | null
          meeting_url?: string | null
          recording_url?: string | null
          scheduled_at: string
          status?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_id?: string | null
          livestream_url?: string | null
          max_participants?: number | null
          meeting_platform?: string | null
          meeting_url?: string | null
          recording_url?: string | null
          scheduled_at?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_classes_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partnerships: {
        Row: {
          approved_by_a: boolean | null
          approved_by_b: boolean | null
          created_at: string | null
          description: string | null
          ended_at: string | null
          established_at: string | null
          id: string
          institution_a_id: string
          institution_b_id: string
          partnership_type: string
          status: string | null
          terms: Json | null
        }
        Insert: {
          approved_by_a?: boolean | null
          approved_by_b?: boolean | null
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          established_at?: string | null
          id?: string
          institution_a_id: string
          institution_b_id: string
          partnership_type: string
          status?: string | null
          terms?: Json | null
        }
        Update: {
          approved_by_a?: boolean | null
          approved_by_b?: boolean | null
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          established_at?: string | null
          id?: string
          institution_a_id?: string
          institution_b_id?: string
          partnership_type?: string
          status?: string | null
          terms?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "partnerships_institution_a_id_fkey"
            columns: ["institution_a_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnerships_institution_b_id_fkey"
            columns: ["institution_b_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          location: string | null
          location_lat: number | null
          location_lng: number | null
          media_type: string | null
          media_url: string | null
          post_type: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          media_type?: string | null
          media_url?: string | null
          post_type?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          media_type?: string | null
          media_url?: string | null
          post_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_title: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          knowledge_score: number | null
          light_law_accepted_at: string | null
          primary_institution_id: string | null
          total_points: number | null
          updated_at: string | null
          verification_level: string | null
          wallet_address: string | null
        }
        Insert: {
          academic_title?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          knowledge_score?: number | null
          light_law_accepted_at?: string | null
          primary_institution_id?: string | null
          total_points?: number | null
          updated_at?: string | null
          verification_level?: string | null
          wallet_address?: string | null
        }
        Update: {
          academic_title?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          knowledge_score?: number | null
          light_law_accepted_at?: string | null
          primary_institution_id?: string | null
          total_points?: number | null
          updated_at?: string | null
          verification_level?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_primary_institution_id_fkey"
            columns: ["primary_institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          awarded_by: string | null
          badge_color: string | null
          badge_icon: string | null
          created_at: string | null
          description: string | null
          id: string
          points_amount: number | null
          reward_type: string
          title: string
          user_id: string
        }
        Insert: {
          awarded_by?: string | null
          badge_color?: string | null
          badge_icon?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          points_amount?: number | null
          reward_type: string
          title: string
          user_id: string
        }
        Update: {
          awarded_by?: string | null
          badge_color?: string | null
          badge_icon?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          points_amount?: number | null
          reward_type?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_bookmarks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          video_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          video_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_ratings: {
        Row: {
          created_at: string | null
          id: string
          rating: number
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating: number
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_ratings_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          category: string | null
          course_id: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          institution: string | null
          instructor_id: string | null
          level: string | null
          rating: number | null
          thumbnail_url: string | null
          title: string
          video_url: string | null
          views: number | null
        }
        Insert: {
          category?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          institution?: string | null
          instructor_id?: string | null
          level?: string | null
          rating?: number | null
          thumbnail_url?: string | null
          title: string
          video_url?: string | null
          views?: number | null
        }
        Update: {
          category?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          institution?: string | null
          instructor_id?: string | null
          level?: string | null
          rating?: number | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_institution_admin: {
        Args: { _institution_id: string; _user_id: string }
        Returns: boolean
      }
      is_institution_member: {
        Args: { _institution_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "educator" | "learner"
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
    Enums: {
      app_role: ["admin", "moderator", "educator", "learner"],
    },
  },
} as const
