"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AmbientBackground from "@/components/proposal/AmbientBackground";
import ThemeToggle from "@/components/ThemeToggle";

interface VisualIdOnboardingPageProps {
  slug: string;
  clientName: string;
  proposalId?: string | null;
}

const STEP_LABELS = [
  "Business Information",
  "About Your Business",
  "Branding Preferences",
  "Website Goals & Structure",
  "References & Inspiration",
  "Final Notes",
];

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-dark-border bg-dark-card/60 text-dark-text-light placeholder:text-dark-text/70 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple/50 transition-colors";
const inputClassSingle =
  "w-full px-4 h-11 rounded-xl border border-dark-border bg-dark-card/60 text-dark-text-light placeholder:text-dark-text/70 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple/50 transition-colors";
const textareaClass = `${inputClass} min-h-[100px]`;
const labelClass = "block text-sm font-medium text-dark-text-light mb-2";

function VisualIdNav() {
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
        <div className="font-clash text-xl font-bold tracking-tight">
          2<span className="gradient-text">FLY</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="w-2 h-2 rounded-full bg-accent-purple" />
          <span className="text-sm sm:text-base text-dark-text-light">
            Visual ID Onboarding
          </span>
        </div>
      </div>
    </nav>
  );
}

function FormField({
  label,
  error,
  required,
  children,
}: {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className={labelClass}>
          {label}
          {required && <span className="text-accent-pink/80 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-sm text-accent-pink">{error}</p>}
    </div>
  );
}

function CheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((x) => x !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const checked = value.includes(opt);
        return (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                checked ? "border-accent-green bg-accent-green" : "border-dark-border bg-dark-card hover:border-accent-green/50"
              }`}
              onClick={(e) => { e.preventDefault(); toggle(opt); }}
            >
              {checked && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <input type="checkbox" checked={checked} onChange={() => toggle(opt)} className="sr-only" />
            <span className="text-dark-text-light group-hover:text-white transition-colors">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
  name,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const checked = value === opt;
        return (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                checked ? "border-accent-green bg-accent-green" : "border-dark-border bg-dark-card hover:border-accent-green/50"
              }`}
              onClick={(e) => { e.preventDefault(); onChange(opt); }}
            >
              {checked && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
            <input type="radio" name={name} checked={checked} onChange={() => onChange(opt)} className="sr-only" />
            <span className="text-dark-text-light group-hover:text-white transition-colors">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function VisualIdOnboardingPage({
  slug,
  clientName,
  proposalId,
}: VisualIdOnboardingPageProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    phoneNumber: "",
    websiteUrl: "",
    businessDescription: "",
    productsServices: "",
    targetAudience: "",
    uniqueVsCompetitors: "",
    hasLogoBrandColors: "",
    brandMaterialsUrl: "",
    brandFeel: [] as string[],
    inspirationBrands: "",
    colorsFontsPreferences: "",
    websiteGoal: "",
    websiteGoalOther: "",
    contentStatus: "",
    mediaStatus: "",
    websiteReferences: "",
    competitorReferences: "",
    additionalNotes: "",
  });

  const update = (key: string, value: unknown) => {
    setFormData((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const requiredForStep: Record<number, string[]> = {
    1: ["businessName", "businessEmail", "phoneNumber"],
    2: ["businessDescription", "productsServices", "targetAudience", "uniqueVsCompetitors"],
    3: ["hasLogoBrandColors"],
    4: ["websiteGoal", "contentStatus", "mediaStatus"],
    5: [],
    6: [],
  };

  const validateStep = (): boolean => {
    const keys = requiredForStep[step] || [];
    const newErrors: Record<string, string> = {};
    for (const k of keys) {
      const v = formData[k as keyof typeof formData];
      if (v === undefined || v === null || (Array.isArray(v) ? v.length === 0 : String(v).trim() === "")) {
        newErrors[k] = "This field is required.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < 6) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const back = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboarding-visual-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposal_id: proposalId ?? undefined,
          slug,
          status: "completed",
          business_name: formData.businessName,
          business_email: formData.businessEmail,
          phone_number: formData.phoneNumber,
          website_url: formData.websiteUrl || undefined,
          business_description: formData.businessDescription,
          products_services: formData.productsServices,
          target_audience: formData.targetAudience,
          unique_vs_competitors: formData.uniqueVsCompetitors,
          has_logo_brand_colors: formData.hasLogoBrandColors,
          brand_materials_url: formData.brandMaterialsUrl || undefined,
          brand_feel: formData.brandFeel || [],
          inspiration_brands: formData.inspirationBrands || undefined,
          colors_fonts_preferences: formData.colorsFontsPreferences || undefined,
          website_goal: formData.websiteGoal,
          website_goal_other: formData.websiteGoalOther || undefined,
          content_status: formData.contentStatus,
          media_status: formData.mediaStatus,
          website_references: formData.websiteReferences || undefined,
          competitor_references: formData.competitorReferences || undefined,
          additional_notes: formData.additionalNotes || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 100 : -100, opacity: 0 }),
  };

  const isStep1 = step === 1;

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-bg text-dark-text-light relative">
        <AmbientBackground />
        <VisualIdNav />
        <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-20 h-20 rounded-full bg-accent-purple/20 border-2 border-accent-purple flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="font-clash text-3xl font-bold mb-3">Visual ID Onboarding Complete!</h1>
            <p className="text-dark-text-light leading-relaxed">
              Thank you! We&apos;ve received your brand and website preferences. Our team will review everything and be in touch soon.
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-light relative">
      <AmbientBackground />
      <VisualIdNav />
      <main className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {isStep1 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h1 className="font-clash text-4xl sm:text-5xl font-bold mb-3">
                Visual ID <span className="gradient-text">Onboarding</span>
              </h1>
              <p className="text-dark-text-light text-lg max-w-2xl mx-auto">
                Help us understand your brand vision. Complete this form so we can create a visual identity that represents your business.
              </p>
            </motion.div>
          ) : (
            <div className="flex items-center justify-between mb-8">
              <div className="font-clash text-xl font-bold">
                2<span className="gradient-text">FLY</span>
              </div>
              <span className="text-sm text-dark-text">Step {step} of 6 — {STEP_LABELS[step - 1]}</span>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {STEP_LABELS.map((_, i) => {
                const stepNum = i + 1;
                const isCompleted = step > stepNum;
                const isCurrent = step === stepNum;
                const canClick = isCompleted;
                return (
                  <button
                    key={stepNum}
                    type="button"
                    onClick={() => canClick && setStep(stepNum)}
                    disabled={!canClick}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                      isCurrent
                        ? "bg-gradient-to-r from-accent-pink to-accent-purple text-white ring-2 ring-accent-purple/50"
                        : isCompleted
                          ? "bg-accent-green/20 text-accent-green hover:bg-accent-green/30 cursor-pointer"
                          : "bg-dark-border text-dark-text/60 cursor-not-allowed"
                    }`}
                  >
                    {stepNum}
                  </button>
                );
              })}
            </div>
            <div className="h-1.5 rounded-full bg-dark-border overflow-hidden mt-3">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-pink to-accent-purple"
                initial={false}
                animate={{ width: `${(step / 6) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-dark-border bg-dark-card p-6 sm:p-8 min-h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {step === 1 && (
                  <>
                    <FormField label="Business Name" error={errors.businessName} required>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => update("businessName", e.target.value)}
                        className={`${inputClassSingle} ${errors.businessName ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Cafe St Petersburg"
                      />
                    </FormField>
                    <FormField label="Email (Business)" error={errors.businessEmail} required>
                      <input
                        type="email"
                        value={formData.businessEmail}
                        onChange={(e) => update("businessEmail", e.target.value)}
                        className={`${inputClassSingle} ${errors.businessEmail ? "border-accent-pink" : ""}`}
                        placeholder="e.g., info@yourbusiness.com"
                      />
                    </FormField>
                    <FormField label="Phone Number (Business)" error={errors.phoneNumber} required>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => update("phoneNumber", e.target.value)}
                        className={`${inputClassSingle} ${errors.phoneNumber ? "border-accent-pink" : ""}`}
                        placeholder="e.g., (727) 555-0123"
                      />
                    </FormField>
                    <FormField label="Website (if you already have one)">
                      <input
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => update("websiteUrl", e.target.value)}
                        className={inputClassSingle}
                        placeholder="https://yourbusiness.com"
                      />
                    </FormField>
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField label="Describe your business in 2–3 sentences" error={errors.businessDescription} required>
                      <textarea
                        value={formData.businessDescription}
                        onChange={(e) => update("businessDescription", e.target.value)}
                        className={`${textareaClass} ${errors.businessDescription ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Italian restaurant specializing in wood-fired pizza..."
                      />
                    </FormField>
                    <FormField label="What products/services do you offer?" error={errors.productsServices} required>
                      <textarea
                        value={formData.productsServices}
                        onChange={(e) => update("productsServices", e.target.value)}
                        className={`${textareaClass} ${errors.productsServices ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Dine-in, takeout, catering..."
                      />
                    </FormField>
                    <FormField label="Who is your target audience? (age, gender, location, lifestyle, etc.)" error={errors.targetAudience} required>
                      <textarea
                        value={formData.targetAudience}
                        onChange={(e) => update("targetAudience", e.target.value)}
                        className={`${textareaClass} ${errors.targetAudience ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Ages 25-55, local professionals, foodies..."
                      />
                    </FormField>
                    <FormField label="What makes your business unique compared to competitors?" error={errors.uniqueVsCompetitors} required>
                      <textarea
                        value={formData.uniqueVsCompetitors}
                        onChange={(e) => update("uniqueVsCompetitors", e.target.value)}
                        className={`${textareaClass} ${errors.uniqueVsCompetitors ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Only wood-fired pizza in the area..."
                      />
                    </FormField>
                  </>
                )}

                {step === 3 && (
                  <>
                    <FormField label="Do you already have a logo, brand colors, or fonts?" error={errors.hasLogoBrandColors} required>
                      <RadioGroup
                        name="hasLogo"
                        options={[
                          "Yes (please upload files)",
                          "No, we need you to create them",
                          "Yes, but need a new one",
                        ]}
                        value={formData.hasLogoBrandColors}
                        onChange={(v) => update("hasLogoBrandColors", v)}
                      />
                    </FormField>
                    <FormField label="Upload your existing logo or brand materials (if any)">
                      <input
                        type="text"
                        value={formData.brandMaterialsUrl}
                        onChange={(e) => update("brandMaterialsUrl", e.target.value)}
                        className={inputClassSingle}
                        placeholder="e.g., Google Drive or Dropbox link to your files"
                      />
                    </FormField>
                    <FormField label="How would you like your brand to feel?">
                      <CheckboxGroup
                        options={["Professional", "Elegant", "Fun/Playful", "Minimalist", "Luxury", "Friendly"]}
                        value={formData.brandFeel}
                        onChange={(v) => update("brandFeel", v)}
                      />
                    </FormField>
                    <FormField label="Do you have brands (inside or outside your industry) that inspire you? Please share names or links.">
                      <textarea
                        value={formData.inspirationBrands}
                        onChange={(e) => update("inspirationBrands", e.target.value)}
                        className={textareaClass}
                        placeholder="e.g., Competitors or brands you admire..."
                      />
                    </FormField>
                    <FormField label="Any specific colors or fonts you like (or dislike)?">
                      <textarea
                        value={formData.colorsFontsPreferences}
                        onChange={(e) => update("colorsFontsPreferences", e.target.value)}
                        className={`${inputClass} min-h-[80px]`}
                        placeholder="e.g., I love navy blue, avoid script fonts..."
                      />
                    </FormField>
                  </>
                )}

                {step === 4 && (
                  <>
                    <FormField label="What is the main goal of your website?" error={errors.websiteGoal} required>
                      <RadioGroup
                        name="websiteGoal"
                        options={[
                          "Attract new clients",
                          "Sell products (e-commerce)",
                          "Take reservations/appointments",
                          "Showcase portfolio/menu/services",
                          "Other (please specify)",
                        ]}
                        value={formData.websiteGoal}
                        onChange={(v) => update("websiteGoal", v)}
                      />
                    </FormField>
                    {formData.websiteGoal === "Other (please specify)" && (
                      <FormField label="Please specify">
                        <input
                          type="text"
                          value={formData.websiteGoalOther}
                          onChange={(e) => update("websiteGoalOther", e.target.value)}
                          className={inputClassSingle}
                          placeholder="Describe your website goal"
                        />
                      </FormField>
                    )}
                    <FormField label="Do you already have the written content (texts, descriptions) or do you need us to create it?" error={errors.contentStatus} required>
                      <RadioGroup
                        name="contentStatus"
                        options={[
                          "I have all content ready",
                          "I have some content, need help polishing",
                          "I need you to create all content",
                        ]}
                        value={formData.contentStatus}
                        onChange={(v) => update("contentStatus", v)}
                      />
                    </FormField>
                    <FormField label="Do you have photos/videos to use, or should we create them for you?" error={errors.mediaStatus} required>
                      <RadioGroup
                        name="mediaStatus"
                        options={[
                          "I already have photos/videos",
                          "I need help creating them",
                        ]}
                        value={formData.mediaStatus}
                        onChange={(v) => update("mediaStatus", v)}
                      />
                    </FormField>
                  </>
                )}

                {step === 5 && (
                  <>
                    <FormField label="Please share 2–3 website links you like and tell us what you like about them.">
                      <textarea
                        value={formData.websiteReferences}
                        onChange={(e) => update("websiteReferences", e.target.value)}
                        className={textareaClass}
                        placeholder="e.g., https://example.com - I like the clean layout and color scheme..."
                      />
                    </FormField>
                    <FormField label="Please share 2–3 competitors you want to stand out from.">
                      <textarea
                        value={formData.competitorReferences}
                        onChange={(e) => update("competitorReferences", e.target.value)}
                        className={textareaClass}
                        placeholder="e.g., Competitor names or website links..."
                      />
                    </FormField>
                  </>
                )}

                {step === 6 && (
                  <>
                    <FormField label="Anything else for our team?">
                      <textarea
                        value={formData.additionalNotes}
                        onChange={(e) => update("additionalNotes", e.target.value)}
                        className={textareaClass}
                        placeholder="e.g., Upcoming rebrand, special considerations..."
                      />
                    </FormField>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-end mt-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={back}
                disabled={step === 1}
                className="px-5 py-2.5 rounded-xl border border-dark-border text-dark-text-light hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              {step < 6 ? (
                <button
                  type="button"
                  onClick={next}
                  className="btn-shimmer px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-white font-semibold hover:opacity-95 transition-opacity"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-shimmer px-8 py-4 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-white font-bold text-base shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
