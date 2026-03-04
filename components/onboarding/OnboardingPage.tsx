"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AmbientBackground from "@/components/proposal/AmbientBackground";
import ThemeToggle from "@/components/ThemeToggle";

interface OnboardingPageProps {
  slug: string;
  clientName: string;
  proposalId?: string | null;
}

const STEP_LABELS = [
  "Business Information",
  "About Your Business",
  "Branding & Assets",
  "Social Media Goals",
  "Advertising & Campaigns",
  "Promotions & Offers",
  "Strategy & Expectations",
  "Communication & Workflow",
  "Platform Access",
  "Final Notes",
];

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-dark-border bg-dark-card/60 text-dark-text-light placeholder:text-dark-text/70 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple/50 transition-colors";
const inputClassSingle =
  "w-full px-4 h-11 rounded-xl border border-dark-border bg-dark-card/60 text-dark-text-light placeholder:text-dark-text/70 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple/50 transition-colors";
const textareaClass = `${inputClass} min-h-[100px]`;
const labelClass = "block text-sm font-medium text-dark-text-light mb-2";

function OnboardingNav() {
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
          <div className="w-2 h-2 rounded-full bg-accent-green" />
          <span className="text-sm sm:text-base text-dark-text-light">
            Client Onboarding
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
      {error && (
        <p className="mt-1 text-sm text-accent-pink">{error}</p>
      )}
    </div>
  );
}

