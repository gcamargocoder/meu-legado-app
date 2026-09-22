import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-app shadow-floating',
  outline:
    'border border-primary/20 bg-white/60 text-primary dark:border-white/10 dark:bg-white/5',
  ghost: 'text-primary/60',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
