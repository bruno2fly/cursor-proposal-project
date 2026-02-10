"use client";

import type { ProposalEvent } from "@/lib/types";

const eventLabels: Record<string, { label: string; color: string }> = {
  viewed: { label: "Viewed", color: "#FDCB6E" },
  accepted: { label: "Accepted", color: "#00B894" },
  declined: { label: "Declined", color: "#FF4D6A" },
  service_clicked: { label: "Service Clicked", color: "#0984E3" },
  pricing_viewed: { label: "Pricing Viewed", color: "#6C5CE7" },
};

export default function EventTimeline({ events }: { events: ProposalEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-dark-text text-sm">No events recorded yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const config = eventLabels[event.event_type] || {
          label: event.event_type,
          color: "#8B8B9E",
        };
        return (
          <div
            key={event.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-dark-bg/50 border border-dark-border"
          >
            <div
              className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
              style={{ backgroundColor: config.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: config.color }}>
                  {config.label}
                </span>
                {event.metadata &&
                  (event.metadata as Record<string, string>).service_id && (
                    <span className="text-xs text-dark-text bg-dark-card px-2 py-0.5 rounded">
                      {(event.metadata as Record<string, string>).service_id}
                    </span>
                  )}
              </div>
              <div className="text-xs text-dark-text mt-0.5">
                {new Date(event.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
