import { useMemo, useState } from 'react';
import { useConteudo } from '../hooks/useConteudo';

export function PremiosScreen() {
  const { faixasCusto } = useConteudo();
  const [faixaAtiva, setFaixaAtiva] = useState<string | null>(null);

  const faixasVisiveis = useMemo(
    () => (faixaAtiva ? faixasCusto.filter((f) => f.id === faixaAtiva) : faixasCusto),
    [faixasCusto, faixaAtiva]
  );

  return (
    <div className="flex flex-col gap-5 pt-2">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">Prêmios</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary">Ideias de recompensa</h1>
        <p className="mt-2 text-sm text-primary/70">
          Filtre por custo e veja quantas estrelas cada recompensa exige.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFaixaAtiva(null)}
          className={`rounded-card border px-3 py-1.5 text-xs font-medium transition-colors ${
            faixaAtiva === null
              ? 'border-primary bg-primary text-app'
              : 'border-primary/20 bg-white/60 text-primary dark:bg-white/5'
          }`}
        >
          Todas
        </button>
        {faixasCusto.map((faixa) => (
          <button
            key={faixa.id}
            type="button"
            onClick={() => setFaixaAtiva(faixa.id)}
            className={`rounded-card border px-3 py-1.5 text-xs font-medium transition-colors ${
              faixaAtiva === faixa.id
                ? 'border-primary bg-primary text-app'
                : 'border-primary/20 bg-white/60 text-primary dark:bg-white/5'
            }`}
          >
            {faixa.nome}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {faixasVisiveis.map((faixa) => (
          <section key={faixa.id} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary/70">
              {faixa.nome}
            </h2>
            <div className="flex flex-col gap-3">
              {faixa.premios.map((premio) => (
                <article
                  key={premio.id}
                  className="flex items-center justify-between gap-3 rounded-card border border-primary/10 bg-white/60 p-4 shadow-sm dark:bg-white/5"
                >
                  <div>
                    <h3 className="text-base font-semibold text-primary">{premio.titulo}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-primary/70">
                      {premio.descricao}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-center rounded-card bg-accent/15 px-3 py-2 text-accent">
                    <span className="text-lg font-semibold leading-none">★ {premio.estrelas}</span>
                    <span className="mt-0.5 text-[10px] uppercase tracking-wide">estrelas</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
