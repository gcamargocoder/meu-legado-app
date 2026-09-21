import { NavLink } from 'react-router-dom';

interface TabItem {
  to: string;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { to: '/', label: 'Início', icon: '🏠' },
  { to: '/faixas-etarias', label: 'Faixas', icon: '🌱' },
  { to: '/situacoes', label: 'Situações', icon: '💬' },
  { to: '/mural', label: 'Mural', icon: '⭐' },
  { to: '/premios', label: 'Prêmios', icon: '🎁' },
  { to: '/frases', label: 'Frases', icon: '📖' },
];

export function TabBar() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-10 w-full max-w-[560px] -translate-x-1/2 border-t border-primary/10 bg-app"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex justify-between px-1 py-1">
        {TABS.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-card px-1 py-2 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-primary/60'
                }`
              }
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {tab.icon}
              </span>
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
