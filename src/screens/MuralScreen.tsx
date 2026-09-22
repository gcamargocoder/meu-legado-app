import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ChevronLeft, ChevronRight, Plus, Star, CheckCircle2, Trash2 } from 'lucide-react';
import { useConteudo } from '../hooks/useConteudo';
import { useMuralData } from '../hooks/useMuralData';
import { usePerfilAtivo } from '../context/PerfilContext';
import { useFaixaEtariaAtiva } from '../context/FaixaEtariaContext';
import { PageHero } from '../components/ui/PageHero';
import { Toast } from '../components/ui/Toast';

const TOAST_DURATION_MS = 2200;

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
  const { faixaId } = useFaixaEtariaAtiva();
  const modoAdolescente = faixaId === '13-15' || faixaId === '16-18';
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
    condutasOcultas,
    adicionarCondutaPersonalizada,
    removerConduta,
  } = useMuralData(perfilAtivo?.id ?? null);

  const [formAberto, setFormAberto] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMsg) return;
    const handle = setTimeout(() => setToastMsg(null), TOAST_DURATION_MS);
    return () => clearTimeout(handle);
  }, [toastMsg]);

  const condutasDaSemana = useMemo(() => {
    const doConteudo = categoriasCondutas.flatMap((categoria) =>
      categoria.condutas.map((conduta) => ({ ...conduta, categoria: categoria.nome }))
    );
    const personalizadas = condutasPersonalizadas.map((conduta) => ({
      ...conduta,
      categoria: 'Personalizada',
    }));
    const condutasOcultasSet = new Set(condutasOcultas);
    return [...doConteudo, ...personalizadas].filter((c) => !condutasOcultasSet.has(c.id));
  }, [categoriasCondutas, condutasPersonalizadas, condutasOcultas]);

  function handleAdicionarConduta(e: FormEvent) {
    e.preventDefault();
    const titulo = novoTitulo.trim();
    if (!titulo) return;
    adicionarCondutaPersonalizada(titulo, novaDescricao.trim());
    setNovoTitulo('');
    setNovaDescricao('');
    setFormAberto(false);
  }

  function handleRemoverConduta(condutaId: string, titulo: string) {
    removerConduta(condutaId);
    setToastMsg(`"${titulo}" removida`);
  }

  const IconeMarca = modoAdolescente ? CheckCircle2 : Star;

  return (
    <div className="flex flex-col gap-5 pt-2">
      <PageHero
        icon={IconeMarca}
        eyebrow={modoAdolescente ? 'Mural de Acordos & Autonomia' : 'Mural de Estrelas'}
        title={perfilAtivo ? `Semana de ${perfilAtivo.nome}` : 'Semana atual'}
        description={
          modoAdolescente
            ? 'Pactos cumpridos e conquistas de responsabilidade durante a semana.'
            : 'Marque as estrelas conquistadas em cada conduta durante a semana.'
        }
      />

      <div className="flex items-center justify-between rounded-2xl border border-primary/10 bg-white/60 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
        <button
          type="button"
          onClick={irParaSemanaAnterior}
          aria-label="Semana anterior"
          className="rounded-2xl p-2 text-primary/70 transition-all duration-200 active:scale-90"
        >
          <ChevronLeft className="h-5 w-5" />
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
          className="rounded-2xl p-2 text-primary/70 transition-all duration-200 active:scale-90"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3">
        <span className="text-sm font-medium text-primary">
          {modoAdolescente ? 'Total de pactos cumpridos' : 'Total de estrelas na semana'}
        </span>
        <span className="flex items-center gap-1.5 text-2xl font-semibold text-accent">
          <IconeMarca className="h-5 w-5 fill-accent" /> {calcularTotalSemana()}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white/60 shadow-sm dark:border-white/10 dark:bg-white/5">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white/60 px-3 py-2 text-left font-medium text-primary dark:bg-transparent">
                {modoAdolescente ? 'Pacto' : 'Conduta'}
              </th>
              {LABELS_DIAS.map((label) => (
                <th key={label} className="px-2 py-2 text-center font-medium text-primary/70">
                  {label}
                </th>
              ))}
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {condutasDaSemana.length === 0 && (
              <tr>
                <td colSpan={LABELS_DIAS.length + 2} className="px-3 py-6 text-center text-sm text-primary/50">
                  {modoAdolescente
                    ? 'Nenhum pacto por aqui ainda. Adicione um abaixo.'
                    : 'Nenhuma conduta por aqui ainda. Adicione uma abaixo.'}
                </td>
              </tr>
            )}
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
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${
                          marcas[diaIndex] ? 'bg-accent text-app' : 'bg-primary/5 text-primary/30'
                        }`}
                      >
                        <IconeMarca
                          className={`h-4 w-4 ${marcas[diaIndex] ? 'fill-current' : ''}`}
                        />
                      </button>
                    </td>
                  ))}
                  <td className="px-1 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoverConduta(conduta.id, conduta.titulo)}
                      aria-label={`Remover ${conduta.titulo}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-alert/60 transition-all duration-200 hover:bg-alert/10 hover:text-alert active:scale-90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-dashed border-primary/20 p-4">
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
                className="mt-1 w-full rounded-2xl border border-primary/20 bg-white/60 px-3 py-2 text-sm text-primary focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                placeholder={
                  modoAdolescente ? 'Ex: Chegar no horário combinado' : 'Ex: Ler 10 minutos antes de dormir'
                }
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
                className="mt-1 w-full rounded-2xl border border-primary/20 bg-white/60 px-3 py-2 text-sm text-primary focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                placeholder={modoAdolescente ? 'Detalhe rápido sobre esse pacto' : 'Detalhe rápido sobre essa conduta'}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-app transition-all duration-200 active:scale-[0.98]"
              >
                {modoAdolescente ? 'Adicionar pacto' : 'Adicionar conduta'}
              </button>
              <button
                type="button"
                onClick={() => setFormAberto(false)}
                className="rounded-2xl px-4 py-2 text-sm font-medium text-primary/60"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setFormAberto(true)}
            className="flex w-full items-center justify-center gap-1.5 text-center text-sm font-medium text-accent"
          >
            <Plus className="h-4 w-4" />
            {modoAdolescente ? 'Novo pacto personalizado' : 'Nova conduta personalizada'}
          </button>
        )}
      </div>

      <Toast message={toastMsg} />
    </div>
  );
}
