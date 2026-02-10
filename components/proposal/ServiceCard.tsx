"use client";

import { motion } from "framer-motion";

interface ServiceCardProps {
  icon: string;
  title: string;
  subtitle: string | null;
  summary: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function ServiceCard({
  icon,
  title,
  subtitle,
  summary,
  color,
  isSelected,
  onClick,
}: ServiceCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      aria-expanded={isSelected}
      className={`w-full text-left cursor-pointer p-6 rounded-2xl border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent-purple/40 ${
        isSelected
          ? "bg-dark-card border-opacity-50"
          : "bg-dark-card/30 border-dark-border hover:border-opacity-40"
      }`}
      style={{
        borderColor: isSelected ? color : undefined,
        boxShadow: isSelected ? `0 0 30px ${color}15` : undefined,
      }}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-clash text-lg font-semibold mb-1">{title}</h3>
      {subtitle && (
        <p className="text-sm text-[#d4d4d8] mb-2">{subtitle}</p>
      )}
      <p className="text-sm sm:text-base text-[#d4d4d8] leading-relaxed line-clamp-3">
        {summary}
      </p>
      <div
        className="mt-4 inline-flex items-center gap-1.5 group/link"
        style={{ color }}
      >
        <span className="text-sm font-medium underline underline-offset-2 decoration-current/40 group-hover/link:decoration-current transition-colors">
          {isSelected ? "Hide details" : "Learn more"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isSelected ? "rotate-90" : "group-hover/link:translate-x-0.5"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  );
}
