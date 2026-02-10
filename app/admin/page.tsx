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
        <Link
          href="/admin/proposals/new"
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-accent-pink to-accent-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + New Proposal
        </Link>
      </div>
      <ProposalList />
    </div>
  );
}
