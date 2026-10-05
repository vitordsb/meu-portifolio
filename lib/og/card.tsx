import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Imagem de prévia (Open Graph) que aparece quando o link é colado no
 * WhatsApp, LinkedIn, Instagram etc. Mesma cara do site: fundo escuro
 * monocromático, título pesado, foto do Vitor e um convite claro no canto.
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
  const [black, medium, mono, photo] = await Promise.all([
    readFile(join(ASSETS, "Geist-Black.ttf")),
    readFile(join(ASSETS, "Geist-Medium.ttf")),
    readFile(join(ASSETS, "GeistMono-Medium.ttf")),
    readFile(join(ASSETS, "vitor.jpg")),
  ]);
  return {
    fonts: [
      { name: "Geist", data: black, weight: 900 as const, style: "normal" as const },
      { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
      { name: "GeistMono", data: mono, weight: 500 as const, style: "normal" as const },
    ],
    photo: `data:image/jpeg;base64,${photo.toString("base64")}`,
  };
}

type Card = {
  /** Linha pequena em caixa alta acima do título. */
  eyebrow: string;
  /** Uma string quebra sozinha; um array força as linhas (banner da home). */
  title: string | string[];
  subtitle?: string;
  /** Convite no canto inferior direito, em pílula clara. */
  cta: string;
  /** Home: título gigante como o banner, com o nome embaixo. */
  hero?: boolean;
};

function Photo({ src, size }: { src: string; size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      style={{ borderRadius: 9999, border: `2px solid ${C.line}` }}
    />
  );
}

export async function ogCard({ eyebrow, title, subtitle, cta, hero }: Card) {
  const { fonts, photo } = await assets();
  const lines = Array.isArray(title) ? title : [title];

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

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {hero && <Photo src={photo} size={64} />}
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
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: hero ? 22 : 40,
            fontWeight: 900,
            fontSize: hero ? 150 : 82,
            lineHeight: hero ? 0.9 : 1.02,
            letterSpacing: hero ? -7 : -3,
            maxWidth: 1000,
          }}
        >
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>

        {hero && (
          <div style={{ display: "flex", marginTop: 22, fontSize: 50, fontWeight: 500, letterSpacing: -1 }}>
            Vitor de Souza
          </div>
        )}

        {!hero && subtitle && (
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
          {hero ? (
            <div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: C.muted, maxWidth: 620, lineHeight: 1.35 }}>
              {subtitle}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Photo src={photo} size={60} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 26, fontWeight: 500 }}>Vitor de Souza</span>
                <span style={{ fontFamily: "GeistMono", fontSize: 18, color: C.muted }}>
                  vitordsb.com.br
                </span>
              </div>
            </div>
          )}
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
