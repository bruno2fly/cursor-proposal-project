"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AmbientBackground from "@/components/proposal/AmbientBackground";

interface AgreementPageProps {
  proposalId: string | null;
  clientName: string;
  slug: string;
  monthlyFee?: number;
  status?: string;
}

function formatSlugAsName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const SERVICE_ITEMS = [
  "Social Media Management (Instagram & Facebook)",
  "Paid Ads (Google Ads + Meta Ads)",
  "Email Marketing",
  "SEO & Website Management",
  "Media Creation (photo/video assets as agreed)",
  "Graphic Design (menus, promos, event creatives, etc.)",
  "Monthly Reports & Analytics",
  "Strategy & Planning Meetings",
];

const CLIENT_RESPONSIBILITIES = [
  "Provide access to Instagram and Facebook pages and ad accounts.",
  "Provide access to Google Business Profile.",
  "Provide access to website CMS, Google Analytics, and Tag Manager (where applicable).",
  "Share brand assets such as logo files, menu, existing photos, and key brand messages.",
  "Review and approve content and campaigns within a reasonable timeframe (ideally 24–48 hours).",
];

const AGENCY_RESPONSIBILITIES = [
  "Plan and execute campaigns based on the agreed strategy.",
  "Create content (copy, design, and media) that fits your brand and audience.",
  "Launch and optimize ads to drive reservations, orders, and other key actions.",
  "Monitor performance and make data-driven adjustments.",
  "Send clear monthly performance reports and meet as needed to review results and next steps.",
];

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
};

function AgreementNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="font-clash text-xl font-bold tracking-tight">
          2<span className="gradient-text">FLY</span>
        </a>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-purple" />
          <span className="text-sm sm:text-base text-[#d4d4d8]">
            Service Agreement
          </span>
        </div>
      </div>
    </nav>
  );
}

function SectionCard({
  children,
  label,
  delay = 0,
}: {
  children: React.ReactNode;
  label?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className="rounded-2xl border border-dark-border bg-dark-card/50 backdrop-blur-sm p-6 sm:p-8"
    >
      {label && (
        <span className="text-accent-purple text-xs font-medium uppercase tracking-widest block mb-4">
          {label}
        </span>
      )}
      {children}
    </motion.section>
  );
}

