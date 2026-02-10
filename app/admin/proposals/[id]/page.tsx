"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProposalForm from "@/components/admin/ProposalForm";
import EventTimeline from "@/components/admin/EventTimeline";
import StatusBadge from "@/components/admin/StatusBadge";
import type { Proposal, ProposalEvent } from "@/lib/types";

export default function EditProposalPage() {
  const params = useParams();
  const id = params.id as string;

  const [proposal, setProposal] = useState<
    | (Proposal & {
        proposal_services: {
          service_id: string;
          enabled: boolean;
          sort_order: number;
          custom_summary: string | null;
        }[];
        proposal_events: ProposalEvent[];
      })
    | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/proposals/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProposal(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-dark-text">Loading proposal...</div>;
  }

  if (!proposal) {
    return <div className="text-red-400">Proposal not found</div>;
  }

  const events = proposal.proposal_events || [];
  const viewCount = events.filter((e) => e.event_type === "viewed").length;
  const servicesExplored = [
    ...new Set(
      events
        .filter((e) => e.event_type === "service_clicked")
        .map((e) => (e.metadata as Record<string, string>)?.service_id)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-clash text-3xl font-bold">
            {proposal.client_name}
          </h1>
          <StatusBadge status={proposal.status} />
        </div>
        <p className="text-dark-text">Edit proposal and view analytics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="text-2xl font-bold text-accent-pink">{viewCount}</div>
          <div className="text-xs text-dark-text">Total Views</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="text-2xl font-bold text-accent-blue">
            {servicesExplored.length}
          </div>
          <div className="text-xs text-dark-text">Services Explored</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="text-2xl font-bold text-accent-purple">
            {events.filter((e) => e.event_type === "pricing_viewed").length}
          </div>
          <div className="text-xs text-dark-text">Pricing Views</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="text-2xl font-bold text-accent-green">
            {events.length}
          </div>
          <div className="text-xs text-dark-text">Total Events</div>
        </div>
      </div>

      {/* Services explored */}
      {servicesExplored.length > 0 && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <h3 className="text-sm font-medium mb-2">Services Explored</h3>
          <div className="flex flex-wrap gap-2">
            {servicesExplored.map((svc) => (
              <span
                key={svc}
                className="px-2.5 py-1 rounded-lg bg-accent-blue/10 text-accent-blue text-xs"
              >
                {svc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Event Timeline */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h2 className="font-clash text-lg font-semibold mb-4">
          Event Timeline
        </h2>
        <EventTimeline events={events} />
      </div>

      {/* Edit Form */}
      <div>
        <h2 className="font-clash text-lg font-semibold mb-4">
          Edit Proposal
        </h2>
        <ProposalForm proposal={proposal} />
      </div>
    </div>
  );
}
