import { Fragment } from "react";

/**
 * Renderiza **negrito** dentro de um texto simples.
 *
 * As descrições de projeto vêm do banco (ou do fallback) como string pura, mas
 * precisam destacar o que importa: stack, papel, tipo de produto. Em vez de
 * guardar HTML no banco - que abriria porta pra injeção e pra conteúdo quebrado
 * vindo do /admin - a marcação aceita só `**assim**` e vira <strong>.
 * Qualquer outra coisa é impressa literalmente.
 */
export function RichText({ text }: { text: string }) {
  if (!text) return null;

  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, i) =>
        part.length > 4 && part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-bold text-on-surface">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Mesma marcação, sem formatação: pra title, alt e meta description. */
export function stripRichText(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}
