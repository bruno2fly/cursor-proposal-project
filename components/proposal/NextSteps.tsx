"use client";

import { motion } from "framer-motion";

const steps = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    text: "Accept this proposal",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    text: "Receive onboarding form within 48h",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    text: "Meet your dedicated account manager",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    text: "Strategy built & campaigns go live",
  },
];

export default function NextSteps() {
  return (
    <section className="px-6 pb-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-dark-border bg-dark-card/50 p-8 md:p-10"
        >
          <h3 className="font-clash text-xl font-semibold mb-1">
            What Happens Next
          </h3>
          <p className="text-sm sm:text-base text-[#d4d4d8] mb-6">
            From acceptance to launch in under a week.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-0">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1 text-center"
              >
                {/* Step indicator */}
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shrink-0">
                    {step.icon}
                  </div>
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block absolute left-full top-1/2 w-full h-px bg-dark-border -translate-y-1/2" />
                  )}
                </div>
                <span className="text-sm sm:text-base text-[#d4d4d8] leading-snug sm:mt-1">
                  {step.text}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="text-sm sm:text-base text-[#d4d4d8] mt-8 text-center border-t border-dark-border pt-5">
            You won&apos;t be left waiting. We move fast so you see progress, not promises.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
