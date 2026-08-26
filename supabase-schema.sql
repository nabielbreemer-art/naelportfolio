-- Portfolio CMS schema for Supabase
-- Run once in Supabase SQL Editor. Never put a service_role key in the website.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Your Name',
  email text,
  avatar_url text,
  profession text default 'Creative Developer',
  bio text default '',
  location text default '',
  phone text default '',
  experience_years integer default 0 check (experience_years >= 0),
  resume_url text default '',
  role text not null default 'user' check (role in ('admin','user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
  description text not null default '', thumbnail_url text default '', category text default 'Other',
  technologies text[] not null default '{}', demo_url text default '', github_url text default '',
  featured boolean not null default false, status text not null default 'draft' check (status in ('draft','published')),
  sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(), name text not null, category text not null default 'Other',
  level text default 'Working', icon text default '', sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(), position text not null, company text not null, location text default '',
  start_date date, end_date date, is_current boolean not null default false, description text default '',
  technologies text[] not null default '{}', sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(), title text not null, description text default '',
  icon text default '', featured boolean not null default false, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(), platform text not null, url text not null,
  icon text default '', is_visible boolean not null default true, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(), site_title text not null default 'Your Name — Creative Developer',
  site_description text default '', favicon_url text default '', accent_color text default '#e7f25c',
  contact_form_mode text default 'mailto', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

-- A trigger creates the safe default role before the client writes the profile.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name','Your Name'), new.email, 'user')
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Public view deliberately omits private contact fields.
drop view if exists public.profile_public;
-- The view intentionally runs with its owner's read privileges while exposing
-- only the public columns selected below. The base table remains admin/owner-only.
create view public.profile_public as
select id, full_name, avatar_url, profession, bio, location, experience_years, resume_url
from public.profiles;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.services enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can read profile" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
grant select on public.profile_public to anon, authenticated;

create policy "Public can read published projects" on public.projects for select using (status = 'published' or public.is_admin());
create policy "Admins manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read skills" on public.skills for select using (true);
create policy "Admins manage skills" on public.skills for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read experiences" on public.experiences for select using (true);
create policy "Admins manage experiences" on public.experiences for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read services" on public.services for select using (true);
create policy "Admins manage services" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read visible social links" on public.social_links for select using (is_visible = true or public.is_admin());
create policy "Admins manage social links" on public.social_links for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read settings" on public.site_settings for select using (true);
create policy "Admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

-- Storage bucket and policies. The bucket is public because portfolio thumbnails are public assets.
insert into storage.buckets (id, name, public) values ('portfolio-images','portfolio-images',true)
on conflict (id) do update set public = true;
drop policy if exists "Public can view portfolio images" on storage.objects;
drop policy if exists "Admins upload portfolio images" on storage.objects;
drop policy if exists "Admins update portfolio images" on storage.objects;
drop policy if exists "Admins delete portfolio images" on storage.objects;
create policy "Public can view portfolio images" on storage.objects for select using (bucket_id = 'portfolio-images');
create policy "Admins upload portfolio images" on storage.objects for insert with check (bucket_id = 'portfolio-images' and public.is_admin());
create policy "Admins update portfolio images" on storage.objects for update using (bucket_id = 'portfolio-images' and public.is_admin());
create policy "Admins delete portfolio images" on storage.objects for delete using (bucket_id = 'portfolio-images' and public.is_admin());

-- Optional seed content: run only if you want starter records. The frontend also has local demo data.
insert into public.site_settings (site_title, site_description, accent_color)
select 'Your Name — Creative Developer', 'Thoughtful digital experiences.', '#e7f25c'
where not exists (select 1 from public.site_settings);

-- After registering your account, run this once with your own email:
-- update public.profiles set role = 'admin' where email = 'your-email@example.com';