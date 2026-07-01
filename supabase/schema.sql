-- ============================================================
-- Schéma de base de données — Application e-commerce
-- À exécuter dans Supabase : SQL Editor > New query > Run
-- ============================================================

-- Extension pour générer des UUID
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- Table categories
-- ------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Table products
-- ------------------------------------------------------------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  description text,
  image_url text,
  image_urls jsonb,
  category_id uuid references categories(id) on delete set null,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category_id);

-- ------------------------------------------------------------
-- Table orders (optionnelle — trace des commandes WhatsApp)
-- ------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  products jsonb not null,       -- ex: [{"id": "...", "name": "...", "price": 12000, "qty": 2}]
  total numeric(10, 2) not null,
  phone text,
  status text not null default 'pending', -- pending | confirmed | delivered | cancelled
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- Clients (anonymes) : lecture seule sur products / categories
-- Admin (authentifié) : accès complet
-- ============================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Lecture publique des catégories
create policy "Lecture publique des catégories"
  on categories for select
  using (true);

-- Lecture publique des produits
create policy "Lecture publique des produits"
  on products for select
  using (true);

-- Admin (utilisateur authentifié) : accès complet aux catégories
create policy "Admin gère les catégories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Admin (utilisateur authentifié) : accès complet aux produits
create policy "Admin gère les produits"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- N'importe qui peut créer une commande (le client passe commande)
create policy "Création publique des commandes"
  on orders for insert
  with check (true);

-- Seul l'admin peut lire / modifier les commandes
create policy "Admin lit les commandes"
  on orders for select
  using (auth.role() = 'authenticated');

create policy "Admin modifie les commandes"
  on orders for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- Storage — bucket pour les images produits
-- À faire manuellement une fois si le bucket n'existe pas déjà :
--   Storage > New bucket > "product-images" > Public bucket : oui
-- Les policies ci-dessous supposent que le bucket s'appelle "product-images"
-- ============================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Lecture publique des images produits"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admin téléverse des images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admin supprime des images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- ============================================================
-- Données de démonstration (facultatif — à supprimer si non désiré)
-- ============================================================

insert into categories (name) values
  ('Habits'), ('Chaussures'), ('Parfums')
on conflict (name) do nothing;
