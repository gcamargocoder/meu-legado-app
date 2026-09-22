import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HeartHandshake,
  MessageCircleQuestion,
  Ear,
  Scale,
  Clock,
  ChevronDown,
  ListChecks,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { usePerfilAtivo } from '../context/PerfilContext';
import { useFaixaEtariaAtiva } from '../context/FaixaEtariaContext';

interface Fundamento {
  id: string;
  titulo: string;
  texto: string;
  Icon: LucideIcon;
  comoAplicar: string[];
}

const FUNDAMENTOS: Fundamento[] = [
  {
    id: 'conexao',
    titulo: 'Conexão antes de correção',
    Icon: HeartHandshake,
    texto:
      'Antes de corrigir um comportamento, garanta que a criança sinta que você está do lado dela. Conexão vem primeiro, a correção rende muito mais depois.',
    comoAplicar: [
      'Abaixe-se à altura da criança antes de falar sobre o que ela fez.',
      'Comece reconhecendo o sentimento antes de qualquer correção.',
      'Só explique a regra depois que a tensão inicial diminuir.',
    ],
  },
  {
    id: 'dialogo',
    titulo: 'Diálogo, não sermão',
    Icon: MessageCircleQuestion,
    texto:
      'Prefira perguntas a discursos longos. "O que você acha que podia ter feito diferente?" ensina mais do que uma explicação de dez minutos.',
    comoAplicar: [
      'Troque afirmações longas por uma pergunta curta e aberta.',
      'Espere a resposta com paciência, mesmo que o silêncio incomode.',
      'Guie com mais perguntas em vez de completar o raciocínio por ela.',
    ],
  },
  {
    id: 'escuta',
    titulo: 'Escuta ativa',
    Icon: Ear,
    texto:
      'Escutar de verdade significa parar o que está fazendo, olhar nos olhos e repetir o que entendeu antes de responder.',
    comoAplicar: [
      'Pare a tarefa que está fazendo ao ouvir algo importante.',
      'Repita com suas palavras o que você entendeu antes de opinar.',
      'Evite interromper para corrigir detalhes enquanto ela ainda fala.',
    ],
  },
  {
    id: 'respeito',
    titulo: 'Respeito nos dois sentidos',
    Icon: Scale,
    texto:
      'Respeito não é obediência cega. É tratar a criança como alguém que também merece ser ouvido, mesmo quando o limite se mantém.',
    comoAplicar: [
      'Explique o motivo de um limite, mesmo quando a resposta continua sendo não.',
      'Peça desculpas quando você errar com a criança, do mesmo jeito que espera dela.',
      'Evite expor a criança ou corrigi-la na frente de outras pessoas.',
    ],
  },
  {
    id: 'paciencia',
    titulo: 'Paciência é treino, não personalidade',
    Icon: Clock,
    texto:
      'Ninguém nasce paciente. Paciência é uma prática diária, com recaídas normais — o importante é reparar depois de um deslize.',
    comoAplicar: [
      'Perceba os primeiros sinais de que sua paciência está no limite.',
      'Faça uma pausa curta antes de reagir quando sentir que vai explodir.',
      'Volte depois para reparar, se a reação tiver sido mais dura do que deveria.',
    ],
  },
];

function saudacao(): string {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

function HeroHeader() {
  const { perfilAtivo } = usePerfilAtivo();
  const { faixaAtiva } = useFaixaEtariaAtiva();

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
        <span className="text-3xl leading-none">{perfilAtivo?.avatar ?? '🌿'}</span>
        <div>
          <p className="text-sm font-medium text-primary/70">
            {saudacao()}{perfilAtivo ? `, cuidando de ${perfilAtivo.nome}` : ''}
          </p>
          <h1 className="text-2xl font-semibold text-primary">Fundamentos do dia a dia</h1>
        </div>
      </div>
      {faixaAtiva && (
        <Badge tom="accent" className="relative mt-3 w-fit">
          Faixa ativa: {faixaAtiva.faixa} anos
        </Badge>
      )}
      <p className="relative mt-3 text-sm text-primary/70">
        Cinco princípios de disciplina positiva para guiar as pequenas decisões de cada dia. Toque
        em cada um para ver como aplicar na prática.
      </p>
    </Card>
  );
}

export function InicioScreen() {
  const [expandidoId, setExpandidoId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 pt-2">
      <HeroHeader />

      <div className="flex flex-col gap-3">
        {FUNDAMENTOS.map((fundamento) => {
          const expandido = expandidoId === fundamento.id;
          const Icon = fundamento.Icon;
          return (
            <Card key={fundamento.id} className="!p-0 overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setExpandidoId((atual) => (atual === fundamento.id ? null : fundamento.id))
                }
                aria-expanded={expandido}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-primary/5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage/20 text-sage">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <h2 className="flex-1 text-base font-semibold text-primary">{fundamento.titulo}</h2>
                <motion.span
                  animate={{ rotate: expandido ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-primary/50"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>
              <div className="px-4 pb-4 pl-[4.25rem]">
                <p className="text-sm leading-relaxed text-primary/80">{fundamento.texto}</p>
              </div>
              <AnimatePresence initial={false}>
                {expandido && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-primary/10 px-4 py-3 dark:border-white/10">
                      <div className="flex items-center gap-1.5 text-accent">
                        <ListChecks className="h-3.5 w-3.5" />
                        <h3 className="text-xs font-semibold uppercase tracking-wide">
                          Como aplicar
                        </h3>
                      </div>
                      <ol className="mt-2 flex flex-col gap-1.5">
                        {fundamento.comoAplicar.map((passo, i) => (
                          <li key={i} className="flex gap-2 text-sm leading-relaxed text-primary/80">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {i + 1}
                            </span>
                            <span>{passo}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
