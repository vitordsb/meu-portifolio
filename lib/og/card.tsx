import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/site";

/**
 * Imagem de prévia (Open Graph) que aparece quando o link é colado no
 * WhatsApp, LinkedIn, Instagram etc. Mesma cara do site: fundo escuro
 * monocromático, título pesado, a marca e um convite claro. Sem foto de
 * pessoa: o site fala como empresa (06/out/2026). Padrão de 07/out/2026: sem
 * rótulo em caixa-alta acima do título (o assunto vai no rodapé, junto da
 * marca), sem cor viva e botão quadrado. A home mostra o case do ArqDoor nos
 * aparelhos, como no topo do site.
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
  clay: "#f1ede7",
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

/** Print em /public como data URL (o Satori não busca arquivo sozinho). */
async function shot(path: string) {
  const data = await readFile(join(process.cwd(), "public", path));
  return `data:image/jpeg;base64,${data.toString("base64")}`;
}

type Card = {
  /** Assunto da página, no rodapé ao lado da marca (não acima do título). */
  label: string;
  title: string;
  subtitle?: string;
  /** Convite, em botão claro e quadrado. */
  cta: string;
  /** Prints de um case (em /public) pra mostrar nos aparelhos, à direita. */
  shots?: { desktop: string; mobile: string };
};

export async function ogCard({ label, title, subtitle, cta, shots }: Card) {
  const fonts = await assets();
  const imgs = shots
    ? await Promise.all([shot(shots.desktop), shot(shots.mobile)])
    : null;

  const button = (
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
      }}
    >
      {cta}
    </div>
  );

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
          padding: "64px 80px 56px",
          position: "relative",
        }}
      >
        {/* Luz neutra e discreta no canto: volume sem cor */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -200,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 65%)",
            display: "flex",
          }}
        />

        {imgs && (
          <div style={{ position: "absolute", left: 640, top: 96, display: "flex" }}>
            {/* Notebook */}
            <div
              style={{
                display: "flex",
                background: C.clay,
                padding: 12,
                borderRadius: 16,
                boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgs[0]} width={512} height={320} style={{ objectFit: "cover", borderRadius: 6 }} alt="" />
            </div>
            {/* Celular, na frente */}
            <div
              style={{
                position: "absolute",
                left: 400,
                top: 150,
                display: "flex",
                background: C.clay,
                padding: 8,
                borderRadius: 26,
                boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgs[1]} width={124} height={268} style={{ objectFit: "cover", borderRadius: 18 }} alt="" />
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            fontWeight: 900,
            fontSize: imgs ? 54 : 82,
            lineHeight: 1.02,
            letterSpacing: imgs ? -2 : -3,
            maxWidth: imgs ? 540 : 1000,
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              display: "flex",
              marginTop: imgs ? 20 : 26,
              fontSize: imgs ? 22 : 30,
              fontWeight: 500,
              lineHeight: 1.35,
              color: C.muted,
              maxWidth: imgs ? 520 : 960,
            }}
          >
            {subtitle}
          </div>
        )}

        {imgs && <div style={{ display: "flex", marginTop: 28 }}>{button}</div>}

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 32,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 500 }}>
              <span>{BRAND.name}</span>
              <span style={{ color: C.muted }}>{`\u00a0· ${label}`}</span>
            </div>
            <span style={{ fontFamily: "GeistMono", fontSize: 18, color: C.muted }}>vitordsb.com.br</span>
          </div>
          {!imgs && button}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
