export type StageType =
  | "new"
  | "qualification"
  | "follow_up_pre_session"
  | "alignment_session"
  | "follow_up_post_session"
  | "won"
  | "lost"
  | "custom";

export type LeadChannel =
  | "form"
  | "whatsapp"
  | "instagram"
  | "paid_traffic"
  | "manual";

export type LeadTemperature = "hot" | "warm" | "cold";

export type TranscriptStatus = "pending" | "done" | "failed" | "skipped";

export interface Pipeline {
  id: string;
  name: string;
  is_default?: boolean;
}

export interface Stage {
  id: string;
  name: string;
  stage_type: StageType;
  position: number;
  archived_at: string | null;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  default_price: number | null;
  is_active: boolean;
}

export interface LostReason {
  id: string;
  label: string;
  is_active: boolean;
}

export interface TagItem {
  id: string;
  name: string;
  color: string;
}

export interface Member {
  userId: string;
  fullName: string;
  role: "admin" | "assistant";
}

export interface LeadCard {
  id: string;
  name: string;
  stage_id: string;
  position: number;
  channel: LeadChannel;
  phone: string | null;
  email: string | null;
  potential_value: number | null;
  owner_id: string | null;
  engaged_at: string | null;
  created_at: string;
  follow_up_at?: string | null;
  follow_up_note?: string | null;
  last_interaction_at?: string | null;
  temperature_override?: LeadTemperature | null;
  temperature_override_at?: string | null;
  lead_product_interests: { product_id: string }[];
  tasks: { id: string; due_at: string | null; completed_at: string | null }[];
  tags?: TagItem[];
}

export interface LeadDetail {
  archived_at: string | null;
  archived_reason: string | null;
  id: string;
  workspace_id: string;
  pipeline_id: string;
  stage_id: string;
  name: string;
  social_name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  contact_preference: string | null;
  channel: LeadChannel;
  source_detail: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  owner_id: string | null;
  potential_value: number | null;
  next_action: string | null;
  first_contact_at: string | null;
  engaged_at: string | null;
  lost_reason_id: string | null;
  lost_note: string | null;
  lost_at: string | null;
  reactivated_count: number;
  reactivation_status?: string | null;
  reactivated_at?: string | null;
  follow_up_at: string | null;
  follow_up_note: string | null;
  last_interaction_at: string | null;
  temperature_override: LeadTemperature | null;
  temperature_override_at: string | null;
  summary_need: string | null;
  summary_moment: string | null;
  summary_preference: string | null;
  summary_open_point: string | null;
  summary_generated_at: string | null;
  summary_model: string | null;
  summary_source_count: number | null;
  notes_summary: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface Note {
  id: string;
  body: string;
  visibility: "team" | "admin_only";
  author_id: string;
  created_at: string;
}

export interface TaskRow {
  id: string;
  title: string;
  due_at: string | null;
  completed_at: string | null;
  assigned_to: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface ActivityRow {
  id: number;
  type: "call" | "message" | "note" | "task" | "stage_change" | "system";
  content: string | null;
  actor_id: string | null;
  created_at: string;
}

export interface AppointmentRow {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  meet_link: string | null;
  calendar_event_id: string | null;
  calendar_sync_status: "pending" | "synced" | "error" | null;
}

export interface OpportunityRow {
  id: string;
  product_id: string;
  status: "open" | "won" | "lost";
  potential_value: number | null;
  sold_value: number | null;
  payment_method: string | null;
  closed_at: string | null;
  created_at: string;
}

export interface HistoryRow {
  id: number;
  from_stage_type: StageType | null;
  to_stage_type: StageType;
  actor_id: string | null;
  created_at: string;
}

export interface CommercialOutcomeRow {
  opportunity_id: string;
  lead_id: string;
  lead_name: string;
  product_id: string | null;
  product_name: string | null;
  status: "won" | "lost";
  potential_value: number | null;
  sold_value: number | null;
  payment_method: string | null;
  closed_at: string;
  owner_id: string | null;
  channel: LeadChannel;
  lost_reason: string | null;
}

export interface ChannelConnectionItem {
  id: string;
  provider: "whatsapp" | "instagram" | "form" | "meta_lead_ads";
  display_name: string | null;
  phone_number: string | null;
  status: string;
  is_default: boolean;
  transport?: "cloud_api" | "bridge";
}

export interface OperationalOverview {
  open_conversations: number;
  tasks_today: number;
  appointments_week: number;
  attention_proposals: number;
  attention_no_next_step: number;
  attention_upcoming_sessions: number;
  pipeline_distribution: {
    id: string;
    name: string;
    stage_type: StageType;
    position: number;
    lead_count: number;
  }[];
}
