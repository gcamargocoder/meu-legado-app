import { useMemo, useState, type FormEvent } from 'react';
import { useConteudo } from '../hooks/useConteudo';
import { useMuralData } from '../hooks/useMuralData';
import { usePerfilAtivo } from '../context/PerfilContext';

const LABELS_DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function formatarIntervalo(dias: Date[]): string {
  const inicio = dias[0];
  const fim = dias[dias.length - 1];
  const formatoDia = (d: Date) => d.getUTCDate();
  const mesFim = fim.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' });
  return `${formatoDia(inicio)} – ${formatoDia(fim)} de ${mesFim}`;
}

export function MuralScreen() {
  const { categoriasCondutas } = useConteudo();
  const { perfilAtivo } = usePerfilAtivo();
  const {
    diasDaSemana,
    marcasPorConduta,
    marcarEstrela,
    calcularTotalSemana,
    irParaSemanaAnterior,
    irParaProximaSemana,
    voltarParaSemanaAtual,
    estaNaSemanaAtual,
    condutasPersonalizadas,
    adicionarCondutaPersonalizada,
  } = useMuralData(perfilAtivo?.id ?? null);

  const [formAberto, setFormAberto] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');

  const condutasDaSemana = useMemo(() => {
    const doConteudo = categoriasCondutas.flatMap((categoria) =>
      categoria.condutas.map((conduta) => ({ ...conduta, categoria: categoria.nome }))
    );
    const personalizadas = condutasPersonalizadas.map((conduta) => ({
      ...conduta,
      categoria: 'Personalizada',
    }));
    return [...doConteudo, ...personalizadas];
  }, [categoriasCondutas, condutasPersonalizadas]);

  function handleAdicionarConduta(e: FormEvent) {
    e.preventDefault();
    const titulo = novoTitulo.trim();
    if (!titulo) return;
    adicionarCondutaPersonalizada(titulo, novaDescricao.trim());
    setNovoTitulo('');
    setNovaDescricao('');
    setFormAberto(false);
  }

  return (
    <div className="flex flex-col gap-5 pt-2">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          Mural de Estrelas
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-primary">
          {perfilAtivo ? `Semana de ${perfilAtivo.nome}` : 'Semana atual'}
        </h1>
      </header>

      <div className="flex items-center justify-between rounded-card border border-primary/10 bg-white/60 p-3 shadow-sm dark:bg-white/5">
        <button
          type="button"
          onClick={irParaSemanaAnterior}
          aria-label="Semana anterior"
          className="rounded-card px-2 py-1 text-lg text-primary/70"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="text-sm font-medium text-primary">{formatarIntervalo(diasDaSemana)}</p>
          {!estaNaSemanaAtual && (
            <button
              type="button"
              onClick={voltarParaSemanaAtual}
              className="text-xs font-medium text-accent underline"
            >
              Voltar para semana atual
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={irParaProximaSemana}
          aria-label="Próxima semana"
          className="rounded-card px-2 py-1 text-lg text-primary/70"
        >
          ›
        </button>
      </div>

      <div className="flex items-center justify-between rounded-card border border-accent/30 bg-accent/10 px-4 py-3">
        <span className="text-sm font-medium text-primary">Total de estrelas na semana</span>
        <span className="text-2xl font-semibold text-accent">★ {calcularTotalSemana()}</span>
      </div>

      <div className="overflow-x-auto rounded-card border border-primary/10 bg-white/60 shadow-sm dark:bg-white/5">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white/60 px-3 py-2 text-left font-medium text-primary dark:bg-transparent">
                Conduta
              </th>
              {LABELS_DIAS.map((label) => (
                <th key={label} className="px-2 py-2 text-center font-medium text-primary/70">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {condutasDaSemana.map((conduta) => {
              const marcas = marcasPorConduta[conduta.id] ?? new Array(7).fill(false);
              return (
                <tr key={conduta.id} className="border-t border-primary/10">
                  <td className="sticky left-0 bg-white/60 px-3 py-2 dark:bg-transparent">
                    <p className="font-medium text-primary">{conduta.titulo}</p>
                    <p className="text-xs text-primary/50">{conduta.categoria}</p>
                  </td>
                  {LABELS_DIAS.map((_, diaIndex) => (
                    <td key={diaIndex} className="px-1 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => marcarEstrela(conduta.id, diaIndex)}
                        aria-pressed={marcas[diaIndex]}
                        aria-label={`${conduta.titulo} — ${LABELS_DIAS[diaIndex]}`}
                        className={`h-8 w-8 rounded-full text-lg transition-colors ${
                          marcas[diaIndex] ? 'bg-accent text-app' : 'bg-primary/5 text-primary/30'
                        }`}
                      >
                        ★
                      </button>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-card border border-dashed border-primary/20 p-4">
        {formAberto ? (
          <form onSubmit={handleAdicionarConduta} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-primary">
                Título
              </label>
              <input
                type="text"
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                required
                className="mt-1 w-full rounded-card border border-primary/20 bg-white/60 px-3 py-2 text-sm text-primary focus:border-primary focus:outline-none dark:bg-white/5"
                placeholder="Ex: Ler 10 minutos antes de dormir"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-primary">
                Descrição (opcional)
              </label>
              <input
                type="text"
                value={novaDescricao}
                onChange={(e) => setNovaDescricao(e.target.value)}
                className="mt-1 w-full rounded-card border border-primary/20 bg-white/60 px-3 py-2 text-sm text-primary focus:border-primary focus:outline-none dark:bg-white/5"
                placeholder="Detalhe rápido sobre essa conduta"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-card bg-primary px-4 py-2 text-sm font-medium text-app"
              >
                Adicionar conduta
              </button>
              <button
                type="button"
                onClick={() => setFormAberto(false)}
                className="rounded-card px-4 py-2 text-sm font-medium text-primary/60"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setFormAberto(true)}
            className="w-full text-center text-sm font-medium text-accent"
          >
            + Nova conduta personalizada
          </button>
        )}
      </div>
    </div>
  );
}
