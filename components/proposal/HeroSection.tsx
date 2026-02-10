"use client";

import { motion, type Variants } from "framer-motion";
import ScrollIndicator from "./ScrollIndicator";

interface HeroSectionProps {
  clientName: string;
  heroTitle: string;
  heroSubtitle: string | null;
  customNote: string | null;
  status: string;
  onAcceptClick: () => void;
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
};

export default function HeroSection({
  clientName,
  heroTitle,
  heroSubtitle,
  customNote,
  status,
  onAcceptClick,
}: HeroSectionProps) {
  const titleParts = heroTitle.split("Marketing");
  const hasMarketingWord = titleParts.length > 1;
  const isAccepted = status === "accepted";

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto text-center"
      >
        {/* Status badge */}
        <motion.div variants={slideUp} className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-pink/30 bg-accent-pink/10 text-accent-pink text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-pink" />
            Prepared for {clientName}
          </span>
        </motion.div>

        {/* Proposal status line */}
        <motion.div variants={slideUp} className="mb-8">
          <p className="text-sm sm:text-base text-[#d4d4d8]">
            Status: {isAccepted ? (
              <span className="text-accent-green font-medium">Accepted</span>
            ) : (
              <span className="text-accent-green font-medium">Active</span>
            )}
            {!isAccepted && (
              <span className="text-[#d4d4d8]"> · Valid for 30 days from receipt</span>
            )}
          </p>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={slideUp}
          className="font-clash text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6"
        >
          {hasMarketingWord ? (
            <>
              {titleParts[0]}
              <span className="gradient-text">Marketing</span>
              {titleParts[1]}
            </>
          ) : (
            heroTitle
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={slideUp}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed text-[#e4e4e7]"
        >
          {heroSubtitle ||
            "A comprehensive digital marketing partnership designed to elevate your brand, drive growth, and deliver measurable results."}
        </motion.p>

        {/* Custom note */}
        {customNote && (
          <motion.div
            variants={slideUp}
            className="max-w-lg mx-auto mb-8 p-4 rounded-xl border border-dark-border bg-dark-card/50 text-sm sm:text-base text-[#d4d4d8] italic leading-relaxed"
          >
            &ldquo;{customNote}&rdquo;
          </motion.div>
        )}

        {/* CTAs — Accept is primary */}
        <motion.div
          variants={slideUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {!isAccepted && (
            <button
              onClick={onAcceptClick}
              className="btn-shimmer px-10 py-4 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-white font-semibold text-base transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:ring-offset-2 focus:ring-offset-dark-bg"
            >
              Accept Proposal
            </button>
          )}
          <button
            onClick={() => scrollToSection("services")}
            className="px-6 py-3.5 rounded-xl border border-dark-border text-[#d4d4d8] font-medium text-sm sm:text-base hover:bg-white/5 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-dark-border"
          >
            Explore Services ↓
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="px-6 py-3.5 rounded-xl border border-dark-border text-[#d4d4d8] font-medium text-sm sm:text-base hover:bg-white/5 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-dark-border"
          >
            View Pricing
          </button>
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
