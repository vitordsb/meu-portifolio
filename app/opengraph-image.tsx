import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Vitor de Souza Barreto — Engenheiro de Software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brutalist OG image: nome grande + tagline + chips de stack + foto cantinho
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f5f7fa",
          padding: 64,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* Grid de fundo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#0b1f3a08 1px, transparent 1px), linear-gradient(90deg, #0b1f3a08 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Tag superior */}
        <div
          style={{
            color: "#1f6feb",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 6,
            marginBottom: 24,
            display: "flex",
          }}
        >
          [ ENGENHEIRO DE SOFTWARE ]
        </div>

        {/* Nome em destaque */}
        <div
          style={{
            color: "#0b1226",
            fontSize: 112,
            fontWeight: 900,
            letterSpacing: -3,
            lineHeight: 0.92,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>VITOR DE</span>
          <span>SOUZA BARRETO</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 32,
            color: "#475569",
            fontSize: 26,
            maxWidth: 900,
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          Soluções web de alta performance, escalabilidade e impacto mensurável.
        </div>

        {/* Stack chips no rodapé */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {[
            "React",
            "Next.js",
            "TypeScript",
            "Node.js",
            "Tailwind",
            "Supabase",
            "AWS",
          ].map((tech) => (
            <div
              key={tech}
              style={{
                border: "2px solid #0b1226",
                padding: "8px 16px",
                fontSize: 18,
                fontWeight: 700,
                color: "#0b1226",
                display: "flex",
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* Marca canto inferior direito */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 64,
            color: "#1f6feb",
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: -1,
            display: "flex",
          }}
        >
          &lt;vitordsb/&gt;
        </div>

        {/* Bloco accent decorativo */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 96,
            height: "100%",
            background: "#1f6feb",
            opacity: 0.08,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
