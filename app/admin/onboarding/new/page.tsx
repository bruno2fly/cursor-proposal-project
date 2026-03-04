"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewOnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "marketing";

  const [clientName, setClientName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (clientName) {
      setSlug(slugify(clientName));
    }
  }, [clientName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          client_name: clientName,
          slug,
          status: "accepted",
          accepted_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  const isMarketing = type === "marketing";
  const title = isMarketing ? "New Onboarding Marketing" : "New Onboarding Visual ID";
  const subtitle = isMarketing
    ? "Add a client for Marketing onboarding. They will appear in Agreement/Clients."
    : "Add a client for Visual ID onboarding. They will appear in Agreement/Clients.";

  const inputClasses =
    "w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-dark-text-light placeholder:text-dark-text text-sm focus:outline-none focus:border-accent-purple transition-colors";
  const labelClasses = "block text-sm text-dark-text-light mb-1.5";

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-dark-text hover:text-white text-sm mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="font-clash text-3xl font-bold">{title}</h1>
        <p className="text-dark-text mt-1">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-xl">
          <h2 className="font-clash text-lg font-semibold mb-4">
            Client Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Client Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={inputClasses}
                placeholder="e.g. Acme Corp"
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Slug (URL path) *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={inputClasses}
                placeholder="e.g. acme-corp"
                required
              />
              <p className="text-xs text-dark-text mt-1">
                Used for onboarding links: /onboarding/{slug || "..."} and /onboarding-visual-id/{slug || "..."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-accent-pink to-accent-purple text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Onboarding"}
          </button>
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-lg border border-dark-border text-dark-text-light text-sm hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
