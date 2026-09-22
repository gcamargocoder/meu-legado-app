-- Suporte a múltiplos perfis de criança: o Mural de Estrelas agora é
-- escopado por (user_id, semana_iso, crianca_id) em vez de só
-- (user_id, semana_iso), já que uma mesma conta/dispositivo pode
-- acompanhar mais de um filho.
alter table mural_semanal add column if not exists crianca_id text not null default 'default';

alter table mural_semanal drop constraint if exists mural_semanal_user_id_semana_iso_key;
alter table mural_semanal
  add constraint mural_semanal_user_id_semana_iso_crianca_id_key
  unique (user_id, semana_iso, crianca_id);

-- RLS permanece "deny all" (ver 20260921_init_schema.sql) até existir
-- autenticação real — esta migração só ajusta a forma dos dados.
