import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sprout, MessagesSquare, Star, Gift, BookOpenText, type LucideIcon } from 'lucide-react';

interface TabItem {
  to: string;
  label: string;
  Icon: LucideIcon;
}

const TABS: TabItem[] = [
  { to: '/', label: 'Início', Icon: Home },
  { to: '/faixas-etarias', label: 'Faixas', Icon: Sprout },
  { to: '/situacoes', label: 'Situações', Icon: MessagesSquare },
  { to: '/mural', label: 'Mural', Icon: Star },
  { to: '/premios', label: 'Prêmios', Icon: Gift },
  { to: '/frases', label: 'Frases', Icon: BookOpenText },
];

export function TabBar() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-3 left-1/2 z-10 w-[calc(100%-1.5rem)] max-w-[536px] -translate-x-1/2 rounded-3xl border border-white/40 bg-white/70 shadow-floating backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex justify-between px-1.5 py-1.5">
        {TABS.map((tab) => {
          const ativo =
            tab.to === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.to);
          const Icon = tab.Icon;
          return (
            <li key={tab.to} className="flex-1">
              <NavLink
                to={tab.to}
                end={tab.to === '/'}
                className="relative flex flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] font-medium"
              >
                {ativo && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-2xl bg-primary/10"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-5 w-5 transition-all duration-200 ${
                    ativo ? 'scale-110 text-accent' : 'text-primary/50'
                  }`}
                  strokeWidth={ativo ? 2.4 : 2}
                />
                <span className={`relative z-10 ${ativo ? 'text-accent' : 'text-primary/50'}`}>
                  {tab.label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
