import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/40 bg-white/60 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-md transition-all duration-200 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/30 ${className}`}
      {...props}
    />
  );
}
