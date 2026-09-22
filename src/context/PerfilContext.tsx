import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { usePerfis, type PerfilCrianca } from '../hooks/usePerfis';
import { useFaixaEtariaAtiva } from './FaixaEtariaContext';
import { useFaixasEtarias } from '../hooks/useFaixasEtarias';
import { calcularFaixaPorIdade } from '../lib/idade';

interface PerfilContextValue {
  perfis: PerfilCrianca[];
  perfilAtivo: PerfilCrianca | null;
  perfilAtivoId: string | null;
  adicionarPerfil: (nome: string, dataNascimento: string, avatar: string) => string;
  removerPerfil: (id: string) => void;
  definirPerfilAtivo: (id: string) => void;
}

const PerfilContext = createContext<PerfilContextValue | null>(null);

export function PerfilProvider({ children }: { children: ReactNode }) {
  const perfisState = usePerfis();
  const { definirFaixaPadrao } = useFaixaEtariaAtiva();
  const { faixas } = useFaixasEtarias();

  // Trocar de perfil ativo recalcula e aplica a faixa etária automaticamente
  // a partir da data de nascimento — é o que faz Situações/Frases/Prêmios
  // se adaptarem sozinhos ao trocar de criança.
  useEffect(() => {
    if (!perfisState.perfilAtivo) return;
    const faixaCalculada = calcularFaixaPorIdade(perfisState.perfilAtivo.dataNascimento, faixas);
    if (faixaCalculada) definirFaixaPadrao(faixaCalculada);
    // Disparado só quando o perfil ativo muda, não a cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfisState.perfilAtivoId]);

  const value = useMemo<PerfilContextValue>(() => perfisState, [perfisState]);

  return <PerfilContext.Provider value={value}>{children}</PerfilContext.Provider>;
}

export function usePerfilAtivo(): PerfilContextValue {
  const contexto = useContext(PerfilContext);
  if (!contexto) {
    throw new Error('usePerfilAtivo precisa ser usado dentro de um PerfilProvider');
  }
  return contexto;
}
