-- =====================================================
-- 2FLY Proposal Portal - Onboarding Responses
-- Run this in your Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS onboarding_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'reviewed')),

  -- Step 1: Business Information
  business_name TEXT,
  business_email TEXT,
  phone_number TEXT,
  business_address TEXT,
  website_url TEXT,
  google_business_profile TEXT,
  social_media_links TEXT,
  business_hours TEXT,
  service_area TEXT,
  years_operating TEXT,

  -- Step 2: About Your Business
  business_description TEXT,
  products_services TEXT,
  top_3_profitable TEXT,
  sell_more_of TEXT,
  target_audience TEXT,
  unique_vs_competitors TEXT,
  common_customer_questions TEXT,

  -- Step 3: Branding & Assets
  brand_assets JSONB DEFAULT '[]',
  brand_assets_description TEXT,
  has_professional_media TEXT,
  allow_location_visit TEXT,

  -- Step 4: Social Media
  social_media_goals JSONB DEFAULT '[]',
  important_platforms JSONB DEFAULT '[]',
  content_types JSONB DEFAULT '[]',
  brand_voice JSONB DEFAULT '[]',
  inspiration_brands TEXT,
  posting_frequency TEXT,

  -- Step 5: Advertising & Campaigns
  advertising_goals JSONB DEFAULT '[]',
  has_run_ads TEXT,
  previous_ad_platforms JSONB DEFAULT '[]',
  previous_ad_results TEXT,
  monthly_ad_budget TEXT,
  ad_destinations JSONB DEFAULT '[]',
  lead_responder TEXT,

  -- Step 6: Promotions & Offers
  current_promotions TEXT,
  focus_products_first TEXT,

  -- Step 7: Strategy & Expectations
  three_month_goal TEXT,
  biggest_challenges TEXT,
  success_revenue TEXT,
  competitors_to_analyze TEXT,
  partnership_success TEXT,

  -- Step 8: Communication & Workflow
  preferred_communication TEXT,
  content_approver_name TEXT,
  content_approver_role TEXT,
  update_frequency TEXT,

  -- Step 9: Platform Access
  platform_access JSONB DEFAULT '[]',
  access_confirmed BOOLEAN DEFAULT false,

  -- Step 10: Final Notes
  topics_to_avoid TEXT,
  additional_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_slug ON onboarding_responses(slug);
CREATE INDEX IF NOT EXISTS idx_onboarding_proposal ON onboarding_responses(proposal_id);
