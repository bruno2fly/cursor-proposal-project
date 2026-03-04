"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import type { ProposalWithEvents } from "@/lib/types";

function getAgreementStatus(proposal: ProposalWithEvents) {
  const events = proposal.proposal_events ?? [];
  const agreementEvent = events.find((e) => e.event_type === "agreement_accepted");
  if (agreementEvent) {
    return { status: "agreement_accepted" as const, date: agreementEvent.created_at };
  }
  return { status: "proposal_accepted" as const, date: proposal.accepted_at };
}

interface OnboardingItem {
  id: string;
  slug: string;
  status: string;
}

interface VisualIdItem {
  id: string;
  slug: string;
  status: string;
}

export default function ProposalList() {
  const [proposals, setProposals] = useState<ProposalWithEvents[]>([]);
  const [onboardingData, setOnboardingData] = useState<Record<string, OnboardingItem>>({});
  const [visualIdData, setVisualIdData] = useState<Record<string, VisualIdItem>>({});
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/proposals")
      .then((res) => res.json())
      .then((data) => {
        setProposals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/onboarding")
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, OnboardingItem> = {};
        (Array.isArray(data) ? data : []).forEach((item: OnboardingItem) => {
          map[item.slug] = item;
        });
        setOnboardingData(map);
      })
      .catch(() => {});

    fetch("/api/onboarding-visual-id")
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, VisualIdItem> = {};
        (Array.isArray(data) ? data : []).forEach((item: VisualIdItem) => {
          map[item.slug] = item;
        });
        setVisualIdData(map);
      })
      .catch(() => {});
  }, []);

  const handleCopyLink = (slug: string, id: string, mode: "proposal" | "agreement" | "onboarding" | "visual-id") => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const path =
      mode === "agreement"
        ? `/agreement/${slug}`
        : mode === "onboarding"
          ? `/onboarding/${slug}`
          : mode === "visual-id"
            ? `/onboarding-visual-id/${slug}`
            : `/proposal/${slug}`;
    navigator.clipboard.writeText(`${siteUrl}${path}`);
    setCopiedId(`${id}-${mode}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this proposal?")) return;
    await fetch(`/api/proposals/${id}`, { method: "DELETE" });
    setProposals((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return <div className="text-dark-text">Loading proposals...</div>;
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-dark-text mb-4">No proposals yet</p>
        <Link href="/admin/proposals/new" className="inline-flex px-4 py-2 rounded-lg bg-gradient-to-r from-accent-pink to-accent-purple text-white text-sm font-medium">
          + Create First Proposal
        </Link>
      </div>
    );
  }

  const activeProposals = proposals.filter((p) => p.status !== "accepted");
  const acceptedProposals = proposals.filter((p) => p.status === "accepted");

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-clash text-2xl font-bold mb-4">Active Proposals</h2>
        {activeProposals.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-dark-border bg-dark-card/30">
            <p className="text-dark-text text-sm">No active proposals right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeProposals.map((proposal) => (
              <div key={proposal.id} className="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-clash font-semibold text-lg truncate">{proposal.client_name}</h3>
                    <StatusBadge status={proposal.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-dark-text">
                    <span>/{proposal.slug}</span>
                    <span>Created {new Date(proposal.created_at).toLocaleDateString()}</span>
                    {proposal.viewed_at && <span>Viewed {new Date(proposal.viewed_at).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleCopyLink(proposal.slug, proposal.id, "proposal")} className="px-3 py-1.5 rounded-lg border border-dark-border text-xs text-dark-text-light hover:bg-white/5 transition-colors">
                    {copiedId === `${proposal.id}-proposal` ? "Copied!" : "Copy Link"}
                  </button>
                  <Link href={`/admin/proposals/${proposal.id}`} className="px-3 py-1.5 rounded-lg border border-dark-border text-xs text-dark-text-light hover:bg-white/5 transition-colors">Edit</Link>
                  <button onClick={() => handleDelete(proposal.id)} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-clash text-2xl font-bold">Agreements</h2>
          {acceptedProposals.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-accent-green/15 text-accent-green text-xs font-medium">{acceptedProposals.length}</span>
          )}
        </div>
        {acceptedProposals.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-dark-border bg-dark-card/30">
            <p className="text-dark-text text-sm">No agreements yet. Accepted proposals will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {acceptedProposals.map((proposal) => {
              const agreementStatus = getAgreementStatus(proposal);
              return (
              <div key={proposal.id} className="bg-dark-card border border-accent-green/20 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-clash font-semibold text-lg truncate">{proposal.client_name}</h3>
                    <StatusBadge status={agreementStatus.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-dark-text flex-wrap">
                    <span>/agreement/{proposal.slug}</span>
                    <span>Created {new Date(proposal.created_at).toLocaleDateString()}</span>
                    {agreementStatus.date && (
                      <span className={agreementStatus.status === "agreement_accepted" ? "text-accent-green" : "text-accent-purple"}>
                        {agreementStatus.status === "agreement_accepted" ? "Agreement" : "Proposal"} accepted {new Date(agreementStatus.date).toLocaleDateString()}
                      </span>
                    )}
                    {onboardingData[proposal.slug] ? (
                      <span className="text-accent-blue">
                        Onboarding {onboardingData[proposal.slug].status === "reviewed" ? "Reviewed" : "Completed"}
                      </span>
                    ) : (
                      <span className="text-dark-text">Onboarding Pending</span>
                    )}
                    {visualIdData[proposal.slug] ? (
                      <span className="text-accent-pink">
                        Visual ID {visualIdData[proposal.slug].status === "reviewed" ? "Reviewed" : "Completed"}
                      </span>
                    ) : (
                      <span className="text-dark-text">Visual ID Pending</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleCopyLink(proposal.slug, proposal.id, "agreement")} className="px-3 py-1.5 rounded-lg border border-dark-border text-xs text-dark-text-light hover:bg-white/5 transition-colors">
                    {copiedId === `${proposal.id}-agreement` ? "Copied!" : "Copy Agreement Link"}
                  </button>
                  <button onClick={() => handleCopyLink(proposal.slug, proposal.id, "onboarding")} className="px-3 py-1.5 rounded-lg border border-accent-purple/50 text-xs text-accent-purple hover:bg-accent-purple/10 transition-colors">
                    {copiedId === `${proposal.id}-onboarding` ? "Copied!" : "Copy Onboarding Link"}
                  </button>
                  <button onClick={() => handleCopyLink(proposal.slug, proposal.id, "visual-id")} className="px-3 py-1.5 rounded-lg border border-accent-pink/50 text-xs text-accent-pink hover:bg-accent-pink/10 transition-colors">
                    {copiedId === `${proposal.id}-visual-id` ? "Copied!" : "Copy Visual ID Link"}
                  </button>
                  <Link href={`/agreement/${proposal.slug}`} className="px-3 py-1.5 rounded-lg border border-accent-green/30 text-xs text-accent-green hover:bg-accent-green/10 transition-colors">View Agreement</Link>
                  {onboardingData[proposal.slug] && (
                    <Link
                      href={`/admin/onboarding/${onboardingData[proposal.slug].id}`}
                      className="px-3 py-1.5 rounded-lg border border-accent-blue/30 text-xs text-accent-blue hover:bg-accent-blue/10 transition-colors"
                    >
                      View Onboarding
                    </Link>
                  )}
                  {visualIdData[proposal.slug] && (
                    <Link
                      href={`/admin/onboarding-visual-id/${visualIdData[proposal.slug].id}`}
                      className="px-3 py-1.5 rounded-lg border border-accent-pink/30 text-xs text-accent-pink hover:bg-accent-pink/10 transition-colors"
                    >
                      View Visual ID
                    </Link>
                  )}
                  <button onClick={() => handleDelete(proposal.id)} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-colors">Delete</button>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
