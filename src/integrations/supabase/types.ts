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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_feed: {
        Row: {
          action_type: string
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          related_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          related_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          related_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_feed_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_template_items: {
        Row: {
          checklist_template_id: string
          created_at: string
          description: string | null
          id: string
          is_required: boolean
          order_index: number
          title: string
        }
        Insert: {
          checklist_template_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean
          order_index?: number
          title: string
        }
        Update: {
          checklist_template_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_template_items_checklist_template_id_fkey"
            columns: ["checklist_template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          project_template_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          project_template_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          project_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_templates_project_template_id_fkey"
            columns: ["project_template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          document_id: string | null
          id: string
          mentioned_users: string[] | null
          parent_comment_id: string | null
          project_id: string | null
          task_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          document_id?: string | null
          id?: string
          mentioned_users?: string[] | null
          parent_comment_id?: string | null
          project_id?: string | null
          task_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          document_id?: string | null
          id?: string
          mentioned_users?: string[] | null
          parent_comment_id?: string | null
          project_id?: string | null
          task_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          industry: string | null
          metadata: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          industry?: string | null
          metadata?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          industry?: string | null
          metadata?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_members: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          conversation_type:
            | Database["public"]["Enums"]["conversation_type"]
            | null
          created_at: string | null
          created_by: string | null
          id: string
          participant_ids: string[] | null
          project_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          conversation_type?:
            | Database["public"]["Enums"]["conversation_type"]
            | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          participant_ids?: string[] | null
          project_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          conversation_type?:
            | Database["public"]["Enums"]["conversation_type"]
            | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          participant_ids?: string[] | null
          project_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      document_collaborators: {
        Row: {
          created_at: string | null
          document_id: string
          id: string
          invited_at: string | null
          invited_by: string | null
          permission_level: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_id: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          permission_level?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_id?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          permission_level?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_collaborators_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          approval_status: string | null
          approved_by: string | null
          bucket_name: string | null
          category: Database["public"]["Enums"]["document_category"] | null
          created_at: string | null
          file_name: string
          file_path: string | null
          file_size: number | null
          id: string
          is_latest_version: boolean | null
          is_standard: boolean | null
          meeting_id: string | null
          mime_type: string | null
          parent_document_id: string | null
          phase_id: string | null
          processed_at: string | null
          project_id: string | null
          storage_path: string | null
          title: string
          uploaded_by: string | null
          version: number | null
          version_notes: string | null
          visibility: Database["public"]["Enums"]["visibility"] | null
        }
        Insert: {
          approval_status?: string | null
          approved_by?: string | null
          bucket_name?: string | null
          category?: Database["public"]["Enums"]["document_category"] | null
          created_at?: string | null
          file_name: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_latest_version?: boolean | null
          is_standard?: boolean | null
          meeting_id?: string | null
          mime_type?: string | null
          parent_document_id?: string | null
          phase_id?: string | null
          processed_at?: string | null
          project_id?: string | null
          storage_path?: string | null
          title: string
          uploaded_by?: string | null
          version?: number | null
          version_notes?: string | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Update: {
          approval_status?: string | null
          approved_by?: string | null
          bucket_name?: string | null
          category?: Database["public"]["Enums"]["document_category"] | null
          created_at?: string | null
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_latest_version?: boolean | null
          is_standard?: boolean | null
          meeting_id?: string | null
          mime_type?: string | null
          parent_document_id?: string | null
          phase_id?: string | null
          processed_at?: string | null
          project_id?: string | null
          storage_path?: string | null
          title?: string
          uploaded_by?: string | null
          version?: number | null
          version_notes?: string | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_attendees: {
        Row: {
          created_at: string | null
          id: string
          meeting_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          meeting_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          meeting_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_attendees_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          meeting_url: string | null
          minutes_content: string | null
          phase_id: string | null
          project_id: string | null
          scheduled_at: string | null
          title: string
          visibility: Database["public"]["Enums"]["visibility"] | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_url?: string | null
          minutes_content?: string | null
          phase_id?: string | null
          project_id?: string | null
          scheduled_at?: string | null
          title: string
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_url?: string | null
          minutes_content?: string | null
          phase_id?: string | null
          project_id?: string | null
          scheduled_at?: string | null
          title?: string
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          role: string | null
          sources: Json | null
          user_id: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          sources?: Json | null
          user_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          sources?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          notification_category: string | null
          project_id: string | null
          read: boolean | null
          related_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          notification_category?: string | null
          project_id?: string | null
          read?: boolean | null
          related_id?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          notification_category?: string | null
          project_id?: string | null
          read?: boolean | null
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      phase_templates: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number | null
          estimated_man_days: number | null
          id: string
          mandatory_meetings: number | null
          name: string
          offset_days: number
          order_index: number
          project_template_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          estimated_man_days?: number | null
          id?: string
          mandatory_meetings?: number | null
          name: string
          offset_days?: number
          order_index: number
          project_template_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          estimated_man_days?: number | null
          id?: string
          mandatory_meetings?: number | null
          name?: string
          offset_days?: number
          order_index?: number
          project_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phase_templates_project_template_id_fkey"
            columns: ["project_template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_checklist_items: {
        Row: {
          completed: boolean
          completed_at: string | null
          completed_by: string | null
          created_at: string
          description: string | null
          id: string
          is_required: boolean
          order_index: number
          project_id: string
          template_item_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean
          order_index?: number
          project_id: string
          template_item_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean
          order_index?: number
          project_id?: string
          template_item_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_checklist_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_checklist_items_template_item_id_fkey"
            columns: ["template_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_template_items"
            referencedColumns: ["id"]
          },
        ]
      }
      project_hierarchies: {
        Row: {
          created_at: string | null
          id: string
          level: number
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: number
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_hierarchies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "project_hierarchies"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          actual_man_days: number | null
          completed: boolean | null
          created_at: string | null
          description: string | null
          end_date: string | null
          estimated_man_days: number | null
          id: string
          name: string
          order_index: number
          project_id: string | null
          start_date: string | null
          updated_at: string | null
          visibility: Database["public"]["Enums"]["visibility"] | null
        }
        Insert: {
          actual_man_days?: number | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          estimated_man_days?: number | null
          id?: string
          name: string
          order_index: number
          project_id?: string | null
          start_date?: string | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Update: {
          actual_man_days?: number | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          estimated_man_days?: number | null
          id?: string
          name?: string
          order_index?: number
          project_id?: string | null
          start_date?: string | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sites: {
        Row: {
          created_at: string
          id: string
          project_id: string
          site_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          site_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_sites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_sites_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      project_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_man_days: number | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_man_days?: number | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_man_days?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          actual_man_days: number | null
          client_id: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          estimated_man_days: number | null
          hierarchy_id: string | null
          hierarchy_level: number | null
          hubspot_deal_id: string | null
          id: string
          parent_project_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          template_id: string | null
          title: string
          updated_at: string | null
          visibility: Database["public"]["Enums"]["visibility"] | null
        }
        Insert: {
          actual_man_days?: number | null
          client_id?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          estimated_man_days?: number | null
          hierarchy_id?: string | null
          hierarchy_level?: number | null
          hubspot_deal_id?: string | null
          id?: string
          parent_project_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          template_id?: string | null
          title: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Update: {
          actual_man_days?: number | null
          client_id?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          estimated_man_days?: number | null
          hierarchy_id?: string | null
          hierarchy_level?: number | null
          hubspot_deal_id?: string | null
          id?: string
          parent_project_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_hierarchy_id_fkey"
            columns: ["hierarchy_id"]
            isOneToOne: false
            referencedRelation: "project_hierarchies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_parent_project_id_fkey"
            columns: ["parent_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_id: string
          country: string | null
          created_at: string
          external_reference: string | null
          id: string
          metadata: Json | null
          name: string
          postal_code: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_id: string
          country?: string | null
          created_at?: string
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          name: string
          postal_code?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_id?: string
          country?: string | null
          created_at?: string
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          postal_code?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          client_validation_required: boolean | null
          created_at: string | null
          description: string | null
          due_offset_days: number
          estimated_hours: number | null
          id: string
          is_milestone: boolean | null
          order_index: number
          phase_template_id: string
          priority: string | null
          title: string
        }
        Insert: {
          client_validation_required?: boolean | null
          created_at?: string | null
          description?: string | null
          due_offset_days?: number
          estimated_hours?: number | null
          id?: string
          is_milestone?: boolean | null
          order_index?: number
          phase_template_id: string
          priority?: string | null
          title: string
        }
        Update: {
          client_validation_required?: boolean | null
          created_at?: string | null
          description?: string | null
          due_offset_days?: number
          estimated_hours?: number | null
          id?: string
          is_milestone?: boolean | null
          order_index?: number
          phase_template_id?: string
          priority?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_templates_phase_template_id_fkey"
            columns: ["phase_template_id"]
            isOneToOne: false
            referencedRelation: "phase_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          client_validation_required: boolean | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          depends_on_task_id: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          is_milestone: boolean | null
          phase_id: string | null
          priority: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string | null
          validated_by_client: boolean | null
          visibility: Database["public"]["Enums"]["visibility"] | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          client_validation_required?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          depends_on_task_id?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_milestone?: boolean | null
          phase_id?: string | null
          priority?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string | null
          validated_by_client?: boolean | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          client_validation_required?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          depends_on_task_id?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_milestone?: boolean | null
          phase_id?: string | null
          priority?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string | null
          validated_by_client?: boolean | null
          visibility?: Database["public"]["Enums"]["visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          hours: number
          id: string
          phase_id: string | null
          project_id: string | null
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          hours: number
          id?: string
          phase_id?: string | null
          project_id?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          hours?: number
          id?: string
          phase_id?: string | null
          project_id?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_business_days: {
        Args: { days: number; start_date: string }
        Returns: string
      }
      apply_project_template: {
        Args: {
          p_project_id: string
          p_task_assignments?: Json
          p_template_id: string
        }
        Returns: boolean
      }
      create_activity_entry: {
        Args: {
          p_action_type: string
          p_description?: string
          p_metadata?: Json
          p_project_id: string
          p_related_id?: string
          p_title: string
          p_user_id: string
        }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_project_member: {
        Args: { project_id: string; user_id: string }
        Returns: boolean
      }
      schedule_project: {
        Args: { p_project_id: string; p_start_date?: string }
        Returns: boolean
      }
    }
    Enums: {
      conversation_type: "ai_chat" | "team_chat" | "project_discussion"
      document_category: "standard" | "project_shared" | "client_uploaded"
      project_status: "draft" | "active" | "on_hold" | "completed" | "cancelled"
      task_status:
        | "not_started"
        | "in_progress"
        | "review"
        | "completed"
        | "blocked"
      user_role: "admin" | "team_member" | "client"
      visibility: "internal" | "client_visible"
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
      conversation_type: ["ai_chat", "team_chat", "project_discussion"],
      document_category: ["standard", "project_shared", "client_uploaded"],
      project_status: ["draft", "active", "on_hold", "completed", "cancelled"],
      task_status: [
        "not_started",
        "in_progress",
        "review",
        "completed",
        "blocked",
      ],
      user_role: ["admin", "team_member", "client"],
      visibility: ["internal", "client_visible"],
    },
  },
} as const
