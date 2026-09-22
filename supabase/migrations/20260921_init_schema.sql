-- Meu Legado — schema inicial
-- Garante gen_random_uuid() disponível (já vem habilitada por padrão em projetos Supabase).
create extension if not exists pgcrypto;

-- Estado semanal do Mural de Estrelas, uma linha por (usuário, semana ISO).
-- A unicidade em (user_id, semana_iso) é o que permite o upsert feito pelo
-- app ao sincronizar em segundo plano.
create table if not exists mural_semanal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  semana_iso text not null,
  condutas_completadas jsonb not null default '{}'::jsonb,
  condutas_personalizadas jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, semana_iso)
);

-- Preferências do usuário (hoje só a faixa etária padrão).
create table if not exists perfil_usuario (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  faixa_etaria_padrao text,
  created_at timestamptz not null default now()
);

-- RLS habilitado com "deny all" por padrão (nenhuma policy criada).
--
-- O app ainda não tem autenticação real: o `user_id` enviado hoje é um
-- UUID anônimo gerado no dispositivo (src/lib/deviceId.ts), não uma
-- identidade verificada pelo Supabase Auth. Se essas tabelas ficassem
-- acessíveis via anon key sem RLS, qualquer cliente poderia ler ou
-- sobrescrever os dados de qualquer outro usuário só adivinhando ou
-- reaproveitando um `user_id` alheio (IDOR) — a anon key é pública por
-- design, então a única barreira real é a policy do banco.
--
-- Por isso: RLS ligado e sem policies, o que bloqueia todo acesso via API
-- por enquanto (a sincronização do useMuralData falha silenciosamente e o
-- app continua funcionando 100% offline via localStorage). Quando o
-- Supabase Auth for adicionado, troque `user_id` pelo id de sessão real e
-- crie policies do tipo `using (auth.uid() = user_id)` para cada tabela.
alter table mural_semanal enable row level security;
alter table perfil_usuario enable row level security;
