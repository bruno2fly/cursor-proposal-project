"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface PricingSectionProps {
  option1Name: string;
  option1Price: number;
  option1Desc: string;
  option2Name: string;
  option2Price: number;
  option2Desc: string;
  onPricingViewed?: () => void;
  onAcceptClick?: () => void;
  status: string;
}

const sharedFeatures = [
  "All included services",
  "Dedicated account manager",
  "Monthly performance reports",
  "Priority support",
  "Strategy sessions",
];

export default function PricingSection({
  option1Name,
  option1Price,
  option1Desc,
  option2Name,
  option2Price,
  option2Desc,
  onPricingViewed,
  onAcceptClick,
  status,
}: PricingSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasTracked, setHasTracked] = useState(false);
  const isAccepted = status === "accepted";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked) {
          setHasTracked(true);
          onPricingViewed?.();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasTracked, onPricingViewed]);

  return (
    <section id="pricing" className="py-28 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-accent-purple text-sm font-medium uppercase tracking-widest">
            Investment
          </span>
          <h2 className="font-clash text-4xl md:text-5xl font-bold mt-3">
            Partnership Options
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Option 1 — Recommended */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="relative rounded-2xl p-[1px] bg-gradient-to-br from-accent-purple to-accent-pink overflow-hidden"
          >
            <div className="ribbon">Recommended</div>
            <div className="relative rounded-2xl bg-dark-card p-8 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="font-clash text-xl font-semibold mb-1">
                  {option1Name}
                </h3>
                <p className="text-sm sm:text-base text-[#d4d4d8]">{option1Desc}</p>
              </div>
              <div className="mb-2">
                <span className="font-clash text-5xl font-bold text-accent-purple">
                  ${option1Price.toLocaleString()}
                </span>
                <span className="text-sm text-[#d4d4d8]">/month</span>
              </div>
              <p className="text-sm text-accent-purple/80 mb-8">
                Best value — lower monthly rate when you commit to 3 months.
              </p>
              <ul className="space-y-3 mb-8">
                {sharedFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm sm:text-base text-[#d4d4d8]"
                  >
                    <svg
                      className="w-4 h-4 text-accent-purple shrink-0"
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
                    {feature}
                  </li>
                ))}
              </ul>
              {/* CTA in pricing card */}
              {!isAccepted && onAcceptClick && (
                <button
                  onClick={onAcceptClick}
                  className="mt-auto btn-shimmer w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-white font-semibold text-sm transition-transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                >
                  Accept Proposal
                </button>
              )}
            </div>
          </motion.div>

          {/* Option 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-dark-border bg-dark-card p-8 flex flex-col"
          >
            <div className="mb-6">
              <h3 className="font-clash text-xl font-semibold mb-1">
                {option2Name}
              </h3>
              <p className="text-sm sm:text-base text-[#d4d4d8]">{option2Desc}</p>
            </div>
            <div className="mb-2">
              <span className="font-clash text-5xl font-bold">
                ${option2Price.toLocaleString()}
              </span>
              <span className="text-sm text-[#d4d4d8]">/month</span>
            </div>
            <p className="text-sm text-[#d4d4d8]/90 mb-8">
              Maximum flexibility — cancel any time with 30 days&apos; notice.
            </p>
            <ul className="space-y-3">
              {sharedFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm sm:text-base text-[#d4d4d8]"
                >
                  <svg
                    className="w-4 h-4 text-[#d4d4d8] shrink-0"
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
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Reassurance */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm sm:text-base text-[#d4d4d8] text-center mt-10"
        >
          No hidden fees. Ad spend is billed separately by the platforms and fully transparent.
        </motion.p>
      </div>
    </section>
  );
}
