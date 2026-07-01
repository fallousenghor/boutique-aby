export const CONFIG = {
  brandName: "Ma Boutique",
  tagline: "Habits • Chaussures • Parfums",
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "221771234567",
  currency: "FCFA",
};

export function formatPrice(value) {
  return new Intl.NumberFormat("fr-FR").format(value) + " " + CONFIG.currency;
}
