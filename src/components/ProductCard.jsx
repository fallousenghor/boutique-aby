import { Link } from "react-router-dom";
import { formatPrice } from "../config";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/produit/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-shadow"
    >
      <div className="aspect-[4/5] bg-sable-200 overflow-hidden relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-400/40 font-display italic text-sm">
            Pas d'image
          </div>
        )}
        {product.in_stock === false && (
          <span className="absolute top-2 left-2 bg-ink-500 text-sable text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full">
            Épuisé
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-body font-semibold text-sm text-ink-500 line-clamp-1">
          {product.name}
        </h3>
        {product.categories?.name && (
          <span className="text-[11px] uppercase tracking-wide text-terracotta-500 font-semibold">
            {product.categories.name}
          </span>
        )}
        <p className="price-tag text-base font-bold text-indigo-500 mt-1">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
