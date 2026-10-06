import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Bullets, type LegalSection } from "@/components/legal/LegalPage";
import { BRAND, CNPJ, OG_BASE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade | Vitor de Souza",
  description:
    "Quais dados o site coleta, para quê, com quem compartilha, por quanto tempo guarda e como você exerce seus direitos pela LGPD.",
  alternates: { canonical: "/privacidade" },
  openGraph: {
    ...OG_BASE,
    title: "Política de Privacidade",
    description: "Como o site trata os seus dados, em linguagem simples.",
    url: `${SITE_URL}/privacidade`,
  },
};

/**
 * Política de Privacidade (LGPD). Escrita a partir do que o código faz de
 * verdade (out/2026): se um formulário, serviço externo ou dado guardado
 * mudar, esta página muda junto. Prazos de guarda definidos pelo Vitor.
 */

const UPDATED = "6 de outubro de 2026";

const sections: LegalSection[] = [
  {
    id: "quem-somos",
    title: "Quem cuida dos seus dados",
    body: (
      <>
        <p>
          O responsável pelos seus dados (o &quot;controlador&quot;, na LGPD) é {BRAND.name}, empresa inscrita no
          CNPJ {CNPJ}, dona do site vitordsb.com.br.
        </p>
        <p>
          O encarregado pelo tratamento de dados é o próprio Vitor de Souza. Fale com ele pelo e-mail{" "}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
        </p>
      </>
    ),
  },
  {
    id: "dados",
    title: "Quais dados coletamos e para quê",
    body: (
      <>
        <p>Só coletamos o que você mesmo informa ao usar um recurso do site:</p>
        <Bullets
          items={[
            <>
              <strong>Orçamento com IA:</strong> a conversa sobre o seu projeto, as imagens que você anexar, seu
              nome, WhatsApp e, se quiser, seu e-mail. Usamos para calcular a faixa de preço, enviar o orçamento e
              falar com você sobre o projeto.
            </>,
            <>
              <strong>Raio-X grátis:</strong> o endereço do site analisado, seu nome, WhatsApp e, se quiser, seu
              e-mail. Usamos para gerar o relatório, enviar a você e conversar sobre as melhorias.
            </>,
            <>
              <strong>Formulário de contato:</strong> nome, e-mail, empresa, assunto e mensagem, para responder o
              que você pediu.
            </>,
            <>
              <strong>Novidades por e-mail:</strong> seu e-mail, para avisar quando lançarmos algo novo. Só entra
              quem pede.
            </>,
            <>
              <strong>Pagamentos:</strong> o pagamento acontece na página do Asaas. Os dados do cartão são digitados
              lá e nunca passam pelo nosso site. Para cobrar um pedido combinado, informamos ao Asaas seu nome,
              CPF ou CNPJ, e-mail e telefone.
            </>,
          ]}
        />
        <p>
          Junto com um pedido de orçamento, contato, Raio-X ou novidades, registramos também de onde veio a sua
          visita (por exemplo, um link que você recebeu ou uma página do Google) e a página em que você entrou no
          site. Isso nos ajuda a saber quais canais funcionam.
        </p>
      </>
    ),
  },
  {
    id: "bases-legais",
    title: "Por que podemos usar esses dados",
    body: (
      <>
        <p>A LGPD exige uma razão legal para cada uso. As nossas são:</p>
        <Bullets
          items={[
            <>
              <strong>Pedido seu antes de um contrato</strong> (art. 7º, V): orçamento, Raio-X e contato são
              etapas que você mesmo pediu antes de contratar.
            </>,
            <>
              <strong>Consentimento</strong> (art. 7º, I): a caixa que você marca no orçamento e no Raio-X, e o
              pedido de novidades. Você pode retirar quando quiser.
            </>,
            <>
              <strong>Execução de contrato e obrigação legal</strong> (art. 7º, II e V): cobrança, nota fiscal e
              registros que a lei exige guardar.
            </>,
            <>
              <strong>Legítimo interesse</strong> (art. 7º, IX): proteger o site contra robôs e abuso, e entender de
              forma agregada como ele é usado.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "navegacao",
    title: "O que acontece enquanto você navega",
    body: (
      <>
        <Bullets
          items={[
            <>
              <strong>Estatísticas sem cookies:</strong> usamos Umami e Vercel Web Analytics para contar visitas e
              cliques de forma agregada. Eles não usam cookies e não identificam você.
            </>,
            <>
              <strong>Proteção contra robôs:</strong> a Vercel analisa sinais técnicos do navegador (Vercel BotID)
              para barrar acessos automáticos nos formulários.
            </>,
            <>
              <strong>Endereço IP:</strong> usado só no momento do acesso, para limitar abusos (como muitos envios
              seguidos). Não guardamos o seu IP junto com os seus dados.
            </>,
          ]}
        />
        <p>
          Não usamos cookies de rastreamento nem de publicidade. O único cookie do site é o de acesso à área
          administrativa, usado apenas pelo Vitor.
        </p>
      </>
    ),
  },
  {
    id: "navegador",
    title: "O que fica guardado no seu navegador",
    body: (
      <>
        <p>Algumas informações ficam só no seu aparelho, para o site funcionar melhor:</p>
        <Bullets
          items={[
            "Suas preferências de tema (claro ou escuro), idioma e tamanho da letra.",
            "De onde veio a sua visita, por até 30 dias, para ir junto se você pedir um orçamento depois.",
            "Se você pediu ou dispensou as novidades, para não perguntar de novo.",
            "A conversa do orçamento e o resultado do Raio-X, só enquanto a aba estiver aberta.",
          ]}
        />
        <p>Você pode apagar tudo isso limpando os dados do site nas configurações do seu navegador.</p>
      </>
    ),
  },
  {
    id: "compartilhamento",
    title: "Com quem compartilhamos",
    body: (
      <>
        <p>
          Não vendemos nem alugamos seus dados. Compartilhamos apenas com os serviços que fazem o site funcionar,
          cada um só com o necessário:
        </p>
        <Bullets
          items={[
            <>
              <strong>Vercel</strong> (Estados Unidos): hospedagem do site, estatísticas e proteção contra robôs.
            </>,
            <>
              <strong>DeepSeek</strong> (China): processa o texto da conversa do orçamento com IA. As imagens
              anexadas não são enviadas a ela.
            </>,
            <>
              <strong>Resend</strong> (Estados Unidos): envio dos e-mails e lista de novidades.
            </>,
            <>
              <strong>ImprovMX</strong>: encaminhamento dos e-mails que chegam no domínio vitordsb.com.br.
            </>,
            <>
              <strong>Asaas</strong> (Brasil): pagamentos e cobranças.
            </>,
            <>
              <strong>Google PageSpeed</strong>: recebe só o endereço do site que você pediu para analisar no
              Raio-X, sem dados seus.
            </>,
            <>
              <strong>Umami</strong>: estatísticas agregadas, sem identificar você.
            </>,
          ]}
        />
        <p>Também podemos compartilhar dados quando a lei ou uma autoridade competente exigir.</p>
      </>
    ),
  },
  {
    id: "internacional",
    title: "Dados fora do Brasil",
    body: (
      <p>
        Alguns desses serviços ficam em outros países (Estados Unidos e China). Essa transferência acontece com
        base no seu consentimento, informado nos formulários, e nas garantias de proteção que esses fornecedores
        oferecem, como prevê o art. 33 da LGPD.
      </p>
    ),
  },
  {
    id: "prazos",
    title: "Por quanto tempo guardamos",
    body: (
      <Bullets
        items={[
          "Orçamentos, Raio-X e mensagens de contato: até 2 anos depois do último contato com você.",
          "Lista de novidades: até você pedir para sair.",
          "Pagamentos, contratos e notas fiscais: pelo prazo que a lei exige (em geral, 5 anos).",
          "Depois disso, os dados são apagados ou anonimizados.",
        ]}
      />
    ),
  },
  {
    id: "direitos",
    title: "Seus direitos",
    body: (
      <>
        <p>Pela LGPD (art. 18), você pode pedir a qualquer momento:</p>
        <Bullets
          items={[
            "Confirmação de que tratamos seus dados e uma cópia deles.",
            "Correção de dados errados ou desatualizados.",
            "Apagar ou anonimizar dados desnecessários ou tratados sem base legal.",
            "Levar seus dados para outro fornecedor (portabilidade).",
            "Saber com quem compartilhamos seus dados.",
            "Retirar o consentimento e sair da lista de novidades.",
          ]}
        />
        <p>
          Basta mandar um e-mail para <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>. Respondemos em até 15
          dias. Se não ficar satisfeito, você pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD), em
          gov.br/anpd.
        </p>
      </>
    ),
  },
  {
    id: "seguranca",
    title: "Como protegemos seus dados",
    body: (
      <p>
        O site usa conexão segura (HTTPS), limita quem acessa os dados, confere tudo o que chega pelos
        formulários e bloqueia robôs e envios em excesso. Nenhum sistema é totalmente imune, mas, se acontecer um
        incidente que possa trazer risco a você, avisaremos você e a ANPD, como a lei manda.
      </p>
    ),
  },
  {
    id: "menores",
    title: "Menores de idade",
    body: (
      <p>
        O site é voltado a empresas e adultos. Não coletamos, de propósito, dados de menores de 18 anos. Se
        perceber que isso aconteceu, fale com a gente que apagamos.
      </p>
    ),
  },
  {
    id: "mudancas",
    title: "Mudanças nesta política",
    body: (
      <p>
        Quando o site mudar a forma de tratar dados, esta página será atualizada e a data no topo muda junto. Os{" "}
        <Link href="/termos">Termos de Uso</Link> explicam as regras de uso do site e dos serviços.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      updated={UPDATED}
      summary={[
        "Só coletamos o que você informa: nome, contato e o que conta sobre o seu projeto.",
        "Usamos esses dados para responder, montar o orçamento e falar com você. Nada de venda de dados.",
        "Não usamos cookies de rastreamento nem de publicidade.",
        `Você pode pedir uma cópia, correção ou exclusão dos seus dados pelo e-mail ${BRAND.email}.`,
      ]}
      sections={sections}
      other={{ href: "/termos", label: "Termos de Uso" }}
    />
  );
}
