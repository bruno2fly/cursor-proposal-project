"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface VisualIdResponse {
  id: string;
  slug: string;
  status: string;
  proposal_id: string | null;
  proposals: { client_name: string } | null;
  business_name: string | null;
  business_email: string | null;
  phone_number: string | null;
  website_url: string | null;
  business_description: string | null;
  products_services: string | null;
  target_audience: string | null;
  unique_vs_competitors: string | null;
  has_logo_brand_colors: string | null;
  brand_materials_url: string | null;
  brand_feel: string[] | null;
  inspiration_brands: string | null;
  colors_fonts_preferences: string | null;
  website_goal: string | null;
  website_goal_other: string | null;
  content_status: string | null;
  media_status: string | null;
  website_references: string | null;
  competitor_references: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at?: string | null;
}

function Val({ children, showEmpty }: { children: React.ReactNode; showEmpty?: boolean }) {
  const empty = children == null || String(children).trim() === "";
  if (empty && !showEmpty) return null;
  return (
    <span className="text-[15px] text-dark-text-light">
      {empty ? <span className="text-dark-text italic">Not provided</span> : children}
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] uppercase tracking-wider text-dark-text opacity-70 block mb-1.5">
      {children}
    </span>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden">
      <div className="px-6 py-4 border-b border-dark-border">
        <span className="font-clash font-semibold">{title}</span>
      </div>
      <div className="px-6 pb-6 pt-4 space-y-4">
        {children}
      </div>
    </div>
  );
}

export default function VisualIdOnboardingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const [data, setData] = useState<VisualIdResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/onboarding-visual-id/${id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const markReviewed = async () => {
    if (!data) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/onboarding-visual-id/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "reviewed" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setData({ ...data, status: "reviewed", updated_at: updated.updated_at });
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!data || !confirm("Delete this Visual ID onboarding? The client can submit again.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/onboarding-visual-id/${data.id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin");
      else alert("Failed to delete.");
    } finally {
      setDeleting(false);
    }
  };

  const clientName =
    (data?.proposals as { client_name?: string } | null)?.client_name ??
    data?.business_name ??
    "Unknown";

  const arr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter(Boolean).map(String) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-dark-text">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center gap-4">
        <p className="text-dark-text">Visual ID onboarding not found.</p>
        <Link href="/admin" className="text-accent-blue hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-dark-text hover:text-dark-text-light mb-6 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-dark-border bg-dark-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-clash text-2xl font-bold">{clientName}</h1>
              <p className="text-dark-text text-sm mt-1">
                Visual ID Onboarding · {new Date(data.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  data.status === "reviewed"
                    ? "bg-accent-blue/15 text-accent-blue"
                    : data.status === "completed"
                      ? "bg-accent-green/15 text-accent-green"
                      : "bg-dark-text/15 text-dark-text"
                }`}
              >
                {data.status === "reviewed" ? "Reviewed" : data.status === "completed" ? "Completed" : "Pending"}
              </span>
              {data.status === "completed" && (
                <button
                  onClick={markReviewed}
                  disabled={updating}
                  className="px-4 py-2 rounded-lg border border-accent-blue/50 text-accent-blue text-sm font-medium hover:bg-accent-blue/10 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Mark as Reviewed"}
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 text-sm font-medium hover:bg-red-500/10 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionCard title="1. Business Information">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Business Name</Label><Val>{data.business_name}</Val></div>
              <div><Label>Email</Label><Val>{data.business_email}</Val></div>
              <div><Label>Phone</Label><Val>{data.phone_number}</Val></div>
              <div>
                <Label>Website</Label>
                {data.website_url ? (
                  <a href={data.website_url} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline text-sm">
                    {data.website_url}
                  </a>
                ) : (
                  <Val>Not provided</Val>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="2. About Your Business">
            <div className="space-y-4">
              <div><Label>Business Description</Label><Val>{data.business_description}</Val></div>
              <div><Label>Products/Services</Label><Val>{data.products_services}</Val></div>
              <div><Label>Target Audience</Label><Val>{data.target_audience}</Val></div>
              <div><Label>Unique vs Competitors</Label><Val>{data.unique_vs_competitors}</Val></div>
            </div>
          </SectionCard>

          <SectionCard title="3. Branding Preferences">
            <div className="space-y-4">
              <div><Label>Logo / Brand Colors / Fonts</Label><Val>{data.has_logo_brand_colors}</Val></div>
              <div><Label>Brand Materials URL</Label><Val>{data.brand_materials_url}</Val></div>
              <div>
                <Label>Brand Feel</Label>
                <div className="flex flex-wrap gap-1.5">
                  {arr(data.brand_feel).map((b) => (
                    <span key={b} className="inline-flex px-2.5 py-1 rounded-full bg-accent-purple/15 text-accent-purple text-xs">
                      {b}
                    </span>
                  ))}
                  {!arr(data.brand_feel).length && <Val>Not provided</Val>}
                </div>
              </div>
              <div><Label>Inspiration Brands</Label><Val>{data.inspiration_brands}</Val></div>
              <div><Label>Colors / Fonts Preferences</Label><Val>{data.colors_fonts_preferences}</Val></div>
            </div>
          </SectionCard>

          <SectionCard title="4. Website Goals & Structure">
            <div className="space-y-4">
              <div><Label>Website Goal</Label><Val>{data.website_goal}</Val></div>
              {data.website_goal_other && (
                <div><Label>Other (specified)</Label><Val>{data.website_goal_other}</Val></div>
              )}
              <div><Label>Content Status</Label><Val>{data.content_status}</Val></div>
              <div><Label>Media Status</Label><Val>{data.media_status}</Val></div>
            </div>
          </SectionCard>

          <SectionCard title="5. References & Inspiration">
            <div className="space-y-4">
              <div><Label>Website References</Label><Val>{data.website_references}</Val></div>
              <div><Label>Competitor References</Label><Val>{data.competitor_references}</Val></div>
            </div>
          </SectionCard>

          <SectionCard title="6. Final Notes">
            <div><Label>Additional Notes</Label><Val>{data.additional_notes}</Val></div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
