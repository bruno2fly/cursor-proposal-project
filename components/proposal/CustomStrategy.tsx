"use client";

import { motion } from "framer-motion";

/** Accent color key per item for icon + card border glow. WCAG-friendly. */
const ACCENT_COLORS = [
  { name: "blue", hex: "#0984E3", bg: "rgba(9,132,227,0.12)", border: "rgba(9,132,227,0.25)" },
  { name: "purple", hex: "#6C5CE7", bg: "rgba(108,92,231,0.12)", border: "rgba(108,92,231,0.25)" },
  { name: "pink", hex: "#FF4D6A", bg: "rgba(255,77,106,0.12)", border: "rgba(255,77,106,0.25)" },
  { name: "green", hex: "#00B894", bg: "rgba(0,184,148,0.12)", border: "rgba(0,184,148,0.25)" },
  { name: "amber", hex: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
  { name: "teal", hex: "#14B8A6", bg: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.25)" },
] as const;

interface StrategyPoint {
  title: string;
  text: string;
  icon: React.ReactNode;
}

/** Single benefit card: distinct background, hover state, 44px+ touch target, focus ring. */
function BenefitCard({
  point,
  accent,
  index,
}: {
  point: StrategyPoint;
  accent: (typeof ACCENT_COLORS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.02 }}
      className="min-h-[44px] min-w-[44px] rounded-xl p-6 sm:p-7 transition-all duration-300 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-dark-bg"
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        outline: "none",
      }}
      tabIndex={0}
    >
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 mb-4"
        style={{
          backgroundColor: accent.bg,
          border: `1px solid ${accent.border}`,
          color: accent.hex,
        }}
      >
        {point.icon}
      </div>
      <h3 className="font-semibold text-lg sm:text-xl mb-2" style={{ color: "#f4f4f5" }}>
        {point.title}
      </h3>
      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#d4d4d8" }}>
        {point.text}
      </p>
    </motion.div>
  );
}

const points: StrategyPoint[] = [
  {
    title: "Custom strategy from day one",
    text: "Built around your business goals, location, and audience — not a recycled playbook.",
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    title: "Competitor & market research",
    text: "We study your local competition, find gaps, and identify the fastest path to ROI.",
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
  },
  {
    title: "Monthly review & optimization",
    text: "Every ad, post, and campaign is reviewed and adjusted based on what the data tells us.",
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>
    ),
  },
  {
    title: "ROI-focused decisions",
    text: "We prioritize actions that drive revenue — not vanity metrics.",
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Full transparency & sign-off",
    text: "Nothing goes live without your approval. You stay in control of your brand.",
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Goal-driven execution",
    text: "Every decision is tied to your business goals. If it doesn't move the needle, we don't do it.",
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export default function CustomStrategy() {
  return (
    <section
      className="py-28 px-6"
      aria-labelledby="strategy-heading"
    >
      {/* Outer container: max-width 1280px, centered. Left accent + gradient border + soft glow. */}
      <div className="max-w-7xl mx-auto">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(18,18,26,0.95) 0%, rgba(18,18,26,0.85) 100%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -12px rgba(0,0,0,0.5)",
          }}
        >
          {/* Left accent bar (2–3px gradient) for importance */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
            style={{
              background: "linear-gradient(180deg, #0984E3, #6C5CE7, #FF4D6A)",
            }}
          />

          <div className="relative pl-6 sm:pl-8 py-10 sm:py-14 pr-6 sm:pr-10">
            {/* Section header: stronger hierarchy, intro at 16–18px and higher contrast */}
            <header className="mb-12 sm:mb-14">
              <span className="text-accent-pink text-sm font-medium uppercase tracking-widest">
                Tailored to You
              </span>
              <h2
                id="strategy-heading"
                className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-5 text-white"
              >
                Your Strategy Is Not a Template
              </h2>
              {/* Intro paragraph: larger (text-lg = 18px), higher contrast (#e4e4e7) for readability */}
              <p
                className="text-lg max-w-2xl leading-relaxed"
                style={{ color: "#e4e4e7" }}
              >
                Every business has different margins, audiences, and growth stages.
                We build your marketing system from scratch based on what actually
                moves the needle for you.
              </p>
            </header>

            {/* Benefit cards: 2-column layout — 3 left, 2 right on tablet/desktop; single column on mobile. 32–48px gap. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
              {/* Left column: first 3 items */}
              <div className="flex flex-col gap-8 sm:gap-10">
                {points.slice(0, 3).map((point, i) => {
                  const accent = ACCENT_COLORS[i];
                  return (
                    <BenefitCard key={i} point={point} accent={accent} index={i} />
                  );
                })}
              </div>
              {/* Right column: last 3 items */}
              <div className="flex flex-col gap-8 sm:gap-10">
                {points.slice(3, 6).map((point, i) => {
                  const accent = ACCENT_COLORS[i + 3];
                  return (
                    <BenefitCard key={i + 3} point={point} accent={accent} index={i + 3} />
                  );
                })}
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
