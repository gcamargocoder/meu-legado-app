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
  porque: string;
  passosPraticos: string[];
  frasePraUsar: string;
}

export interface FraseCategoria {
  id: string;
  nome: string;
  frases: string[];
}

export interface Premio {
  id: string;
  titulo: string;
  descricao: string;
  estrelas: number;
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
