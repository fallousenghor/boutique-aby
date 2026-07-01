import { NavLink } from "react-router-dom";
import { IconHome, IconGrid, IconBag, IconUser } from "./icons";
import { useCart } from "../context/CartContext";

const linkBase =
  "flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[11px] font-semibold tracking-wide transition-colors";

export default function BottomNav() {
  const { count } = useCart();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-sable/95 backdrop-blur border-t border-ink-500/10 md:hidden">
      <div className="flex items-stretch max-w-md mx-auto">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "text-terracotta-500" : "text-ink-400"}`
          }
        >
          <IconHome className="w-5 h-5" />
          Accueil
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "text-terracotta-500" : "text-ink-400"}`
          }
        >
          <IconGrid className="w-5 h-5" />
          Catégories
        </NavLink>
        <NavLink
          to="/panier"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "text-terracotta-500" : "text-ink-400"} relative`
          }
        >
          <span className="relative">
            <IconBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-terracotta-500 text-sable text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </span>
          Panier
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "text-terracotta-500" : "text-ink-400"}`
          }
        >
          <IconUser className="w-5 h-5" />
          Compte
        </NavLink>
      </div>
    </nav>
  );
}
