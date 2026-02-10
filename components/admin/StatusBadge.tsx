"use client";

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: "bg-gray-500/10", text: "text-gray-400" },
  sent: { bg: "bg-blue-500/10", text: "text-blue-400" },
  viewed: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
  accepted: { bg: "bg-green-500/10", text: "text-green-400" },
  declined: { bg: "bg-red-500/10", text: "text-red-400" },
};

export default function StatusBadge({ status }: { status: string }) {
  const colors = statusColors[status] || statusColors.draft;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors.bg} ${colors.text}`}
    >
      {status}
    </span>
  );
}
