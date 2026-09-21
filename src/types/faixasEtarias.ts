export interface FaixaEtaria {
  id: string;
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
