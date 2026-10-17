/**
 * Modo prospecção do Raio-X (plano de leads #4): analisa uma lista de sites
 * e monta uma proposta por empresa, pronta pra revisar e enviar.
 *
 *   pnpm prospectar prospeccao/lista.txt
 *
 * A lista tem um site por linha. Opcional: nome da empresa depois de "|"
 * (`bufalloinox.com.br | Bufallo Inox`). Linha com # é comentário.
 *
 * Pra cada site: roda o Raio-X (PageSpeed, mesma chave do site), procura
 * e-mail comercial e WhatsApp na home e nas páginas de contato, escolhe os
 * 3 problemas mais graves e escreve o e-mail no formato padrão.
 *
 * Saída em prospeccao/<data>/ (fora do git): propostas.json (vira rascunho
 * no Gmail), propostas.csv (planilha) e um .txt por empresa.
 *
 * NÃO envia nada. E-mail de RH/vagas é descartado: proposta de serviço não
 * é assunto de quem recruta. Domínio já processado em outra rodada fica de
 * fora (prospeccao/historico.csv), pra ninguém receber a mesma proposta duas vezes.
 */

import { existsSync } from "node:fs";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";
import { analyze, PsiError } from "@/lib/raio-x/psi";
import { displayUrl, normalizeSiteUrl } from "@/lib/raio-x/url";
import type { Issue, Report } from "@/lib/raio-x/types";

config({ path: ".env.local" });

const SITE = "https://www.vitordsb.com.br";
const DIR = "prospeccao";
const HISTORY = path.join(DIR, "historico.csv");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

/** Site já bom não rende proposta convincente. */
const GOOD = { performance: 80, seo: 90 };

/** Títulos genéricos do Raio-X: no e-mail parecem enrolação. */
const VAGUE = /^(Detalhe técnico|Configuração técnica|Partes do site)/;

const HR = /(^|[._-])(rh|recrutamento|curriculo|curriculos|cv|vagas?|trabalhe|jobs|carreiras?|talentos|selecao)([._-]|@)/i;
const SALES = /^(comercial|vendas|contato|atendimento|orcamento|orcamentos|sac|faleconosco|contact|sales|info)@/i;
const JUNK = /\.(png|jpe?g|gif|webp|svg)$|sentry|wixpress|example\.|seudominio|email@|nome@|@sentry|@2x/i;

type Target = { url: string; name?: string };

type Proposal = {
  empresa: string;
  site: string;
  email: string | null;
  outrosEmails: string[];
  whatsapp: string | null;
  notas: Report["scores"];
  problemas: string[];
  assunto: string;
  corpo: string;
  status: "pronta" | "sem_email" | "site_bom" | "falhou";
  motivo?: string;
};

function fail(msg: string): never {
  console.error(`\n  ${msg}\n`);
  process.exit(1);
}

function parseList(text: string): Target[] {
  const out: Target[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [site, name] = line.split("|").map((s) => s.trim());
    const url = normalizeSiteUrl(site);
    if (!url) {
      console.warn(`  ignorado (endereço inválido): ${line}`);
      continue;
    }
    out.push({ url, name: name || undefined });
  }
  return out;
}

function domainOf(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}

async function getHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("html")) return null;
    return (await res.text()).slice(0, 2_000_000);
  } catch {
    return null;
  }
}

/** Links da mesma empresa com cara de página de contato. */
function contactLinks(html: string, base: string): string[] {
  const host = domainOf(base);
  const links = new Set<string>();
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const [, href, text] = m;
    if (!/contato|fale|atendimento|orcamento|orçamento|contact/i.test(href + text)) continue;
    try {
      const u = new URL(href, base);
      if (domainOf(u.toString()) === host && u.protocol.startsWith("http")) links.add(u.toString());
    } catch {}
  }
  return [...links].slice(0, 3);
}

