-- =====================================================
-- 2FLY Proposal Portal - Visual ID Onboarding Responses
-- Run this in your Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS visual_id_onboarding_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'reviewed')),

  -- Section 1: Business Information
  business_name TEXT,
  business_email TEXT,
  phone_number TEXT,
  website_url TEXT,

  -- Section 2: About Your Business
  business_description TEXT,
  products_services TEXT,
  target_audience TEXT,
  unique_vs_competitors TEXT,

  -- Section 3: Branding Preferences
  has_logo_brand_colors TEXT,
  brand_materials_url TEXT,
  brand_feel JSONB DEFAULT '[]',
  inspiration_brands TEXT,
  colors_fonts_preferences TEXT,

  -- Section 4: Website Goals & Structure
  website_goal TEXT,
  website_goal_other TEXT,
  content_status TEXT,
  media_status TEXT,

  -- Section 5: References & Inspiration
  website_references TEXT,
  competitor_references TEXT,

  -- Section 6: Final Notes
  additional_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visual_id_slug ON visual_id_onboarding_responses(slug);
CREATE INDEX IF NOT EXISTS idx_visual_id_proposal ON visual_id_onboarding_responses(proposal_id);
