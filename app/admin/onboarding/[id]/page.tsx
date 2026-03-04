"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  Briefcase,
  Palette,
  Share2,
  Target,
  Tag,
  Compass,
  MessageCircle,
  Key,
  FileText,
  Instagram,
  Facebook,
  Globe,
  Youtube,
  Linkedin,
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface OnboardingResponse {
  id: string;
  slug: string;
  status: string;
  proposal_id: string | null;
  proposals: { client_name: string } | null;
  business_name: string | null;
  business_email: string | null;
  phone_number: string | null;
  business_address: string | null;
  website_url: string | null;
  google_business_profile: string | null;
  social_media_links: string | null;
  business_hours: string | null;
  service_area: string | null;
  years_operating: string | null;
  business_description: string | null;
  products_services: string | null;
  top_3_profitable: string | null;
  sell_more_of: string | null;
  target_audience: string | null;
  unique_vs_competitors: string | null;
  common_customer_questions: string | null;
  brand_assets: string[] | null;
  brand_assets_description: string | null;
  has_professional_media: string | null;
  allow_location_visit: string | null;
  social_media_goals: string[] | null;
  important_platforms: string[] | null;
  content_types: string[] | null;
  brand_voice: string[] | null;
  inspiration_brands: string | null;
  posting_frequency: string | null;
  advertising_goals: string[] | null;
  has_run_ads: string | null;
  previous_ad_platforms: string[] | null;
  previous_ad_results: string | null;
  monthly_ad_budget: string | null;
  ad_destinations: string[] | null;
  lead_responder: string | null;
  current_promotions: string | null;
  focus_products_first: string | null;
  three_month_goal: string | null;
  biggest_challenges: string | null;
  success_revenue: string | null;
  competitors_to_analyze: string | null;
  partnership_success: string | null;
  preferred_communication: string | null;
  content_approver_name: string | null;
  content_approver_role: string | null;
  update_frequency: string | null;
  platform_access: string[] | null;
  access_confirmed: boolean | null;
  topics_to_avoid: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at?: string | null;
}

const SECTION_CONFIG = [
  { id: "s1", title: "Business Information", icon: Building2 },
  { id: "s2", title: "About Your Business", icon: Briefcase },
  { id: "s3", title: "Branding & Assets", icon: Palette },
  { id: "s4", title: "Social & Content", icon: Share2 },
  { id: "s5", title: "Advertising", icon: Target },
  { id: "s6", title: "Promotions & Offers", icon: Tag },
  { id: "s7", title: "Strategy & Expectations", icon: Compass },
  { id: "s8", title: "Communication & Workflow", icon: MessageCircle },
  { id: "s9", title: "Platform Access", icon: Key },
  { id: "s10", title: "Final Notes", icon: FileText },
];

function detectPlatform(url: string): { platform: string; icon: React.ElementType } | null {
  const u = url.toLowerCase();
  if (u.includes("instagram.com")) return { platform: "Instagram", icon: Instagram };
  if (u.includes("facebook.com") || u.includes("fb.com") || u.includes("fb.me")) return { platform: "Facebook", icon: Facebook };
  if (u.includes("youtube.com") || u.includes("youtu.be")) return { platform: "YouTube", icon: Youtube };
  if (u.includes("linkedin.com")) return { platform: "LinkedIn", icon: Linkedin };
  if (u.includes("tiktok.com")) return { platform: "TikTok", icon: Share2 };
  return { platform: "Link", icon: Globe };
}

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "bg-[#E4405F]/15 text-[#E4405F]",
  Facebook: "bg-[#1877F2]/15 text-[#1877F2]",
  YouTube: "bg-[#FF0000]/15 text-[#FF0000]",
  LinkedIn: "bg-[#0A66C2]/15 text-[#0A66C2]",
  TikTok: "bg-[#000000]/15 text-[#25F4EE]",
  Link: "bg-accent-purple/15 text-accent-purple",
};

