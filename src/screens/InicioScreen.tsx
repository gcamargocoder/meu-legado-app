import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface Fundamento {
  id: string;
  titulo: string;
  texto: string;
  comoAplicar: string[];
}

const FUNDAMENTOS: Fundamento[] = [
  {
    id: 'conexao',
    titulo: 'Conexão antes de correção',
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
    texto:
      'Ninguém nasce paciente. Paciência é uma prática diária, com recaídas normais — o importante é reparar depois de um deslize.',
    comoAplicar: [
      'Perceba os primeiros sinais de que sua paciência está no limite.',
      'Faça uma pausa curta antes de reagir quando sentir que vai explodir.',
      'Volte depois para reparar, se a reação tiver sido mais dura do que deveria.',
    ],
  },
];

export function InicioScreen() {
  const [expandidoId, setExpandidoId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 pt-2">
      <header>
        <Badge tom="accent">Meu Legado</Badge>
        <h1 className="mt-2 text-3xl font-semibold text-primary">Fundamentos do dia a dia</h1>
        <p className="mt-2 text-sm text-primary/70">
          Cinco princípios de disciplina positiva para guiar as pequenas decisões de cada dia.
          Toque em cada um para ver como aplicar na prática.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {FUNDAMENTOS.map((fundamento) => {
          const expandido = expandidoId === fundamento.id;
          return (
            <Card key={fundamento.id} className="!p-0 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandidoId((atual) => (atual === fundamento.id ? null : fundamento.id))}
                aria-expanded={expandido}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <h2 className="text-lg font-semibold text-primary">{fundamento.titulo}</h2>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-primary/60 transition-transform ${expandido ? 'rotate-180' : ''}`}
                >
                  ▾
                </span>
              </button>
              <div className="px-4 pb-4">
                <p className="text-sm leading-relaxed text-primary/80">{fundamento.texto}</p>
              </div>
              {expandido && (
                <div className="border-t border-primary/10 px-4 py-3 dark:border-white/10">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Como aplicar
                  </h3>
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
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
