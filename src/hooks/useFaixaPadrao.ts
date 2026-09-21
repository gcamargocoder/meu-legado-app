import { useCallback, useState } from 'react';

const STORAGE_KEY = 'meu-legado:faixa-etaria-padrao';

function lerFaixaSalva(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function useFaixaPadrao() {
  const [faixaId, setFaixaId] = useState<string | null>(lerFaixaSalva);

  const definirFaixaPadrao = useCallback((id: string) => {
    setFaixaId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // localStorage indisponível (ex.: modo privado) — segue apenas em memória
    }
  }, []);

  return { faixaId, definirFaixaPadrao };
}
