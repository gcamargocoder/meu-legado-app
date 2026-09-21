import { useState } from 'react';
import { useConteudo } from '../hooks/useConteudo';

export function FrasesScreen() {
  const { frasesCategorias } = useConteudo();
  const [fraseCopiadaId, setFraseCopiadaId] = useState<string | null>(null);

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
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          Frases & Diálogo
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-primary">Comunicação não violenta</h1>
        <p className="mt-2 text-sm text-primary/70">
          Frases prontas para os momentos mais comuns do dia a dia. Toque para copiar.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {frasesCategorias.map((categoria) => (
          <section key={categoria.id} className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary/70">
              {categoria.nome}
            </h2>
            <div className="flex flex-col gap-2">
              {categoria.frases.map((frase, i) => {
                const id = `${categoria.id}-${i}`;
                const copiada = fraseCopiadaId === id;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-3 rounded-card border border-primary/10 bg-white/60 p-3 shadow-sm dark:bg-white/5"
                  >
                    <p className="text-sm leading-relaxed text-primary/90">"{frase}"</p>
                    <button
                      type="button"
                      onClick={() => copiarFrase(id, frase)}
                      className={`shrink-0 rounded-card px-3 py-1.5 text-xs font-medium transition-colors ${
                        copiada ? 'bg-accent text-app' : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {copiada ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
