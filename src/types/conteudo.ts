export type FaixaEtariaId = '2-5' | '6-9' | '10-12' | '13-15' | '16-18';

export interface Conduta {
  id: string;
  titulo: string;
  descricao: string;
}

export interface CategoriaCondutas {
  id: string;
  nome: string;
  condutas: Conduta[];
}

export interface Situacao {
  id: string;
  titulo: string;
  categoria: string;
  faixasEtarias: FaixaEtariaId[];
  oQueEstaAcontecendo: string;
  passoAPasso: string[];
  oQueNaoFazer: string[];
  frasePronta: string;
  prevencaoLongoPrazo: string;
}

export interface Frase {
  texto: string;
  faixasEtarias: FaixaEtariaId[];
}

export interface FraseCategoria {
  id: string;
  nome: string;
  frases: Frase[];
}

export interface Premio {
  id: string;
  titulo: string;
  descricao: string;
  estrelas: number;
  faixasEtarias: FaixaEtariaId[];
}

export interface FaixaCusto {
  id: string;
  nome: string;
  premios: Premio[];
}

export interface ConteudoData {
  categoriasCondutas: CategoriaCondutas[];
  situacoes: Situacao[];
  frasesCategorias: FraseCategoria[];
  faixasCusto: FaixaCusto[];
}
