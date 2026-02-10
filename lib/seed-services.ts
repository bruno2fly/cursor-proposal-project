import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const serviceTemplates = [
  {
    id: "social",
    title: "Social Media Management",
    subtitle: null,
    icon: "📱",
    color: "#FF4D6A",
    summary:
      "Complete social media management across all major platforms. We create engaging content, grow your following, and drive meaningful engagement.",
    details: [
      { label: "Strategy Development", desc: "Custom social media strategy aligned with your brand goals and target audience" },
      { label: "Content Planning & Creation", desc: "Professional content calendar with engaging posts, stories, and reels" },
      { label: "Platform Management", desc: "Daily management of all social media platforms including community engagement" },
      { label: "Trend & Event Alignment", desc: "Capitalizing on trending topics and seasonal events relevant to your brand" },
    ],
    sort_order: 1,
  },
  {
    id: "strategy",
    title: "Meeting & Strategy",
    subtitle: null,
    icon: "🎯",
    color: "#6C5CE7",
    summary:
      "Regular strategic meetings to align marketing efforts with your business objectives. Data-driven planning for maximum impact.",
    details: [
      { label: "Strategic Meetings", desc: "Regular check-ins to review performance and adjust strategy" },
      { label: "Actionable Planning", desc: "Clear roadmaps with defined goals, timelines, and KPIs" },
      { label: "Continuous Optimization", desc: "Ongoing refinement based on data insights and market changes" },
    ],
    sort_order: 2,
  },
  {
    id: "google_ads",
    title: "Google Ads",
    subtitle: null,
    icon: "🔍",
    color: "#00B894",
    summary:
      "Strategic Google Ads campaigns that put your business in front of high-intent customers actively searching for your services.",
    details: [
      { label: "Competitor & Market Analysis", desc: "Deep analysis of your competitive landscape and market opportunities" },
      { label: "Keyword Research & Ad Creation", desc: "Targeted keyword selection and compelling ad copy that converts" },
      { label: "Bid Optimization & Budget Management", desc: "Maximizing ROI through smart bidding strategies and budget allocation" },
      { label: "Performance Tracking", desc: "Detailed tracking and reporting on all campaign metrics" },
    ],
    sort_order: 3,
  },
  {
    id: "meta_ads",
    title: "META Ads",
    subtitle: "Facebook & Instagram",
    icon: "📣",
    color: "#0984E3",
    summary:
      "Targeted advertising across Facebook and Instagram to reach your ideal customers with precision targeting and compelling creatives.",
    details: [
      { label: "Competitor & Market Analysis", desc: "Understanding your competitive landscape on social platforms" },
      { label: "Keyword Research & Ad Creation", desc: "Audience targeting and creative ad development that resonates" },
      { label: "Bid Optimization & Budget", desc: "Smart budget allocation across campaigns for maximum return" },
      { label: "Performance Tracking & Adjustments", desc: "Real-time optimization based on campaign performance data" },
    ],
    sort_order: 4,
  },
  {
    id: "email",
    title: "Email Marketing",
    subtitle: null,
    icon: "✉️",
    color: "#E17055",
    summary:
      "Strategic email campaigns that nurture leads, retain customers, and drive conversions with personalized messaging.",
    details: [
      { label: "Professional Email Design", desc: "Beautiful, on-brand email templates that look great on all devices" },
      { label: "Effective Copywriting", desc: "Compelling email copy that drives opens, clicks, and conversions" },
      { label: "Audience Segmentation", desc: "Targeted messaging based on customer behavior and preferences" },
      { label: "Performance Tracking", desc: "Detailed analytics on open rates, click rates, and conversions" },
    ],
    sort_order: 5,
  },
  {
    id: "media",
    title: "Media Creation",
    subtitle: null,
    icon: "🎬",
    color: "#FDCB6E",
    summary:
      "Professional photo and video production that tells your brand story and captures attention across all platforms.",
    details: [
      { label: "Photo & Video Production", desc: "Professional-quality visual content for all marketing channels" },
      { label: "Creative Direction & Storytelling", desc: "Compelling narratives that connect with your audience emotionally" },
      { label: "Branded Content", desc: "Consistent visual identity across all produced content" },
      { label: "High-Quality Editing", desc: "Professional post-production for polished final deliverables" },
    ],
    sort_order: 6,
  },
  {
    id: "seo",
    title: "SEO & Website Management",
    subtitle: null,
    icon: "🌐",
    color: "#A29BFE",
    summary:
      "Comprehensive SEO and website management to improve your online visibility and drive organic traffic growth.",
    details: [
      { label: "SEO Optimization", desc: "On-page and off-page optimization for better search rankings" },
      { label: "Website Management & Updates", desc: "Regular updates, maintenance, and content additions" },
      { label: "Performance Monitoring", desc: "Tracking site speed, uptime, and user experience metrics" },
      { label: "Content Refresh & Strategy", desc: "Keeping your content fresh and aligned with SEO best practices" },
      { label: "Technical SEO", desc: "Schema markup, site structure, and technical optimizations" },
    ],
    sort_order: 7,
  },
  {
    id: "design",
    title: "Graphic Design",
    subtitle: null,
    icon: "🎨",
    color: "#E84393",
    summary:
      "Eye-catching graphic design that strengthens your brand identity and makes your marketing materials stand out.",
    details: [
      { label: "Logo & Brand Identity", desc: "Professional logo design and complete brand identity systems" },
      { label: "Marketing Materials", desc: "Flyers, brochures, business cards, and promotional materials" },
      { label: "Social Media Graphics", desc: "Custom graphics optimized for each social media platform" },
      { label: "Web Design Elements", desc: "Banners, icons, and visual elements for your digital presence" },
    ],
    sort_order: 8,
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    subtitle: null,
    icon: "📊",
    color: "#00CEC9",
    summary:
      "Comprehensive reporting and analytics that give you clear insights into your marketing performance and ROI.",
    details: [
      { label: "Performance Metrics", desc: "Detailed breakdown of KPIs across all marketing channels" },
      { label: "Action Updates", desc: "Clear summary of completed actions and upcoming initiatives" },
      { label: "Strategic Insights", desc: "Data-driven recommendations for continued growth and optimization" },
    ],
    sort_order: 9,
  },
];

async function seed() {
  console.log("Seeding service templates...");

  const { error } = await supabase
    .from("service_templates")
    .upsert(serviceTemplates, { onConflict: "id" });

  if (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }

  console.log("Successfully seeded 9 service templates!");
}

seed();
