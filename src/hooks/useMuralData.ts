import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'meu-legado:mural';
const DIAS_NA_SEMANA = 7;

export interface CondutaPersonalizada {
  id: string;
  titulo: string;
  descricao: string;
}

interface MuralStorage {
  condutasPersonalizadas: CondutaPersonalizada[];
  marcasPorSemana: Record<string, Record<string, boolean[]>>;
}

function estadoVazio(): MuralStorage {
  return { condutasPersonalizadas: [], marcasPorSemana: {} };
}

function carregarStorage(): MuralStorage {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return estadoVazio();
    const salvo = JSON.parse(bruto) as Partial<MuralStorage>;
    return {
      condutasPersonalizadas: salvo.condutasPersonalizadas ?? [],
      marcasPorSemana: salvo.marcasPorSemana ?? {},
    };
  } catch {
    return estadoVazio();
  }
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function getSegundaFeira(data: Date): Date {
  const d = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()));
  const diaSemana = (d.getUTCDay() + 6) % 7; // 0 = segunda
  d.setUTCDate(d.getUTCDate() - diaSemana);
  return d;
}

function getSemanaId(data: Date): string {
  const segunda = getSegundaFeira(data);
  const quinta = new Date(segunda);
  quinta.setUTCDate(segunda.getUTCDate() + 3);
  const primeiraQuintaDoAno = (() => {
    const jan4 = new Date(Date.UTC(quinta.getUTCFullYear(), 0, 4));
    return getSegundaFeira(jan4);
  })();
  const semanaNum =
    1 + Math.round((getSegundaFeira(quinta).getTime() - primeiraQuintaDoAno.getTime()) / (7 * 86400000));
  return `${quinta.getUTCFullYear()}-W${pad2(semanaNum)}`;
}

function getSegundaFeiraDaSemanaId(semanaId: string): Date {
  const [anoStr, semanaStr] = semanaId.split('-W');
  const ano = Number(anoStr);
  const semana = Number(semanaStr);
  const jan4 = new Date(Date.UTC(ano, 0, 4));
  const segundaSemana1 = getSegundaFeira(jan4);
  const segunda = new Date(segundaSemana1);
  segunda.setUTCDate(segundaSemana1.getUTCDate() + (semana - 1) * 7);
  return segunda;
}

function getDiasDaSemana(semanaId: string): Date[] {
  const segunda = getSegundaFeiraDaSemanaId(semanaId);
  return Array.from({ length: DIAS_NA_SEMANA }, (_, i) => {
    const dia = new Date(segunda);
    dia.setUTCDate(segunda.getUTCDate() + i);
    return dia;
  });
}

function deslocarSemana(semanaId: string, deltaSemanas: number): string {
  const segunda = getSegundaFeiraDaSemanaId(semanaId);
  segunda.setUTCDate(segunda.getUTCDate() + deltaSemanas * 7);
  return getSemanaId(segunda);
}

export function useMuralData() {
  const semanaAtualId = useMemo(() => getSemanaId(new Date()), []);
  const [semanaSelecionadaId, setSemanaSelecionadaId] = useState(semanaAtualId);
  const [storage, setStorage] = useState<MuralStorage>(carregarStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  }, [storage]);

  const diasDaSemana = useMemo(() => getDiasDaSemana(semanaSelecionadaId), [semanaSelecionadaId]);

  const marcasPorConduta = storage.marcasPorSemana[semanaSelecionadaId] ?? {};

  const marcarEstrela = useCallback(
    (condutaId: string, diaIndex: number) => {
      setStorage((atual) => {
        const marcasDaSemana = atual.marcasPorSemana[semanaSelecionadaId] ?? {};
        const marcasAtuais = marcasDaSemana[condutaId] ?? new Array(DIAS_NA_SEMANA).fill(false);
        const novasMarcas = [...marcasAtuais];
        novasMarcas[diaIndex] = !novasMarcas[diaIndex];
        return {
          ...atual,
          marcasPorSemana: {
            ...atual.marcasPorSemana,
            [semanaSelecionadaId]: { ...marcasDaSemana, [condutaId]: novasMarcas },
          },
        };
      });
    },
    [semanaSelecionadaId]
  );

  const calcularTotalSemana = useCallback(() => {
    return Object.values(marcasPorConduta).reduce(
      (total, marcas) => total + marcas.filter(Boolean).length,
      0
    );
  }, [marcasPorConduta]);

  const irParaSemanaAnterior = useCallback(() => {
    setSemanaSelecionadaId((atual) => deslocarSemana(atual, -1));
  }, []);

  const irParaProximaSemana = useCallback(() => {
    setSemanaSelecionadaId((atual) => deslocarSemana(atual, 1));
  }, []);

  const voltarParaSemanaAtual = useCallback(() => {
    setSemanaSelecionadaId(semanaAtualId);
  }, [semanaAtualId]);

  const adicionarCondutaPersonalizada = useCallback((titulo: string, descricao: string) => {
    const id = `personalizada-${Date.now()}`;
    setStorage((atual) => ({
      ...atual,
      condutasPersonalizadas: [...atual.condutasPersonalizadas, { id, titulo, descricao }],
    }));
  }, []);

  const removerCondutaPersonalizada = useCallback((condutaId: string) => {
    setStorage((atual) => ({
      ...atual,
      condutasPersonalizadas: atual.condutasPersonalizadas.filter((c) => c.id !== condutaId),
    }));
  }, []);

  return {
    semanaSelecionadaId,
    estaNaSemanaAtual: semanaSelecionadaId === semanaAtualId,
    diasDaSemana,
    marcasPorConduta,
    marcarEstrela,
    calcularTotalSemana,
    irParaSemanaAnterior,
    irParaProximaSemana,
    voltarParaSemanaAtual,
    condutasPersonalizadas: storage.condutasPersonalizadas,
    adicionarCondutaPersonalizada,
    removerCondutaPersonalizada,
  };
}
