import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../config";
import { getWhatsappOrderLink } from "../lib/whatsapp";
import { IconMinus, IconPlus, IconTrash, IconWhatsapp, IconBag } from "../components/icons";

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="px-5 py-20 text-center pb-24 md:pb-10">
        <IconBag className="w-10 h-10 mx-auto text-ink-400/40" />
        <p className="font-display italic text-xl text-ink-400 mt-4">
          Votre panier est vide.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 text-terracotta-500 font-semibold text-sm"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 pb-40 md:pb-10 max-w-2xl mx-auto">
      <h1 className="font-display italic text-2xl mb-5">Mon panier</h1>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 bg-white rounded-2xl p-3 shadow-soft items-center"
          >
            <div className="w-16 h-16 rounded-xl bg-sable-200 overflow-hidden shrink-0">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-ink-500 line-clamp-1">
                {item.name}
              </p>
              <p className="price-tag text-sm text-indigo-500 font-bold">
                {formatPrice(item.price)}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="w-6 h-6 rounded-full bg-sable-100 flex items-center justify-center"
                  aria-label="Diminuer"
                >
                  <IconMinus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-sm font-semibold price-tag">
                  {item.qty}
                </span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-6 h-6 rounded-full bg-sable-100 flex items-center justify-center"
                  aria-label="Augmenter"
                >
                  <IconPlus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-ink-400 hover:text-terracotta-500 transition-colors p-2"
              aria-label="Supprimer"
            >
              <IconTrash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="fixed md:static bottom-16 md:bottom-auto inset-x-0 bg-sable/95 md:bg-transparent backdrop-blur md:backdrop-blur-none border-t md:border-none border-ink-500/10 px-5 py-4 md:mt-6 md:px-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-ink-400">Total</span>
            <span className="price-tag text-xl font-bold text-indigo-500">
              {formatPrice(total)}
            </span>
          </div>
          <a
            href={getWhatsappOrderLink(items, total)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:opacity-90 transition-opacity text-white font-semibold rounded-full py-3.5 text-sm w-full"
          >
            <IconWhatsapp className="w-5 h-5" />
            Commander sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
