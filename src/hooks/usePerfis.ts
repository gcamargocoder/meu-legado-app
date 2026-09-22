import { useCallback, useEffect, useMemo, useState } from 'react';

export interface PerfilCrianca {
  id: string;
  nome: string;
  dataNascimento: string;
  avatar: string;
}

const PERFIS_KEY = 'meu-legado:perfis';
const PERFIL_ATIVO_KEY = 'meu-legado:perfil-ativo';

function carregarPerfis(): PerfilCrianca[] {
  try {
    const bruto = localStorage.getItem(PERFIS_KEY);
    return bruto ? (JSON.parse(bruto) as PerfilCrianca[]) : [];
  } catch {
    return [];
  }
}

function carregarPerfilAtivoId(): string | null {
  try {
    return localStorage.getItem(PERFIL_ATIVO_KEY);
  } catch {
    return null;
  }
}

export function usePerfis() {
  const [perfis, setPerfis] = useState<PerfilCrianca[]>(carregarPerfis);
  const [perfilAtivoId, setPerfilAtivoId] = useState<string | null>(carregarPerfilAtivoId);

  useEffect(() => {
    try {
      localStorage.setItem(PERFIS_KEY, JSON.stringify(perfis));
    } catch {
      // localStorage indisponível (ex.: modo privado) — segue apenas em memória
    }
  }, [perfis]);

  useEffect(() => {
    try {
      if (perfilAtivoId) localStorage.setItem(PERFIL_ATIVO_KEY, perfilAtivoId);
      else localStorage.removeItem(PERFIL_ATIVO_KEY);
    } catch {
      // localStorage indisponível — segue apenas em memória
    }
  }, [perfilAtivoId]);

  const adicionarPerfil = useCallback((nome: string, dataNascimento: string, avatar: string) => {
    const id = `crianca-${Date.now()}`;
    setPerfis((atual) => [...atual, { id, nome, dataNascimento, avatar }]);
    setPerfilAtivoId((atual) => atual ?? id);
    return id;
  }, []);

  const removerPerfil = useCallback((id: string) => {
    setPerfis((atual) => atual.filter((p) => p.id !== id));
    setPerfilAtivoId((atual) => (atual === id ? null : atual));
  }, []);

  const definirPerfilAtivo = useCallback((id: string) => {
    setPerfilAtivoId(id);
  }, []);

  const perfilAtivo = useMemo(
    () => perfis.find((p) => p.id === perfilAtivoId) ?? null,
    [perfis, perfilAtivoId]
  );

  return { perfis, perfilAtivo, perfilAtivoId, adicionarPerfil, removerPerfil, definirPerfilAtivo };
}
