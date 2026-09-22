import { useState } from 'react';

interface SpeakerButtonProps {
  texto: string;
  label?: string;
  className?: string;
}

export function SpeakerButton({ texto, label = 'Ouvir', className = '' }: SpeakerButtonProps) {
  const [falando, setFalando] = useState(false);

  function handleClick() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onstart = () => setFalando(true);
    utterance.onend = () => setFalando(false);
    utterance.onerror = () => setFalando(false);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base transition-colors ${
        falando ? 'bg-accent text-app' : 'bg-primary/10 text-primary'
      } ${className}`}
    >
      {falando ? '🔊' : '🔈'}
    </button>
  );
}
