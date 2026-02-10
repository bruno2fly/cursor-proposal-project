"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AmbientBackground from "./AmbientBackground";
import ProposalNav from "./ProposalNav";
import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import ServicesGrid from "./ServicesGrid";
import HowItWorks from "./HowItWorks";
import CustomStrategy from "./CustomStrategy";
import ProgressMetrics from "./ProgressMetrics";
import TrustBlock from "./TrustBlock";
import PricingSection from "./PricingSection";
import FAQ from "./FAQ";
import NextSteps from "./NextSteps";
import CTASection from "./CTASection";
import StickyAcceptBar from "./StickyAcceptBar";
import type { ProposalWithServices } from "@/lib/types";

interface ProposalPageProps {
  proposal: ProposalWithServices;
}

export default function ProposalPageClient({ proposal }: ProposalPageProps) {
  const hasLoggedView = useRef(false);
  const [currentStatus, setCurrentStatus] = useState(proposal.status);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const logEvent = useCallback(
    async (
      eventType: string,
      metadata?: Record<string, unknown>
    ) => {
      try {
        await fetch(`/api/proposals/${proposal.id}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event_type: eventType, metadata }),
        });
      } catch {
        // Silently fail — don't interrupt UX for analytics
      }
    },
    [proposal.id]
  );

  useEffect(() => {
    if (!hasLoggedView.current) {
      hasLoggedView.current = true;
      logEvent("viewed");
    }
  }, [logEvent]);

  const enabledServices = proposal.proposal_services
    .filter((s) => s.enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  const openAcceptModal = () => setShowAcceptModal(true);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await fetch(`/api/proposals/${proposal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });
      await logEvent("accepted");
      setCurrentStatus("accepted");
      setShowAcceptModal(false);
      setShowSuccessPopup(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <ProposalNav status={currentStatus} />

      <main className="relative z-10">
        <HeroSection
          clientName={proposal.client_name}
          heroTitle={proposal.hero_title}
          heroSubtitle={proposal.hero_subtitle}
          customNote={proposal.custom_note}
          status={currentStatus}
          onAcceptClick={openAcceptModal}
        />

        <StatsSection serviceCount={enabledServices.length} />

        <ServicesGrid
          services={enabledServices.map((s) => ({
            service_id: s.service_id,
            custom_summary: s.custom_summary,
            service_templates: s.service_templates,
          }))}
          proposalId={proposal.id}
          onServiceClick={(serviceId) =>
            logEvent("service_clicked", { service_id: serviceId })
          }
        />

        <HowItWorks />

        <CustomStrategy />

        <ProgressMetrics />

        <TrustBlock />

        <PricingSection
          option1Name={proposal.pricing_option_1_name}
          option1Price={proposal.pricing_option_1_price}
          option1Desc={proposal.pricing_option_1_desc}
          option2Name={proposal.pricing_option_2_name}
          option2Price={proposal.pricing_option_2_price}
          option2Desc={proposal.pricing_option_2_desc}
          onPricingViewed={() => logEvent("pricing_viewed")}
          onAcceptClick={openAcceptModal}
          status={currentStatus}
        />

        <FAQ />

        <NextSteps />

        <CTASection
          proposalId={proposal.id}
          status={currentStatus}
          onAccept={async () => openAcceptModal()}
        />

        {/* Footer */}
        <footer className="py-10 px-6 border-t border-dark-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-clash text-lg font-bold">
                2<span className="gradient-text">FLY</span>
              </div>
              <p className="text-sm sm:text-base text-[#d4d4d8] text-center sm:text-right max-w-md leading-relaxed">
                2FLY is a performance marketing agency helping local businesses grow through
                data-driven strategy, paid media, and creative execution.
              </p>
            </div>
            <p className="text-sm text-[#d4d4d8]/80 text-center mt-6">
              &copy; {new Date().getFullYear()} 2FLY Agency. All rights reserved.
            </p>
          </div>
        </footer>
      </main>

      {/* Sticky Accept CTA */}
      <StickyAcceptBar
        onAcceptClick={openAcceptModal}
        status={currentStatus}
      />

      {/* Shared Confirmation Modal */}
      <AnimatePresence>
        {showAcceptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !isAccepting && setShowAcceptModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-card border border-dark-border rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="font-clash text-2xl font-bold mb-2">
                Accept Proposal?
              </h3>
              <p className="text-sm sm:text-base text-[#d4d4d8] mb-6 leading-relaxed">
                By accepting this proposal, you confirm your interest in
                partnering with 2FLY Marketing. Our team will reach out within
                48 hours to finalize the details and get started.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="flex-1 btn-shimmer px-6 py-3 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-white font-semibold text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                >
                  {isAccepting ? "Accepting..." : "Yes, Accept"}
                </button>
                <button
                  onClick={() => setShowAcceptModal(false)}
                  disabled={isAccepting}
                  className="flex-1 px-6 py-3 rounded-xl border border-dark-border text-white font-semibold text-sm hover:bg-white/5 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-dark-border"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success celebration pop-up — animated, reinforces best decision */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowSuccessPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 28,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-2xl p-8 sm:p-10 max-w-md w-full text-center overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(18,18,26,0.98) 0%, rgba(30,30,46,0.95) 100%)",
                border: "1px solid rgba(0, 184, 148, 0.3)",
                boxShadow: "0 0 60px rgba(0, 184, 148, 0.15), 0 24px 48px rgba(0,0,0,0.4)",
              }}
            >
              {/* Subtle gradient glow behind content */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,184,148,0.25), transparent)",
                }}
              />

              {/* Animated checkmark circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                className="relative mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: "rgba(0, 184, 148, 0.15)",
                  border: "2px solid rgba(0, 184, 148, 0.5)",
                }}
              >
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="w-10 h-10 text-accent-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path d="M5 13l4 4L19 7" />
                </motion.svg>
              </motion.div>

              <h3 className="font-clash text-2xl sm:text-3xl font-bold text-white mb-3 relative">
                Proposal Accepted!
              </h3>
              <p className="text-sm sm:text-base text-[#d4d4d8] leading-relaxed mb-8 max-w-sm mx-auto relative">
                Thank you for choosing 2FLY Marketing. You just made the best decision to start growing your business — we&apos;re excited to get started and drive real results with you.
              </p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setShowSuccessPopup(false)}
                className="relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-green/50"
                style={{
                  background: "rgba(0, 184, 148, 0.15)",
                  border: "1px solid rgba(0, 184, 148, 0.5)",
                  color: "#2dd4bf",
                }}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Proposal Accepted
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
