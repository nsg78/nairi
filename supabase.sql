-- ============================================================
-- NAIRI CORPORATION — SUPABASE V1
-- À coller EN UNE FOIS dans Supabase > SQL Editor > New query
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Types simples via CHECK (faciles à modifier plus tard) ----------

create table if not exists public.staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Staff Nairi',
  role text not null default 'staff' check (role in ('admin','manager','staff')),
  branch text default 'Corporate',
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  category text,
  hourly_rate numeric(12,2) not null default 0 check (hourly_rate >= 0),
  deposit numeric(12,2) not null default 0 check (deposit >= 0),
  status text not null default 'available' check (status in ('available','reserved','service','unavailable')),
  image_url text,
  description text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fleet_vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  category text,
  status text not null default 'available' check (status in ('available','reserved','service','unavailable')),
  image_url text,
  description text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.advisory_requests (
  id uuid primary key default gen_random_uuid(),
  client_ref text not null unique,
  contact_name text not null,
  phone text not null,
  request_text text not null,
  status text not null default 'new' check (status in ('new','review','contacted','negotiation','completed','rejected','cancelled')),
  assigned_to uuid references public.staff_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automotive_bookings (
  id uuid primary key default gen_random_uuid(),
  client_ref text not null unique,
  contact_name text not null,
  phone text not null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  vehicle_name text,
  with_driver boolean not null default false,
  duration_hours numeric(6,2) not null default 1 check (duration_hours > 0),
  requested_at timestamptz,
  pickup_location text,
  notes text,
  estimated_price numeric(12,2) not null default 0,
  deposit_amount numeric(12,2) not null default 0,
  deposit_received boolean not null default false,
  deposit_returned numeric(12,2),
  damage_amount numeric(12,2) not null default 0,
  status text not null default 'new' check (status in ('new','accepted','deposit_pending','confirmed','assigned','in_progress','completed','cancelled')),
  assigned_to uuid references public.staff_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.logistics_requests (
  id uuid primary key default gen_random_uuid(),
  client_ref text not null unique,
  contact_name text not null,
  company_name text,
  phone text not null,
  request_type text not null check (request_type in ('business_supply','urgent_delivery','special_transport','secure_convoy')),
  pickup_location text,
  delivery_location text not null,
  cargo text not null,
  volume text,
  requested_at timestamptz,
  is_urgent boolean not null default false,
  needs_security boolean not null default false,
  notes text,
  assigned_driver text,
  fleet_vehicle_id uuid references public.fleet_vehicles(id) on delete set null,
  status text not null default 'new' check (status in ('new','review','accepted','assigned','in_transit','delivered','cancelled')),
  assigned_to uuid references public.staff_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  client_ref text not null unique,
  full_name text not null,
  phone text not null,
  position text not null check (position in ('heavy_driver','private_driver','advisor')),
  experience text,
  availability text,
  motivation text not null,
  notes text,
  status text not null default 'new' check (status in ('new','review','interview','accepted','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  direction text not null check (direction in ('income','expense')),
  amount numeric(12,2) not null check (amount >= 0),
  branch text not null check (branch in ('Automotive','Logistics','Advisory','Corporate')),
  category text not null,
  description text not null,
  transaction_date date not null default current_date,
  booking_id uuid references public.automotive_bookings(id) on delete set null,
  logistics_id uuid references public.logistics_requests(id) on delete set null,
  created_by uuid references public.staff_profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.request_notes (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('advisory','automotive','logistics','application')),
  entity_id uuid not null,
  note text not null,
  created_by uuid references public.staff_profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

-- ---------- Index ----------
create index if not exists idx_advisory_created on public.advisory_requests(created_at desc);
create index if not exists idx_booking_created on public.automotive_bookings(created_at desc);
create index if not exists idx_logistics_created on public.logistics_requests(created_at desc);
create index if not exists idx_applications_created on public.applications(created_at desc);
create index if not exists idx_finance_date on public.financial_transactions(transaction_date desc);
create index if not exists idx_advisory_phone on public.advisory_requests(phone);
create index if not exists idx_booking_phone on public.automotive_bookings(phone);
create index if not exists idx_logistics_phone on public.logistics_requests(phone);

-- ---------- updated_at automatique ----------
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
  foreach t in array array['vehicles','fleet_vehicles','advisory_requests','automotive_bookings','logistics_requests','applications']
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', t, t);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ---------- Helper sécurisé : est-ce un compte staff ? ----------
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.staff_profiles s where s.id = auth.uid());
$$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated;

-- ---------- RLS ----------
alter table public.staff_profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.fleet_vehicles enable row level security;
alter table public.advisory_requests enable row level security;
alter table public.automotive_bookings enable row level security;
alter table public.logistics_requests enable row level security;
alter table public.applications enable row level security;
alter table public.financial_transactions enable row level security;
alter table public.request_notes enable row level security;

-- Nettoyage des policies si le script est relancé
do $$
declare r record;
begin
  for r in select schemaname, tablename, policyname from pg_policies where schemaname='public' and tablename in ('staff_profiles','vehicles','fleet_vehicles','advisory_requests','automotive_bookings','logistics_requests','applications','financial_transactions','request_notes')
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- Catalogue : lecture publique des éléments actifs, écriture staff
create policy "public read active vehicles" on public.vehicles for select to anon, authenticated using (active = true or public.is_staff());
create policy "staff manage vehicles" on public.vehicles for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "public read active fleet" on public.fleet_vehicles for select to anon, authenticated using (active = true or public.is_staff());
create policy "staff manage fleet" on public.fleet_vehicles for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Profil staff : chacun lit son profil, le staff peut lire les profils
create policy "staff read profiles" on public.staff_profiles for select to authenticated using (id = auth.uid() or public.is_staff());
create policy "admin staff profiles" on public.staff_profiles for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Demandes publiques : INSERT uniquement en statut new. Lecture / update réservées au staff.
create policy "public submit advisory" on public.advisory_requests for insert to anon, authenticated with check (status = 'new');
create policy "staff advisory" on public.advisory_requests for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "public submit booking" on public.automotive_bookings for insert to anon, authenticated with check (status = 'new');
create policy "staff bookings" on public.automotive_bookings for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "public submit logistics" on public.logistics_requests for insert to anon, authenticated with check (status = 'new');
create policy "staff logistics" on public.logistics_requests for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "public submit application" on public.applications for insert to anon, authenticated with check (status = 'new');
create policy "staff applications" on public.applications for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "staff finance" on public.financial_transactions for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff notes" on public.request_notes for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- ---------- Permissions API ----------
revoke all on table public.staff_profiles from anon;
revoke all on table public.financial_transactions from anon;
revoke all on table public.request_notes from anon;

grant select on public.vehicles, public.fleet_vehicles to anon;
grant insert on public.advisory_requests, public.automotive_bookings, public.logistics_requests, public.applications to anon;

grant select, insert, update, delete on all tables in schema public to authenticated;

-- ---------- Suivi client sécurisé ----------
-- Le client ne reçoit que : référence, branche, statut, date, résumé.
-- Pas d'accès SELECT direct aux tables de demandes.
create or replace function public.track_request(p_reference text, p_phone text)
returns table(reference text, category text, status text, created_at timestamptz, summary text)
language sql
stable
security definer
set search_path = public
as $$
  select b.client_ref, 'Automotive'::text, b.status, b.created_at,
         concat(coalesce(b.vehicle_name,'Véhicule'), ' · ', coalesce(b.duration_hours::text,'?'), 'h')
  from public.automotive_bookings b
  where upper(b.client_ref) = upper(trim(p_reference)) and b.phone = trim(p_phone)

  union all

  select l.client_ref, 'Logistics'::text, l.status, l.created_at,
         concat(coalesce(l.cargo,'Marchandise'), ' → ', coalesce(l.delivery_location,'Destination à définir'))
  from public.logistics_requests l
  where upper(l.client_ref) = upper(trim(p_reference)) and l.phone = trim(p_phone)

  union all

  select a.client_ref, 'Advisory'::text, a.status, a.created_at,
         left(a.request_text, 120)
  from public.advisory_requests a
  where upper(a.client_ref) = upper(trim(p_reference)) and a.phone = trim(p_phone)

  union all

  select j.client_ref, 'Carrières'::text, j.status, j.created_at,
         concat('Candidature · ', j.position)
  from public.applications j
  where upper(j.client_ref) = upper(trim(p_reference)) and j.phone = trim(p_phone)

  limit 1;
$$;

revoke all on function public.track_request(text,text) from public;
grant execute on function public.track_request(text,text) to anon, authenticated;

-- ---------- Seed V1 : flotte Automotive ----------
insert into public.vehicles (name, brand, category, hourly_rate, deposit, status, image_url, description, active, sort_order)
select 'Argento','Obey','Berline d''exception',4000,10000,'available','https://img.gta5-mods.com/q95/images/obey-argento-add-on-sounds-lods/152cdf-2.jpg','Berline premium au tempérament sportif, pensée pour les rendez-vous où l’arrivée compte autant que le trajet.',true,1
where not exists (select 1 from public.vehicles where lower(name)='argento');

insert into public.vehicles (name, brand, category, hourly_rate, deposit, status, image_url, description, active, sort_order)
select 'Toros','Pegassi','SUV Grand Tourisme',5000,12000,'available','https://img.gta5-mods.com/q75/images/pegassi-toros-rework-facelift-add-on-fivem/0ecdf8-1.png','SUV haut de gamme, confortable et imposant, adapté aux transferts VIP comme aux longues distances.',true,2
where not exists (select 1 from public.vehicles where lower(name)='toros');

insert into public.vehicles (name, brand, category, hourly_rate, deposit, status, image_url, description, active, sort_order)
select 'Schweizer V8','Schweizer','Muscle V8',1000,5000,'available','https://i.ytimg.com/vi/w77zxaHDiL0/sddefault.jpg','Une alternative plus accessible, brute et charismatique, pour se déplacer avec personnalité.',true,3
where not exists (select 1 from public.vehicles where lower(name)='schweizer v8');

-- ---------- Seed V1 : flotte Logistics ----------
insert into public.fleet_vehicles (name, brand, category, status, image_url, description, active, sort_order)
select 'Pounder','MTL','Poids lourd','available','https://static.wikia.nocookie.net/gtawiki/images/8/85/PounderCustom-GTAO-front.png/revision/latest?cb=20190716203227','Gros porteur destiné aux ravitaillements et aux cargaisons volumineuses.',true,1
where not exists (select 1 from public.fleet_vehicles where lower(name)='pounder');

insert into public.fleet_vehicles (name, brand, category, status, image_url, description, active, sort_order)
select 'Speedo Express','Vapid','Utilitaire','available','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRXnzWrFCD-gykInC86VszO2o5mRsMtoO8UEQX2VCyRw&s=10','Utilitaire rapide pour les livraisons urgentes, discrètes ou de faible volume.',true,2
where not exists (select 1 from public.fleet_vehicles where lower(name)='speedo express');

-- ============================================================
-- APRÈS AVOIR CRÉÉ TON UTILISATEUR STAFF DANS AUTHENTICATION > USERS
-- remplace l'email ci-dessous et exécute SEULEMENT ces 4 lignes :
--
-- insert into public.staff_profiles (id, display_name, role, branch)
-- select id, 'T. Markoussian', 'admin', 'Automotive & Logistics'
-- from auth.users where email = 'TON-EMAIL@EXEMPLE.COM'
-- on conflict (id) do update set display_name=excluded.display_name, role=excluded.role, branch=excluded.branch;
-- ============================================================
