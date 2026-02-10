"use client";

import { useEffect, useState } from "react";

interface ProposalNavProps {
  status: string;
}

export default function ProposalNav({ status }: ProposalNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAccepted = status === "accepted";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-clash text-xl font-bold tracking-tight">
          2<span className="gradient-text">FLY</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isAccepted ? "bg-accent-green" : "bg-accent-green animate-pulse"
            }`}
          />
          <span className="text-sm sm:text-base text-[#d4d4d8]">
            {isAccepted ? "Proposal Accepted" : "Proposal Active"}
          </span>
          {isAccepted && <span className="text-accent-green ml-1">✓</span>}
        </div>
      </div>
    </nav>
  );
}
