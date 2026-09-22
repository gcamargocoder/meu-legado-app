import { useCallback, useState } from 'react';
import type { FaixaEtariaId } from '../types/conteudo';

const STORAGE_KEY = 'meu-legado:faixa-etaria-padrao';

function lerFaixaSalva(): FaixaEtariaId | null {
  try {
    return localStorage.getItem(STORAGE_KEY) as FaixaEtariaId | null;
  } catch {
    return null;
  }
}

export function useFaixaPadrao() {
  const [faixaId, setFaixaId] = useState<FaixaEtariaId | null>(lerFaixaSalva);

  const definirFaixaPadrao = useCallback((id: FaixaEtariaId) => {
    setFaixaId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // localStorage indisponível (ex.: modo privado) — segue apenas em memória
    }
  }, []);

  return { faixaId, definirFaixaPadrao };
}
