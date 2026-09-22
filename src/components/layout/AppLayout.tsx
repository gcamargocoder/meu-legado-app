import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TabBar } from './TabBar';
import { useFaixaEtariaAtiva } from '../../context/FaixaEtariaContext';

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
  const naTelaDeFaixas = location.pathname === '/faixas-etarias';

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col bg-app">
      <main
        className="flex-1 overflow-y-auto px-4 pb-24"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
      >
        {!naTelaDeFaixas && <FaixaAtivaIndicator />}
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
