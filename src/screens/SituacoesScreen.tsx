import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  ChevronDown,
  Brain,
  ListChecks,
  XCircle,
  Quote,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { useConteudo } from '../hooks/useConteudo';
import { useFaixaEtariaAtiva } from '../context/FaixaEtariaContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageHero } from '../components/ui/PageHero';
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
      <PageHero
        icon={MessageCircle}
        eyebrow="Situações"
        title="Guia do dia a dia"
        description="Busque uma situação para ver o que está acontecendo, o passo a passo, o que evitar e a frase para usar."
      />

      {faixaAtiva && (
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-accent/10 px-3 py-2 text-xs text-primary">
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

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40" />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por palavra-chave..."
          className="w-full rounded-2xl border border-primary/20 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-primary placeholder:text-primary/40 backdrop-blur-md transition-all duration-200 focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoriaAtiva(null)}
          className={`rounded-2xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.97] ${
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
            className={`rounded-2xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.97] ${
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
          <p className="rounded-2xl border border-dashed border-primary/20 p-4 text-sm text-primary/60">
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
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors active:bg-primary/5"
      >
        <div className="flex flex-col gap-1.5">
          <Badge tom="accent" className="w-fit">
            {situacao.categoria}
          </Badge>
          <h2 className="text-base font-semibold text-primary">{situacao.titulo}</h2>
        </div>
        <motion.span
          animate={{ rotate: expandida ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-primary/50"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expandida && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 border-t border-primary/10 px-4 py-4 dark:border-white/10">
              <div>
                <div className="flex items-center gap-1.5 text-primary">
                  <Brain className="h-3.5 w-3.5" />
                  <h3 className="text-xs font-semibold uppercase tracking-wide">
                    O que está acontecendo
                  </h3>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-primary/80">
                  {situacao.oQueEstaAcontecendo}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-primary">
                    <ListChecks className="h-3.5 w-3.5" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide">
                      Passo a passo imediato
                    </h3>
                  </div>
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

              <div className="rounded-2xl border border-alert/30 bg-alert/10 p-3">
                <div className="flex items-center gap-1.5 text-alert">
                  <XCircle className="h-3.5 w-3.5" />
                  <h3 className="text-xs font-semibold uppercase tracking-wide">O que NÃO fazer</h3>
                </div>
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

              <div className="rounded-2xl border border-accent/30 bg-accent/10 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-accent">
                    <Quote className="h-3.5 w-3.5" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide">Frase pronta</h3>
                  </div>
                  <SpeakerButton texto={situacao.frasePronta} label="Ouvir frase pronta" />
                </div>
                <p className="mt-1 text-sm italic leading-relaxed text-primary/90">
                  "{situacao.frasePronta}"
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <h3 className="text-xs font-semibold uppercase tracking-wide">
                    Prevenção a longo prazo
                  </h3>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-primary/80">
                  {situacao.prevencaoLongoPrazo}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
