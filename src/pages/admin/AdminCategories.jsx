import { useEffect, useState } from "react";
import AdminShell from "../../components/AdminShell";
import { supabase } from "../../lib/supabaseClient";
import { IconTrash, IconPlus } from "../../components/icons";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("categories")
      .insert({ name: newName.trim() });
    setSaving(false);
    if (error) {
      setError(
        error.code === "23505"
          ? "Cette catégorie existe déjà."
          : error.message
      );
      return;
    }
    setNewName("");
    load();
  }

  async function handleDelete(cat) {
    if (
      !confirm(
        `Supprimer "${cat.name}" ? Les produits associés resteront mais sans catégorie.`
      )
    )
      return;
    await supabase.from("categories").delete().eq("id", cat.id);
    load();
  }

  return (
    <AdminShell>
      <h2 className="font-semibold text-ink-500 mb-4">
        Catégories ({categories.length})
      </h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-5">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nouvelle catégorie (ex: Sacs)"
          className="flex-1 rounded-full border border-ink-500/15 px-4 py-2 text-sm bg-white focus:border-terracotta-500 outline-none"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-60 text-sable text-sm font-semibold rounded-full px-4 py-2"
        >
          <IconPlus className="w-4 h-4" />
          Ajouter
        </button>
      </form>

      {error && (
        <p className="text-terracotta-600 text-sm bg-terracotta-50 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-sable-200 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <p className="text-sm text-ink-400 py-10 text-center">
          Aucune catégorie pour l'instant.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-soft"
          >
            <span className="text-sm font-medium text-ink-500">{cat.name}</span>
            <button
              onClick={() => handleDelete(cat)}
              className="p-1.5 text-ink-400 hover:text-terracotta-500"
              aria-label="Supprimer"
            >
              <IconTrash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
