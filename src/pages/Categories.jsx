import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const PALETTE = ["bg-terracotta-500", "bg-indigo-500", "bg-ochre-500"];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("categories").select("*").order("name");
      setCategories(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="px-5 py-6 pb-24 md:pb-10 max-w-3xl mx-auto">
      <h1 className="font-display italic text-2xl mb-1">Catégories</h1>
      <p className="text-sm text-ink-400 mb-6">Trouvez ce que vous cherchez, plus vite.</p>

      {loading && (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-sable-200 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <p className="text-sm text-ink-400">Aucune catégorie pour l'instant.</p>
      )}

      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/?categorie=${cat.id}`)}
              className={`${PALETTE[i % PALETTE.length]} text-sable rounded-2xl h-24 flex items-end p-4 font-display italic text-lg shadow-soft hover:opacity-90 transition-opacity text-left`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
