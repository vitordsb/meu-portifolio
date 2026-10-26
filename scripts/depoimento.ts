/**
 * Gera o link único de depoimento pra mandar a um cliente.
 *
 *   pnpm depoimento arqdoor "Dani"
 *   pnpm depoimento                 (lista os projetos)
 *
 * O link vale 1 envio e 30 dias, já vem com o projeto marcado e o
 * depoimento sai com "Cliente verificado". Precisa do mesmo
 * TESTIMONIAL_SECRET do .env.local que está na Vercel: com segredo diferente,
 * o site recusa o link.
 *
 * Não manda nada pra ninguém: imprime o link e a mensagem pronta do WhatsApp.
 */
import { config } from "dotenv";
import { OTHER_PROJECT, projectName, testimonialProjects } from "@/lib/testimonials/projects";
import { testimonialRequestMessage } from "@/lib/testimonials/request-message";
import { createRequestToken } from "@/lib/testimonials/token";

config({ path: ".env.local" });

const SITE = "https://www.vitordsb.com.br";
const [project, ...nameParts] = process.argv.slice(2);
const name = nameParts.join(" ").trim();
const projects = testimonialProjects();

if (!project || (project !== OTHER_PROJECT && !projectName(project))) {
  if (project) console.error(`Projeto "${project}" não existe.\n`);
  console.log('Uso: pnpm depoimento <projeto> "<nome da pessoa>"\n\nProjetos:');
  for (const p of projects) console.log(`  ${p.id.padEnd(18)} ${p.name}`);
  console.log(`  ${OTHER_PROJECT.padEnd(18)} (projeto fora da lista)`);
  process.exit(project ? 1 : 0);
}

if (!process.env.TESTIMONIAL_SECRET || process.env.TESTIMONIAL_SECRET.length < 32) {
  console.error("Falta TESTIMONIAL_SECRET no .env.local (o mesmo valor da Vercel, 32+ caracteres).");
  process.exit(1);
}

const { token } = createRequestToken({ project, name: name || undefined });
const link = `${SITE}/depoimento/${token}`;
console.log(`\nLink (1 envio, vale 30 dias):\n${link}\n`);
console.log("Mensagem pro WhatsApp:\n");
console.log(testimonialRequestMessage(link, name, projectName(project)));
console.log();
