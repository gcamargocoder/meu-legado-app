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

-- Observação: nenhuma política de RLS foi definida ainda porque o app não
-- tem autenticação de usuário real (o `user_id` usado hoje é um UUID
-- anônimo por dispositivo). Antes de expor este schema em produção com
-- Supabase Auth, habilite RLS e adicione policies baseadas em auth.uid().
