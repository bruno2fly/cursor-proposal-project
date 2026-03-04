import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

// GET — List all visual ID onboarding responses
export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("visual_id_onboarding_responses")
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

// POST — Save visual ID onboarding response
export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createAdminClient();

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
    website_url: body.website_url ?? null,

    business_description: body.business_description ?? null,
    products_services: body.products_services ?? null,
    target_audience: body.target_audience ?? null,
    unique_vs_competitors: body.unique_vs_competitors ?? null,

    has_logo_brand_colors: body.has_logo_brand_colors ?? null,
    brand_materials_url: body.brand_materials_url ?? null,
    brand_feel: body.brand_feel ?? [],
    inspiration_brands: body.inspiration_brands ?? null,
    colors_fonts_preferences: body.colors_fonts_preferences ?? null,

    website_goal: body.website_goal ?? null,
    website_goal_other: body.website_goal_other ?? null,
    content_status: body.content_status ?? null,
    media_status: body.media_status ?? null,

    website_references: body.website_references ?? null,
    competitor_references: body.competitor_references ?? null,

    additional_notes: body.additional_notes ?? null,
  };

  const { data, error } = await supabase
    .from("visual_id_onboarding_responses")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
