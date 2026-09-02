-- 1) Crée d'abord l'utilisateur dans Supabase > Authentication > Users.
-- 2) Remplace l'e-mail et exécute ce bloc.

insert into public.staff_profiles (id, display_name, role, branch)
select id, 'T. Markoussian', 'admin', 'Logistics'
from auth.users
where email = 'TON-EMAIL@EXEMPLE.COM'
on conflict (id) do update
set display_name = excluded.display_name,
    role = excluded.role,
    branch = excluded.branch;