function decodeEntities(s: string) {
  return s.replace(/&#64;|&commat;/g, "@").replace(/&#46;|&period;/g, ".");
}

function findEmails(html: string): string[] {
  const text = decodeEntities(html);
  const found = new Set<string>();
  for (const m of text.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)) {
    const e = m[0].toLowerCase().replace(/\.$/, "");
    if (!JUNK.test(e)) found.add(e);
  }
  return [...found];
}

function findWhatsapp(html: string): string | null {
  const m =
    html.match(/(?:wa\.me\/|api\.whatsapp\.com\/send\/?\?phone=|whatsapp\.com\/send\?phone=)(\+?\d{10,15})/i);
  return m ? m[1].replace(/\D/g, "") : null;
}

function pageName(html: string): string | null {
  const og = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i);
  if (og) return og[1].trim();
  const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (!t) return null;
  // "Home - Empresa X | Fios de aço" -> o pedaço mais curto que não é "Home"
  const parts = t[1].split(/[|\-\u2013\u2014:]/).map((s) => s.trim()).filter((s) => s && !/^(home|início|inicio)$/i.test(s));
  return parts.sort((a, b) => a.length - b.length)[0] ?? null;
}

/** Comercial primeiro; RH nunca. */
function pickEmail(emails: string[], domain: string) {
  const ok = emails.filter((e) => !HR.test(e));
  const score = (e: string) => (SALES.test(e) ? 0 : 2) + (e.endsWith(`@${domain}`) ? 0 : 1);
  ok.sort((a, b) => score(a) - score(b));
  return { best: ok[0] ?? null, others: ok.slice(1, 4) };
}

function problemLines(r: Report): string[] {
  const pick = r.issues.filter((i: Issue) => !VAGUE.test(i.title)).slice(0, 3);
  return pick.map((i) => {
    const t = i.title.replace(/\.$/, "");
    return i.id === "@lcp" ? `${t} (teste do Google).` : `${t}.`;
  });
}

function buildEmail(empresa: string, site: string, problems: string[]) {
  const link = `${SITE}/raio-x?site=${encodeURIComponent(displayUrl(site))}&utm_source=prospeccao&utm_medium=email`;
  const n = problems.length;
  const assunto = `Site da ${empresa}: ${n} ${n === 1 ? "melhoria rápida" : "melhorias rápidas"}`;
  const corpo = [
    "Olá, tudo bem?",
    "",
    `Sou o Vitor de Souza, desenvolvedor de sites para empresas. Dei uma olhada no site da ${empresa} e encontrei ${n === 1 ? "um ponto que pode" : `${n} pontos que podem`} estar custando clientes:`,
    "",
    ...problems.map((p, i) => `${i + 1}. ${p}`),
    "",
    `Consigo resolver ${n === 1 ? "isso" : n === 2 ? "os dois" : "os três"}. O diagnóstico completo do site de vocês é gratuito:`,
    link,
    "",
    "Podemos conversar 15 minutos esta semana?",
    "",
    "Abraço,",
    "Vitor de Souza",
    "www.vitordsb.com.br",
    "",
    "Se não quiser receber este tipo de contato, é só responder \"não\" que eu não escrevo mais.",
  ].join("\n");
  return { assunto, corpo };
}

async function loadHistory(): Promise<Set<string>> {
  if (!existsSync(HISTORY)) return new Set();
  const text = await readFile(HISTORY, "utf8");
  return new Set(text.split("\n").slice(1).map((l) => l.split(",")[1]).filter(Boolean));
}

function csvCell(v: unknown) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function prospect(t: Target): Promise<Proposal> {
  const domain = domainOf(t.url);
  const home = await getHtml(t.url);
  const pages = home ? [home, ...(await Promise.all(contactLinks(home, t.url).map(getHtml)))] : [];
  const htmls = pages.filter((h): h is string => Boolean(h));

  const emails = [...new Set(htmls.flatMap(findEmails))];
  const { best, others } = pickEmail(emails, domain);
  const whatsapp = htmls.map(findWhatsapp).find(Boolean) ?? null;
  const empresa = t.name ?? (home && pageName(home)) ?? domain;

  const base = { empresa, site: t.url, email: best, outrosEmails: others, whatsapp };

  let report: Report;
  try {
    report = await analyze(t.url, "pt");
  } catch (e) {
    const motivo = e instanceof PsiError ? e.reason : "falhou";
    return { ...base, notas: { performance: 0, seo: 0, accessibility: 0, bestPractices: 0 }, problemas: [], assunto: "", corpo: "", status: "falhou", motivo };
  }

  const problemas = problemLines(report);
  const { assunto, corpo } = buildEmail(empresa, t.url, problemas);
  const good = report.scores.performance >= GOOD.performance && report.scores.seo >= GOOD.seo;
  const status = good || problemas.length === 0 ? "site_bom" : best ? "pronta" : "sem_email";
  return { ...base, notas: report.scores, problemas, assunto, corpo, status };
}

