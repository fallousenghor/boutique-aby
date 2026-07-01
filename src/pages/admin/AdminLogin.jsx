import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IconLock } from "../../components/icons";

export default function AdminLogin() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError("Identifiants incorrects. Vérifiez l'email et le mot de passe.");
      return;
    }
    navigate("/admin/dashboard");
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-500 text-sable w-12 h-12 rounded-full flex items-center justify-center mb-3">
            <IconLock className="w-5 h-5" />
          </div>
          <h1 className="font-display italic text-2xl">Espace admin</h1>
          <p className="text-sm text-ink-400 mt-1">Connectez-vous pour gérer la boutique</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-400 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-500/15 px-4 py-2.5 text-sm bg-white focus:border-terracotta-500 outline-none"
              placeholder="admin@boutique.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-400 uppercase tracking-wide">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-500/15 px-4 py-2.5 text-sm bg-white focus:border-terracotta-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-terracotta-600 text-sm bg-terracotta-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-60 transition-colors text-sable font-semibold rounded-full py-3 text-sm"
          >
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="text-xs text-ink-400/70 text-center mt-6">
          Compte admin créé depuis Supabase Auth (Authentication → Users).
        </p>
      </div>
    </div>
  );
}
