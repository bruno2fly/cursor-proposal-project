"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { ServiceTemplate, Proposal } from "@/lib/types";

interface ProposalFormProps {
  proposal?: Proposal & {
    proposal_services?: {
      service_id: string;
      enabled: boolean;
      sort_order: number;
      custom_summary: string | null;
    }[];
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProposalForm({ proposal }: ProposalFormProps) {
  const router = useRouter();
  const isEditing = !!proposal;

  const [templates, setTemplates] = useState<ServiceTemplate[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [clientName, setClientName] = useState(proposal?.client_name || "");
  const [clientLogoUrl, setClientLogoUrl] = useState(proposal?.client_logo_url || "");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [slug, setSlug] = useState(proposal?.slug || "");
  const [heroTitle, setHeroTitle] = useState(
    proposal?.hero_title || "360° Marketing Service"
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    proposal?.hero_subtitle || ""
  );
  const [customNote, setCustomNote] = useState(proposal?.custom_note || "");
  const [status, setStatus] = useState(proposal?.status || "draft");
  const [pricing1Name, setPricing1Name] = useState(
    proposal?.pricing_option_1_name || "3-Month Agreement"
  );
  const [pricing1Price, setPricing1Price] = useState(
    proposal?.pricing_option_1_price || 1100
  );
  const [pricing1Desc, setPricing1Desc] = useState(
    proposal?.pricing_option_1_desc ||
      "Commit to growth with our recommended partnership plan."
  );
  const [pricing2Name, setPricing2Name] = useState(
    proposal?.pricing_option_2_name || "Month-to-Month"
  );
  const [pricing2Price, setPricing2Price] = useState(
    proposal?.pricing_option_2_price || 1400
  );
  const [pricing2Desc, setPricing2Desc] = useState(
    proposal?.pricing_option_2_desc ||
      "Flexible month-to-month plan with no long-term commitment."
  );

  // Services state: { service_id: { enabled, sort_order, custom_summary } }
  const [services, setServices] = useState<
    Record<
      string,
      { enabled: boolean; sort_order: number; custom_summary: string }
    >
  >({});

  // Load service templates
  useEffect(() => {
    fetch("/api/service-templates")
      .then((res) => res.json())
      .then((data: ServiceTemplate[]) => {
        setTemplates(data);

        // Initialize services state
        if (proposal?.proposal_services) {
          const svcMap: Record<
            string,
            { enabled: boolean; sort_order: number; custom_summary: string }
          > = {};
          data.forEach((t) => {
            const existing = proposal.proposal_services?.find(
              (s) => s.service_id === t.id
            );
            svcMap[t.id] = {
              enabled: existing ? existing.enabled : true,
              sort_order: existing ? existing.sort_order : t.sort_order,
              custom_summary: existing?.custom_summary || "",
            };
          });
          setServices(svcMap);
        } else {
          const svcMap: Record<
            string,
            { enabled: boolean; sort_order: number; custom_summary: string }
          > = {};
          data.forEach((t) => {
            svcMap[t.id] = {
              enabled: true,
              sort_order: t.sort_order,
              custom_summary: "",
            };
          });
          setServices(svcMap);
        }
      })
      .catch(console.error);
  }, [proposal]);

  // Auto-generate slug from client name
  useEffect(() => {
    if (!isEditing && clientName) {
      setSlug(slugify(clientName));
    }
  }, [clientName, isEditing]);

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { url } = await res.json();
      setClientLogoUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleLogoUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLogoUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const servicesList = Object.entries(services).map(([id, svc]) => ({
      service_id: id,
      enabled: svc.enabled,
      sort_order: svc.sort_order,
      custom_summary: svc.custom_summary || null,
    }));

    const body = {
      client_name: clientName,
      client_logo_url: clientLogoUrl || null,
      slug,
      status,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle || null,
      custom_note: customNote || null,
      pricing_option_1_name: pricing1Name,
      pricing_option_1_price: pricing1Price,
      pricing_option_1_desc: pricing1Desc,
      pricing_option_2_name: pricing2Name,
      pricing_option_2_price: pricing2Price,
      pricing_option_2_desc: pricing2Desc,
      services: servicesList,
    };

    try {
      const url = isEditing
        ? `/api/proposals/${proposal.id}`
        : "/api/proposals";
      const method = isEditing ? "PATCH" : "POST";

      // Get current session token for auth
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggleService = (id: string) => {
    setServices((prev) => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id].enabled },
    }));
  };

