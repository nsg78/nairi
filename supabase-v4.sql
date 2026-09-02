-- ============================================================================
-- IMEX LOGISTICS — BASE COMPATIBLE V6
-- Compatible avec une base neuve OU les versions V1/V2/V3 précédentes.
-- À exécuter dans Supabase > SQL Editor.
-- ============================================================================

create extension if not exists pgcrypto;

-- --------------------------------------------------------------------------
-- 1) STAFF
-- --------------------------------------------------------------------------
create table if not exists public.staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Staff IMEX',
  role text not null default 'staff',
  branch text default 'Logistics',
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 2) DOSSIERS CENTRALISÉS
-- --------------------------------------------------------------------------
create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  kind text not null check (kind in ('corporate','logistics')),
  service text not null,
  contact_name text not null,
  company_name text,
  phone text not null,
  title text not null,
  description text not null,
  origin text,
  destination text,
  cargo text,
  quantity text,
  requested_at timestamptz,
  frequency text,
  urgency text not null default 'standard' check (urgency in ('standard','urgent','planned')),
  status text not null default 'new' check (status in ('new','qualified','waiting_client','accepted','scheduled','in_progress','completed','declined','cancelled')),
  assigned_to uuid references public.staff_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  author_type text not null check (author_type in ('client','staff','system')),
  author_name text,
  visibility text not null default 'public' check (visibility in ('public','internal')),
  body text not null check (char_length(trim(body)) between 1 and 5000),
  created_by uuid references public.staff_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 3) RÉSEAU PARTENAIRES (IMAGE + TEXTE)
-- --------------------------------------------------------------------------
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  eyebrow text not null default 'PARTENAIRE IMEX',
  description text not null default '',
  image_url text,
  link_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 4) FLOTTE LOGISTICS
-- --------------------------------------------------------------------------
create table if not exists public.fleet_vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  category text,
  registration text,
  capacity text,
  status text not null default 'available',
  image_url text,
  description text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Migration : statuts de flotte utilisés par le portail Logistics.
alter table public.fleet_vehicles add column if not exists registration text;
alter table public.fleet_vehicles add column if not exists capacity text;

alter table public.fleet_vehicles drop constraint if exists fleet_vehicles_status_check;
alter table public.fleet_vehicles
  add constraint fleet_vehicles_status_check
  check (status in ('available','reserved','service','maintenance','unavailable'));

-- --------------------------------------------------------------------------
-- 5) RECRUTEMENT
-- --------------------------------------------------------------------------
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  client_ref text not null unique,
  full_name text not null,
  phone text not null,
  position text not null,
  experience text,
  availability text,
  motivation text not null,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.applications drop constraint if exists applications_position_check;
alter table public.applications
  add constraint applications_position_check
  check (position in ('heavy_driver','dispatcher','advisor','private_driver'));

alter table public.applications drop constraint if exists applications_status_check;
alter table public.applications
  add constraint applications_status_check
  check (status in ('new','review','interview','accepted','rejected'));

-- --------------------------------------------------------------------------
-- 6) FINANCE
-- --------------------------------------------------------------------------
create table if not exists public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  direction text not null check (direction in ('income','expense')),
  amount numeric(12,2) not null check (amount >= 0),
  branch text not null,
  category text not null,
  description text not null,
  transaction_date date not null default current_date,
  case_id uuid references public.cases(id) on delete set null,
  created_by uuid references public.staff_profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

-- Si la table venait de la V1 : ajout du lien vers le nouveau dossier.
alter table public.financial_transactions
  add column if not exists case_id uuid references public.cases(id) on delete set null;

alter table public.financial_transactions drop constraint if exists financial_transactions_branch_check;
alter table public.financial_transactions
  add constraint financial_transactions_branch_check
  check (branch in ('Logistics','Advisory','Corporate','Automotive'));

-- --------------------------------------------------------------------------
-- 7) INDEX
-- --------------------------------------------------------------------------
create index if not exists idx_cases_reference on public.cases(reference);
create index if not exists idx_cases_phone on public.cases(phone);
create index if not exists idx_cases_kind_status on public.cases(kind,status);
create index if not exists idx_cases_updated on public.cases(updated_at desc);
create index if not exists idx_case_messages_case_created on public.case_messages(case_id,created_at);
create index if not exists idx_partners_sort on public.partners(active,sort_order);
create index if not exists idx_fleet_sort on public.fleet_vehicles(active,sort_order);
create index if not exists idx_applications_created on public.applications(created_at desc);
create index if not exists idx_finance_date on public.financial_transactions(transaction_date desc);

-- --------------------------------------------------------------------------
-- 8) UPDATED_AT
-- --------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['cases','partners','fleet_vehicles','applications']
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I',t,t);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',t,t);
  end loop;
end $$;

-- Toute réponse dans un dossier remonte l'activité du dossier.
create or replace function public.touch_case_from_message()
returns trigger
language plpgsql
as $$
begin
  update public.cases set updated_at = now() where id = new.case_id;
  return new;
