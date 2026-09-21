interface Fundamento {
  titulo: string;
  texto: string;
}

const FUNDAMENTOS: Fundamento[] = [
  {
    titulo: 'Conexão antes de correção',
    texto:
      'Antes de corrigir um comportamento, garanta que a criança sinta que você está do lado dela. Conexão vem primeiro, a correção rende muito mais depois.',
  },
  {
    titulo: 'Diálogo, não sermão',
    texto:
      'Prefira perguntas a discursos longos. "O que você acha que podia ter feito diferente?" ensina mais do que uma explicação de dez minutos.',
  },
  {
    titulo: 'Escuta ativa',
    texto:
      'Escutar de verdade significa parar o que está fazendo, olhar nos olhos e repetir o que entendeu antes de responder.',
  },
  {
    titulo: 'Respeito nos dois sentidos',
    texto:
      'Respeito não é obediência cega. É tratar a criança como alguém que também merece ser ouvido, mesmo quando o limite se mantém.',
  },
  {
    titulo: 'Paciência é treino, não personalidade',
    texto:
      'Ninguém nasce paciente. Paciência é uma prática diária, com recaídas normais — o importante é reparar depois de um deslize.',
  },
];

export function InicioScreen() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-accent">Meu Legado</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary">Fundamentos do dia a dia</h1>
        <p className="mt-2 text-sm text-primary/70">
          Cinco princípios de disciplina positiva para guiar as pequenas decisões de cada dia.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {FUNDAMENTOS.map((fundamento) => (
          <article
            key={fundamento.titulo}
            className="rounded-card border border-primary/10 bg-white/60 p-4 shadow-sm dark:bg-white/5"
          >
            <h2 className="text-lg font-semibold text-primary">{fundamento.titulo}</h2>
            <p className="mt-1 text-sm leading-relaxed text-primary/80">{fundamento.texto}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
