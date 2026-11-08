/**
 * O site já hidratou nesta aba? Falso no servidor e durante a primeira
 * hidratação; vira verdadeiro no primeiro efeito do Providers (raiz).
 *
 * Serve pra animação de entrada só rodar em navegação dentro do site. Na
 * primeira carga, `initial` com opacidade 0 vai pro HTML e deixa a página
 * invisível até o JavaScript carregar: no celular lento eram segundos em
 * branco, e o PageSpeed dava "a página não pintou nada" (08/nov/2026).
 */
let booted = false;

export function hasBooted() {
  return booted;
}

export function markBooted() {
  booted = true;
}
