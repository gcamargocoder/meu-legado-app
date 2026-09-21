import { useMemo } from 'react';
import { useFaixasEtarias } from '../hooks/useFaixasEtarias';
import { useFaixaPadrao } from '../hooks/useFaixaPadrao';

export function FaixasEtariasScreen() {
  const { faixas } = useFaixasEtarias();
  const { faixaId, definirFaixaPadrao } = useFaixaPadrao();

  const faixaSelecionada = useMemo(
    () => faixas.find((f) => f.id === faixaId) ?? null,
    [faixas, faixaId]
  );

  return (
    <div className="flex flex-col gap-6 pt-2">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">Faixas Etárias</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary">Qual a idade do seu filho?</h1>
        <p className="mt-2 text-sm text-primary/70">
          Escolha a faixa etária para ver o que esperar dessa fase. Sua escolha fica salva como
          padrão.
        </p>
      </header>

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
                  : 'border-primary/20 bg-white/60 text-primary dark:bg-white/5'
              }`}
            >
              {faixa.faixa} anos
            </button>
          );
        })}
      </div>

      {faixaSelecionada ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-primary/10 bg-white/60 p-4 shadow-sm dark:bg-white/5">
            <p className="text-sm font-medium uppercase tracking-wide text-accent">
              {faixaSelecionada.faixa} anos
            </p>
            <h2 className="mt-1 text-xl font-semibold text-primary">{faixaSelecionada.titulo}</h2>
          </div>

          <Secao titulo="O que está acontecendo" itens={faixaSelecionada.fasesDesenvolvimento} />
          <Secao titulo="Como os pais devem agir" itens={faixaSelecionada.abordagemPais} />
          <Secao titulo="Desafios comuns" itens={faixaSelecionada.desafiosComuns} tom="alert" />

          <div className="rounded-card border border-accent/30 bg-accent/10 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
              Frases-guia
            </h3>
            <ul className="mt-2 flex flex-col gap-2">
              {faixaSelecionada.frasesGuia.map((frase) => (
                <li key={frase} className="text-sm italic leading-relaxed text-primary/90">
                  "{frase}"
                </li>
              ))}
            </ul>
          </div>
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
    <div className="rounded-card border border-primary/10 bg-white/60 p-4 shadow-sm dark:bg-white/5">
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
    </div>
  );
}