const PLATFORM_ACCESS_STYLES: Record<string, string> = {
  "Instagram account": "bg-[#E4405F]/15 text-[#E4405F]",
  "Facebook Page": "bg-[#1877F2]/15 text-[#1877F2]",
  "Meta Ads Manager": "bg-[#1877F2]/15 text-[#1877F2]",
  "Google Ads": "bg-[#4285F4]/15 text-[#4285F4]",
  "Google Business Profile": "bg-[#4285F4]/15 text-[#4285F4]",
  "Website CMS": "bg-accent-purple/15 text-accent-purple",
  "Email marketing platform": "bg-accent-green/15 text-accent-green",
};

function Val({
  children,
  showEmpty,
  className = "",
}: {
  children: React.ReactNode;
  showEmpty?: boolean;
  className?: string;
}) {
  const empty = children == null || String(children).trim() === "";
  if (empty && !showEmpty) return null;
  return (
    <span className={`text-[15px] text-dark-text-light ${className}`}>
      {empty ? (
        <span className="text-dark-text italic">Not provided</span>
      ) : (
        children
      )}
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

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full bg-accent-purple/15 text-accent-purple text-xs mr-1.5 mb-1.5 ${className}`}
    >
      {children}
    </span>
  );
}

function FieldGroup({
  label,
  value,
  showEmpty,
  children,
}: {
  label?: string;
  value?: React.ReactNode;
  showEmpty?: boolean;
  children?: React.ReactNode;
}) {
  const content = children ?? value;
  const empty =
    content == null ||
    (typeof content === "string" && content.trim() === "") ||
    (typeof value === "string" && value.trim() === "" && !children);
  if (empty && !showEmpty && !children) return null;
  return (
    <div className="py-4 border-b border-dark-border/50 last:border-0 last:pb-0">
      {label && <Label>{label}</Label>}
      {children ?? <Val showEmpty={showEmpty}>{value}</Val>}
    </div>
  );
}

export default function OnboardingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const [data, setData] = useState<OnboardingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("s1");
  const contentRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/onboarding/${id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleScroll = useCallback(() => {
    const sections = document.querySelectorAll("[data-section]");
    if (!sections?.length) return;
    let current = "s1";
    for (const el of Array.from(sections)) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 150) current = el.getAttribute("data-section") || current;
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, data]);

  const markReviewed = async () => {
    if (!data) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/onboarding/${data.id}`, {
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
    if (!data || !confirm("Delete this onboarding response? The client will be able to submit the form again."))
      return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/onboarding/${data.id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin");
      else alert("Failed to delete.");
    } finally {
      setDeleting(false);
    }
  };

  const downloadPdf = async () => {
    const el = printRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#12121A",
    });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save(`onboarding-${data?.business_name || "client"}.pdf`);
  };

  const clientName =
    (data?.proposals as { client_name?: string } | null)?.client_name ??
    data?.business_name ??
    "Unknown";

  const arr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter(Boolean).map(String) : [];

  const parseSocialLinks = (text: string | null): string[] => {
    if (!text?.trim()) return [];
    return text
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

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
        <p className="text-dark-text">Onboarding not found.</p>
        <Link href="/admin" className="text-accent-blue hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const scrollToSection = (sectionId: string) => {
    const el = document.querySelector(`[data-section="${sectionId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="flex">
        {/* Sidebar TOC - desktop */}
        <aside className="hidden lg:block w-[200px] shrink-0 sticky top-24 self-start py-8 pl-6">
          <nav className="space-y-1">
            {SECTION_CONFIG.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  activeSection === s.id
                    ? "bg-accent-purple/15 text-accent-purple font-medium"
                    : "text-dark-text hover:text-dark-text-light hover:bg-dark-card"
                }`}
              >
                <s.icon className="w-4 h-4 shrink-0" />
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-dark-text hover:text-dark-text-light mb-6 transition-colors"
            >
              ← Back to Dashboard
            </Link>

            {/* Header card */}
            <div className="rounded-2xl border border-dark-border bg-dark-card p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="font-clash text-2xl font-bold truncate">{clientName}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        data.status === "reviewed"
                          ? "bg-accent-blue/15 text-accent-blue"
                          : data.status === "completed"
                            ? "bg-accent-green/15 text-accent-green"
                            : "bg-dark-text/15 text-dark-text"
                      }`}
                    >
                      {data.status === "reviewed"
                        ? "Reviewed"
                        : data.status === "completed"
                          ? "Completed"
                          : "Pending"}
                    </span>
                    <span className="text-dark-text text-sm">
                      Submitted {new Date(data.created_at).toLocaleDateString()}
                    </span>
                    {data.status === "reviewed" && data.updated_at && (
                      <span className="text-dark-text text-sm">
                        Reviewed {new Date(data.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {data.status === "completed" && (
                    <button
                      onClick={markReviewed}
                      disabled={updating}
                      className="px-4 py-2 rounded-lg border border-accent-blue/50 text-accent-blue text-sm font-medium hover:bg-accent-blue/10 disabled:opacity-50 transition-colors"
                    >
                      {updating ? "Updating..." : "Mark as Reviewed"}
                    </button>
                  )}
                  <button
                    onClick={downloadPdf}
                    className="px-4 py-2 rounded-lg border border-dark-border text-dark-text-light text-sm font-medium hover:bg-dark-border/50 transition-colors"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 text-sm font-medium hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>

            {/* Toggle empty fields - mobile TOC */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEmpty}
                  onChange={(e) => setShowEmpty(e.target.checked)}
                  className="rounded border-dark-border bg-dark-card text-accent-green focus:ring-accent-green/50"
                />
                <span className="text-sm text-dark-text-light">Show empty fields</span>
              </label>
              <div className="lg:hidden">
                <select
                  value={activeSection}
                  onChange={(e) => scrollToSection(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-dark-border bg-dark-card text-dark-text-light text-sm"
                >
                  {SECTION_CONFIG.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div ref={contentRef} className="scroll-smooth">
              <div ref={printRef} className="space-y-6">
                {/* Section 1 */}
                <section
                  data-section="s1"
                  className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden"
                >
                  <button
                    onClick={() => scrollToSection("s1")}
                    className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-dark-border/30 transition-colors"
                  >
                    <Building2 className="w-5 h-5 text-accent-purple shrink-0" />
                    <span className="font-clash font-semibold">1. Business Information</span>
                  </button>
                  <div className="px-6 pb-6">
                    <div className="grid sm:grid-cols-2 gap-x-6">
                      <FieldGroup label="Business Name" value={data.business_name} showEmpty={showEmpty} />
                      <FieldGroup label="Email" value={data.business_email} showEmpty={showEmpty} />
                      <FieldGroup label="Phone" value={data.phone_number} showEmpty={showEmpty} />
                      <FieldGroup label="Address" value={data.business_address} showEmpty={showEmpty} />
                      <FieldGroup label="Service Area" value={data.service_area} showEmpty={showEmpty} />
                      <FieldGroup label="Years Operating" value={data.years_operating} showEmpty={showEmpty} />
                    </div>
                    {(data.website_url || showEmpty) && (
                      <FieldGroup showEmpty={showEmpty}>
                        <Label>Website</Label>
                        {data.website_url ? (
                          <a
                            href={data.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[15px] text-accent-blue hover:underline"
                          >
                            {data.website_url}
                          </a>
                        ) : (
                          <Val showEmpty>Not provided</Val>
                        )}
                      </FieldGroup>
                    )}
                    {(data.google_business_profile || showEmpty) && (
                      <FieldGroup showEmpty={showEmpty}>
                        <Label>Google Business Profile</Label>
                        {data.google_business_profile ? (
                          <a
                            href={data.google_business_profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[15px] text-accent-blue hover:underline"
                          >
                            {data.google_business_profile}
                          </a>
                        ) : (
                          <Val showEmpty>Not provided</Val>
                        )}
                      </FieldGroup>
                    )}
                    <FieldGroup label="Business Hours" value={data.business_hours} showEmpty={showEmpty} />
                    {(parseSocialLinks(data.social_media_links).length > 0 || showEmpty) && (
                      <FieldGroup showEmpty={showEmpty}>
                        <Label>Social Media Links</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {parseSocialLinks(data.social_media_links).map((url) => {
                            const info = detectPlatform(url);
                            const Icon = info?.icon ?? Globe;
                            const style = PLATFORM_COLORS[info?.platform ?? "Link"];
                            return (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:opacity-90 transition-opacity ${style}`}
                              >
                                <Icon className="w-4 h-4" />
                                {info?.platform ?? "Link"}
                              </a>
                            );
                          })}
                          {parseSocialLinks(data.social_media_links).length === 0 && (
                            <Val showEmpty>{data.social_media_links || "Not provided"}</Val>
                          )}
                        </div>
                      </FieldGroup>
                    )}
                  </div>
                </section>

                {/* Section 2 */}
                <section
                  data-section="s2"
                  className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden"
                >
                  <button
                    onClick={() => scrollToSection("s2")}
                    className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-dark-border/30 transition-colors"
                  >
                    <Briefcase className="w-5 h-5 text-accent-purple shrink-0" />
                    <span className="font-clash font-semibold">2. About Your Business</span>
                  </button>
                  <div className="px-6 pb-6 space-y-0">
                    <FieldGroup label="Description" value={data.business_description} showEmpty={showEmpty} />
                    <FieldGroup label="Products/Services" value={data.products_services} showEmpty={showEmpty} />
                    <FieldGroup label="Top 3 Profitable" value={data.top_3_profitable} showEmpty={showEmpty} />
                    <FieldGroup label="Sell More Of" value={data.sell_more_of} showEmpty={showEmpty} />
                    <FieldGroup label="Target Audience" value={data.target_audience} showEmpty={showEmpty} />
                    <FieldGroup label="Unique vs Competitors" value={data.unique_vs_competitors} showEmpty={showEmpty} />
                    <FieldGroup label="Common Customer Questions" value={data.common_customer_questions} showEmpty={showEmpty} />
                  </div>
                </section>

                {/* Section 3 */}
                <section
                  data-section="s3"
                  className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden"
                >
                  <button
                    onClick={() => scrollToSection("s3")}
                    className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-dark-border/30 transition-colors"
                  >
                    <Palette className="w-5 h-5 text-accent-purple shrink-0" />
                    <span className="font-clash font-semibold">3. Branding & Assets</span>
                  </button>
                  <div className="px-6 pb-6">
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Brand Assets Available</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {arr(data.brand_assets).length
                          ? arr(data.brand_assets).map((a) => <Pill key={a}>{a}</Pill>)
                          : showEmpty && <Val showEmpty>Not provided</Val>}
                      </div>
                    </FieldGroup>
                    <FieldGroup label="Assets Description" value={data.brand_assets_description} showEmpty={showEmpty} />
                    <FieldGroup label="Professional Media" value={data.has_professional_media} showEmpty={showEmpty} />
                    <FieldGroup label="Location Visit" value={data.allow_location_visit} showEmpty={showEmpty} />
                  </div>
                </section>

                {/* Section 4 */}
                <section
                  data-section="s4"
                  className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden"
                >
                  <button
                    onClick={() => scrollToSection("s4")}
                    className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-dark-border/30 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-accent-purple shrink-0" />
                    <span className="font-clash font-semibold">4. Social & Content</span>
                  </button>
                  <div className="px-6 pb-6">
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Goals</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {arr(data.social_media_goals).map((g) => <Pill key={g}>{g}</Pill>)}
                        {!arr(data.social_media_goals).length && showEmpty && <Val showEmpty>Not provided</Val>}
                      </div>
                    </FieldGroup>
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Important Platforms</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {arr(data.important_platforms).map((p) => <Pill key={p}>{p}</Pill>)}
                        {!arr(data.important_platforms).length && showEmpty && <Val showEmpty>Not provided</Val>}
                      </div>
                    </FieldGroup>
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Content Types</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {arr(data.content_types).map((c) => <Pill key={c}>{c}</Pill>)}
                        {!arr(data.content_types).length && showEmpty && <Val showEmpty>Not provided</Val>}
                      </div>
                    </FieldGroup>
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Brand Voice</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {arr(data.brand_voice).map((b) => <Pill key={b}>{b}</Pill>)}
                        {!arr(data.brand_voice).length && showEmpty && <Val showEmpty>Not provided</Val>}
                      </div>
                    </FieldGroup>
                    <FieldGroup label="Inspiration Brands" value={data.inspiration_brands} showEmpty={showEmpty} />
                    <FieldGroup label="Posting Frequency" value={data.posting_frequency} showEmpty={showEmpty} />
                  </div>
                </section>

                {/* Section 5 */}
                <section
                  data-section="s5"
                  className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden"
                >
                  <button
                    onClick={() => scrollToSection("s5")}
                    className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-dark-border/30 transition-colors"
                  >
                    <Target className="w-5 h-5 text-accent-purple shrink-0" />
                    <span className="font-clash font-semibold">5. Advertising</span>
                  </button>
                  <div className="px-6 pb-6">
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Advertising Goals</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {arr(data.advertising_goals).map((g) => <Pill key={g}>{g}</Pill>)}
                        {!arr(data.advertising_goals).length && showEmpty && <Val showEmpty>Not provided</Val>}
                      </div>
                    </FieldGroup>
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Has Run Ads</Label>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          data.has_run_ads === "Yes"
                            ? "bg-accent-green/15 text-accent-green"
                            : "bg-dark-text/15 text-dark-text"
                        }`}
                      >
                        {data.has_run_ads || "—"}
                      </span>
                    </FieldGroup>
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Previous Platforms</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {arr(data.previous_ad_platforms).map((p) => <Pill key={p}>{p}</Pill>)}
                        {!arr(data.previous_ad_platforms).length && showEmpty && <Val showEmpty>Not provided</Val>}
                      </div>
                    </FieldGroup>
                    <FieldGroup label="Previous Results" value={data.previous_ad_results} showEmpty={showEmpty} />
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Monthly Budget</Label>
                      <span className="text-[15px] text-dark-text-light font-medium">
                        {data.monthly_ad_budget || (showEmpty ? "Not provided" : "")}
                      </span>
                    </FieldGroup>
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Ad Destinations</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {arr(data.ad_destinations).map((d) => <Pill key={d}>{d}</Pill>)}
                        {!arr(data.ad_destinations).length && showEmpty && <Val showEmpty>Not provided</Val>}
                      </div>
                    </FieldGroup>
                    <FieldGroup label="Lead Responder" value={data.lead_responder} showEmpty={showEmpty} />
                  </div>
                </section>

                {/* Section 6 */}
                <section
                  data-section="s6"
                  className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden"
                >
                  <button
                    onClick={() => scrollToSection("s6")}
                    className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-dark-border/30 transition-colors"
                  >
                    <Tag className="w-5 h-5 text-accent-purple shrink-0" />
                    <span className="font-clash font-semibold">6. Promotions & Offers</span>
                  </button>
                  <div className="px-6 pb-6">
                    <FieldGroup label="Current Promotions" value={data.current_promotions} showEmpty={showEmpty} />
                    <FieldGroup label="Focus Products" value={data.focus_products_first} showEmpty={showEmpty} />
                  </div>
                </section>

                {/* Section 7 */}
                <section
                  data-section="s7"
                  className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden"
                >
                  <button
                    onClick={() => scrollToSection("s7")}
                    className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-dark-border/30 transition-colors"
                  >
                    <Compass className="w-5 h-5 text-accent-purple shrink-0" />
                    <span className="font-clash font-semibold">7. Strategy & Expectations</span>
                  </button>
                  <div className="px-6 pb-6">
                    <FieldGroup label="3-Month Goal" value={data.three_month_goal} showEmpty={showEmpty} />
                    <FieldGroup label="Biggest Challenges" value={data.biggest_challenges} showEmpty={showEmpty} />
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Success Revenue</Label>
                      <div className="mt-2 p-4 rounded-xl bg-dark-bg/50 border border-dark-border">
                        <span className="text-lg font-semibold text-dark-text-light">
                          {data.success_revenue || (showEmpty ? "Not provided" : "")}
                        </span>
                      </div>
                    </FieldGroup>
                    <FieldGroup label="Competitors" value={data.competitors_to_analyze} showEmpty={showEmpty} />
                    <FieldGroup label="Partnership Success" value={data.partnership_success} showEmpty={showEmpty} />
                  </div>
                </section>

                {/* Section 8 */}
                <section
                  data-section="s8"
                  className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden"
                >
                  <button
                    onClick={() => scrollToSection("s8")}
                    className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-dark-border/30 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-accent-purple shrink-0" />
                    <span className="font-clash font-semibold">8. Communication & Workflow</span>
                  </button>
                  <div className="px-6 pb-6">
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Preferred Communication</Label>
                      <span className="inline-flex px-2.5 py-1 rounded-full bg-accent-purple/15 text-accent-purple text-xs">
                        {data.preferred_communication || (showEmpty ? "Not provided" : "")}
                      </span>
                    </FieldGroup>
                    <FieldGroup
                      label="Content Approver"
                      showEmpty={showEmpty}
                      value={
                        data.content_approver_name && data.content_approver_role
                          ? `${data.content_approver_name} — ${data.content_approver_role}`
                          : undefined
                      }
                    />
                    <FieldGroup label="Update Frequency" value={data.update_frequency} showEmpty={showEmpty} />
                  </div>
                </section>

                {/* Section 9 */}
                <section
                  data-section="s9"
                  className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden"
                >
                  <button
                    onClick={() => scrollToSection("s9")}
                    className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-dark-border/30 transition-colors"
                  >
                    <Key className="w-5 h-5 text-accent-purple shrink-0" />
                    <span className="font-clash font-semibold">9. Platform Access</span>
                  </button>
                  <div className="px-6 pb-6">
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Platforms</Label>
                      <div className="flex flex-wrap gap-2">
                        {arr(data.platform_access).length
                          ? arr(data.platform_access).map((p) => (
                              <span
                                key={p}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                                  PLATFORM_ACCESS_STYLES[p] ?? "bg-accent-purple/15 text-accent-purple"
                                }`}
                              >
                                <span className="text-accent-green">✓</span> {p}
                              </span>
                            ))
                          : showEmpty && <Val showEmpty>Not provided</Val>}
                      </div>
                    </FieldGroup>
                    <FieldGroup showEmpty={showEmpty}>
                      <Label>Access Confirmed</Label>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          data.access_confirmed
                            ? "bg-accent-green/15 text-accent-green"
                            : "bg-dark-text/15 text-dark-text"
                        }`}
                      >
                        {data.access_confirmed ? "Yes" : "No"}
                      </span>
                    </FieldGroup>
                  </div>
                </section>

                {/* Section 10 */}
                <section
                  data-section="s10"
                  className="rounded-2xl border border-dark-border bg-dark-card overflow-hidden"
                >
                  <button
                    onClick={() => scrollToSection("s10")}
                    className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-dark-border/30 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-accent-purple shrink-0" />
                    <span className="font-clash font-semibold">10. Final Notes</span>
                  </button>
                  <div className="px-6 pb-6">
                    <FieldGroup label="Topics to Avoid" value={data.topics_to_avoid} showEmpty={showEmpty} />
                    <FieldGroup label="Additional Notes" value={data.additional_notes} showEmpty={showEmpty} />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
