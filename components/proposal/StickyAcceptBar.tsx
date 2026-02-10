"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StickyAcceptBarProps {
  onAcceptClick: () => void;
  status: string;
  enabled?: boolean;
}

export default function StickyAcceptBar({
  onAcceptClick,
  status,
  enabled = true,
}: StickyAcceptBarProps) {
  const [visible, setVisible] = useState(false);
  const isAccepted = status === "accepted";

  useEffect(() => {
    if (!enabled || isAccepted) return;

    const handleScroll = () => {
      // Show after scrolling past the hero (roughly one viewport height)
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled, isAccepted]);

  if (!enabled || isAccepted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-lg px-4 pb-4 sm:pb-5">
            <div className="flex items-center justify-between gap-3 px-5 py-3 rounded-2xl border border-dark-border bg-dark-card/95 backdrop-blur-md shadow-2xl shadow-black/40">
              <span className="text-sm sm:text-base text-[#d4d4d8] hidden sm:block">
                Ready to get started?
              </span>
              <button
                onClick={onAcceptClick}
                className="btn-shimmer flex-shrink-0 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-white font-semibold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-purple/50 sm:ml-auto"
              >
                Accept Proposal
              </button>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-4 py-2.5 rounded-xl border border-dark-border text-white text-sm font-medium hover:bg-white/5 transition-colors hidden sm:inline-flex"
              >
                Schedule a Call
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