end;
$$;

drop trigger if exists trg_case_message_touch on public.case_messages;
create trigger trg_case_message_touch
after insert on public.case_messages
for each row execute function public.touch_case_from_message();

-- --------------------------------------------------------------------------
-- 9) HELPER STAFF
-- --------------------------------------------------------------------------
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.staff_profiles where id = auth.uid());
$$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated;

-- --------------------------------------------------------------------------
-- 10) API PUBLIQUE DES DOSSIERS
-- Le navigateur public ne reçoit jamais un SELECT direct sur cases/messages.
-- --------------------------------------------------------------------------
create or replace function public.open_case(
  p_kind text,
  p_service text,
  p_contact_name text,
  p_company_name text,
  p_phone text,
  p_title text,
  p_description text,
  p_origin text default null,
  p_destination text default null,
  p_cargo text default null,
  p_quantity text default null,
  p_requested_at timestamptz default null,
  p_frequency text default null,
  p_urgency text default 'standard'
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_ref text;
  v_prefix text;
begin
  if p_kind not in ('corporate','logistics') then
    raise exception 'Type de dossier invalide';
  end if;
  if nullif(trim(p_service),'') is null or nullif(trim(p_contact_name),'') is null
     or nullif(trim(p_phone),'') is null or nullif(trim(p_title),'') is null
     or nullif(trim(p_description),'') is null then
    raise exception 'Champs obligatoires manquants';
  end if;

  v_prefix := case when p_kind='logistics' then 'NL' else 'NC' end;

  loop
    v_ref := v_prefix || '-' || to_char(now(),'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,4));
    exit when not exists(select 1 from public.cases where reference=v_ref);
  end loop;

  insert into public.cases(
    reference,kind,service,contact_name,company_name,phone,title,description,
    origin,destination,cargo,quantity,requested_at,frequency,urgency,status
  ) values (
    v_ref,p_kind,trim(p_service),trim(p_contact_name),nullif(trim(p_company_name),''),trim(p_phone),trim(p_title),trim(p_description),
    nullif(trim(p_origin),''),nullif(trim(p_destination),''),nullif(trim(p_cargo),''),nullif(trim(p_quantity),''),
    p_requested_at,nullif(trim(p_frequency),''),coalesce(nullif(trim(p_urgency),''),'standard'),'new'
  ) returning id into v_id;

  insert into public.case_messages(case_id,author_type,author_name,visibility,body)
  values(v_id,'system','IMEX Logistics','public','Votre demande a bien été enregistrée. Notre équipe va l’étudier et vous répondra directement dans cet espace.');

  return v_ref;
end;
$$;

-- Anciennes fonctions V3 : le client n'a plus besoin de connaître une référence.
drop function if exists public.track_case(text,text);
drop function if exists public.case_public_messages(text,text);
drop function if exists public.reply_case(text,text,text);

create or replace function public.track_cases_by_phone(p_phone text)
returns table(
  id uuid,
  reference text,
  kind text,
  service text,
  contact_name text,
  company_name text,
  phone text,
  title text,
  description text,
  origin text,
  destination text,
  cargo text,
  quantity text,
  requested_at timestamptz,
  frequency text,
  urgency text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select c.id,c.reference,c.kind,c.service,c.contact_name,c.company_name,c.phone,c.title,c.description,
         c.origin,c.destination,c.cargo,c.quantity,c.requested_at,c.frequency,c.urgency,c.status,c.created_at,c.updated_at
  from public.cases c
  where regexp_replace(coalesce(c.phone,''),'[^0-9]','','g') = regexp_replace(coalesce(trim(p_phone),''),'[^0-9]','','g')
    and length(regexp_replace(coalesce(trim(p_phone),''),'[^0-9]','','g')) >= 3
  order by c.updated_at desc
  limit 25;
$$;

create or replace function public.case_public_messages_by_phone(p_case_id uuid,p_phone text)
returns table(
  id uuid,
  case_id uuid,
  author_type text,
  author_name text,
  visibility text,
  body text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select m.id,m.case_id,m.author_type,m.author_name,m.visibility,m.body,m.created_at
  from public.case_messages m
  join public.cases c on c.id=m.case_id
  where c.id=p_case_id
    and regexp_replace(coalesce(c.phone,''),'[^0-9]','','g') = regexp_replace(coalesce(trim(p_phone),''),'[^0-9]','','g')
    and length(regexp_replace(coalesce(trim(p_phone),''),'[^0-9]','','g')) >= 3
    and m.visibility='public'
  order by m.created_at asc;
$$;

create or replace function public.reply_case_by_phone(p_case_id uuid,p_phone text,p_body text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_case public.cases%rowtype;
begin
  if nullif(trim(p_body),'') is null then
    raise exception 'Message vide';
  end if;

  select * into v_case
  from public.cases
  where id=p_case_id
    and regexp_replace(coalesce(phone,''),'[^0-9]','','g') = regexp_replace(coalesce(trim(p_phone),''),'[^0-9]','','g')
    and length(regexp_replace(coalesce(trim(p_phone),''),'[^0-9]','','g')) >= 3
  limit 1;

  if v_case.id is null then
    raise exception 'Dossier introuvable';
  end if;

  if v_case.status in ('completed','declined','cancelled') then
    raise exception 'Ce dossier est clôturé';
  end if;

  insert into public.case_messages(case_id,author_type,author_name,visibility,body)
  values(v_case.id,'client',v_case.contact_name,'public',trim(p_body));

  return true;
end;
$$;

revoke all on function public.open_case(text,text,text,text,text,text,text,text,text,text,text,timestamptz,text,text) from public;
revoke all on function public.track_cases_by_phone(text) from public;
revoke all on function public.case_public_messages_by_phone(uuid,text) from public;
revoke all on function public.reply_case_by_phone(uuid,text,text) from public;

grant execute on function public.open_case(text,text,text,text,text,text,text,text,text,text,text,timestamptz,text,text) to anon, authenticated;
grant execute on function public.track_cases_by_phone(text) to anon, authenticated;
grant execute on function public.case_public_messages_by_phone(uuid,text) to anon, authenticated;
grant execute on function public.reply_case_by_phone(uuid,text,text) to anon, authenticated;

-- --------------------------------------------------------------------------
-- 11) RLS
-- --------------------------------------------------------------------------
alter table public.staff_profiles enable row level security;
alter table public.cases enable row level security;
alter table public.case_messages enable row level security;
alter table public.partners enable row level security;
alter table public.fleet_vehicles enable row level security;
alter table public.applications enable row level security;
alter table public.financial_transactions enable row level security;

-- Nettoyage seulement des policies de tables utilisées par la V3.
do $$
declare r record;
begin
  for r in
    select schemaname,tablename,policyname
    from pg_policies
    where schemaname='public'
      and tablename in ('staff_profiles','cases','case_messages','partners','fleet_vehicles','applications','financial_transactions')
  loop
    execute format('drop policy if exists %I on %I.%I',r.policyname,r.schemaname,r.tablename);
  end loop;
end $$;

create policy "staff read profiles" on public.staff_profiles
for select to authenticated using (public.is_staff());
create policy "staff manage profiles" on public.staff_profiles
for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "staff manage cases" on public.cases
for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff manage case messages" on public.case_messages
for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "public read active partners" on public.partners
for select to anon, authenticated using (active=true or public.is_staff());
create policy "staff manage partners" on public.partners
for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "public read active fleet" on public.fleet_vehicles
for select to anon, authenticated using (active=true or public.is_staff());
create policy "staff manage fleet" on public.fleet_vehicles
for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "public submit applications" on public.applications
for insert to anon, authenticated with check (status='new');
create policy "staff manage applications" on public.applications
for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "staff manage finance" on public.financial_transactions
for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- --------------------------------------------------------------------------
-- 12) GRANTS
-- --------------------------------------------------------------------------
revoke all on public.cases from anon;
revoke all on public.case_messages from anon;
revoke all on public.staff_profiles from anon;
revoke all on public.financial_transactions from anon;

grant select on public.partners, public.fleet_vehicles to anon;
grant insert on public.applications to anon;

grant select,insert,update,delete on public.staff_profiles,public.cases,public.case_messages,public.partners,public.fleet_vehicles,public.applications,public.financial_transactions to authenticated;

-- --------------------------------------------------------------------------
-- 13) SEED LOGISTICS
-- --------------------------------------------------------------------------
insert into public.fleet_vehicles(name,brand,category,capacity,status,image_url,description,active,sort_order)
select 'Pounder','MTL','Poids lourd','Fret lourd','available',
'https://static.wikia.nocookie.net/gtawiki/images/8/85/PounderCustom-GTAO-front.png/revision/latest?cb=20190716203227',
'Porteur lourd pour ravitaillements, tournées régulières et cargaisons volumineuses.',true,1
where not exists(select 1 from public.fleet_vehicles where lower(name)='pounder');

insert into public.fleet_vehicles(name,brand,category,capacity,status,image_url,description,active,sort_order)
select 'Speedo Express','Vapid','Utilitaire','Fret léger','available',
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRXnzWrFCD-gykInC86VszO2o5mRsMtoO8UEQX2VCyRw&s=10',
'Utilitaire agile pour les urgences, petits volumes et livraisons rapides en zone urbaine.',true,2
where not exists(select 1 from public.fleet_vehicles where lower(name)='speedo express');

-- --------------------------------------------------------------------------
-- 14) OPTIONNEL : l'ancienne branche Automotive peut rester en base.
-- La V4 ne lit plus vehicles / automotive_bookings / anciennes demandes.
-- Tu pourras les supprimer plus tard quand tu seras sûr de ne plus en avoir besoin.
-- --------------------------------------------------------------------------
