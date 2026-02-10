"use client";

import { motion } from "framer-motion";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  includes: string[];
  color: string;
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Onboarding & Access",
    description:
      "We collect your logins, assets, and context — and assign your dedicated point of contact.",
    includes: ["Brand assets & logins", "Business goals review", "Account manager assigned"],
    color: "#FF4D6A",
  },
  {
    number: "02",
    title: "Strategy Setup",
    description:
      "We audit your presence, research your market, and build a plan around your specific goals.",
    includes: ["Competitor analysis", "Audience research", "Custom campaign plan"],
    color: "#6C5CE7",
  },
  {
    number: "03",
    title: "Execution & Optimization",
    description:
      "Campaigns go live. We manage everything and optimize weekly based on real performance data.",
    includes: ["Ads, content & SEO", "Weekly optimization", "A/B testing"],
    color: "#00B894",
  },
  {
    number: "04",
    title: "Reporting & Alignment",
    description:
      "You get clear monthly reports and a strategy call to review progress and adjust together.",
    includes: ["Monthly performance report", "Strategy call", "Plan adjustments"],
    color: "#0984E3",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-accent-green text-sm font-medium uppercase tracking-widest">
            The Process
          </span>
          <h2 className="font-clash text-4xl md:text-5xl font-bold mt-3">
            How Our Partnership Works
          </h2>
        </motion.div>

        {/* ── DESKTOP: Horizontal timeline ── */}
        <div className="hidden lg:block">
          {/* Connecting rail */}
          <div className="relative">
            {/* Horizontal line spanning all dots */}
            <div className="absolute top-[21px] left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-dark-border" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="absolute top-[21px] left-[calc(12.5%)] right-[calc(12.5%)] h-px origin-left"
              style={{
                background:
                  "linear-gradient(90deg, #FF4D6A, #6C5CE7, #00B894, #0984E3)",
                opacity: 0.35,
              }}
            />

            {/* Steps row */}
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.12 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Dot */}
                  <div className="relative mb-6">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: `${step.color}15`,
                        border: `1.5px solid ${step.color}40`,
                        color: step.color,
                      }}
                    >
                      {step.number}
                    </div>
                    {/* Glow */}
                    <div
                      className="absolute inset-0 rounded-full blur-md opacity-20"
                      style={{ backgroundColor: step.color }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="font-clash text-lg font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#d4d4d8] leading-relaxed mb-4 max-w-[240px]">
                    {step.description}
                  </p>

                  {/* Includes (desktop only) */}
                  <ul className="space-y-1.5">
                    {step.includes.map((item) => (
                      <li
                        key={item}
                        className="text-sm sm:text-base text-[#d4d4d8]/90 flex items-center gap-1.5 justify-center"
                      >
                        <span
                          className="w-1 h-1 rounded-full shrink-0"
                          style={{ backgroundColor: step.color, opacity: 0.5 }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MOBILE / TABLET: Vertical timeline ── */}
        <div className="lg:hidden">
          <div className="relative pl-12">
            {/* Vertical rail line */}
            <div className="absolute left-[16px] top-2 bottom-2 w-px bg-dark-border" />
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
              className="absolute left-[16px] top-2 bottom-2 w-px origin-top"
              style={{
                background:
                  "linear-gradient(180deg, #FF4D6A, #6C5CE7, #00B894, #0984E3)",
                opacity: 0.35,
              }}
            />

            {/* Steps */}
            <div className="space-y-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Dot on the rail */}
                  <div
                    className="absolute -left-12 top-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: `${step.color}15`,
                      border: `1.5px solid ${step.color}40`,
                      color: step.color,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Content */}
                  <h3 className="font-clash text-lg font-semibold mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#d4d4d8] leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Reassurance line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sm sm:text-base text-[#d4d4d8] text-center mt-14 border-t border-dark-border pt-8"
        >
          You&apos;ll always know what&apos;s happening and what&apos;s next.
        </motion.p>
      </div>
    </section>
  );
}
