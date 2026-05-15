-- ============================================================================
-- FBA Margin Calculator — initial schema
-- Generated from plan §2 (2026-05-15)
-- ============================================================================
--
-- Apply via Supabase Studio SQL Editor, or `supabase db push` after `supabase link`.
-- Tables: products, product_params, product_history, ephemeral_calcs, audit_log
-- ============================================================================

-- ---------------------------------------------------------------------------
-- products: 主表 (一个 SKU/ASIN 一行)
-- ---------------------------------------------------------------------------
create table if not exists public.products (
	id            uuid primary key default gen_random_uuid(),
	asin          text,
	sku           text,
	title         text not null,
	category      text,
	marketplace   text not null default 'amazon.com',
	owner_id      uuid references auth.users(id) on delete set null,
	created_at    timestamptz not null default now(),
	updated_at    timestamptz not null default now()
);

create index if not exists products_owner_id_idx on public.products(owner_id);
create index if not exists products_asin_idx on public.products(asin);

-- ---------------------------------------------------------------------------
-- product_params: 当前参数 + 计算结果 cache (1:1)
-- ---------------------------------------------------------------------------
create table if not exists public.product_params (
	product_id    uuid primary key references public.products(id) on delete cascade,
	inputs        jsonb not null,
	computed      jsonb not null,
	updated_at    timestamptz not null default now(),
	updated_by    uuid references auth.users(id)
);

-- ---------------------------------------------------------------------------
-- product_history: 历史快照
-- ---------------------------------------------------------------------------
create table if not exists public.product_history (
	id            uuid primary key default gen_random_uuid(),
	product_id    uuid references public.products(id) on delete cascade,
	inputs        jsonb not null,
	computed      jsonb not null,
	snapshot_at   timestamptz not null default now(),
	snapshot_by   uuid references auth.users(id),
	note          text
);

create index if not exists product_history_product_at_idx
	on public.product_history(product_id, snapshot_at desc);

-- ---------------------------------------------------------------------------
-- ephemeral_calcs: 选品临时计算 (30 天 TTL)
--   清理策略: 优先 pg_cron 定时清理；
--   若 Supabase Free 未开 pg_cron，则用 Edge Function + GitHub Actions cron。
-- ---------------------------------------------------------------------------
create table if not exists public.ephemeral_calcs (
	id            uuid primary key default gen_random_uuid(),
	owner_id      uuid not null references auth.users(id) on delete cascade,
	inputs        jsonb not null,
	computed      jsonb not null,
	created_at    timestamptz not null default now()
);

create index if not exists ephemeral_calcs_owner_idx on public.ephemeral_calcs(owner_id);
create index if not exists ephemeral_calcs_created_idx on public.ephemeral_calcs(created_at);

-- ---------------------------------------------------------------------------
-- audit_log: 任何改动都记一条
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
	id            uuid primary key default gen_random_uuid(),
	actor_id      uuid references auth.users(id) on delete set null,
	action        text not null,            -- 'create' | 'update' | 'delete'
	entity        text not null,            -- 'product' | 'params' | 'history'
	entity_id     uuid,
	diff          jsonb,
	occurred_at   timestamptz not null default now()
);

create index if not exists audit_log_entity_idx on public.audit_log(entity, entity_id);
create index if not exists audit_log_actor_idx on public.audit_log(actor_id);
create index if not exists audit_log_occurred_idx on public.audit_log(occurred_at desc);

-- ===========================================================================
-- Row Level Security (共享工作空间)
-- ===========================================================================
alter table public.products            enable row level security;
alter table public.product_params      enable row level security;
alter table public.product_history     enable row level security;
alter table public.ephemeral_calcs     enable row level security;
alter table public.audit_log           enable row level security;

-- 所有 authenticated 用户可读 (公司共享工作空间)
drop policy if exists "auth read products"   on public.products;
drop policy if exists "auth read params"     on public.product_params;
drop policy if exists "auth read history"    on public.product_history;
drop policy if exists "auth read audit"      on public.audit_log;
create policy "auth read products"  on public.products        for select to authenticated using (true);
create policy "auth read params"    on public.product_params  for select to authenticated using (true);
create policy "auth read history"   on public.product_history for select to authenticated using (true);
create policy "auth read audit"     on public.audit_log       for select to authenticated using (true);

-- 所有 authenticated 用户可写 (共享维护，但 audit_log 记下是谁)
drop policy if exists "auth write products"  on public.products;
drop policy if exists "auth write params"    on public.product_params;
drop policy if exists "auth write history"   on public.product_history;
create policy "auth write products" on public.products        for all to authenticated using (true) with check (true);
create policy "auth write params"   on public.product_params  for all to authenticated using (true) with check (true);
create policy "auth write history"  on public.product_history for all to authenticated using (true) with check (true);

-- ephemeral_calcs 仅本人可见
drop policy if exists "owner only ephemeral" on public.ephemeral_calcs;
create policy "owner only ephemeral" on public.ephemeral_calcs
	for all to authenticated
	using (owner_id = auth.uid())
	with check (owner_id = auth.uid());

-- audit_log 不允许从客户端直接写入 (必须经 Server Action via service_role)
drop policy if exists "no manual audit write" on public.audit_log;
create policy "no manual audit write" on public.audit_log
	for insert to authenticated
	with check (false);

-- ===========================================================================
-- Trigger: products.updated_at auto-update
-- ===========================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
	before update on public.products
	for each row execute function public.set_updated_at();

drop trigger if exists product_params_set_updated_at on public.product_params;
create trigger product_params_set_updated_at
	before update on public.product_params
	for each row execute function public.set_updated_at();
