import { useState, type FormEvent } from 'react';
import { usePerfilAtivo } from '../context/PerfilContext';
import { useBaseCientifica } from '../hooks/useBaseCientifica';
import { calcularIdadeEmAnos } from '../lib/idade';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const AVATARES = ['👦', '👧', '🧒', '👶', '🐻', '🐰', '🦁', '🐼', '🦄', '🌟'];

function SecaoPerfis() {
  const { perfis, perfilAtivoId, definirPerfilAtivo, adicionarPerfil, removerPerfil } =
    usePerfilAtivo();
  const [formAberto, setFormAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [avatar, setAvatar] = useState(AVATARES[0]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nomeAparado = nome.trim();
    if (!nomeAparado || !dataNascimento) return;
    adicionarPerfil(nomeAparado, dataNascimento, avatar);
    setNome('');
    setDataNascimento('');
    setAvatar(AVATARES[0]);
    setFormAberto(false);
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-primary/70">
        Perfis das crianças
      </h2>

      {perfis.length === 0 && !formAberto && (
        <p className="rounded-card border border-dashed border-primary/20 p-4 text-sm text-primary/60">
          Nenhum perfil cadastrado ainda. Adicione o primeiro para personalizar o app por idade.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {perfis.map((perfil) => {
          const ativo = perfil.id === perfilAtivoId;
          return (
            <Card
              key={perfil.id}
              className={`flex items-center justify-between gap-3 !p-3 ${
                ativo ? 'border-primary' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => definirPerfilAtivo(perfil.id)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <span className="text-2xl leading-none">{perfil.avatar}</span>
                <div>
                  <p className="text-sm font-semibold text-primary">{perfil.nome}</p>
                  <p className="text-xs text-primary/60">
                    {calcularIdadeEmAnos(perfil.dataNascimento)} anos
                    {ativo ? ' · ativo agora' : ''}
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => removerPerfil(perfil.id)}
                aria-label={`Remover ${perfil.nome}`}
                className="shrink-0 rounded-card px-2 py-1 text-xs font-medium text-alert"
              >
                Remover
              </button>
            </Card>
          );
        })}
      </div>

      {formAberto ? (
        <Card
          className="flex flex-col gap-3"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-primary">
                Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="mt-1 w-full rounded-card border border-primary/20 bg-white/60 px-3 py-2 text-sm text-primary focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                placeholder="Ex: Ana"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-primary">
                Data de nascimento
              </label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
                max={new Date().toISOString().slice(0, 10)}
                className="mt-1 w-full rounded-card border border-primary/20 bg-white/60 px-3 py-2 text-sm text-primary focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-primary">
                Avatar
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {AVATARES.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-lg ${
                      avatar === emoji
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/15 bg-white/60 dark:border-white/10 dark:bg-white/5'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-card bg-primary px-4 py-2 text-sm font-medium text-app"
              >
                Adicionar perfil
              </button>
              <button
                type="button"
                onClick={() => setFormAberto(false)}
                className="rounded-card px-4 py-2 text-sm font-medium text-primary/60"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <button
          type="button"
          onClick={() => setFormAberto(true)}
          className="rounded-card border border-dashed border-primary/20 py-3 text-sm font-medium text-accent"
        >
          + Adicionar perfil
        </button>
      )}
    </section>
  );
}

function SecaoBaseCientifica() {
  const { especialistas } = useBaseCientifica();
  const [expandidoId, setExpandidoId] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-primary/70">
          Nossa base científica
        </h2>
        <p className="mt-1 text-xs text-primary/60">
          O conteúdo do Meu Legado se apoia em pesquisadores e metodologias reconhecidas de
          desenvolvimento infantil e parentalidade.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {especialistas.map((especialista) => {
          const expandido = expandidoId === especialista.id;
          return (
            <Card key={especialista.id} className="!p-0 overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setExpandidoId((atual) => (atual === especialista.id ? null : especialista.id))
                }
                aria-expanded={expandido}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="flex flex-col gap-1.5">
                  <Badge tom="accent" className="w-fit">
                    {especialista.metodologia}
                  </Badge>
                  <h3 className="text-sm font-semibold text-primary">{especialista.nome}</h3>
                </div>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-primary/60 transition-transform ${
                    expandido ? 'rotate-180' : ''
                  }`}
                >
                  ▾
                </span>
              </button>
              {expandido && (
                <div className="border-t border-primary/10 px-4 py-3 dark:border-white/10">
                  <p className="text-sm leading-relaxed text-primary/80">
                    {especialista.descricao}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export function ConfiguracoesScreen() {
  return (
    <div className="flex flex-col gap-8 pt-2">
      <header>
        <Badge tom="accent">Configurações</Badge>
        <h1 className="mt-2 text-3xl font-semibold text-primary">Ajustes do app</h1>
      </header>

      <SecaoPerfis />
      <SecaoBaseCientifica />
    </div>
  );
}
