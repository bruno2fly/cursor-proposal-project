import type { Metadata } from "next";
import AgreementPage from "@/components/agreement/AgreementPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const clientName =
    slug === "cafe-st-petersburg" ? "Cafe St Petersburg" : slug;

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
  void slug;
  return <AgreementPage />;
}
