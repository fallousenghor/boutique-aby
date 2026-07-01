import { useEffect, useState } from "react";
import AdminShell from "../../components/AdminShell";
import { supabase } from "../../lib/supabaseClient";
import { formatPrice } from "../../config";
import ProductForm from "../../components/admin/ProductForm";
import { IconEdit, IconTrash, IconPlus } from "../../components/icons";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  async function load() {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from("products")
        .select("*, categories(id, name)")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setProducts(productsRes.data ?? []);
    setCategories(categoriesRes.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(product) {
    if (!confirm(`Supprimer "${product.name}" ?`)) return;
    await supabase.from("products").delete().eq("id", product.id);
    load();
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-ink-500">Produits ({products.length})</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-1.5 bg-terracotta-500 hover:bg-terracotta-600 text-sable text-sm font-semibold rounded-full px-4 py-2"
        >
          <IconPlus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {loading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-sable-200 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="text-sm text-ink-400 py-10 text-center">
          Aucun produit. Cliquez sur "Ajouter" pour commencer.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-soft"
          >
            <div className="w-12 h-12 rounded-lg bg-sable-200 overflow-hidden shrink-0">
              {(product.image_urls?.[0] || product.image_url) && (
                <img
                  src={product.image_urls?.[0] || product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-ink-500 line-clamp-1">
                {product.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-ink-400">
                <span className="price-tag font-bold text-indigo-500">
                  {formatPrice(product.price)}
                </span>
                {product.categories?.name && <span>· {product.categories.name}</span>}
                {product.in_stock === false && (
                  <span className="text-terracotta-500 font-semibold">· Épuisé</span>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setEditingProduct(product);
                setFormOpen(true);
              }}
              className="p-2 text-ink-400 hover:text-indigo-500"
              aria-label="Modifier"
            >
              <IconEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(product)}
              className="p-2 text-ink-400 hover:text-terracotta-500"
              aria-label="Supprimer"
            >
              <IconTrash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {formOpen && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            load();
          }}
        />
      )}
    </AdminShell>
  );
}
