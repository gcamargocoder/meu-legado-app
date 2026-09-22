-- Suporte a exclusão de condutas padrão/sugeridas: como elas vêm de um
-- JSON estático (não editável em runtime), "excluir" uma conduta padrão
-- significa escondê-la para aquele perfil, guardando o id dela aqui.
alter table mural_semanal
  add column if not exists condutas_ocultas jsonb not null default '[]'::jsonb;

-- RLS permanece "deny all" (ver 20260921_init_schema.sql) até existir
-- autenticação real — esta migração só ajusta a forma dos dados.
