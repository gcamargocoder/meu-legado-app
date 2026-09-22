import type { FaixaEtariaId } from './conteudo';

export interface FaixaEtaria {
  id: FaixaEtariaId;
  faixa: string;
  titulo: string;
  idadeMin: number;
  idadeMax: number;
  fasesDesenvolvimento: string[];
  abordagemPais: string[];
  desafiosComuns: string[];
  frasesGuia: string[];
}

export interface FaixasEtariasData {
  faixas: FaixaEtaria[];
}
