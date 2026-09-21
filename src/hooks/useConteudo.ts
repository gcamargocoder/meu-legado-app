import conteudoJson from '../data/raizes-conteudo.json';
import type { ConteudoData } from '../types/conteudo';

const conteudo = conteudoJson as ConteudoData;

export function useConteudo(): ConteudoData {
  return conteudo;
}
