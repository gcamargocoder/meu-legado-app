import { useMemo, useState } from 'react';
import { BookOpen, Copy, Check } from 'lucide-react';
import { useConteudo } from '../hooks/useConteudo';
import { useFaixaEtariaAtiva } from '../context/FaixaEtariaContext';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';
import { SpeakerButton } from '../components/ui/SpeakerButton';

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
      <PageHero
        icon={BookOpen}
        eyebrow="Frases & Diálogo"
        title="Comunicação não violenta"
        description="Frases prontas para os momentos mais comuns do dia a dia. Toque para copiar."
      />

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
                    <div className="flex shrink-0 items-center gap-2">
                      <SpeakerButton texto={frase.texto} label="Ouvir frase" />
                      <button
                        type="button"
                        onClick={() => copiarFrase(id, frase.texto)}
                        className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.97] ${
                          copiada ? 'bg-accent text-app' : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {copiada ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copiar
                          </>
                        )}
                      </button>
                    </div>
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
