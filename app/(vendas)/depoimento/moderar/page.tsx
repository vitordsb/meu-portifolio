import type { Metadata } from "next";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import TestimonialCard from "@/components/depoimentos/TestimonialCard";
import { readTestimonial, removeTestimonial, TESTIMONIALS_TAG } from "@/lib/testimonials/store";
import { checkModerationSig } from "@/lib/testimonials/token";

export const metadata: Metadata = {
  title: "Depoimento",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";

/**
 * Destino do botão "Tirar do site" do e-mail do Vitor. O link só mostra a
 * página: a remoção é um POST no botão daqui, porque o Gmail e antivírus
 * abrem os links do e-mail sozinhos pra checar, e um GET que removesse
 * tiraria todo depoimento do ar no instante em que o e-mail chegasse.
 */
async function remove(form: FormData) {
  "use server";
  const id = String(form.get("id") ?? "");
  const s = String(form.get("s") ?? "");
  if (!checkModerationSig(id, s)) return;
  await removeTestimonial(id);
  revalidateTag(TESTIMONIALS_TAG);
  // `removido=1`: a leitura logo depois da gravação às vezes ainda devolve o
  // estado antigo, e a página mostrava "No ar no site" até recarregar
  redirect(`/depoimento/moderar?id=${encodeURIComponent(id)}&s=${encodeURIComponent(s)}&removido=1`);
}

export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string; s?: string; removido?: string }> }) {
  const { id = "", s = "", removido } = await searchParams;
  const ok = checkModerationSig(id, s);
  const read = ok ? await readTestimonial(id) : null;
  const t = read && removido === "1" ? { ...read, status: "removido" as const, photoUrl: null } : read;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl bg-surface px-5 py-16 text-on-surface">
      {!t ? (
        <>
          <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Link inválido</h1>
          <p className="mt-3 text-on-surface-variant">Esse depoimento não existe ou o link do e-mail foi alterado.</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-extrabold tracking-[-0.03em]">
            {t.status === "removido" ? "Fora do site" : "No ar no site"}
          </h1>
          <p className="mt-3 text-on-surface-variant">
            {t.status === "removido"
              ? "Esse depoimento foi tirado do site e a foto foi apagada."
              : `Publicado ${t.verified ? "pelo link único (cliente verificado)" : "pelo formulário aberto"}.`}
          </p>
          <div className="mt-8">
            <TestimonialCard t={t} pt />
          </div>
          {t.status === "publicado" && (
            <form action={remove} className="mt-8">
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="s" value={s} />
              <button type="submit" className="btn btn-filled h-12 rounded-none px-6 text-base">
                Tirar do site
              </button>
            </form>
          )}
        </>
      )}
    </main>
  );
}
