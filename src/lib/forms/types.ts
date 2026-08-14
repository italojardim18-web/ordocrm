export type FormQuestionType =
  | "text"
  | "textarea"
  | "phone"
  | "email"
  | "select"
  | "radio"
  | "scale"
  | "date";

export interface FormQuestion {
  id: string;
  type: FormQuestionType;
  title: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // Para 'select' e 'radio'
  mapsTo?: "name" | "phone" | "email" | "notes" | "none";
}

export interface FormSchema {
  welcome: {
    title: string;
    description: string;
    buttonText?: string;
  };
  questions: FormQuestion[];
  thankyou: {
    title: string;
    description: string;
    buttonText?: string;
    redirectUrl?: string;
  };
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  cardBackground: string;
  borderRadius: string;
}

export interface FormSettings {
  autoCreateLead: boolean;
  notifyEmail: boolean;
  redirectUrl?: string;
}

export interface FormEndpoint {
  id: string;
  workspace_id: string;
  slug: string;
  name: string;
  headline?: string | null;
  description?: string | null;
  pipeline_id?: string | null;
  product_id?: string | null;
  owner_id?: string | null;
  is_active: boolean;
  schema: FormSchema;
  theme: FormTheme;
  settings: FormSettings;
  folder?: string | null;
  views_count: number;
  submissions_count: number;
  created_at: string;
  updated_at: string;
}

export interface FormFolder {
  id: string;
  workspace_id: string;
  name: string;
  created_at: string;
}

export interface FormSubmissionRecord {
  id: string;
  form_endpoint_id: string;
  lead_id?: string | null;
  payload: Record<string, unknown>;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  created_at: string;
  lead?: {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
  } | null;
}
