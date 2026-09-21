import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col bg-app">
      <main
        className="flex-1 overflow-y-auto px-4 pb-24"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
      >
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
