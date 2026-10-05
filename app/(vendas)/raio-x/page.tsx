import type { Metadata } from "next";
import { OG_BASE, SITE_URL } from "@/lib/site";
import RaioXPage from "@/components/raio-x/RaioXPage";

export const metadata: Metadata = {
  title: "Raio-X grátis do seu site | Vitor de Souza",
  description:
    "Descubra em 30 segundos o que está afastando clientes do seu site no celular: velocidade, Google, acessibilidade e segurança. Grátis, com o teste do próprio Google.",
  alternates: { canonical: "/raio-x" },
  openGraph: {
    ...OG_BASE,
    title: "Raio-X grátis do seu site",
    description:
      "Descubra em 30 segundos o que está afastando clientes do seu site no celular: velocidade, Google, acessibilidade e segurança.",
    url: `${SITE_URL}/raio-x`,
  },
};

export default function Page() {
  return <RaioXPage />;
}
