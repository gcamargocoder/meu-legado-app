import { Sparkles } from 'lucide-react';
import { useFaixasEtarias } from '../hooks/useFaixasEtarias';
import { useFaixaEtariaAtiva } from '../context/FaixaEtariaContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageHero } from '../components/ui/PageHero';
import { SpeakerButton } from '../components/ui/SpeakerButton';

export function FaixasEtariasScreen() {
  const { faixas } = useFaixasEtarias();
  const { faixaId, faixaAtiva, definirFaixaPadrao } = useFaixaEtariaAtiva();

  return (
    <div className="flex flex-col gap-6 pt-2">
      <PageHero
        icon={Sparkles}
        eyebrow="Faixas Etárias"
        title="Qual a idade do seu filho?"
        description="Escolha a faixa etária para ver o que esperar dessa fase. Sua escolha vira o filtro padrão de Situações, Frases e Prêmios."
      />

      <div className="flex flex-wrap gap-2">
        {faixas.map((faixa) => {
          const ativa = faixa.id === faixaId;
          return (
            <button
              key={faixa.id}
              type="button"
              onClick={() => definirFaixaPadrao(faixa.id)}
              className={`rounded-card border px-3 py-2 text-sm font-medium transition-colors ${
                ativa
                  ? 'border-primary bg-primary text-app'
                  : 'border-primary/20 bg-white/60 text-primary dark:border-white/10 dark:bg-white/5'
              }`}
            >
              {faixa.faixa} anos
            </button>
          );
        })}
      </div>

      {faixaAtiva ? (
        <div className="flex flex-col gap-4">
          <Card>
            <Badge tom="accent">{faixaAtiva.faixa} anos</Badge>
            <h2 className="mt-2 text-xl font-semibold text-primary">{faixaAtiva.titulo}</h2>
          </Card>

          <Secao titulo="O que está acontecendo" itens={faixaAtiva.fasesDesenvolvimento} />
          <Secao titulo="Como os pais devem agir" itens={faixaAtiva.abordagemPais} />
          <Secao titulo="Desafios comuns" itens={faixaAtiva.desafiosComuns} tom="alert" />

          <Card className="border-accent/30 bg-accent/10">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
              Frases-guia
            </h3>
            <ul className="mt-2 flex flex-col gap-2">
              {faixaAtiva.frasesGuia.map((frase) => (
                <li key={frase} className="flex items-start gap-2 text-sm italic leading-relaxed text-primary/90">
                  <span className="flex-1">"{frase}"</span>
                  <SpeakerButton texto={frase} label="Ouvir frase" />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : (
        <p className="rounded-card border border-dashed border-primary/20 p-4 text-sm text-primary/60">
          Selecione uma faixa etária acima para ver os detalhes dessa fase.
        </p>
      )}
    </div>
  );
}

function Secao({
  titulo,
  itens,
  tom = 'primary',
}: {
  titulo: string;
  itens: string[];
  tom?: 'primary' | 'alert';
}) {
  return (
    <Card>
      <h3
        className={`text-sm font-semibold uppercase tracking-wide ${
          tom === 'alert' ? 'text-alert' : 'text-primary'
        }`}
      >
        {titulo}
      </h3>
      <ul className="mt-2 flex flex-col gap-1.5">
        {itens.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-primary/80">
            <span aria-hidden="true">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