function CheckboxGroup({
  options,
  value,
  onChange,
  maxSelections,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  maxSelections?: number;
}) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((x) => x !== opt));
    } else if (!maxSelections || value.length < maxSelections) {
      onChange([...value, opt]);
    }
  };
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const checked = value.includes(opt);
        return (
          <label
            key={opt}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                checked
                  ? "border-accent-green bg-accent-green"
                  : "border-dark-border bg-dark-card hover:border-accent-green/50"
              }`}
              onClick={(e) => {
                e.preventDefault();
                toggle(opt);
              }}
            >
              {checked && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(opt)}
              className="sr-only"
            />
            <span className="text-dark-text-light group-hover:text-white transition-colors">
              {opt}
            </span>
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
  name = "radio-group",
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  name?: string;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const checked = value === opt;
        return (
          <label
            key={opt}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                checked
                  ? "border-accent-green bg-accent-green"
                  : "border-dark-border bg-dark-card hover:border-accent-green/50"
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(opt);
              }}
            >
              {checked && (
                <span className="h-2 w-2 rounded-full bg-white" />
              )}
            </span>
            <input
              type="radio"
              name={name}
              checked={checked}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            <span className="text-dark-text-light group-hover:text-white transition-colors">
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default function OnboardingPage({ slug, clientName, proposalId }: OnboardingPageProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({
    // Step 1
    businessName: "",
    businessEmail: "",
    phoneNumber: "",
    businessAddress: "",
    websiteUrl: "",
    googleBusinessProfile: "",
    socialMediaLinks: "",
    primaryServiceArea: "",
    yearsInOperation: "",
    // Step 2
    describeBusiness: "",
    productsServices: "",
    top3Profitable: "",
    productToSellMore: "",
    targetAudience: "",
    whatMakesUnique: "",
    commonCustomerQuestions: "",
    // Step 3
    brandAssets: [] as string[],
    brandAssetsDescribe: "",
    professionalPhotos: "",
    // Step 4
    socialGoals: [] as string[],
    importantPlatforms: [] as string[],
    contentWanted: [] as string[],
    brandSound: [] as string[],
    brandsInspire: "",
    postFrequency: "",
    // Step 5
    adGoals: [] as string[],
    runAdsBefore: "",
    whereRunAds: [] as string[],
    adResults: "",
    monthlyAdBudget: "",
    adDestination: [] as string[],
    whoRespondsLeads: "",
    // Step 6
    promotions: "",
    focusProducts: "",
    // Step 7
    mainGoal3Months: "",
    marketingChallenges: "",
    revenueSuccess: "",
    competitors: "",
    partnershipSuccess: "",
    // Step 8
    preferredCommunication: "",
    approverName: "",
    approverRole: "",
    // Step 9
    platformAccess: [] as string[],
    confirmAccess: false,
    // Step 10
    avoidTopics: "",
    anythingElse: "",
  });

  const update = (key: string, value: unknown) => {
    setFormData((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const requiredForStep: Record<number, string[]> = {
    1: ["businessName", "businessEmail", "phoneNumber", "businessAddress"],
    2: [
      "describeBusiness",
      "productsServices",
      "top3Profitable",
      "productToSellMore",
      "targetAudience",
    ],
    3: [],
    4: [],
    5: ["whoRespondsLeads"],
    6: [],
    7: ["mainGoal3Months", "marketingChallenges", "revenueSuccess", "partnershipSuccess"],
    8: ["preferredCommunication", "approverName", "approverRole"],
    9: ["confirmAccess"],
    10: [],
  };

  const validateStep = (): boolean => {
    const keys = requiredForStep[step] || [];
    const newErrors: Record<string, string> = {};
    for (const k of keys) {
      const v = formData[k];
      if (k === "confirmAccess") {
        if (!v) newErrors[k] = "Please confirm you will grant access when requested.";
      } else if (v === undefined || v === null || String(v).trim() === "") {
        newErrors[k] = "This field is required.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [direction, setDirection] = useState(0);

  const next = () => {
    if (!validateStep()) return;
    if (step < 10) {
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
      const payload = {
        proposal_id: proposalId ?? undefined,
        slug,
        status: "completed",
        business_name: formData.businessName,
        business_email: formData.businessEmail,
        phone_number: formData.phoneNumber,
        business_address: formData.businessAddress,
        website_url: formData.websiteUrl || undefined,
        google_business_profile: formData.googleBusinessProfile || undefined,
        social_media_links: formData.socialMediaLinks || undefined,
        service_area: formData.primaryServiceArea || undefined,
        years_operating: formData.yearsInOperation || undefined,
        business_description: formData.describeBusiness || undefined,
        products_services: formData.productsServices || undefined,
        top_3_profitable: formData.top3Profitable || undefined,
        sell_more_of: formData.productToSellMore || undefined,
        target_audience: formData.targetAudience || undefined,
        unique_vs_competitors: formData.whatMakesUnique || undefined,
        common_customer_questions: formData.commonCustomerQuestions || undefined,
        brand_assets: formData.brandAssets || [],
        brand_assets_description: formData.brandAssetsDescribe || undefined,
        has_professional_media: formData.professionalPhotos || undefined,
        social_media_goals: formData.socialGoals || [],
        important_platforms: formData.importantPlatforms || [],
        content_types: formData.contentWanted || [],
        brand_voice: formData.brandSound || [],
        inspiration_brands: formData.brandsInspire || undefined,
        posting_frequency: formData.postFrequency || undefined,
        advertising_goals: formData.adGoals || [],
        has_run_ads: formData.runAdsBefore || undefined,
        previous_ad_platforms: formData.whereRunAds || [],
        previous_ad_results: formData.adResults || undefined,
        monthly_ad_budget: formData.monthlyAdBudget || undefined,
        ad_destinations: formData.adDestination || [],
        lead_responder: formData.whoRespondsLeads || undefined,
        current_promotions: formData.promotions || undefined,
        focus_products_first: formData.focusProducts || undefined,
        three_month_goal: formData.mainGoal3Months || undefined,
        biggest_challenges: formData.marketingChallenges || undefined,
        success_revenue: formData.revenueSuccess || undefined,
        competitors_to_analyze: formData.competitors || undefined,
        partnership_success: formData.partnershipSuccess || undefined,
        preferred_communication: formData.preferredCommunication || undefined,
        content_approver_name: formData.approverName || undefined,
        content_approver_role: formData.approverRole || undefined,
        platform_access: formData.platformAccess || [],
        access_confirmed: Boolean(formData.confirmAccess),
        topics_to_avoid: formData.avoidTopics || undefined,
        additional_notes: formData.anythingElse || undefined,
      };

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit");
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-bg text-dark-text-light relative">
        <AmbientBackground />
        <OnboardingNav />
        <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-20 h-20 rounded-full bg-accent-green/20 border-2 border-accent-green flex items-center justify-center mx-auto mb-6"
            >
              <svg
                className="w-10 h-10 text-accent-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="font-clash text-3xl font-bold mb-3">
              Onboarding Complete!
            </h1>
            <p className="text-dark-text-light leading-relaxed">
              Thank you! We&apos;ve received all your business details. Our team
              will review everything and schedule your kickoff call within 48
              hours. Let&apos;s grow your business together.
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  const isStep1 = step === 1;

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-light relative">
      <AmbientBackground />
      <OnboardingNav />
      <main className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {isStep1 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-clash text-4xl sm:text-5xl font-bold mb-3">
                Welcome to <span className="gradient-text">2FLY</span>
              </h1>
              <p className="text-dark-text-light text-lg max-w-2xl mx-auto">
                Let&apos;s get to know your business. Complete this form so we can
                start building your marketing strategy.
              </p>
            </motion.div>
          ) : (
            <div className="flex items-center justify-between mb-8">
              <div className="font-clash text-xl font-bold">
                2<span className="gradient-text">FLY</span>
              </div>
              <span className="text-sm text-dark-text">
                Step {step} of 10 — {STEP_LABELS[step - 1]}
              </span>
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
                animate={{ width: `${(step / 10) * 100}%` }}
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
                        value={String(formData.businessName)}
                        onChange={(e) => update("businessName", e.target.value)}
                        className={`${inputClassSingle} ${errors.businessName ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Cafe St Petersburg"
                      />
                    </FormField>
                    <FormField label="Business Email Address" error={errors.businessEmail} required>
                      <input
                        type="email"
                        value={String(formData.businessEmail)}
                        onChange={(e) => update("businessEmail", e.target.value)}
                        className={`${inputClassSingle} ${errors.businessEmail ? "border-accent-pink" : ""}`}
                        placeholder="e.g., info@yourbusiness.com"
                      />
                    </FormField>
                    <FormField label="Phone Number" error={errors.phoneNumber} required>
                      <input
                        type="tel"
                        value={String(formData.phoneNumber)}
                        onChange={(e) => update("phoneNumber", e.target.value)}
                        className={`${inputClassSingle} ${errors.phoneNumber ? "border-accent-pink" : ""}`}
                        placeholder="e.g., (727) 555-0123"
                      />
                    </FormField>
                    <FormField label="Business Address" error={errors.businessAddress} required>
                      <input
                        type="text"
                        value={String(formData.businessAddress)}
                        onChange={(e) => update("businessAddress", e.target.value)}
                        className={`${inputClassSingle} ${errors.businessAddress ? "border-accent-pink" : ""}`}
                        placeholder="e.g., 123 Main St, St Petersburg, FL"
                      />
                    </FormField>
                    <FormField label="Website URL (optional)">
                      <input
                        type="url"
                        value={String(formData.websiteUrl)}
                        onChange={(e) => update("websiteUrl", e.target.value)}
                        className={inputClassSingle}
                        placeholder="https://yourbusiness.com"
                      />
                    </FormField>
                    <FormField label="Google Business Profile link (optional)">
                      <input
                        type="url"
                        value={String(formData.googleBusinessProfile)}
                        onChange={(e) => update("googleBusinessProfile", e.target.value)}
                        className={inputClassSingle}
                        placeholder="https://g.page/your-business"
                      />
                    </FormField>
                    <FormField label="Social media links — Instagram, Facebook, TikTok">
                      <textarea
                        value={String(formData.socialMediaLinks)}
                        onChange={(e) => update("socialMediaLinks", e.target.value)}
                        className={textareaClass}
                        placeholder="Paste all applicable links, one per line"
                      />
                    </FormField>
                    <FormField label="Primary service area">
                      <input
                        type="text"
                        value={String(formData.primaryServiceArea)}
                        onChange={(e) => update("primaryServiceArea", e.target.value)}
                        className={inputClassSingle}
                        placeholder="e.g., St Petersburg, Tampa Bay area"
                      />
                    </FormField>
                    <FormField label="Years in operation">
                      <select
                        value={String(formData.yearsInOperation)}
                        onChange={(e) => update("yearsInOperation", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select...</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="10+ years">10+ years</option>
                      </select>
                    </FormField>
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField label="Describe your business" error={errors.describeBusiness} required>
                      <textarea
                        value={String(formData.describeBusiness)}
                        onChange={(e) => update("describeBusiness", e.target.value)}
                        className={`${textareaClass} ${errors.describeBusiness ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Italian restaurant specializing in wood-fired pizza and fresh pasta..."
                      />
                    </FormField>
                    <FormField label="Products/services offered" error={errors.productsServices} required>
                      <textarea
                        value={String(formData.productsServices)}
                        onChange={(e) => update("productsServices", e.target.value)}
                        className={`${textareaClass} ${errors.productsServices ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Dine-in, takeout, catering, private events..."
                      />
                    </FormField>
                    <FormField label="TOP 3 most profitable services/products" error={errors.top3Profitable} required>
                      <textarea
                        value={String(formData.top3Profitable)}
                        onChange={(e) => update("top3Profitable", e.target.value)}
                        className={`${inputClass} min-h-[80px] ${errors.top3Profitable ? "border-accent-pink" : ""}`}
                        placeholder="1. Catering&#10;2. Weekend brunch&#10;3. Private dining"
                      />
                    </FormField>
                    <FormField label="Which product/service to sell MORE of right now?" error={errors.productToSellMore} required>
                      <textarea
                        value={String(formData.productToSellMore)}
                        onChange={(e) => update("productToSellMore", e.target.value)}
                        className={`${inputClass} min-h-[80px] ${errors.productToSellMore ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Catering packages for corporate events"
                      />
                    </FormField>
                    <FormField label="Target audience description" error={errors.targetAudience} required>
                      <textarea
                        value={String(formData.targetAudience)}
                        onChange={(e) => update("targetAudience", e.target.value)}
                        className={`${inputClass} min-h-[80px] ${errors.targetAudience ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Ages 25-55, local professionals, foodies, families..."
                      />
                    </FormField>
                    <FormField label="What makes you unique vs competitors?">
                      <textarea
                        value={String(formData.whatMakesUnique)}
                        onChange={(e) => update("whatMakesUnique", e.target.value)}
                        className={`${inputClass} min-h-[80px]`}
                        placeholder="e.g., Only wood-fired pizza in the area, family recipes..."
                      />
                    </FormField>
                    <FormField label="Most common customer questions before buying">
                      <textarea
                        value={String(formData.commonCustomerQuestions)}
                        onChange={(e) => update("commonCustomerQuestions", e.target.value)}
                        className={`${inputClass} min-h-[80px]`}
                        placeholder="e.g., Do you accommodate dietary restrictions? Group reservations?"
                      />
                    </FormField>
                  </>
                )}

                {step === 3 && (
                  <>
                    <FormField label="Do you have brand assets? (select all that apply)">
                      <CheckboxGroup
                        options={[
                          "Logo",
                          "Brand colors",
                          "Fonts",
                          "Professional photos",
                          "Videos",
                          "Product photos",
                        ]}
                        value={(formData.brandAssets as string[]) || []}
                        onChange={(v) => update("brandAssets", v)}
                      />
                    </FormField>
                    <FormField label="Describe what assets you have available">
                      <textarea
                        value={String(formData.brandAssetsDescribe)}
                        onChange={(e) => update("brandAssetsDescribe", e.target.value)}
                        className={`${inputClass} min-h-[80px]`}
                        placeholder="e.g., High-res logo files, brand guidelines document..."
                      />
                    </FormField>
                    <FormField label="Do you have current contents (photos/videos)?">
                      <RadioGroup
                        name="professionalPhotos"
                        options={[
                          "Yes, professional photos/videos",
                          "Yes, phone photos/videos",
                          "No, we need new content",
                        ]}
                        value={String(formData.professionalPhotos)}
                        onChange={(v) => update("professionalPhotos", v)}
                      />
                    </FormField>
                  </>
                )}

                {step === 4 && (
                  <>
                    <FormField label="Main goals with social media?">
                      <CheckboxGroup
                        options={[
                          "Get more customers",
                          "Generate leads",
                          "Increase brand awareness",
                          "Grow followers",
                          "Drive traffic to website",
                          "Promote products/services",
                          "Promote events",
                          "Build brand authority",
                        ]}
                        value={(formData.socialGoals as string[]) || []}
                        onChange={(v) => update("socialGoals", v)}
                      />
                    </FormField>
                    <FormField label="Most important platforms? (max 2)">
                      <CheckboxGroup
                        options={["Instagram", "Facebook", "TikTok", "LinkedIn", "YouTube", "Other"]}
                        value={(formData.importantPlatforms as string[]) || []}
                        onChange={(v) => update("importantPlatforms", v)}
                        maxSelections={2}
                      />
                    </FormField>
                    <FormField label="What content do you want to see?">
                      <CheckboxGroup
                        options={[
                          "Educational",
                          "Behind-the-scenes",
                          "Product demonstrations",
                          "Before/after results",
                          "Testimonials",
                          "Promotions",
                          "Lifestyle content",
                          "Interactive content",
                        ]}
                        value={(formData.contentWanted as string[]) || []}
                        onChange={(v) => update("contentWanted", v)}
                      />
                    </FormField>
                    <FormField label="How should your brand sound?">
                      <CheckboxGroup
                        options={[
                          "Professional",
                          "Friendly",
                          "Luxury",
                          "Fun",
                          "Informative",
                          "Inspirational",
                        ]}
                        value={(formData.brandSound as string[]) || []}
                        onChange={(v) => update("brandSound", v)}
                      />
                    </FormField>
                    <FormField label="Brands that inspire you? (optional)">
                      <textarea
                        value={String(formData.brandsInspire)}
                        onChange={(e) => update("brandsInspire", e.target.value)}
                        className={`${inputClass} min-h-[80px]`}
                        placeholder="e.g., Competitors or brands you admire..."
                      />
                    </FormField>
                    <FormField label="How often you expect to post?">
                      <RadioGroup
                        name="postFrequency"
                        options={[
                          "2-3 posts/week",
                          "4-5 posts/week",
                          "Daily",
                          "Custom strategy",
                        ]}
                        value={String(formData.postFrequency)}
                        onChange={(v) => update("postFrequency", v)}
                      />
                    </FormField>
                  </>
                )}

                {step === 5 && (
                  <>
                    <FormField label="Main advertising goals?">
                      <CheckboxGroup
                        options={[
                          "Generate leads",
                          "Increase sales",
                          "Book appointments",
                          "Promote offers",
                          "Grow brand awareness",
                        ]}
                        value={(formData.adGoals as string[]) || []}
                        onChange={(v) => update("adGoals", v)}
                      />
                    </FormField>
                    <FormField label="Have you run ads before?">
                      <RadioGroup
                        name="runAdsBefore"
                        options={["Yes", "No"]}
                        value={String(formData.runAdsBefore)}
                        onChange={(v) => update("runAdsBefore", v)}
                      />
                    </FormField>
                    {formData.runAdsBefore === "Yes" && (
                      <>
                        <FormField label="Where did you run ads?">
                          <CheckboxGroup
                            options={[
                              "Facebook/Instagram",
                              "Google Ads",
                              "TikTok Ads",
                              "Other",
                            ]}
                            value={(formData.whereRunAds as string[]) || []}
                            onChange={(v) => update("whereRunAds", v)}
                          />
                        </FormField>
                        <FormField label="What results did you see?">
                          <textarea
                            value={String(formData.adResults)}
                            onChange={(e) => update("adResults", e.target.value)}
                            className={`${inputClass} min-h-[80px]`}
                            placeholder="e.g., Leads generated, cost per result, what worked..."
                          />
                        </FormField>
                      </>
                    )}
                    <FormField label="Monthly ad budget?">
                      <select
                        value={String(formData.monthlyAdBudget)}
                        onChange={(e) => update("monthlyAdBudget", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select...</option>
                        <option value="$500-$1,000">$500-$1,000</option>
                        <option value="$1,000-$2,500">$1,000-$2,500</option>
                        <option value="$2,500-$5,000">$2,500-$5,000</option>
                        <option value="$5,000-$10,000">$5,000-$10,000</option>
                        <option value="$10,000+">$10,000+</option>
                      </select>
                    </FormField>
                    <FormField label="Where should ads send people?">
                      <CheckboxGroup
                        options={[
                          "Website",
                          "Landing page",
                          "Instagram messages",
                          "WhatsApp",
                          "Booking system",
                          "Phone calls",
                        ]}
                        value={(formData.adDestination as string[]) || []}
                        onChange={(v) => update("adDestination", v)}
                      />
                    </FormField>
                    <FormField label="Who responds to leads?" error={errors.whoRespondsLeads} required>
                      <input
                        type="text"
                        value={String(formData.whoRespondsLeads)}
                        onChange={(e) => update("whoRespondsLeads", e.target.value)}
                        className={`${inputClassSingle} ${errors.whoRespondsLeads ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Owner, marketing manager, receptionist"
                      />
                    </FormField>
                  </>
                )}

                {step === 6 && (
                  <>
                    <FormField label="Do you run promotions?">
                      <textarea
                        value={String(formData.promotions)}
                        onChange={(e) => update("promotions", e.target.value)}
                        className={`${inputClass} min-h-[100px]`}
                        placeholder="Seasonal promotions, memberships, packages, discounts, happy hour, limited-time offers..."
                      />
                    </FormField>
                    <FormField label="Specific products/services to focus on first?">
                      <textarea
                        value={String(formData.focusProducts)}
                        onChange={(e) => update("focusProducts", e.target.value)}
                        className={`${inputClass} min-h-[80px]`}
                        placeholder="e.g., New catering menu, summer specials..."
                      />
                    </FormField>
                  </>
                )}

                {step === 7 && (
                  <>
                    <FormField label="Main goal for the next 3 months?" error={errors.mainGoal3Months} required>
                      <textarea
                        value={String(formData.mainGoal3Months)}
                        onChange={(e) => update("mainGoal3Months", e.target.value)}
                        className={`${inputClass} min-h-[80px] ${errors.mainGoal3Months ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Increase catering revenue by 30%"
                      />
                    </FormField>
                    <FormField label="Biggest marketing challenges right now?" error={errors.marketingChallenges} required>
                      <textarea
                        value={String(formData.marketingChallenges)}
                        onChange={(e) => update("marketingChallenges", e.target.value)}
                        className={`${inputClass} min-h-[80px] ${errors.marketingChallenges ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Inconsistent social presence, low engagement..."
                      />
                    </FormField>
                    <FormField label="What revenue result = success?" error={errors.revenueSuccess} required>
                      <textarea
                        value={String(formData.revenueSuccess)}
                        onChange={(e) => update("revenueSuccess", e.target.value)}
                        className={`${inputClass} min-h-[80px] ${errors.revenueSuccess ? "border-accent-pink" : ""}`}
                        placeholder="e.g., $50K additional revenue in 3 months"
                      />
                    </FormField>
                    <FormField label="Competitors to analyze?">
                      <textarea
                        value={String(formData.competitors)}
                        onChange={(e) => update("competitors", e.target.value)}
                        className={`${inputClass} min-h-[80px]`}
                        placeholder="e.g., Competitor names or website links..."
                      />
                    </FormField>
                    <FormField label="What makes this partnership successful for you?" error={errors.partnershipSuccess} required>
                      <textarea
                        value={String(formData.partnershipSuccess)}
                        onChange={(e) => update("partnershipSuccess", e.target.value)}
                        className={`${inputClass} min-h-[80px] ${errors.partnershipSuccess ? "border-accent-pink" : ""}`}
                        placeholder="e.g., Clear communication, measurable results..."
                      />
                    </FormField>
                  </>
                )}

                {step === 8 && (
                  <>
                    <FormField label="Preferred communication?" error={errors.preferredCommunication} required>
                      <RadioGroup
                        name="preferredCommunication"
                        options={["WhatsApp", "Email", "Phone", "Slack", "Other"]}
                        value={String(formData.preferredCommunication)}
                        onChange={(v) => update("preferredCommunication", v)}
                      />
                    </FormField>
                    <FormField label="Who approves content/campaigns?" error={errors.approverName || errors.approverRole} required>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Name <span className="text-accent-pink/80">*</span></label>
                          <input
                            type="text"
                            value={String(formData.approverName)}
                            onChange={(e) => update("approverName", e.target.value)}
                            className={`${inputClassSingle} ${errors.approverName ? "border-accent-pink" : ""}`}
                            placeholder="e.g., Jane Smith"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Role <span className="text-accent-pink/80">*</span></label>
                          <input
                            type="text"
                            value={String(formData.approverRole)}
                            onChange={(e) => update("approverRole", e.target.value)}
                            className={`${inputClassSingle} ${errors.approverRole ? "border-accent-pink" : ""}`}
                            placeholder="e.g., Marketing Director"
                          />
                        </div>
                      </div>
                      {(errors.approverName || errors.approverRole) && (
                        <p className="mt-1 text-sm text-accent-pink">
                          Both name and role are required.
                        </p>
                      )}
                    </FormField>
                  </>
                )}

                {step === 9 && (
                  <>
                    <FormField label="Do you have access to these accounts?">
                      <CheckboxGroup
                        options={[
                          "Instagram account",
                          "Facebook Page",
                          "Meta Ads Manager",
                          "Google Ads",
                          "Google Business Profile",
                          "Website CMS",
                          "Email marketing platform",
                        ]}
                        value={(formData.platformAccess as string[]) || []}
                        onChange={(v) => update("platformAccess", v)}
                      />
                    </FormField>
                    <FormField label="Confirm platform access" error={errors.confirmAccess} required>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                            Boolean(formData.confirmAccess)
                              ? "border-accent-green bg-accent-green"
                              : "border-dark-border bg-dark-card hover:border-accent-green/50"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            update("confirmAccess", !formData.confirmAccess);
                          }}
                        >
                          {Boolean(formData.confirmAccess) && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          checked={Boolean(formData.confirmAccess)}
                          onChange={(e) => update("confirmAccess", e.target.checked)}
                          className="sr-only"
                        />
                        <span className="text-dark-text-light group-hover:text-white transition-colors">
                          I confirm I will grant access to the platforms checked above when requested.
                        </span>
                      </label>
                    </FormField>
                  </>
                )}

                {step === 10 && (
                  <>
                    <FormField label="Topics, messaging, or visuals to AVOID?">
                      <textarea
                        value={String(formData.avoidTopics)}
                        onChange={(e) => update("avoidTopics", e.target.value)}
                        className={textareaClass}
                        placeholder="e.g., Political topics, certain imagery, competitor mentions..."
                      />
                    </FormField>
                    <FormField label="Anything else for our team?">
                      <textarea
                        value={String(formData.anythingElse)}
                        onChange={(e) => update("anythingElse", e.target.value)}
                        className={textareaClass}
                        placeholder="e.g., Upcoming events, special considerations..."
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
              {step < 10 ? (
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
                  {isSubmitting ? "Submitting..." : "Submit Onboarding"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-10 px-6 border-t border-dark-border mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-clash text-lg font-bold">
              2<span className="gradient-text">FLY</span>
            </div>
            <p className="text-sm sm:text-base text-dark-text-light text-center sm:text-right max-w-md leading-relaxed">
              2FLY is a performance marketing agency helping local businesses grow
              through data-driven strategy, paid media, and creative execution.
            </p>
          </div>
          <p className="text-sm text-dark-text text-center mt-6">
            &copy; {new Date().getFullYear()} 2FLY Agency. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
