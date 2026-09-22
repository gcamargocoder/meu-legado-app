import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useFaixaPadrao } from '../hooks/useFaixaPadrao';
import { useFaixasEtarias } from '../hooks/useFaixasEtarias';
import type { FaixaEtaria } from '../types/faixasEtarias';
import type { FaixaEtariaId } from '../types/conteudo';

interface FaixaEtariaContextValue {
  faixaId: FaixaEtariaId | null;
  faixaAtiva: FaixaEtaria | null;
  definirFaixaPadrao: (id: FaixaEtariaId) => void;
}

const FaixaEtariaContext = createContext<FaixaEtariaContextValue | null>(null);

export function FaixaEtariaProvider({ children }: { children: ReactNode }) {
  const { faixaId, definirFaixaPadrao } = useFaixaPadrao();
  const { faixas } = useFaixasEtarias();

  const faixaAtiva = useMemo(() => faixas.find((f) => f.id === faixaId) ?? null, [faixas, faixaId]);

  const value = useMemo<FaixaEtariaContextValue>(
    () => ({ faixaId, faixaAtiva, definirFaixaPadrao }),
    [faixaId, faixaAtiva, definirFaixaPadrao]
  );

  return <FaixaEtariaContext.Provider value={value}>{children}</FaixaEtariaContext.Provider>;
}

export function useFaixaEtariaAtiva(): FaixaEtariaContextValue {
  const contexto = useContext(FaixaEtariaContext);
  if (!contexto) {
    throw new Error('useFaixaEtariaAtiva precisa ser usado dentro de um FaixaEtariaProvider');
  }
  return contexto;
}
