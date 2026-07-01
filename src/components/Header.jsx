import { Link } from "react-router-dom";
import { CONFIG } from "../config";
import { IconBag } from "./icons";
import { useCart } from "../context/CartContext";
import InstallPWA from "./InstallPWA";

export default function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-indigo-500 text-sable">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display italic text-2xl leading-none">
            {CONFIG.brandName}
          </span>
        </Link>
        <p className="hidden sm:block text-xs uppercase tracking-[0.2em] text-ochre-400">
          {CONFIG.tagline}
        </p>
        <Link
          to="/panier"
          className="hidden md:flex items-center gap-2 bg-terracotta-500 hover:bg-terracotta-600 transition-colors px-4 py-2 rounded-full text-sm font-semibold"
        >
          <IconBag className="w-4 h-4" />
          Panier
          {count > 0 && <span>({count})</span>}
        </Link>
        <div className="flex items-center">
          <InstallPWA />
        </div>
      </div>
      <div className="h-3 bg-indigo-500 scallop-edge" />
    </header>
  );
}
