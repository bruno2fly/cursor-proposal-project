import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase";
import ProposalPageClient from "@/components/proposal/ProposalPage";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProposal(slug: string) {
  const supabase = createAdminClient();

  const { data: proposal, error } = await supabase
    .from("proposals")
    .select(
      `
      *,
      proposal_services (
        *,
        service_templates (*)
      )
    `
    )
    .eq("slug", slug)
    .single();

  if (error || !proposal) return null;
  return proposal;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const proposal = await getProposal(slug);

  if (!proposal) {
    return { title: "Proposal Not Found" };
  }

  return {
    title: `${proposal.client_name} — ${proposal.hero_title} | 2FLY Marketing`,
    description: `Interactive marketing proposal prepared for ${proposal.client_name} by 2FLY Marketing Agency.`,
    openGraph: {
      title: `${proposal.client_name} — ${proposal.hero_title}`,
      description: `Marketing proposal by 2FLY Agency`,
      type: "website",
    },
  };
}

export default async function ProposalSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const proposal = await getProposal(slug);

  if (!proposal) {
    notFound();
  }

  return <ProposalPageClient proposal={proposal} />;
}
