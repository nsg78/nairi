-- POST OP LOGISTICS V9 — PARTENAIRES & DEMANDES DE PARTENARIAT
-- Idempotent / ne supprime pas les dossiers existants.

begin;

-- Autorise un troisième type de dossier : partenariat.
alter table public.cases drop constraint if exists cases_kind_check;
alter table public.cases
  add constraint cases_kind_check
  check (kind in ('corporate','logistics','partnership'));

-- Branding par défaut du réseau partenaires.
alter table public.partners alter column eyebrow set default 'PARTENAIRE POST OP';

-- Met à jour les partenaires connus s'ils existent déjà.
update public.partners set
  eyebrow='PARTENAIRE · CUSTOM CULTURE',
  description='Repaire incontournable de la culture custom et de l’esprit West Coast, entre choppers, lowriders, vêtements, équipements et accessoires.',
  image_url='/assets/partners/ls-choppers-only.png', active=true, sort_order=1
where lower(name)=lower('LS CHOPPERS ONLY');

update public.partners set
  eyebrow='PARTENAIRE · VINEWOOD OUEST',
  description='Établissement de la communauté arménienne de Vinewood Ouest, lieu de café, de rencontres et d’affaires pour les habitués du quartier.',
  image_url='/assets/partners/ararat-coffee.png', active=true, sort_order=2
where lower(name)=lower('Ararat Coffee');

update public.partners set
  eyebrow='PARTENAIRE · NIGHTLIFE',
  description='Nightclub et stripclub de Los Santos, établissement partenaire du réseau Post OP Logistics.',
  image_url='/assets/partners/cockatoos-nightclub.png', active=true, sort_order=3
where lower(name)=lower('Cockatoos Nightclub');

-- Insère ceux qui n'existent pas encore.
insert into public.partners(name,eyebrow,description,image_url,active,sort_order)
select 'LS CHOPPERS ONLY','PARTENAIRE · CUSTOM CULTURE','Repaire incontournable de la culture custom et de l’esprit West Coast, entre choppers, lowriders, vêtements, équipements et accessoires.','/assets/partners/ls-choppers-only.png',true,1
where not exists (select 1 from public.partners where lower(name)=lower('LS CHOPPERS ONLY'));

insert into public.partners(name,eyebrow,description,image_url,active,sort_order)
select 'Ararat Coffee','PARTENAIRE · VINEWOOD OUEST','Établissement de la communauté arménienne de Vinewood Ouest, lieu de café, de rencontres et d’affaires pour les habitués du quartier.','/assets/partners/ararat-coffee.png',true,2
where not exists (select 1 from public.partners where lower(name)=lower('Ararat Coffee'));

insert into public.partners(name,eyebrow,description,image_url,active,sort_order)
select 'Cockatoos Nightclub','PARTENAIRE · NIGHTLIFE','Nightclub et stripclub de Los Santos, établissement partenaire du réseau Post OP Logistics.','/assets/partners/cockatoos-nightclub.png',true,3
where not exists (select 1 from public.partners where lower(name)=lower('Cockatoos Nightclub'));

commit;

-- Contrôle
select name,eyebrow,image_url,active,sort_order from public.partners order by sort_order;
