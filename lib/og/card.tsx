import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/site";

/**
 * Imagem de prévia (Open Graph) que aparece quando o link é colado no
 * WhatsApp, LinkedIn, Instagram etc. Mesma cara do site: fundo escuro
 * monocromático, título pesado, a marca e um convite claro no canto. Sem foto
 * de pessoa: o site fala como empresa (06/out/2026).
 *
 * Cada página de venda tem a sua (opengraph-image.tsx na pasta da rota): um
 * link do Raio-X mandado pra um cliente tem que falar do Raio-X, não do
 * portfólio. As imagens são geradas no build (estáticas).
 *
 * Fontes: Geist (vem no pacote `geist`, licença OFL), copiadas pra
 * lib/og/assets porque o Satori precisa do arquivo .ttf.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const C = {
  bg: "#1c1c1f",
  text: "#f5f5f5",
  muted: "#a3a3a3",
  line: "#36363b",
  accent: "#a78bfa",
};

const ASSETS = join(process.cwd(), "lib/og/assets");

async function assets() {
  const [black, medium, mono] = await Promise.all([
    readFile(join(ASSETS, "Geist-Black.ttf")),
    readFile(join(ASSETS, "Geist-Medium.ttf")),
    readFile(join(ASSETS, "GeistMono-Medium.ttf")),
  ]);
  return [
    { name: "Geist", data: black, weight: 900 as const, style: "normal" as const },
    { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "GeistMono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

type Card = {
  /** Linha pequena em caixa alta acima do título. */
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Convite no canto inferior direito, em pílula clara. */
  cta: string;
};

export async function ogCard({ eyebrow, title, subtitle, cta }: Card) {
  const fonts = await assets();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: C.bg,
          color: C.text,
          fontFamily: "Geist",
          padding: "64px 80px 60px",
          position: "relative",
        }}
      >
        {/* Brilho violeta discreto no canto: o mesmo acento do site */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -200,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(167,139,250,0.20) 0%, rgba(167,139,250,0) 65%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            fontFamily: "GeistMono",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: C.muted,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontWeight: 900,
            fontSize: 82,
            lineHeight: 1.02,
            letterSpacing: -3,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              fontWeight: 500,
              lineHeight: 1.35,
              color: C.muted,
              maxWidth: 960,
            }}
          >
            {subtitle}
          </div>
        )}

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 26, fontWeight: 500 }}>{BRAND.name}</span>
            <span style={{ fontFamily: "GeistMono", fontSize: 18, color: C.muted }}>vitordsb.com.br</span>
          </div>
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              alignItems: "center",
              background: C.text,
              color: C.bg,
              fontSize: 26,
              fontWeight: 500,
              padding: "18px 32px",
              borderRadius: 9999,
            }}
          >
            {cta}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
