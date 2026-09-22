import { useMemo, useState } from 'react';
import { useConteudo } from '../hooks/useConteudo';
import { useFaixaEtariaAtiva } from '../context/FaixaEtariaContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function FrasesScreen() {
  const { frasesCategorias } = useConteudo();
  const { faixaId, faixaAtiva } = useFaixaEtariaAtiva();
  const [fraseCopiadaId, setFraseCopiadaId] = useState<string | null>(null);
  const [ignorarFiltroDeFaixa, setIgnorarFiltroDeFaixa] = useState(false);

  const categoriasFiltradas = useMemo(() => {
    const filtrarPorFaixa = faixaId && !ignorarFiltroDeFaixa;
    return frasesCategorias
      .map((categoria) => ({
        ...categoria,
        frases: filtrarPorFaixa
          ? categoria.frases.filter((f) => f.faixasEtarias.includes(faixaId))
          : categoria.frases,
      }))
      .filter((categoria) => categoria.frases.length > 0);
  }, [frasesCategorias, faixaId, ignorarFiltroDeFaixa]);

  async function copiarFrase(id: string, frase: string) {
    try {
      await navigator.clipboard.writeText(frase);
      setFraseCopiadaId(id);
      setTimeout(() => setFraseCopiadaId((atual) => (atual === id ? null : atual)), 1500);
    } catch {
      // clipboard indisponível (ex.: contexto não seguro) — falha silenciosamente
    }
  }

  return (
    <div className="flex flex-col gap-5 pt-2">
      <header>
        <Badge tom="accent">Frases & Diálogo</Badge>
        <h1 className="mt-2 text-3xl font-semibold text-primary">Comunicação não violenta</h1>
        <p className="mt-2 text-sm text-primary/70">
          Frases prontas para os momentos mais comuns do dia a dia. Toque para copiar.
        </p>
      </header>

      {faixaAtiva && (
        <div className="flex items-center justify-between gap-2 rounded-card bg-accent/10 px-3 py-2 text-xs text-primary">
          <span>
            Mostrando frases para <strong>{faixaAtiva.faixa} anos</strong>
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

      <div className="flex flex-col gap-5">
        {categoriasFiltradas.map((categoria) => (
          <section key={categoria.id} className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary/70">
              {categoria.nome}
            </h2>
            <div className="flex flex-col gap-2">
              {categoria.frases.map((frase, i) => {
                const id = `${categoria.id}-${i}`;
                const copiada = fraseCopiadaId === id;
                return (
                  <Card key={id} className="flex items-center justify-between gap-3">
                    <p className="text-sm leading-relaxed text-primary/90">"{frase.texto}"</p>
                    <button
                      type="button"
                      onClick={() => copiarFrase(id, frase.texto)}
                      className={`shrink-0 rounded-card px-3 py-1.5 text-xs font-medium transition-colors ${
                        copiada ? 'bg-accent text-app' : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {copiada ? 'Copiado!' : 'Copiar'}
                    </button>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
