"use client";

import Link from "next/link";
import ProposalList from "@/components/admin/ProposalList";

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-clash text-3xl font-bold">Proposals</h1>
          <p className="text-dark-text mt-1">
            Manage your client proposals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/onboarding/new?type=marketing"
            className="px-4 py-2.5 rounded-lg border border-accent-purple/50 text-accent-purple text-sm font-medium hover:bg-accent-purple/10 transition-colors"
          >
            + New Onboarding Marketing
          </Link>
          <Link
            href="/admin/onboarding/new?type=visual-id"
            className="px-4 py-2.5 rounded-lg border border-accent-pink/50 text-accent-pink text-sm font-medium hover:bg-accent-pink/10 transition-colors"
          >
            + New Onboarding Visual ID
          </Link>
          <Link
            href="/admin/proposals/new"
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-accent-pink to-accent-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            + New Proposal
          </Link>
        </div>
      </div>
      <ProposalList />
    </div>
  );
}
