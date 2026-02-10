"use client";

import ProposalForm from "@/components/admin/ProposalForm";

export default function NewProposalPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash text-3xl font-bold">New Proposal</h1>
        <p className="text-dark-text mt-1">
          Create a new client proposal
        </p>
      </div>
      <ProposalForm />
    </div>
  );
}
