"use client";

import { motion } from "framer-motion";

const metrics = [
  {
    label: "Calls & Reservations",
    description: "Direct actions driven by ads and local SEO — the numbers that affect your bottom line.",
    color: "#FF4D6A",
  },
  {
    label: "Ad Efficiency",
    description: "Cost per lead, click-through rates, and return on ad spend — tracked and optimized weekly.",
    color: "#6C5CE7",
  },
  {
    label: "Website Actions",
    description: "Form submissions, direction requests, phone taps — every meaningful interaction measured.",
    color: "#00B894",
  },
  {
    label: "Audience Growth",
    description: "Followers, engagement, and reach across platforms — building long-term brand equity.",
    color: "#0984E3",
  },
];

export default function ProgressMetrics() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-accent-blue text-sm font-medium uppercase tracking-widest">
            Measurable Results
          </span>
          <h2 className="font-clash text-4xl md:text-5xl font-bold mt-3">
            What Progress Looks Like
          </h2>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-dark-border bg-dark-card/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: metric.color }}
                />
                <h3 className="font-clash text-lg font-semibold">
                  {metric.label}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-[#d4d4d8] leading-relaxed pl-[22px]">
                {metric.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm sm:text-base text-[#d4d4d8] max-w-2xl mx-auto leading-relaxed border-t border-dark-border pt-10">
            We don&apos;t promise specific numbers — markets vary.
            What we guarantee is a structured, data-driven approach where every
            dollar is tracked, every campaign is optimized, and nothing runs on
            autopilot.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
