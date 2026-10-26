import type { Metadata } from "next";
import ReferralPage from "@/components/indicacao/ReferralPage";
import { REFERRAL_REWARD } from "@/lib/referral";
import { OG_BASE, SITE_URL } from "@/lib/site";

const description = `Indique alguém que precisa de site, landing page ou sistema. Fechou o projeto, você ganha ${REFERRAL_REWARD.percent}% do valor no Pix.`;

export const metadata: Metadata = {
  title: "Indique e ganhe",
  description,
  alternates: { canonical: "/indique" },
  openGraph: {
    ...OG_BASE,
    title: "Indique e ganhe",
    description,
    url: `${SITE_URL}/indique`,
  },
};

export default function Page() {
  return <ReferralPage />;
}
