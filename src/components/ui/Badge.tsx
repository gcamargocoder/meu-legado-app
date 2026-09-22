import type { HTMLAttributes, ReactNode } from 'react';

type Tom = 'accent' | 'alert' | 'neutral' | 'sage' | 'terracotta';

const TONS: Record<Tom, string> = {
  accent: 'bg-accent/15 text-accent',
  alert: 'bg-alert/15 text-alert',
  neutral: 'bg-primary/10 text-primary/70',
  sage: 'bg-sage/20 text-sage',
  terracotta: 'bg-terracotta/20 text-terracotta',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tom?: Tom;
  icon?: ReactNode;
}

export function Badge({ tom = 'neutral', icon, className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${TONS[tom]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
