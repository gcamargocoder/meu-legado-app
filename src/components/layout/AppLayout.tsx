import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TabBar } from './TabBar';
import { useFaixaEtariaAtiva } from '../../context/FaixaEtariaContext';
import { usePerfilAtivo } from '../../context/PerfilContext';

function PerfilSelector() {
  const { perfis, perfilAtivoId, definirPerfilAtivo } = usePerfilAtivo();
  const navigate = useNavigate();

  if (perfis.length === 0) {
    return (
      <button
        type="button"
        onClick={() => navigate('/configuracoes')}
        className="mb-2 flex items-center gap-1.5 text-xs font-medium text-accent"
      >
        <span aria-hidden="true">＋</span> Adicionar perfil da criança
      </button>
    );
  }

  return (
    <div className="mb-2 flex items-center gap-2 overflow-x-auto pb-1">
      {perfis.map((perfil) => {
        const ativo = perfil.id === perfilAtivoId;
        return (
          <button
            key={perfil.id}
            type="button"
            onClick={() => definirPerfilAtivo(perfil.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
              ativo
                ? 'border-primary bg-primary text-app'
                : 'border-primary/20 bg-white/60 text-primary dark:border-white/10 dark:bg-white/5'
            }`}
          >
            <span aria-hidden="true" className="text-base leading-none">
              {perfil.avatar}
            </span>
            {perfil.nome}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => navigate('/configuracoes')}
        aria-label="Adicionar outro perfil"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-primary/30 text-sm text-primary/60"
      >
        ＋
      </button>
    </div>
  );
}

function FaixaAtivaIndicator() {
  const { faixaAtiva } = useFaixaEtariaAtiva();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/faixas-etarias')}
      className="mb-3 flex w-full items-center justify-between gap-2 rounded-card bg-primary/5 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
    >
      <span>
        {faixaAtiva ? `Faixa ativa: ${faixaAtiva.faixa} anos` : 'Escolher faixa etária do seu filho'}
      </span>
      <span aria-hidden="true" className="text-primary/50">
        Alterar ›
      </span>
    </button>
  );
}

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const naTelaDeFaixas = location.pathname === '/faixas-etarias';
  const naTelaDeConfiguracoes = location.pathname === '/configuracoes';

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col bg-app">
      <main
        className="flex-1 overflow-y-auto px-4 pb-24"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
      >
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <PerfilSelector />
            {!naTelaDeFaixas && <FaixaAtivaIndicator />}
          </div>
          {!naTelaDeConfiguracoes && (
            <button
              type="button"
              onClick={() => navigate('/configuracoes')}
              aria-label="Configurações"
              title="Configurações"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/5 text-base text-primary transition-colors hover:bg-primary/10"
            >
              ⚙
            </button>
          )}
        </div>
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
