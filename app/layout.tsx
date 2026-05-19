import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Vitor de Souza Barreto | Full-Stack Developer",
  description:
    "Full-Stack Developer transformando desafios de negócio em soluções web de alta performance, escalabilidade e impacto mensurável.",
  openGraph: {
    title: "Vitor de Souza Barreto | Full-Stack Developer",
    description: "Portfolio profissional — projetos, competências e trabalho freelancer.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