  const inputClasses =
    "w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-accent-purple transition-colors";
  const labelClasses = "block text-sm text-dark-text-light mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h2 className="font-clash text-lg font-semibold mb-4">
          Basic Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Client Name *</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={inputClasses}
              required
              placeholder="e.g. SUPERCRISP"
            />
          </div>
          <div>
            <label className={labelClasses}>Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputClasses}
              required
              placeholder="e.g. supercrisp-q1-2025"
            />
          </div>
          <div>
            <label className={labelClasses}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Proposal["status"])}
              className={inputClasses}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>

        {/* Client Logo Upload */}
        <div className="mt-4">
          <label className={labelClasses}>Client Logo</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 px-4 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              dragOver
                ? "border-accent-purple bg-accent-purple/10"
                : clientLogoUrl
                  ? "border-accent-green/30 bg-accent-green/5"
                  : "border-dark-border hover:border-dark-text/40 hover:bg-white/[0.02]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              onChange={handleFileSelect}
              className="hidden"
            />

            {uploading ? (
              <div className="flex items-center gap-2 text-sm text-dark-text-light">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading...
              </div>
            ) : clientLogoUrl ? (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-dark-bg border border-dark-border overflow-hidden flex items-center justify-center">
                  <Image
                    src={clientLogoUrl}
                    alt="Client logo"
                    width={56}
                    height={56}
                    unoptimized
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">Logo uploaded</p>
                  <p className="text-xs text-dark-text truncate max-w-[260px]">{clientLogoUrl}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setClientLogoUrl("");
                  }}
                  className="p-1.5 rounded-lg text-dark-text hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Remove logo"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-center text-dark-text">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm text-dark-text-light">
                    <span className="text-accent-purple font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-dark-text mt-1">PNG, JPG, WebP or SVG (max 2MB)</p>
                </div>
              </>
            )}
          </div>
          <p className="text-xs text-dark-text mt-1.5">
            The client logo will appear in the hero with an animated partnership graphic connecting 2FLY and the client.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h2 className="font-clash text-lg font-semibold mb-4">
          Proposal Content
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClasses}>Hero Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Hero Subtitle</label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className={`${inputClasses} resize-none`}
              rows={2}
              placeholder="Custom tagline for this client"
            />
          </div>
          <div>
            <label className={labelClasses}>Personal Note (optional)</label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className={`${inputClasses} resize-none`}
              rows={2}
              placeholder="A personal note shown at the top of the proposal"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h2 className="font-clash text-lg font-semibold mb-4">Pricing</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 rounded-xl border border-accent-purple/20 bg-accent-purple/5">
            <h3 className="text-sm font-medium text-accent-purple">
              Option 1 (Recommended)
            </h3>
            <div>
              <label className={labelClasses}>Name</label>
              <input
                type="text"
                value={pricing1Name}
                onChange={(e) => setPricing1Name(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Price ($/month)</label>
              <input
                type="number"
                value={pricing1Price}
                onChange={(e) => setPricing1Price(Number(e.target.value))}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Description</label>
              <input
                type="text"
                value={pricing1Desc}
                onChange={(e) => setPricing1Desc(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
          <div className="space-y-3 p-4 rounded-xl border border-dark-border">
            <h3 className="text-sm font-medium text-dark-text-light">
              Option 2
            </h3>
            <div>
              <label className={labelClasses}>Name</label>
              <input
                type="text"
                value={pricing2Name}
                onChange={(e) => setPricing2Name(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Price ($/month)</label>
              <input
                type="number"
                value={pricing2Price}
                onChange={(e) => setPricing2Price(Number(e.target.value))}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Description</label>
              <input
                type="text"
                value={pricing2Desc}
                onChange={(e) => setPricing2Desc(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h2 className="font-clash text-lg font-semibold mb-4">Services</h2>
        <div className="space-y-3">
          {templates.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-xl border transition-colors ${
                services[t.id]?.enabled
                  ? "border-accent-green/20 bg-accent-green/5"
                  : "border-dark-border bg-dark-bg/30 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleService(t.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                    services[t.id]?.enabled
                      ? "bg-accent-green border-accent-green text-white"
                      : "border-dark-border"
                  }`}
                >
                  {services[t.id]?.enabled && (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-lg">{t.icon}</span>
                <span className="font-medium text-sm">{t.title}</span>
                {t.subtitle && (
                  <span className="text-xs text-dark-text">({t.subtitle})</span>
                )}
              </div>
              {services[t.id]?.enabled && (
                <div className="mt-3 ml-8">
                  <input
                    type="text"
                    value={services[t.id]?.custom_summary || ""}
                    onChange={(e) =>
                      setServices((prev) => ({
                        ...prev,
                        [t.id]: {
                          ...prev[t.id],
                          custom_summary: e.target.value,
                        },
                      }))
                    }
                    className={`${inputClasses} text-xs`}
                    placeholder={`Custom summary (leave blank to use default)`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-accent-pink to-accent-purple text-white font-medium text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Update Proposal" : "Create Proposal"}
        </button>
        {isEditing && (
          <a
            href={`/proposal/${proposal.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-lg border border-dark-border text-white text-sm hover:bg-white/5 transition-colors"
          >
            Preview
          </a>
        )}
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-2.5 rounded-lg text-dark-text text-sm hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
