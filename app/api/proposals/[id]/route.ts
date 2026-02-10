import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET single proposal with services and events
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("proposals")
    .select(
      `
      *,
      proposal_services (
        *,
        service_templates (*)
      ),
      proposal_events (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PATCH update proposal (status change from client, or full edit from admin)
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const supabase = createAdminClient();

  const updateData: Record<string, unknown> = {};

  // Allow these fields to be updated
  const allowedFields = [
    "client_name",
    "client_logo_url",
    "slug",
    "status",
    "hero_title",
    "hero_subtitle",
    "pricing_option_1_name",
    "pricing_option_1_price",
    "pricing_option_1_desc",
    "pricing_option_2_name",
    "pricing_option_2_price",
    "pricing_option_2_desc",
    "custom_note",
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  // If status changed to accepted, set accepted_at
  if (body.status === "accepted") {
    updateData.accepted_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("proposals")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update services if provided
  if (body.services && Array.isArray(body.services)) {
    // Delete existing services
    await supabase
      .from("proposal_services")
      .delete()
      .eq("proposal_id", id);

    // Insert new services
    const services = body.services.map(
      (s: { service_id: string; enabled?: boolean; sort_order?: number; custom_summary?: string }, i: number) => ({
        proposal_id: id,
        service_id: s.service_id,
        enabled: s.enabled !== false,
        sort_order: s.sort_order ?? i,
        custom_summary: s.custom_summary || null,
      })
    );

    await supabase.from("proposal_services").insert(services);
  }

  return NextResponse.json(data);
}

// DELETE proposal
export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = createAdminClient();

  const { error } = await supabase.from("proposals").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
