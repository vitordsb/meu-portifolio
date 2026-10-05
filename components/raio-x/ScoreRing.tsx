/** Cor da nota na régua do Lighthouse: 90+ bom, 50 a 89 atenção, abaixo ruim. */
export function scoreTone(n: number) {
  if (n >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (n >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

const R = 26;
const LEN = 2 * Math.PI * R;

/** Anel de 0 a 100 com a nota no meio. */
export default function ScoreRing({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className={`relative h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] ${scoreTone(value)}`}>
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="32" cy="32" r={R} fill="none" strokeWidth="5" className="stroke-outline-variant" />
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={LEN}
            strokeDashoffset={LEN * (1 - value / 100)}
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold tabular-nums sm:text-xl">
          {value}
        </span>
      </div>
      <span className="text-xs leading-tight text-on-surface-variant sm:text-sm">{label}</span>
    </div>
  );
}
