import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// GET all proposals (admin)
export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("proposals")
    .select(`
      *,
      proposal_events (event_type, created_at)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Helper: verify auth from Authorization header
async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// POST create new proposal (admin)
export async function POST(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const admin = createAdminClient();

  // Create proposal
  const { data: proposal, error: proposalError } = await admin
    .from("proposals")
    .insert({
      client_name: body.client_name,
      client_logo_url: body.client_logo_url || null,
      slug: body.slug,
      status: body.status || "draft",
      hero_title: body.hero_title || "360° Marketing Service",
      hero_subtitle: body.hero_subtitle || null,
      pricing_option_1_name: body.pricing_option_1_name || "3-Month Agreement",
      pricing_option_1_price: body.pricing_option_1_price || 1100,
      pricing_option_1_desc: body.pricing_option_1_desc || "Commit to growth with our recommended partnership plan.",
      pricing_option_2_name: body.pricing_option_2_name || "Month-to-Month",
      pricing_option_2_price: body.pricing_option_2_price || 1400,
      pricing_option_2_desc: body.pricing_option_2_desc || "Flexible month-to-month plan with no long-term commitment.",
      custom_note: body.custom_note || null,
    })
    .select()
    .single();

  if (proposalError) {
    return NextResponse.json(
      { error: proposalError.message },
      { status: 500 }
    );
  }

  // Create proposal services
  if (body.services && Array.isArray(body.services)) {
    const services = body.services.map(
      (s: { service_id: string; enabled?: boolean; sort_order?: number; custom_summary?: string }, i: number) => ({
        proposal_id: proposal.id,
        service_id: s.service_id,
        enabled: s.enabled !== false,
        sort_order: s.sort_order ?? i,
        custom_summary: s.custom_summary || null,
      })
    );

    const { error: servicesError } = await admin
      .from("proposal_services")
      .insert(services);

    if (servicesError) {
      return NextResponse.json(
        { error: servicesError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(proposal, { status: 201 });
}
