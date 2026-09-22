import { useMemo, useState } from 'react';
import { Trophy, Star } from 'lucide-react';
import { useConteudo } from '../hooks/useConteudo';
import { useFaixaEtariaAtiva } from '../context/FaixaEtariaContext';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';

export function PremiosScreen() {
  const { faixasCusto } = useConteudo();
  const { faixaId, faixaAtiva } = useFaixaEtariaAtiva();
  const [faixaCustoAtiva, setFaixaCustoAtiva] = useState<string | null>(null);
  const [ignorarFiltroDeFaixa, setIgnorarFiltroDeFaixa] = useState(false);

  const faixasVisiveis = useMemo(() => {
    const filtrarPorIdade = faixaId && !ignorarFiltroDeFaixa;
    return faixasCusto
      .filter((f) => !faixaCustoAtiva || f.id === faixaCustoAtiva)
      .map((f) => ({
        ...f,
        premios: filtrarPorIdade
          ? f.premios.filter((p) => p.faixasEtarias.includes(faixaId))
          : f.premios,
      }))
      .filter((f) => f.premios.length > 0);
  }, [faixasCusto, faixaCustoAtiva, faixaId, ignorarFiltroDeFaixa]);

  return (
    <div className="flex flex-col gap-5 pt-2">
      <PageHero
        icon={Trophy}
        eyebrow="Prêmios"
        title="Ideias de recompensa"
        description="Filtre por custo e veja quantas estrelas cada recompensa exige."
      />

      {faixaAtiva && (
        <div className="flex items-center justify-between gap-2 rounded-card bg-accent/10 px-3 py-2 text-xs text-primary">
          <span>
            Mostrando prêmios para <strong>{faixaAtiva.faixa} anos</strong>
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

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFaixaCustoAtiva(null)}
          className={`rounded-card border px-3 py-1.5 text-xs font-medium transition-colors ${
            faixaCustoAtiva === null
              ? 'border-primary bg-primary text-app'
              : 'border-primary/20 bg-white/60 text-primary dark:border-white/10 dark:bg-white/5'
          }`}
        >
          Todas
        </button>
        {faixasCusto.map((faixa) => (
          <button
            key={faixa.id}
            type="button"
            onClick={() => setFaixaCustoAtiva(faixa.id)}
            className={`rounded-card border px-3 py-1.5 text-xs font-medium transition-colors ${
              faixaCustoAtiva === faixa.id
                ? 'border-primary bg-primary text-app'
                : 'border-primary/20 bg-white/60 text-primary dark:border-white/10 dark:bg-white/5'
            }`}
          >
            {faixa.nome}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {faixasVisiveis.length === 0 && (
          <p className="rounded-card border border-dashed border-primary/20 p-4 text-sm text-primary/60">
            Nenhum prêmio encontrado para esse filtro. Tente ver todas as idades.
          </p>
        )}
        {faixasVisiveis.map((faixa) => (
          <section key={faixa.id} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary/70">
              {faixa.nome}
            </h2>
            <div className="flex flex-col gap-3">
              {faixa.premios.map((premio) => (
                <Card key={premio.id} className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-primary">{premio.titulo}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-primary/70">
                      {premio.descricao}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-center rounded-2xl bg-accent/15 px-3 py-2 text-accent">
                    <span className="flex items-center gap-1 text-lg font-semibold leading-none">
                      <Star className="h-4 w-4 fill-accent" /> {premio.estrelas}
                    </span>
                    <span className="mt-0.5 text-[10px] uppercase tracking-wide">estrelas</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
