import { useMemo, useState } from 'react';
import { useConteudo } from '../hooks/useConteudo';
import type { Situacao } from '../types/conteudo';

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function SituacoesScreen() {
  const { situacoes } = useConteudo();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [expandidaId, setExpandidaId] = useState<string | null>(null);

  const categorias = useMemo(
    () => Array.from(new Set(situacoes.map((s) => s.categoria))),
    [situacoes]
  );

  const situacoesFiltradas = useMemo(() => {
    const buscaNormalizada = normalizar(busca.trim());
    return situacoes.filter((situacao) => {
      const bateCategoria = !categoriaAtiva || situacao.categoria === categoriaAtiva;
      if (!bateCategoria) return false;
      if (!buscaNormalizada) return true;
      const alvo = normalizar(`${situacao.titulo} ${situacao.categoria}`);
      return alvo.includes(buscaNormalizada);
    });
  }, [situacoes, busca, categoriaAtiva]);

  return (
    <div className="flex flex-col gap-5 pt-2">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">Situações</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary">Guia do dia a dia</h1>
        <p className="mt-2 text-sm text-primary/70">
          Busque uma situação para ver o porquê, os passos práticos e a frase para usar.
        </p>
      </header>

      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por palavra-chave..."
        className="rounded-card border border-primary/20 bg-white/60 px-4 py-2.5 text-sm text-primary placeholder:text-primary/40 focus:border-primary focus:outline-none dark:bg-white/5"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoriaAtiva(null)}
          className={`rounded-card border px-3 py-1.5 text-xs font-medium transition-colors ${
            categoriaAtiva === null
              ? 'border-primary bg-primary text-app'
              : 'border-primary/20 bg-white/60 text-primary dark:bg-white/5'
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
                : 'border-primary/20 bg-white/60 text-primary dark:bg-white/5'
            }`}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {situacoesFiltradas.length === 0 && (
          <p className="rounded-card border border-dashed border-primary/20 p-4 text-sm text-primary/60">
            Nenhuma situação encontrada para essa busca.
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
    <div className="overflow-hidden rounded-card border border-primary/10 bg-white/60 shadow-sm dark:bg-white/5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expandida}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            {situacao.categoria}
          </p>
          <h2 className="text-base font-semibold text-primary">{situacao.titulo}</h2>
        </div>
        <span
          aria-hidden="true"
          className={`text-primary/60 transition-transform ${expandida ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {expandida && (
        <div className="flex flex-col gap-3 border-t border-primary/10 px-4 py-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
              Por que isso acontece
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-primary/80">{situacao.porque}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
              Passos práticos
            </h3>
            <ul className="mt-1 flex flex-col gap-1">
              {situacao.passosPraticos.map((passo, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-primary/80">
                  <span className="font-semibold text-accent">{i + 1}.</span>
                  <span>{passo}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card border border-accent/30 bg-accent/10 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-accent">
              Frase para usar
            </h3>
            <p className="mt-1 text-sm italic leading-relaxed text-primary/90">
              "{situacao.frasePraUsar}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
