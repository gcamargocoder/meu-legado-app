import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-20 flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/40 bg-primary px-4 py-2.5 text-sm font-medium text-app shadow-floating backdrop-blur-md dark:border-white/10"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
