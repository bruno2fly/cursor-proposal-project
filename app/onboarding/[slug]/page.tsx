import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase";
import OnboardingPage from "@/components/onboarding/OnboardingPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatSlugAsName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getProposalData(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("proposals")
    .select("id, client_name")
    .eq("slug", slug)
    .single();
  return {
    proposalId: data?.id ?? null,
    clientName: data?.client_name ?? formatSlugAsName(slug),
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { clientName } = await getProposalData(slug);

  return {
    title: `Client Onboarding — ${clientName} | 2FLY Agency`,
    description: `Complete your onboarding form for 2FLY Marketing. Let's get to know your business.`,
    openGraph: {
      title: `Client Onboarding — ${clientName}`,
      description: `Complete your onboarding for 2FLY Agency`,
      type: "website",
    },
  };
}

export default async function OnboardingSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const { proposalId, clientName } = await getProposalData(slug);

  return (
    <OnboardingPage
      slug={slug}
      clientName={clientName}
      proposalId={proposalId}
    />
  );
}
