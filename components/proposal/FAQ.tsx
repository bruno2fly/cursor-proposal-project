"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How fast do we start after I accept?",
    answer:
      "Within 48 hours of accepting, we send you an onboarding form to collect logins, brand assets, and business context. Strategy work begins immediately — most clients see campaigns live within 5–7 business days.",
  },
  {
    question: "Is ad spend included in the monthly price?",
    answer:
      "No. The monthly fee covers strategy, management, creative, and optimization. Ad spend is separate and goes directly to the platforms (Meta, Google, etc.). We'll recommend a budget based on your goals and market.",
  },
  {
    question: "How do content approvals work?",
    answer:
      "Nothing goes live without your sign-off. We prepare content batches and send them for your review. You approve, request edits, or reject — and we adjust. It's your brand, your call.",
  },
  {
    question: "Can I cancel or switch plans?",
    answer:
      "The 3-month plan has a commitment period to give the strategy time to work. After that, it renews monthly. The month-to-month plan can be cancelled with 30 days notice at any time. No hidden fees.",
  },
  {
    question: "Who will I be communicating with?",
    answer:
      "You get a dedicated account manager who is your single point of contact. No getting bounced between departments. One person who knows your business, your goals, and your preferences.",
  },
];

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border-b border-dark-border last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple/40 focus-visible:ring-inset rounded-lg"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        id={`faq-trigger-${index}`}
      >
        <span className="font-medium text-base pr-4 text-white group-hover:text-accent-purple transition-colors">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-dark-text shrink-0"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${index}`}
            role="region"
            aria-labelledby={`faq-trigger-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm sm:text-base text-[#d4d4d8] leading-relaxed pb-6 pr-8">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  // Open first item by default so the pattern is obvious
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-accent-purple text-sm font-medium uppercase tracking-widest">
            Common Questions
          </span>
          <h2 className="font-clash text-4xl md:text-5xl font-bold mt-3">
            Frequently Asked
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="rounded-2xl border border-dark-border bg-dark-card/30 px-6 md:px-8">
          {faqs.map((faq, i) => (
            <FAQAccordionItem
              key={i}
              item={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Still have questions? */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-8 text-sm sm:text-base text-[#d4d4d8]"
        >
          Still have questions?{" "}
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-purple font-medium underline underline-offset-2 hover:text-accent-purple/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple/40 rounded"
          >
            Schedule a call
          </a>
        </motion.p>
      </div>
    </section>
  );
}
