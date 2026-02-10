"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import type { Proposal } from "@/lib/types";

export default function ProposalList() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
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
  }, []);

  const handleCopyLink = (slug: string, id: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    navigator.clipboard.writeText(`${siteUrl}/proposal/${slug}`);
    setCopiedId(id);
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
        <Link
          href="/admin/proposals/new"
          className="inline-flex px-4 py-2 rounded-lg bg-gradient-to-r from-accent-pink to-accent-purple text-white text-sm font-medium"
        >
          + Create First Proposal
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <div
          key={proposal.id}
          className="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-clash font-semibold text-lg truncate">
                {proposal.client_name}
              </h3>
              <StatusBadge status={proposal.status} />
            </div>
            <div className="flex items-center gap-4 text-xs text-dark-text">
              <span>/{proposal.slug}</span>
              <span>
                Created{" "}
                {new Date(proposal.created_at).toLocaleDateString()}
              </span>
              {proposal.viewed_at && (
                <span>
                  Viewed{" "}
                  {new Date(proposal.viewed_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopyLink(proposal.slug, proposal.id)}
              className="px-3 py-1.5 rounded-lg border border-dark-border text-xs text-dark-text-light hover:bg-white/5 transition-colors"
            >
              {copiedId === proposal.id ? "Copied!" : "Copy Link"}
            </button>
            <Link
              href={`/admin/proposals/${proposal.id}`}
              className="px-3 py-1.5 rounded-lg border border-dark-border text-xs text-dark-text-light hover:bg-white/5 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(proposal.id)}
              className="px-3 py-1.5 rounded-lg border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
