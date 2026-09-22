import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface PageHeroProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHero({ icon: Icon, eyebrow, title, description, children }: PageHeroProps) {
  return (
    <Card className="relative overflow-hidden !p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-terracotta/25 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-sage/25 blur-2xl"
      />
      <div className="relative flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">{eyebrow}</p>
          <h1 className="text-2xl font-semibold text-primary">{title}</h1>
        </div>
      </div>
      {description && <p className="relative mt-3 text-sm text-primary/70">{description}</p>}
      {children}
    </Card>
  );
}
