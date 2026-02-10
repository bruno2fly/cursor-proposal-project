-- =====================================================
-- 2FLY Proposal Portal - Database Migration
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Service Templates (predefined services)
CREATE TABLE IF NOT EXISTS service_templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  summary TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Proposals
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_logo_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  hero_title TEXT NOT NULL DEFAULT '360° Marketing Service',
  hero_subtitle TEXT,
  pricing_option_1_name TEXT NOT NULL DEFAULT '3-Month Agreement',
  pricing_option_1_price INTEGER NOT NULL DEFAULT 1100,
  pricing_option_1_desc TEXT NOT NULL DEFAULT '',
  pricing_option_2_name TEXT NOT NULL DEFAULT 'Month-to-Month',
  pricing_option_2_price INTEGER NOT NULL DEFAULT 1400,
  pricing_option_2_desc TEXT NOT NULL DEFAULT '',
  custom_note TEXT
);

-- Proposal Services (junction table)
CREATE TABLE IF NOT EXISTS proposal_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL REFERENCES service_templates(id),
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  custom_summary TEXT
);

-- Proposal Events (analytics)
CREATE TABLE IF NOT EXISTS proposal_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_proposals_slug ON proposals(slug);
CREATE INDEX IF NOT EXISTS idx_proposal_services_proposal_id ON proposal_services(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_events_proposal_id ON proposal_events(proposal_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_proposals_updated_at ON proposals;
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_templates ENABLE ROW LEVEL SECURITY;

-- Public read access for proposals (by slug) and service templates
CREATE POLICY "Public can read proposals by slug" ON proposals
  FOR SELECT USING (true);

CREATE POLICY "Public can read service templates" ON service_templates
  FOR SELECT USING (true);

CREATE POLICY "Public can read proposal services" ON proposal_services
  FOR SELECT USING (true);

-- Public can insert events (for tracking)
CREATE POLICY "Public can insert events" ON proposal_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read events" ON proposal_events
  FOR SELECT USING (true);

-- Authenticated users can do everything (admin)
CREATE POLICY "Authenticated users can manage proposals" ON proposals
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage services" ON proposal_services
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage templates" ON service_templates
  FOR ALL USING (auth.role() = 'authenticated');

-- Public can update proposals (for accept/decline status changes)
CREATE POLICY "Public can update proposal status" ON proposals
  FOR UPDATE USING (true);
