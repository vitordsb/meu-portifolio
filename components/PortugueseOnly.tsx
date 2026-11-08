/**
 * Marca a página como só em português (serviços, quanto custa, termos,
 * privacidade). Em aparelho de outro idioma, o langScript do layout esconde
 * a página até o LanguageProvider trocar o texto; aqui não há o que trocar,
 * então o script mostra a página na hora, antes da primeira pintura.
 *
 * Sem isso a página ficava em branco até o JavaScript carregar, e o PageSpeed
 * (que testa com o navegador em inglês) dava "a página não pintou nada"
 * (08/nov/2026). Vai logo no começo da página, antes do conteúdo.
 */
export default function PortugueseOnly() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: "document.documentElement.removeAttribute('data-lang-pending')",
      }}
    />
  );
}
