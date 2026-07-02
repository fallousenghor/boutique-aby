export const CONFIG = {
  brandName: "Rawda Store",
  tagline: "Habits • Chaussures • Parfums",
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "221773437122",
  currency: "FCFA",
};

export function formatPrice(value) {
  return new Intl.NumberFormat("fr-FR").format(value) + " " + CONFIG.currency;
}
