import type { HTMLAttributes } from 'react';

type Tom = 'accent' | 'alert' | 'neutral';

const TONS: Record<Tom, string> = {
  accent: 'bg-accent/15 text-accent',
  alert: 'bg-alert/15 text-alert',
  neutral: 'bg-primary/10 text-primary/70',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tom?: Tom;
}

export function Badge({ tom = 'neutral', className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${TONS[tom]} ${className}`}
      {...props}
    />
  );
}
