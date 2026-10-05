import type { Metadata } from "next";
import RaioXPage from "@/components/raio-x/RaioXPage";

export const metadata: Metadata = {
  title: "Raio-X grátis do seu site | Vitor de Souza",
  description:
    "Descubra em 30 segundos o que está afastando clientes do seu site no celular: velocidade, Google, acessibilidade e segurança. Grátis, com o teste do próprio Google.",
  alternates: { canonical: "/raio-x" },
};

export default function Page() {
  return <RaioXPage />;
}
