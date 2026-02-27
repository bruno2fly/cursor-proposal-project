"use client";

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: "bg-gray-500/10", text: "text-gray-400", label: "Draft" },
  sent: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Sent" },
  viewed: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "Viewed" },
  accepted: { bg: "bg-green-500/10", text: "text-green-400", label: "Accepted" },
  proposal_accepted: { bg: "bg-accent-purple/15", text: "text-accent-purple", label: "Proposal Accepted" },
  agreement_accepted: { bg: "bg-accent-green/15", text: "text-accent-green", label: "Agreement Accepted" },
  declined: { bg: "bg-red-500/10", text: "text-red-400", label: "Declined" },
};

export default function StatusBadge({
  status,
  label,
}: {
  status: string;
  label?: string;
}) {
  const config = statusConfig[status] || statusConfig.draft;
  const displayLabel = label ?? config.label;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {displayLabel}
    </span>
  );
}
