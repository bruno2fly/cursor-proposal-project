"use client";

import { motion } from "framer-motion";

interface CTASectionProps {
  proposalId: string;
  status: string;
  onAccept: () => Promise<void>;
}

export default function CTASection({
  status,
  onAccept,
}: CTASectionProps) {
  const isAccepted = status === "accepted";

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-12 text-center bg-gradient-to-br from-accent-pink/20 via-accent-purple/10 to-accent-green/10 border border-dark-border"
        >
          <h2 className="font-clash text-3xl md:text-4xl font-bold mb-4">
            {isAccepted ? "Proposal Accepted!" : "Ready to Grow Together?"}
          </h2>
          <p className="text-sm sm:text-base text-[#d4d4d8] mb-8 max-w-lg mx-auto leading-relaxed">
            {isAccepted
              ? "Thank you for choosing 2FLY Marketing. We're excited to start this partnership and drive results for your business."
              : "Let's turn your vision into reality. Accept this proposal to get started, or schedule a call to discuss further."}
          </p>

          {!isAccepted && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onAccept}
                className="btn-shimmer px-10 py-4 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-white font-semibold text-base transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:ring-offset-2 focus:ring-offset-dark-bg"
              >
                Accept Proposal
              </button>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-xl border border-dark-border text-white font-semibold text-sm hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-border"
              >
                Schedule a Call
              </a>
            </div>
          )}

          {isAccepted && (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green/10 border border-accent-green/30 text-accent-green">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Proposal Accepted
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
