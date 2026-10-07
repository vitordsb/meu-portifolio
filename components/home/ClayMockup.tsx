import { Lock } from "lucide-react";
import type { ProjectShots } from "@/lib/project-shots";

/**
 * Mockup "de argila": notebook e celular foscos, cor de argila clara, com
 * sombra macia, desenhados em CSS (sem imagem de aparelho de terceiro). O
 * notebook mostra o print de desktop e o celular, na frente, o de celular.
 * Tudo em porcentagem: o mesmo desenho serve no card grande e na miniatura.
 *
 * Sem print (projeto privado): a tela fica neutra, com cadeado.
 */

const CLAY = "#f1ede7";
const CLAY_SHADE = "#ddd6cb";
const SHADOW =
  "inset 0 1.5px 0 rgba(255,255,255,.95), inset 0 -3px 6px rgba(60,45,30,.10), 0 22px 44px -18px rgba(45,32,20,.45)";

function Screen({ src, focus, label }: { src?: string; focus?: string; label: string }) {
  if (!src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-[6%] bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-500">
        <Lock className="h-[14%] w-auto" />
        <span className="sr-only">{label}</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      draggable={false}
      className="h-full w-full select-none object-cover"
      style={{ objectPosition: focus ?? "top" }}
    />
  );
}

function Phone({ src, focus, label }: { src?: string; focus?: string; label: string }) {
  return (
    <div className="relative h-full w-full rounded-[17%/7.8%] p-[4%]" style={{ background: CLAY, boxShadow: SHADOW }}>
      <div className="h-full w-full overflow-hidden rounded-[13%/6%] bg-neutral-200">
        <Screen src={src} focus={focus} label={label} />
      </div>
      <span
        className="absolute left-1/2 top-[3.2%] aspect-[4/1] w-[30%] -translate-x-1/2 rounded-full"
        style={{ background: CLAY_SHADE }}
      />
    </div>
  );
}

export default function ClayMockup({
  shots,
  label,
  className = "",
  bare = false,
  tallOnMobile = false,
}: {
  shots?: ProjectShots;
  /** Nome do projeto, pra leitor de tela. */
  label: string;
  className?: string;
  /** Sem fundo nem luz próprios: o card de fora já tem. */
  bare?: boolean;
  /** No celular, caixa mais alta e aparelhos maiores (cases: imagem sempre grande). */
  tallOnMobile?: boolean;
}) {
  const desktop = shots?.desktop;
  const mobile = shots?.mobile;
  const mobileAlt = shots?.mobileAlt;
  const showLaptop = Boolean(desktop) || !mobile;
  const both = showLaptop && Boolean(mobile);

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative ${tallOnMobile ? "aspect-[4/3.4] sm:aspect-[16/10]" : "aspect-[16/10]"} ${
        bare ? "" : "overflow-hidden bg-[linear-gradient(150deg,#ebe6de_0%,#d9d2c6_100%)] dark:bg-[linear-gradient(150deg,#3b3834_0%,#292724_100%)]"
      } ${className}`}
    >
      {/* Luz suave no alto: dá volume sem cor */}
      {!bare && (
        <div aria-hidden className="absolute -left-[10%] -top-[30%] h-[80%] w-[70%] rounded-full bg-white/40 blur-3xl dark:bg-white/[0.06]" />
      )}

      {showLaptop && (
        <div
          aria-hidden
          className={`absolute transition-transform duration-500 group-hover:-translate-y-[1.5%] ${
            tallOnMobile
              ? both
                ? "left-[4%] top-[9%] w-[86%] sm:left-[7%] sm:top-[13%] sm:w-[72%]"
                : "left-[5%] top-[16%] w-[90%] sm:left-[10%] sm:top-[11%] sm:w-[80%]"
              : both
                ? "left-[7%] top-[13%] w-[72%]"
                : "left-[10%] top-[11%] w-[80%]"
          }`}
        >
          <div className="rounded-[3.2%/5.2%] p-[2.4%]" style={{ background: CLAY, boxShadow: SHADOW }}>
            <div className="aspect-[16/10] overflow-hidden rounded-[1.2%/1.9%] bg-neutral-200">
              <Screen src={desktop} label={label} />
            </div>
          </div>
          {/* Base do notebook, com o entalhe no meio */}
          <div
            className="relative left-1/2 aspect-[100/3.6] w-[116%] -translate-x-1/2 rounded-b-[45%_100%]"
            style={{ background: `linear-gradient(${CLAY}, ${CLAY_SHADE})`, boxShadow: SHADOW }}
          >
            <span className="absolute left-1/2 top-0 h-[38%] w-[14%] -translate-x-1/2 rounded-b-full bg-black/[0.07]" />
          </div>
        </div>
      )}

      {/* App só de celular com duas telas: dois aparelhos lado a lado */}
      {mobileAlt && !showLaptop && (
        <div
          aria-hidden
          className="absolute bottom-[11%] right-[52%] aspect-[9/19.5] h-[78%] transition-transform duration-500 group-hover:-translate-y-[1.5%]"
        >
          <Phone src={mobileAlt} label={label} />
        </div>
      )}

      {mobile && (
        <div
          aria-hidden
          className={`absolute aspect-[9/19.5] transition-transform delay-75 duration-500 group-hover:-translate-y-[2.5%] ${
            both
              ? tallOnMobile
                ? "bottom-[5%] right-[4%] h-[60%] sm:bottom-[7%] sm:right-[8%] sm:h-[76%]"
                : "bottom-[7%] right-[8%] h-[76%]"
              : mobileAlt
                ? "bottom-[6%] left-[50%] h-[86%]"
                : "bottom-[7%] left-1/2 h-[86%] -translate-x-1/2"
          }`}
        >
          <Phone src={mobile} focus={shots?.mobileFocus} label={label} />
        </div>
      )}
    </div>
  );
}
