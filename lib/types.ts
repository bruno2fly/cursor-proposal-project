export interface Proposal {
  id: string;
  client_name: string;
  client_logo_url: string | null;
  slug: string;
  status: "draft" | "sent" | "viewed" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
  viewed_at: string | null;
  accepted_at: string | null;
  hero_title: string;
  hero_subtitle: string | null;
  pricing_option_1_name: string;
  pricing_option_1_price: number;
  pricing_option_1_desc: string;
  pricing_option_2_name: string;
  pricing_option_2_price: number;
  pricing_option_2_desc: string;
  custom_note: string | null;
}

export interface ProposalService {
  id: string;
  proposal_id: string;
  service_id: string;
  enabled: boolean;
  sort_order: number;
  custom_summary: string | null;
}

export interface ServiceTemplate {
  id: string;
  title: string;
  subtitle: string | null;
  icon: string;
  color: string;
  summary: string;
  details: ServiceDetail[];
  sort_order: number;
}

export interface ServiceDetail {
  label: string;
  desc: string;
}

export interface ProposalEvent {
  id: string;
  proposal_id: string;
  event_type: "viewed" | "accepted" | "declined" | "service_clicked" | "pricing_viewed";
  metadata: Record<string, unknown> | null;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export interface ProposalWithServices extends Proposal {
  proposal_services: (ProposalService & {
    service_templates: ServiceTemplate;
  })[];
}