async function main() {
  const file = process.argv[2];
  if (!file) fail("Uso: pnpm prospectar prospeccao/lista.txt");
  if (!existsSync(file)) fail(`Arquivo não encontrado: ${file}`);
  if (!process.env.PAGESPEED_API_KEY) fail("Falta PAGESPEED_API_KEY no .env.local (a mesma do Raio-X).");

  const history = await loadHistory();
  const all = parseList(await readFile(file, "utf8"));
  const targets = all.filter((t) => !history.has(domainOf(t.url)));
  const skipped = all.length - targets.length;
  if (!targets.length) fail(skipped ? "Todos os sites da lista já foram processados antes (prospeccao/historico.csv)." : "Lista vazia.");

  const day = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
  const outDir = path.join(DIR, day);
  await mkdir(outDir, { recursive: true });

  console.log(`\n  ${targets.length} site(s) pra analisar${skipped ? ` (${skipped} já processado(s), pulados)` : ""}.\n`);

  const results: Proposal[] = [];
  for (const [i, t] of targets.entries()) {
    process.stdout.write(`  [${i + 1}/${targets.length}] ${displayUrl(t.url)} ... `);
    const p = await prospect(t);
    results.push(p);
    const label = {
      pronta: `pronta -> ${p.email}`,
      sem_email: `sem e-mail comercial${p.whatsapp ? ` (WhatsApp ${p.whatsapp})` : ""}`,
      site_bom: "site já está bom, pulei",
      falhou: `não consegui analisar (${p.motivo})`,
    }[p.status];
    console.log(label);
    if (p.corpo) {
      const slug = domainOf(t.url).replace(/[^a-z0-9]+/g, "-");
      await writeFile(path.join(outDir, `${slug}.txt`), `Para: ${p.email ?? "(sem e-mail)"}\nAssunto: ${p.assunto}\n\n${p.corpo}\n`);
    }
  }

  await writeFile(path.join(outDir, "propostas.json"), JSON.stringify(results, null, 2));
  const cols = ["status", "empresa", "site", "email", "whatsapp", "velocidade", "seo", "assunto", "outros_emails", "motivo"];
  const rows = results.map((p) =>
    [p.status, p.empresa, p.site, p.email, p.whatsapp, p.notas.performance, p.notas.seo, p.assunto, p.outrosEmails.join(" "), p.motivo]
      .map(csvCell)
      .join(","),
  );
  await writeFile(path.join(outDir, "propostas.csv"), [cols.join(","), ...rows].join("\n") + "\n");

  // Falha de análise não entra no histórico: dá pra tentar de novo depois
  if (!existsSync(HISTORY)) await writeFile(HISTORY, "data,dominio,status\n");
  const done = results.filter((p) => p.status !== "falhou");
  if (done.length) await appendFile(HISTORY, done.map((p) => `${day},${domainOf(p.site)},${p.status}`).join("\n") + "\n");

  const count = (s: Proposal["status"]) => results.filter((p) => p.status === s).length;
  console.log(
    `\n  Prontas: ${count("pronta")} | sem e-mail: ${count("sem_email")} | site bom: ${count("site_bom")} | falharam: ${count("falhou")}`,
  );
  console.log(`  Arquivos em ${outDir}/\n`);
}

main().catch((e) => fail(e instanceof Error ? e.message : String(e)));
