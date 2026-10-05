/**
 * Script do <head> que aplica o tamanho de letra salvo antes da primeira
 * pintura (sem pulo de layout). Arquivo separado de lib/font-scale (que é de
 * cliente) porque o layout roda no servidor e precisa do texto do script.
 */
export const FONT_SCALE_KEY = "font-scale";

export const fontScript = `(function(){try{var v=parseFloat(localStorage.getItem('${FONT_SCALE_KEY}'));if(v===1.125||v===1.25)document.documentElement.style.setProperty('--font-scale',String(v));}catch(e){}})();`;
