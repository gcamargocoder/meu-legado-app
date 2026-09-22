import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Settings, ChevronRight } from 'lucide-react';
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
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Adicionar perfil da criança
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
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 active:scale-[0.97] ${
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
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-primary/30 text-primary/60 transition-all duration-200 active:scale-[0.94]"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
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
      className="mb-3 flex w-full items-center justify-between gap-2 rounded-2xl bg-primary/5 px-3 py-2 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary/10 active:scale-[0.99]"
    >
      <span>
        {faixaAtiva ? `Faixa ativa: ${faixaAtiva.faixa} anos` : 'Escolher faixa etária do seu filho'}
      </span>
      <span aria-hidden="true" className="flex items-center gap-0.5 text-primary/50">
        Alterar <ChevronRight className="h-3.5 w-3.5" />
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
        className="flex-1 overflow-y-auto px-4 pb-28"
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
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary transition-all duration-200 hover:bg-primary/10 active:scale-[0.94]"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <TabBar />
    </div>
  );
}
