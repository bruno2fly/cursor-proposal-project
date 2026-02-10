import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST log event (public — no auth required)
export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const supabase = createAdminClient();

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null;
  const userAgent = request.headers.get("user-agent") || null;

  // Log the event
  const { error } = await supabase.from("proposal_events").insert({
    proposal_id: id,
    event_type: body.event_type,
    metadata: body.metadata || null,
    ip_address: ip,
    user_agent: userAgent,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If this is a 'viewed' event and proposal hasn't been viewed before, update viewed_at
  if (body.event_type === "viewed") {
    const { data: proposal } = await supabase
      .from("proposals")
      .select("viewed_at, status")
      .eq("id", id)
      .single();

    if (proposal && !proposal.viewed_at) {
      await supabase
        .from("proposals")
        .update({
          viewed_at: new Date().toISOString(),
          status: proposal.status === "sent" ? "viewed" : proposal.status,
        })
        .eq("id", id);
    }
  }

  return NextResponse.json({ success: true });
}

// GET events for a proposal (admin)
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("proposal_events")
    .select("*")
    .eq("proposal_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
