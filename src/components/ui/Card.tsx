import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-primary/10 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-colors dark:border-white/10 dark:bg-white/[0.04] ${className}`}
      {...props}
    />
  );
}
