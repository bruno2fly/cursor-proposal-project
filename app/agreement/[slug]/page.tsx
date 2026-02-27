import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase";
import AgreementPage from "@/components/agreement/AgreementPage";

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
    .select("id, client_name, pricing_option_1_price, status")
    .eq("slug", slug)
    .single();
  return {
    proposalId: data?.id ?? null,
    clientName: data?.client_name ?? formatSlugAsName(slug),
    monthlyFee: data?.pricing_option_1_price ?? 1400,
    status: data?.status ?? "draft",
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { clientName } = await getProposalData(slug);

  return {
    title: `Service Agreement — ${clientName} | 2FLY Agency`,
    description: `Service agreement for the 3-Month 2Fly 360° Marketing Service prepared for ${clientName}.`,
    openGraph: {
      title: `Service Agreement — ${clientName}`,
      description: `Marketing service agreement by 2FLY Agency`,
      type: "website",
    },
  };
}

export default async function AgreementSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const { proposalId, clientName, monthlyFee, status } =
    await getProposalData(slug);
  return (
    <AgreementPage
      proposalId={proposalId}
      clientName={clientName}
      slug={slug}
      monthlyFee={monthlyFee}
      status={status}
    />
  );
}
