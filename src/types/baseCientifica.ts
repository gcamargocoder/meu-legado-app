export interface Especialista {
  id: string;
  nome: string;
  metodologia: string;
  descricao: string;
}

export interface BaseCientificaData {
  especialistas: Especialista[];
}
