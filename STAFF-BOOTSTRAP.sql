-- 1) Dans Supabase > Authentication > Users, crée d'abord ton utilisateur.
-- 2) Change uniquement l'email ci-dessous.
-- 3) Exécute ce script dans SQL Editor.

insert into public.staff_profiles (id, display_name, role, branch)
select id, 'T. Markoussian', 'admin', 'Automotive & Logistics'
from auth.users
where email = 'TON-EMAIL@EXEMPLE.COM'
on conflict (id) do update
set display_name = excluded.display_name,
    role = excluded.role,
    branch = excluded.branch;