export default function AgreementPage({
  proposalId,
  clientName,
  slug,
  monthlyFee = 1400,
  status = "draft",
}: AgreementPageProps) {
  const displayName = clientName || formatSlugAsName(slug);
  const formattedFee = monthlyFee.toLocaleString();

  const [formData, setFormData] = useState({
    clientName: clientName || "",
    title: "",
    email: "",
    signature: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptSuccess, setAcceptSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalId) {
      setError("This agreement is not linked to a proposal.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const [patchRes, eventRes] = await Promise.all([
        fetch(`/api/proposals/${proposalId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "accepted" }),
        }),
        fetch(`/api/proposals/${proposalId}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type: "agreement_accepted",
            metadata: {
              client_name: formData.clientName,
              title: formData.title,
              email: formData.email,
              signature: formData.signature,
              date: formData.date,
            },
          }),
        }),
      ]);
      if (!patchRes.ok) throw new Error("Failed to accept");
      if (!eventRes.ok) throw new Error("Failed to record acceptance");
      setAcceptSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-bg text-white">
      <AmbientBackground />
      <AgreementNav />

      <main className="relative z-10">
        {/* Hero */}
        <section className="min-h-[60vh] flex items-center justify-center px-6 pt-24 pb-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={slideUp} className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 text-accent-purple text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                Prepared for {displayName}
              </span>
            </motion.div>
            <motion.h1
              variants={slideUp}
              className="font-clash text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4"
            >
              Service Agreement
            </motion.h1>
            <motion.p
              variants={slideUp}
              className="font-clash text-xl sm:text-2xl text-accent-pink mb-6"
            >
              3‑Month 2Fly 360° Marketing Service
            </motion.p>
            <motion.p
              variants={slideUp}
              className="text-[#d4d4d8] text-lg max-w-2xl mx-auto leading-relaxed"
            >
              This agreement is designed to be simple and clear. It describes how
              we&apos;ll work together to grow {displayName}&apos;s visibility and
              sales over an initial 3‑month period.
            </motion.p>
          </motion.div>
        </section>

        {/* Content sections */}
        <div className="max-w-3xl mx-auto px-6 pb-24 space-y-6">
          {/* 1. Who's involved */}
          <SectionCard label="Section 1">
            <h2 className="font-clash text-xl font-semibold text-white mb-4">
              Who&apos;s involved
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 text-[#d4d4d8]">
              <div className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border">
                <span className="text-accent-pink font-medium text-sm uppercase tracking-wider block mb-1">
                  Client
                </span>
                <p>{displayName} (&quot;Client&quot;)</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-bg/50 border border-dark-border">
                <span className="text-accent-purple font-medium text-sm uppercase tracking-wider block mb-1">
                  Agency
                </span>
                <p>2FLY Marketing LLC (&quot;Agency&quot;)</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-[#d4d4d8]">
              <p>
                <span className="text-white font-medium">Start Date</span> — [to
                be confirmed]
              </p>
              <p>
                <span className="text-white font-medium">Initial Term</span> — 3
                months from the Start Date.
              </p>
              <p className="text-[#d4d4d8] leading-relaxed pt-2">
                After the initial 3 months, the agreement can continue
                month‑to‑month if both parties agree.
              </p>
            </div>
          </SectionCard>

          {/* 2. What you're getting */}
          <SectionCard label="Section 2">
            <h2 className="font-clash text-xl font-semibold text-white mb-4">
              What You&apos;re Getting (Scope of Services)
            </h2>
            <p className="text-[#d4d4d8] leading-relaxed mb-4">
              We&apos;ll provide the 2Fly 360° Marketing Service customized for{" "}
              {displayName}, which includes:
            </p>
            <ul className="space-y-2 mb-6">
              {SERVICE_ITEMS.map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[#d4d4d8]"
                >
                  <span className="text-accent-purple mt-1 shrink-0">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="p-4 rounded-xl border border-accent-green/20 bg-accent-green/5">
              <p className="text-[#e4e4e7] leading-relaxed">
                <span className="text-accent-green font-medium">Goal:</span>{" "}
                Drive more reservations, orders, and website actions for{" "}
                {displayName}, while growing your local audience and brand
                presence.
              </p>
            </div>
            <p className="text-[#d4d4d8] leading-relaxed mt-4 text-sm">
              The exact tactics may evolve over time based on performance and
              data, but the focus remains on the goals above.
            </p>
          </SectionCard>

          {/* 3. Fees & payment */}
          <SectionCard label="Section 3">
            <h2 className="font-clash text-xl font-semibold text-white mb-4">
              Fees & Payment
            </h2>
            <div className="space-y-4 mb-4">
              <div className="p-5 rounded-xl bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 border border-accent-purple/20">
                <p className="text-accent-purple text-xs font-medium uppercase tracking-wider mb-1">
                  Monthly Marketing Package
                </p>
                <p className="font-clash text-2xl font-bold text-white">
                  {formattedFee} USD <span className="text-[#d4d4d8] font-normal text-lg">/ month</span>
                </p>
                <p className="text-[#d4d4d8] text-sm mt-2">
                  Includes maintenance, upgrades, and all marketing services.
                </p>
                <div className="mt-4 pt-4 border-t border-accent-purple/20 space-y-2 text-[#d4d4d8] text-sm">
                  <p>Advertising spend is not included and is paid directly to platforms (Google, Meta, etc.) using your payment methods.</p>
                  <p>Month 1 is invoiced upon signing and must be paid before work starts.</p>
                  <p>Months 2 and 3 are invoiced in advance on the same date each month.</p>
                  <p>Payments are non‑refundable once a month&apos;s work has begun.</p>
                </div>
              </div>
              <div className="p-5 rounded-xl border border-dark-border bg-dark-bg/50">
                <p className="text-accent-pink text-xs font-medium uppercase tracking-wider mb-1">
                  Website Creation
                </p>
                <p className="font-clash text-2xl font-bold text-white">
                  1,300 USD <span className="text-[#d4d4d8] font-normal text-lg">one-time</span>
                </p>
                <p className="text-[#d4d4d8] text-sm mt-2">
                  Full responsive website design, SEO setup, and all foundational elements to get your site live and performing. This is a one-time payment only — maintenance and upgrades are included in the Monthly Marketing Package above.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* 4. How we'll work together */}
          <SectionCard label="Section 4">
            <h2 className="font-clash text-xl font-semibold text-white mb-6">
              How We&apos;ll Work Together
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-accent-pink font-medium mb-3">
                  Client Responsibilities
                </h3>
                <ul className="space-y-2">
                  {CLIENT_RESPONSIBILITIES.map((item) => (
                    <li key={item} className="flex gap-2 text-[#d4d4d8] text-sm">
                      <span className="text-accent-pink shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-accent-purple font-medium mb-3">
                  Agency Responsibilities
                </h3>
                <ul className="space-y-2">
                  {AGENCY_RESPONSIBILITIES.map((item) => (
                    <li key={item} className="flex gap-2 text-[#d4d4d8] text-sm">
                      <span className="text-accent-purple shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* 5. Term, renewal & cancellation */}
          <SectionCard label="Section 5">
            <h2 className="font-clash text-xl font-semibold text-white mb-4">
              Term, Renewal & Cancellation
            </h2>
            <div className="space-y-3 text-[#d4d4d8] leading-relaxed">
              <p>The initial term is three (3) months from the Start Date.</p>
              <p>
                During the initial term, early cancellation requires mutual
                written agreement.
              </p>
              <p>
                After the initial 3 months, either party may end the agreement
                with thirty (30) days&apos; written notice.
              </p>
              <p>
                Any work already completed, and any invoices already issued or
                outstanding, remain payable.
              </p>
            </div>
          </SectionCard>

          {/* 6. Communication */}
          <SectionCard label="Section 6">
            <h2 className="font-clash text-xl font-semibold text-white mb-4">
              Communication
            </h2>
            <div className="space-y-3 text-[#d4d4d8] leading-relaxed">
              <p>We&apos;ll keep communication simple and responsive.</p>
              <p>
                Our main hub for collaboration will be the 2FlyFlow platform,
                where you can send requests, approve content, share assets, and
                track progress in one place.
              </p>
              <p>
                Client will have a primary point of contact at 2FLY Agency, but
                most day‑to‑day communication and task management will happen
                inside 2FlyFlow.
              </p>
              <p>
                We&apos;ll use email and WhatsApp only when needed for quick
                updates or urgent matters.
              </p>
              <p>
                Strategy and review meetings will be held via Google Meet,
                typically monthly or at key milestones, or as otherwise agreed
                between Client and Agency.
              </p>
            </div>
          </SectionCard>

          {/* 7. The legal bits */}
          <SectionCard label="Section 7">
            <h2 className="font-clash text-xl font-semibold text-white mb-4">
              The Legal Bits (Kept Short)
            </h2>
            <div className="space-y-3 text-[#d4d4d8] leading-relaxed text-sm">
              <p>
                This agreement covers marketing services only. While we
                can&apos;t guarantee specific results, we commit to using our
                expertise, effort, and data to drive the best outcomes possible.
              </p>
              <p>
                Each party is responsible for its own tools, accounts, and
                compliance with local laws and platform policies.
              </p>
              <p>
                This agreement, together with the accepted proposal, represents
                the full understanding between Client and Agency. Any changes
                must be agreed in writing (email is fine).
              </p>
            </div>
          </SectionCard>

          {/* 8. Acceptance */}
          <SectionCard label="Section 8">
            <h2 className="font-clash text-xl font-semibold text-white mb-4">
              Acceptance
            </h2>
            <p className="text-[#d4d4d8] leading-relaxed mb-6">
              By signing or otherwise accepting this Agreement, you confirm
              that you are authorized to enter into this Agreement on behalf of{" "}
              {displayName} and that you agree to the terms above.
            </p>

            <AnimatePresence mode="wait">
              {acceptSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 rounded-xl border border-accent-green/40 bg-accent-green/10 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-7 h-7 text-accent-green"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="font-clash text-xl font-bold text-white mb-2">
                    Agreement Accepted!
                  </h3>
                  <p className="text-[#d4d4d8] text-sm">
                    Thank you for partnering with 2FLY. We&apos;ll be in touch
                    within 48 hours to get started.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleAccept}
                  className="p-5 rounded-xl border border-accent-green/30 bg-accent-green/5 space-y-4"
                >
                  <p className="text-accent-green font-medium text-sm mb-4">
                    Complete the form below to accept this agreement:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                        Client Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, clientName: e.target.value }))
                        }
                        placeholder="Full legal name"
                        className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                        Title / Role
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, title: e.target.value }))
                        }
                        placeholder="e.g. Owner, Marketing Manager"
                        className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="you@company.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green/50"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                        Signature (type full name)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.signature}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, signature: e.target.value }))
                        }
                        placeholder="Your full name"
                        className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white placeholder:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, date: e.target.value }))
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white focus:outline-none focus:ring-2 focus:ring-accent-green/50 focus:border-accent-green/50"
                      />
                    </div>
                  </div>
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting || !proposalId}
                    className="w-full btn-shimmer px-6 py-4 rounded-xl bg-gradient-to-r from-accent-green to-accent-blue text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent-green/50"
                  >
                    {isSubmitting ? "Accepting..." : "Accept Agreement"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </SectionCard>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-8 text-center"
          >
            <p className="text-dark-text text-sm">
              For questions, contact 2FLY Agency.
            </p>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}
