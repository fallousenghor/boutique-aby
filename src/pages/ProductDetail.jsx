import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { formatPrice } from "../config";
import { useCart } from "../context/CartContext";
import { getWhatsappSingleProductLink } from "../lib/whatsapp";
import { IconArrowLeft, IconBag, IconWhatsapp, IconPlus, IconMinus } from "../components/icons";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*, categories(id, name)")
        .eq("id", id)
        .single();
      if (!ignore) {
        setProduct(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    setSelectedImage(0);
  }, [product]);

  if (loading) {
    return (
      <div className="px-5 py-6 max-w-3xl mx-auto">
        <div className="aspect-square rounded-2xl bg-sable-200 animate-pulse mb-4" />
        <div className="h-6 w-2/3 bg-sable-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-1/3 bg-sable-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-5 py-16 text-center">
        <p className="font-display italic text-xl text-ink-400">Produit introuvable.</p>
        <Link to="/" className="text-terracotta-500 font-semibold text-sm mt-3 inline-block">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const productImages =
    product?.image_urls?.length > 0
      ? product.image_urls.filter(Boolean)
      : product?.image_url
      ? [product.image_url]
      : [];
  const selectedImageUrl = productImages[selectedImage] || productImages[0] || null;

  return (
    <div className="pb-28 md:pb-10 max-w-4xl mx-auto">
      <div className="relative">
        <div className="aspect-square md:aspect-[16/10] bg-sable-200">
          {selectedImageUrl ? (
            <img
              src={selectedImageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink-400/40 font-display italic">
              Pas d'image
            </div>
          )}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-sable/90 backdrop-blur rounded-full p-2 shadow-soft"
          aria-label="Retour"
        >
          <IconArrowLeft className="w-5 h-5 text-ink-500" />
        </button>
      </div>

      {productImages.length > 1 && (
        <div className="grid grid-cols-3 gap-2 px-5 pt-3">
          {productImages.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`h-20 rounded-xl overflow-hidden border ${
                index === selectedImage
                  ? "border-terracotta-500"
                  : "border-ink-200"
              }`}
            >
              <img
                src={src}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="px-5 pt-5">
        {product.categories?.name && (
          <span className="text-[11px] uppercase tracking-wide text-terracotta-500 font-semibold">
            {product.categories.name}
          </span>
        )}
        <h1 className="font-display italic text-2xl mt-1">{product.name}</h1>
        <p className="price-tag text-xl font-bold text-indigo-500 mt-2">
          {formatPrice(product.price)}
        </p>

        {product.description && (
          <p className="text-sm text-ink-400 leading-relaxed mt-4 whitespace-pre-line">
            {product.description}
          </p>
        )}

        {product.in_stock === false && (
          <p className="mt-4 inline-block bg-ink-500 text-sable text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
            Rupture de stock
          </p>
        )}

        <div className="flex items-center gap-3 mt-6">
          <span className="text-sm font-semibold text-ink-400">Quantité</span>
          <div className="flex items-center gap-3 bg-white rounded-full px-3 py-1.5 shadow-soft">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="text-ink-500"
              aria-label="Diminuer la quantité"
            >
              <IconMinus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-semibold price-tag">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="text-ink-500"
              aria-label="Augmenter la quantité"
            >
              <IconPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed md:static bottom-16 md:bottom-auto inset-x-0 px-5 py-3 bg-sable/95 md:bg-transparent backdrop-blur md:backdrop-blur-none border-t md:border-none border-ink-500/10 flex gap-3 md:mt-6">
        <button
          disabled={product.in_stock === false}
          onClick={() => {
            addItem(product, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-terracotta-500 disabled:bg-ink-400/40 hover:bg-terracotta-600 transition-colors text-sable font-semibold rounded-full py-3 text-sm"
        >
          <IconBag className="w-4 h-4" />
          {added ? "Ajouté !" : "Ajouter au panier"}
        </button>
        <a
          href={getWhatsappSingleProductLink(product)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:opacity-90 transition-opacity text-white font-semibold rounded-full px-4 text-sm"
        >
          <IconWhatsapp className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
