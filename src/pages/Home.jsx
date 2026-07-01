import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { CONFIG } from "../config";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("categorie") || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);

      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from("products")
          .select("*, categories(id, name)")
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ]);

      if (ignore) return;

      if (productsRes.error || categoriesRes.error) {
        setError(
          productsRes.error?.message ||
            categoriesRes.error?.message ||
            "Impossible de charger les produits."
        );
      } else {
        setProducts(productsRes.data ?? []);
        setCategories(categoriesRes.data ?? []);
      }
      setLoading(false);
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((p) => p.category_id === activeCategory);
  }, [products, activeCategory]);

  return (
    <div>
      <section className="bg-indigo-500 text-sable px-5 pt-2 pb-8">
        <h1 className="font-display italic text-3xl leading-tight max-w-xs">
          Le style qui vous ressemble.
        </h1>
        <p className="text-sable/70 text-sm mt-2 max-w-sm">
          {CONFIG.tagline} — commandez directement sur WhatsApp, sans détour.
        </p>
      </section>

      <div className="-mt-4 rounded-t-scallop bg-sable relative z-10">
        <CategoryFilter
          categories={categories}
          activeId={activeCategory}
          onChange={(id) => {
            setActiveCategory(id);
            setSearchParams(id ? { categorie: id } : {});
          }}
        />

        <div className="px-5 pb-24 md:pb-10">
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] rounded-2xl bg-sable-200 animate-pulse"
                />
              ))}
            </div>
          )}

          {error && (
            <div className="mt-6 bg-terracotta-50 border border-terracotta-500/30 text-terracotta-700 rounded-xl p-4 text-sm">
              <p className="font-semibold mb-1">Connexion à la base indisponible</p>
              <p>{error}</p>
              <p className="mt-2 text-ink-400">
                Vérifie que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont bien
                renseignés dans ton fichier .env.
              </p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="font-display italic text-xl text-ink-400">
                Aucun produit pour l'instant.
              </p>
              <p className="text-sm text-ink-400/70 mt-1">
                Revenez bientôt, la boutique se remplit vite !
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
