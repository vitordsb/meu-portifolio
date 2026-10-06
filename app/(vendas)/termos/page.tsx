import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Bullets, type LegalSection } from "@/components/legal/LegalPage";
import { BRAND, CNPJ, OG_BASE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de Uso | Vitor de Souza",
  description:
    "Regras de uso do site, do orçamento com IA, do Raio-X grátis, dos pacotes com preço fechado e dos pagamentos.",
  alternates: { canonical: "/termos" },
  openGraph: {
    ...OG_BASE,
    title: "Termos de Uso",
    description: "As regras do site e dos serviços, em linguagem simples.",
    url: `${SITE_URL}/termos`,
  },
};

/**
 * Termos de Uso. Escritos a partir do que o site oferece (out/2026). Escopo,
 * propriedade do código, garantias e suporte de cada projeto ficam no
 * contrato, não aqui: o Vitor ainda não definiu uma regra única pra isso.
 */

const UPDATED = "6 de outubro de 2026";

const sections: LegalSection[] = [
  {
    id: "quem-somos",
    title: "Quem somos e o que é este documento",
    body: (
      <>
        <p>
          Este site é de {BRAND.name}, empresa inscrita no CNPJ {CNPJ}, que cria sites, sistemas e aplicativos.
        </p>
        <p>
          Estes termos explicam as regras para usar o site e os serviços oferecidos nele. Ao usar o site, você
          concorda com eles. O tratamento dos seus dados está explicado na{" "}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </p>
      </>
    ),
  },
  {
    id: "servicos-do-site",
    title: "O que o site oferece",
    body: (
      <Bullets
        items={[
          "Informações sobre os serviços e os projetos já entregues.",
          "Orçamento grátis com inteligência artificial.",
          "Raio-X grátis de sites.",
          "Pacotes com preço fechado, que podem ser pagos pelo site.",
          "Pagamento de pedidos combinados com a gente.",
        ]}
      />
    ),
  },
  {
    id: "orcamento",
    title: "Orçamento com IA",
    body: (
      <>
        <p>
          O orçamento com IA mostra um <strong>valor de partida</strong> da primeira versão do projeto (MVP), o
          prazo estimado e a equipe sugerida. Esse valor é calculado a partir do que você contou na conversa.
        </p>
        <p>
          Ele <strong>não é uma proposta fechada</strong>. O valor final, o prazo e o que entra no projeto são
          definidos depois de uma conversa, numa proposta por escrito. A inteligência artificial pode entender algo
          errado ou incompleto: o que vale é a proposta.
        </p>
      </>
    ),
  },
  {
    id: "raio-x",
    title: "Raio-X grátis",
    body: (
      <p>
        O Raio-X usa o teste público do Google (PageSpeed) para avaliar velocidade, aparição no Google,
        acessibilidade e segurança de um site. O resultado é informativo e pode variar a cada teste, conforme a
        rede e o momento. Ele não garante posição no Google nem resultado de vendas.
      </p>
    ),
  },
  {
    id: "contratacao",
    title: "Contratação de projetos",
    body: (
      <p>
        Projetos sob medida são contratados por proposta e contrato próprios. É neles que ficam o escopo, o
        prazo, o valor, a forma de pagamento, a propriedade do que for criado, as garantias e o suporte. Se algo
        no contrato for diferente destes termos, vale o contrato.
      </p>
    ),
  },
  {
    id: "pacotes",
    title: "Pacotes com preço fechado",
    body: (
      <>
        <p>
          O que cada pacote inclui, o preço e o formato de entrega estão descritos na página de{" "}
          <Link href="/servicos">serviços</Link>. O trabalho começa depois da confirmação do pagamento, e a data de
          início é combinada com você pelo WhatsApp ou e-mail.
        </p>
        <p>
          Para começar, podemos precisar de informações e materiais seus (textos, imagens, acessos). Atrasos no
          envio desses materiais mudam o prazo de entrega na mesma medida.
        </p>
      </>
    ),
  },
  {
    id: "pagamentos",
    title: "Pagamentos e nota fiscal",
    body: (
      <>
        <p>
          Os pagamentos são processados pelo Asaas, por Pix, boleto ou cartão, conforme a opção disponível. Os
          dados do cartão são digitados na página do Asaas e não passam pelo nosso site.
        </p>
        <p>Emitimos nota fiscal dos serviços pagos.</p>
      </>
    ),
  },
  {
    id: "arrependimento",
    title: "Desistência e reembolso",
    body: (
      <>
        <p>
          Pelo Código de Defesa do Consumidor (art. 49), você pode <strong>desistir da compra em até 7 dias</strong>{" "}
          contados do pagamento. Nesse caso, devolvemos o valor pago, pelo mesmo meio de pagamento.
        </p>
        <p>
          Para desistir, mande um e-mail para <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> com o número do
          pedido. Depois desse prazo, o cancelamento segue o que foi combinado no pedido ou no contrato.
        </p>
      </>
    ),
  },
  {
    id: "uso",
    title: "Uso correto do site",
    body: (
      <>
        <p>Ao usar o site, você se compromete a não:</p>
        <Bullets
          items={[
            "Enviar informações falsas ou de outra pessoa sem autorização.",
            "Usar robôs, programas automáticos ou envios em massa nos formulários.",
            "Tentar enganar, desviar ou extrair as instruções do orçamento com IA.",
            "Tentar invadir, sobrecarregar ou atrapalhar o funcionamento do site.",
          ]}
        />
        <p>Podemos bloquear acessos que desrespeitem essas regras.</p>
      </>
    ),
  },
  {
    id: "propriedade",
    title: "Conteúdo e marcas",
    body: (
      <p>
        Os textos, o design e o código deste site pertencem a {BRAND.name}. Os projetos de clientes aparecem
        como portfólio e as marcas e telas deles pertencem aos respectivos donos. Não é permitido copiar o
        conteúdo do site para uso comercial sem autorização.
      </p>
    ),
  },
  {
    id: "links",
    title: "Links para outros sites",
    body: (
      <p>
        O site tem links para projetos no ar, redes sociais e outros serviços. Esses sites têm regras próprias e
        não são controlados por nós.
      </p>
    ),
  },
  {
    id: "responsabilidade",
    title: "Responsabilidade",
    body: (
      <p>
        Trabalhamos para o site ficar sempre no ar e com informações corretas, mas ele pode passar por
        instabilidades ou manutenções. As estimativas do orçamento com IA e do Raio-X são informativas. Nada
        nestes termos limita os direitos que o Código de Defesa do Consumidor garante a você.
      </p>
    ),
  },
  {
    id: "mudancas",
    title: "Mudanças nestes termos",
    body: (
      <p>
        Estes termos podem ser atualizados quando o site ou os serviços mudarem. A data no topo mostra a versão
        em vigor. Compras e contratos já feitos seguem as condições da época em que foram fechados.
      </p>
    ),
  },
  {
    id: "lei",
    title: "Lei aplicável e contato",
    body: (
      <p>
        Estes termos seguem as leis do Brasil. Para resolver qualquer questão, vale o foro do seu domicílio,
        quando você for consumidor. Dúvidas? Escreva para{" "}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      updated={UPDATED}
      summary={[
        "O orçamento com IA mostra um valor de partida. O valor fechado vem numa proposta por escrito.",
        "Projetos sob medida seguem o contrato de cada um, que prevalece sobre estes termos.",
        "Pagamentos são feitos pelo Asaas, com nota fiscal. Os dados do cartão não passam pelo site.",
        "Você pode desistir de uma compra em até 7 dias e recebe o dinheiro de volta.",
      ]}
      sections={sections}
      other={{ href: "/privacidade", label: "Política de Privacidade" }}
    />
  );
}
