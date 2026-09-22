import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getDeviceId } from '../lib/deviceId';

const STORAGE_KEY = 'meu-legado:mural';
const DIAS_NA_SEMANA = 7;
const SYNC_DEBOUNCE_MS = 800;

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

  // Sincronização com Supabase: localStorage continua sendo a fonte de
  // verdade imediata (offline-first); a nuvem é só um espelho em segundo
  // plano, sem bloquear a UI e tolerando falhas silenciosamente.
  //
  // getDeviceId() NÃO é uma identidade autenticada — é só um UUID gerado
  // no próprio dispositivo, então nada aqui garante que dois dispositivos
  // não colidam ou que um cliente mal-intencionado não envie o user_id de
  // outra pessoa. Quem impede isso hoje é o RLS "deny all" da migração
  // (supabase/migrations/20260921_init_schema.sql): sem policy, toda
  // chamada abaixo falha e cai no catch/erro silencioso, então na prática
  // a sincronização só passa a funcionar de verdade depois que houver
  // Supabase Auth real e políticas baseadas em auth.uid().
  useEffect(() => {
    if (!supabase) return;
    let cancelado = false;

    async function hidratarDaNuvem() {
      const { data, error } = await supabase!
        .from('mural_semanal')
        .select('condutas_completadas, condutas_personalizadas')
        .eq('user_id', getDeviceId())
        .eq('semana_iso', semanaSelecionadaId)
        .maybeSingle();

      if (cancelado || error || !data) return;

      setStorage((atual) => {
        const jaTemDadosLocaisDaSemana = Boolean(atual.marcasPorSemana[semanaSelecionadaId]);
        const marcasPorSemana = jaTemDadosLocaisDaSemana
          ? atual.marcasPorSemana
          : {
              ...atual.marcasPorSemana,
              [semanaSelecionadaId]: (data.condutas_completadas ?? {}) as Record<
                string,
                boolean[]
              >,
            };

        const idsLocais = new Set(atual.condutasPersonalizadas.map((c) => c.id));
        const personalizadasRemotas = (data.condutas_personalizadas ??
          []) as CondutaPersonalizada[];
        const condutasPersonalizadas = [
          ...atual.condutasPersonalizadas,
          ...personalizadasRemotas.filter((c) => !idsLocais.has(c.id)),
        ];

        return { marcasPorSemana, condutasPersonalizadas };
      });
    }

    hidratarDaNuvem();
    return () => {
      cancelado = true;
    };
  }, [semanaSelecionadaId]);

  useEffect(() => {
    if (!supabase) return;
    const marcasDaSemana = storage.marcasPorSemana[semanaSelecionadaId] ?? {};

    const handle = setTimeout(() => {
      supabase!
        .from('mural_semanal')
        .upsert(
          {
            user_id: getDeviceId(),
            semana_iso: semanaSelecionadaId,
            condutas_completadas: marcasDaSemana,
            condutas_personalizadas: storage.condutasPersonalizadas,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,semana_iso' }
        )
        .then(({ error }) => {
          if (error) console.warn('Falha ao sincronizar mural com Supabase:', error.message);
        });
    }, SYNC_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [storage, semanaSelecionadaId]);

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
