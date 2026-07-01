# 🛍️ Ma Boutique — Application e-commerce (React + Supabase)

Application e-commerce mobile-first : catalogue produits, filtre par catégorie,
panier, et commande via WhatsApp. Espace admin sécurisé pour gérer produits et
catégories.

## 🧱 Stack

- **React 19** + **Vite**
- **Tailwind CSS** — design "boutique" (terracotta / indigo / ochre, police Fraunces + Manrope)
- **React Router** — navigation
- **Supabase** — base de données, authentification admin, stockage des images

---

## 1. Créer le projet Supabase

1. Va sur [supabase.com](https://supabase.com) → crée un nouveau projet (gratuit).
2. Dans **SQL Editor**, ouvre une nouvelle requête, colle le contenu du fichier
   `supabase/schema.sql` de ce dossier, puis clique **Run**.
   Cela crée les tables `categories`, `products`, `orders`, active la sécurité
   (RLS), et crée le bucket de stockage `product-images`.

> Si ta base Supabase existe déjà, ne relance pas `supabase/schema.sql` entier
> : cela provoquera des erreurs de doublons sur les tables et les policies.
> Exécute seulement `supabase/add_image_urls_column.sql` si tu veux ajouter la
> colonne `image_urls` sur la table `products`.
3. Dans **Authentication → Users**, clique **Add user** pour créer le compte de
   connexion de l'admin (email + mot de passe). C'est ce compte qui se connectera
   sur `/admin`.
4. Dans **Project Settings → API**, note :
   - `Project URL`
   - `anon public key`

## 2. Configurer le projet

```bash
cp .env.example .env
```

Ouvre `.env` et remplis :

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_WHATSAPP_NUMBER=221771234567
```

`VITE_WHATSAPP_NUMBER` = le numéro WhatsApp de la boutique, format international
sans "+" ni espaces (ex : Sénégal → `221` + numéro).

## 3. Installer et lancer en local

```bash
npm install
npm run dev
```

Ouvre `http://localhost:5173`.

## 4. Personnaliser le nom de la boutique

Dans `src/config.js`, change :

```js
brandName: "Ma Boutique",
tagline: "Habits • Chaussures • Parfums",
```

## 5. Ajouter des produits

Va sur `/admin`, connecte-toi avec le compte créé à l'étape 1, puis :

- Onglet **Catégories** : crée d'abord tes catégories (Habits, Chaussures, Parfums…)
- Onglet **Produits** : clique **Ajouter**, remplis nom / prix / description /
  catégorie / photo.

Les images sont automatiquement envoyées dans le bucket Supabase `product-images`
et deviennent publiques.

## 6. Déployer

### Frontend → Vercel ou Netlify

- Connecte ton dépôt Git, ou glisse le dossier après `npm run build` (dossier `dist/`).
- Ajoute les mêmes variables d'environnement (`VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`, `VITE_WHATSAPP_NUMBER`) dans les réglages du site.

### Backend → déjà hébergé sur Supabase (cloud), rien à faire de plus.

---

## 📂 Structure du projet

```
src/
  components/         → composants réutilisables (carte produit, nav, icônes...)
  components/admin/   → formulaire produit (admin)
  context/             → panier (CartContext) + session admin (AuthContext)
  lib/                 → client Supabase + génération du message WhatsApp
  pages/               → Accueil, Catégories, Détail produit, Panier
  pages/admin/          → Connexion, Tableau de bord, Catégories (admin)
  config.js             → nom de la boutique, numéro WhatsApp, devise
supabase/
  schema.sql            → tables + sécurité (RLS) + bucket images, à exécuter une fois
```

## 🔐 Sécurité (RLS)

- **Clients (visiteurs anonymes)** : lecture seule sur `products` et `categories`.
- **Admin (connecté via Supabase Auth)** : peut ajouter / modifier / supprimer
  produits et catégories.
- Les commandes ne transitent pas par la base par défaut : le bouton "Commander"
  ouvre WhatsApp avec la liste des produits et le total pré-remplis. La table
  `orders` est prête si tu veux plus tard garder une trace des commandes côté
  admin.

## 🚀 Évolutions possibles

- Paiement en ligne (Stripe / Wave / Orange Money)
- Suivi des commandes dans le tableau de bord admin (table `orders` déjà créée)
- Gestion du stock par quantité
- Multi-vendeurs

---

Fait avec React ⚛️ + Supabase 🔥 + Tailwind 🎨
