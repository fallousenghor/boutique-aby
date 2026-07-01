import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const emptyForm = {
  name: "",
  price: "",
  description: "",
  category_id: "",
  in_stock: true,
};

function getProductImages(product) {
  if (!product) return [];
  if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    return product.image_urls.filter(Boolean);
  }
  return product.image_url ? [product.image_url] : [];
}

export default function ProductForm({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState(
    product
      ? {
          name: product.name ?? "",
          price: product.price ?? "",
          description: product.description ?? "",
          category_id: product.category_id ?? "",
          in_stock: product.in_stock ?? true,
        }
      : emptyForm
  );
  const [images, setImages] = useState(
    getProductImages(product).map((src) => ({ src, file: null }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (images.length >= 3) return;
    setImages((current) => [
      ...current,
      { src: URL.createObjectURL(file), file },
    ]);
  }

  function removeImage(index) {
    setImages((current) => current.filter((_, idx) => idx !== index));
  }

  async function uploadImageFile(file) {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: false });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function uploadImages() {
    const uploaded = await Promise.all(
      images.map(async (image) => {
        if (image.file) {
          return uploadImageFile(image.file);
        }
        return image.src;
      })
    );
    return uploaded.filter(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const image_urls = await uploadImages();
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim() || null,
        category_id: form.category_id || null,
        image_urls: image_urls.length > 0 ? image_urls : null,
        image_url: image_urls[0] || null,
        in_stock: form.in_stock,
      };

      let result;
      if (product) {
        result = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id);
      } else {
        result = await supabase.from("products").insert(payload);
      }

      if (result.error) throw result.error;
      onSaved();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink-500/40 flex items-end md:items-center justify-center">
      <div className="bg-sable w-full md:max-w-md md:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto p-5">
        <h2 className="font-display italic text-xl mb-4">
          {product ? "Modifier le produit" : "Nouveau produit"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-400 uppercase tracking-wide">
              Nom
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-ink-500/15 px-3 py-2 text-sm bg-white focus:border-terracotta-500 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-ink-400 uppercase tracking-wide">
                Prix (FCFA)
              </label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-1 w-full rounded-xl border border-ink-500/15 px-3 py-2 text-sm bg-white focus:border-terracotta-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-ink-400 uppercase tracking-wide">
                Catégorie
              </label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="mt-1 w-full rounded-xl border border-ink-500/15 px-3 py-2 text-sm bg-white focus:border-terracotta-500 outline-none"
              >
                <option value="">Aucune</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-400 uppercase tracking-wide">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-ink-500/15 px-3 py-2 text-sm bg-white focus:border-terracotta-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-400 uppercase tracking-wide">
              Photos du produit (max 3)
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative rounded-xl overflow-hidden bg-sable-200">
                  <img
                    src={image.src}
                    alt={`Aperçu ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 rounded-full bg-white/90 text-ink-600 p-1.5 shadow-soft"
                    aria-label="Supprimer l'image"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className="flex items-center justify-center h-24 rounded-xl border border-dashed border-ink-300 bg-white text-sm text-ink-400 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  Ajouter
                </label>
              )}
            </div>
            {images.length === 0 && (
              <p className="text-xs text-ink-400 mt-2">Aucune photo enregistrée pour ce produit.</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-ink-500 mt-1">
            <input
              type="checkbox"
              checked={form.in_stock}
              onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
              className="w-4 h-4 accent-terracotta-500"
            />
            En stock
          </label>

          {error && (
            <p className="text-terracotta-600 text-sm bg-terracotta-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full py-2.5 text-sm font-semibold text-ink-400 bg-white border border-ink-500/10"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full py-2.5 text-sm font-semibold text-sable bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-60"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
