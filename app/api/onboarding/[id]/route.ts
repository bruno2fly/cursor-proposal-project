import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET — Single onboarding response by ID
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("onboarding_responses")
    .select(
      `
      *,
      proposals (client_name)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PATCH — Update status (e.g., completed → reviewed)
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const supabase = createAdminClient();

  const updateData: Record<string, unknown> = {};
  if (body.status !== undefined) {
    updateData.status = body.status;
  }
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("onboarding_responses")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE — Remove onboarding response (allows client to re-submit)
export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("onboarding_responses")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
