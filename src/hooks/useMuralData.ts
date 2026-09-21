import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'meu-legado:mural';
const DIAS_NA_SEMANA = 7;

interface MuralState {
  semanaAtual: string;
  marcasPorConduta: Record<string, boolean[]>;
}

function getSemanaAtualId(): string {
  const hoje = new Date();
  const inicioAno = new Date(hoje.getFullYear(), 0, 1);
  const dias = Math.floor((hoje.getTime() - inicioAno.getTime()) / 86400000);
  const semana = Math.ceil((dias + inicioAno.getDay() + 1) / 7);
  return `${hoje.getFullYear()}-W${semana}`;
}

function carregarEstado(): MuralState {
  const semanaAtual = getSemanaAtualId();
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return { semanaAtual, marcasPorConduta: {} };
    const salvo = JSON.parse(bruto) as MuralState;
    if (salvo.semanaAtual !== semanaAtual) return { semanaAtual, marcasPorConduta: {} };
    return salvo;
  } catch {
    return { semanaAtual, marcasPorConduta: {} };
  }
}

export function useMuralData() {
  const [estado, setEstado] = useState<MuralState>(carregarEstado);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  }, [estado]);

  const marcarEstrela = useCallback((condutaId: string, diaIndex: number) => {
    setEstado((atual) => {
      const marcasAtuais = atual.marcasPorConduta[condutaId] ?? new Array(DIAS_NA_SEMANA).fill(false);
      const novasMarcas = [...marcasAtuais];
      novasMarcas[diaIndex] = !novasMarcas[diaIndex];
      return {
        ...atual,
        marcasPorConduta: { ...atual.marcasPorConduta, [condutaId]: novasMarcas },
      };
    });
  }, []);

  const calcularTotalSemana = useCallback(() => {
    return Object.values(estado.marcasPorConduta).reduce(
      (total, marcas) => total + marcas.filter(Boolean).length,
      0
    );
  }, [estado.marcasPorConduta]);

  return {
    semanaAtual: estado.semanaAtual,
    marcasPorConduta: estado.marcasPorConduta,
    marcarEstrela,
    calcularTotalSemana,
  };
}
