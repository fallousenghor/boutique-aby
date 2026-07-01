-- Ajout de la colonne image_urls à la table products
-- Exécutez ce script dans Supabase SQL Editor si votre base existante ne contient pas encore cette colonne.

alter table products
  add column if not exists image_urls jsonb;
