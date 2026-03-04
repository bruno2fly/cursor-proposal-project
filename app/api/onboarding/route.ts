import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

// GET — List all onboarding responses (for admin dashboard)
export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("onboarding_responses")
    .select(
      `
      *,
      proposals (client_name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST — Save onboarding response (public, client submits after signing)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createAdminClient();

  // Look up proposal_id by slug if not provided
  let proposalId = body.proposal_id ?? null;
  if (!proposalId && body.slug) {
    const { data: proposal } = await supabase
      .from("proposals")
      .select("id")
      .eq("slug", body.slug)
      .single();
    proposalId = proposal?.id ?? null;
  }

  const insertData = {
    proposal_id: proposalId,
    slug: body.slug,
    status: body.status ?? "completed",

    business_name: body.business_name ?? null,
    business_email: body.business_email ?? null,
    phone_number: body.phone_number ?? null,
    business_address: body.business_address ?? null,
    website_url: body.website_url ?? null,
    google_business_profile: body.google_business_profile ?? null,
    social_media_links: body.social_media_links ?? null,
    business_hours: body.business_hours ?? null,
    service_area: body.service_area ?? null,
    years_operating: body.years_operating ?? null,

    business_description: body.business_description ?? null,
    products_services: body.products_services ?? null,
    top_3_profitable: body.top_3_profitable ?? null,
    sell_more_of: body.sell_more_of ?? null,
    target_audience: body.target_audience ?? null,
    unique_vs_competitors: body.unique_vs_competitors ?? null,
    common_customer_questions: body.common_customer_questions ?? null,

    brand_assets: body.brand_assets ?? [],
    brand_assets_description: body.brand_assets_description ?? null,
    has_professional_media: body.has_professional_media ?? null,
    allow_location_visit: body.allow_location_visit ?? null,

    social_media_goals: body.social_media_goals ?? [],
    important_platforms: body.important_platforms ?? [],
    content_types: body.content_types ?? [],
    brand_voice: body.brand_voice ?? [],
    inspiration_brands: body.inspiration_brands ?? null,
    posting_frequency: body.posting_frequency ?? null,

    advertising_goals: body.advertising_goals ?? [],
    has_run_ads: body.has_run_ads ?? null,
    previous_ad_platforms: body.previous_ad_platforms ?? [],
    previous_ad_results: body.previous_ad_results ?? null,
    monthly_ad_budget: body.monthly_ad_budget ?? null,
    ad_destinations: body.ad_destinations ?? [],
    lead_responder: body.lead_responder ?? null,

    current_promotions: body.current_promotions ?? null,
    focus_products_first: body.focus_products_first ?? null,

    three_month_goal: body.three_month_goal ?? null,
    biggest_challenges: body.biggest_challenges ?? null,
    success_revenue: body.success_revenue ?? null,
    competitors_to_analyze: body.competitors_to_analyze ?? null,
    partnership_success: body.partnership_success ?? null,

    preferred_communication: body.preferred_communication ?? null,
    content_approver_name: body.content_approver_name ?? null,
    content_approver_role: body.content_approver_role ?? null,
    update_frequency: body.update_frequency ?? null,

    platform_access: body.platform_access ?? [],
    access_confirmed: body.access_confirmed ?? false,

    topics_to_avoid: body.topics_to_avoid ?? null,
    additional_notes: body.additional_notes ?? null,
  };

  const { data, error } = await supabase
    .from("onboarding_responses")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
