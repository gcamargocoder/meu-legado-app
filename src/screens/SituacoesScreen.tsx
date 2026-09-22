import { useMemo, useState } from 'react';
import { useConteudo } from '../hooks/useConteudo';
import { useFaixaEtariaAtiva } from '../context/FaixaEtariaContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SpeakerButton } from '../components/ui/SpeakerButton';
import type { Situacao } from '../types/conteudo';

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function SituacoesScreen() {
  const { situacoes } = useConteudo();
  const { faixaId, faixaAtiva } = useFaixaEtariaAtiva();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [expandidaId, setExpandidaId] = useState<string | null>(null);
  const [ignorarFiltroDeFaixa, setIgnorarFiltroDeFaixa] = useState(false);

  const situacoesDaFaixa = useMemo(() => {
    if (!faixaId || ignorarFiltroDeFaixa) return situacoes;
    return situacoes.filter((s) => s.faixasEtarias.includes(faixaId));
  }, [situacoes, faixaId, ignorarFiltroDeFaixa]);

  const categorias = useMemo(
    () => Array.from(new Set(situacoesDaFaixa.map((s) => s.categoria))),
    [situacoesDaFaixa]
  );

  const situacoesFiltradas = useMemo(() => {
    const buscaNormalizada = normalizar(busca.trim());
    return situacoesDaFaixa.filter((situacao) => {
      const bateCategoria = !categoriaAtiva || situacao.categoria === categoriaAtiva;
      if (!bateCategoria) return false;
      if (!buscaNormalizada) return true;
      const alvo = normalizar(`${situacao.titulo} ${situacao.categoria}`);
      return alvo.includes(buscaNormalizada);
    });
  }, [situacoesDaFaixa, busca, categoriaAtiva]);

  return (
    <div className="flex flex-col gap-5 pt-2">
      <header>
        <Badge tom="accent">Situações</Badge>
        <h1 className="mt-2 text-3xl font-semibold text-primary">Guia do dia a dia</h1>
        <p className="mt-2 text-sm text-primary/70">
          Busque uma situação para ver o que está acontecendo, o passo a passo, o que evitar e a
          frase para usar.
        </p>
      </header>

      {faixaAtiva && (
        <div className="flex items-center justify-between gap-2 rounded-card bg-accent/10 px-3 py-2 text-xs text-primary">
          <span>
            Mostrando situações para <strong>{faixaAtiva.faixa} anos</strong>
          </span>
          <button
            type="button"
            onClick={() => setIgnorarFiltroDeFaixa((atual) => !atual)}
            className="font-semibold text-accent underline"
          >
            {ignorarFiltroDeFaixa ? 'Filtrar pela faixa' : 'Ver todas as idades'}
          </button>
        </div>
      )}

      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por palavra-chave..."
        className="rounded-card border border-primary/20 bg-white/60 px-4 py-2.5 text-sm text-primary placeholder:text-primary/40 focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoriaAtiva(null)}
          className={`rounded-card border px-3 py-1.5 text-xs font-medium transition-colors ${
            categoriaAtiva === null
              ? 'border-primary bg-primary text-app'
              : 'border-primary/20 bg-white/60 text-primary dark:border-white/10 dark:bg-white/5'
          }`}
        >
          Todas
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            onClick={() => setCategoriaAtiva(categoria)}
            className={`rounded-card border px-3 py-1.5 text-xs font-medium transition-colors ${
              categoriaAtiva === categoria
                ? 'border-primary bg-primary text-app'
                : 'border-primary/20 bg-white/60 text-primary dark:border-white/10 dark:bg-white/5'
            }`}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {situacoesFiltradas.length === 0 && (
          <p className="rounded-card border border-dashed border-primary/20 p-4 text-sm text-primary/60">
            Nenhuma situação encontrada. Tente outra busca ou veja todas as idades.
          </p>
        )}
        {situacoesFiltradas.map((situacao) => (
          <SituacaoCard
            key={situacao.id}
            situacao={situacao}
            expandida={expandidaId === situacao.id}
            onToggle={() =>
              setExpandidaId((atual) => (atual === situacao.id ? null : situacao.id))
            }
          />
        ))}
      </div>
    </div>
  );
}

function SituacaoCard({
  situacao,
  expandida,
  onToggle,
}: {
  situacao: Situacao;
  expandida: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="overflow-hidden !p-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expandida}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex flex-col gap-1.5">
          <Badge tom="accent" className="w-fit">
            {situacao.categoria}
          </Badge>
          <h2 className="text-base font-semibold text-primary">{situacao.titulo}</h2>
        </div>
        <span
          aria-hidden="true"
          className={`shrink-0 text-primary/60 transition-transform ${expandida ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {expandida && (
        <div className="flex flex-col gap-4 border-t border-primary/10 px-4 py-4 dark:border-white/10">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
              O que está acontecendo
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-primary/80">
              {situacao.oQueEstaAcontecendo}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
                Passo a passo imediato
              </h3>
              <SpeakerButton
                texto={situacao.passoAPasso.join('. ')}
                label="Ouvir passo a passo"
              />
            </div>
            <ol className="mt-1 flex flex-col gap-1.5">
              {situacao.passoAPasso.map((passo, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-primary/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span>{passo}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-card border border-alert/30 bg-alert/10 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-alert">
              O que NÃO fazer
            </h3>
            <ul className="mt-1.5 flex flex-col gap-1">
              {situacao.oQueNaoFazer.map((erro, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-primary/80">
                  <span aria-hidden="true" className="text-alert">
                    ✕
                  </span>
                  <span>{erro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-accent/30 bg-accent/10 p-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-accent">
                Frase pronta
              </h3>
              <SpeakerButton texto={situacao.frasePronta} label="Ouvir frase pronta" />
            </div>
            <p className="mt-1 text-sm italic leading-relaxed text-primary/90">
              "{situacao.frasePronta}"
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
              Prevenção a longo prazo
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-primary/80">
              {situacao.prevencaoLongoPrazo}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
