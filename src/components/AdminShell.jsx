import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconLogout } from "./icons";

const tabClass = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
    isActive
      ? "bg-terracotta-500 text-sable"
      : "bg-white text-ink-400 hover:text-ink-500"
  }`;

export default function AdminShell({ children }) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-[70vh]">
      <div className="bg-indigo-500 text-sable px-5 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display italic text-2xl">Tableau de bord</h1>
            {user?.email && (
              <p className="text-sable/60 text-xs mt-0.5">{user.email}</p>
            )}
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-sm text-sable/80 hover:text-sable"
          >
            <IconLogout className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-5 pb-24 md:pb-10">
        <div className="flex gap-2 mb-6">
          <NavLink to="/admin/dashboard" end className={tabClass}>
            Produits
          </NavLink>
          <NavLink to="/admin/categories" className={tabClass}>
            Catégories
          </NavLink>
        </div>
        {children}
      </div>
    </div>
  );
}
