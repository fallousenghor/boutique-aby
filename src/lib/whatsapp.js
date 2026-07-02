import { CONFIG, formatPrice } from "../config";

function getProductUrlFromItem(item) {
  if (item.productUrl) {
    return item.productUrl;
  }

  if (typeof window !== "undefined") {
    return new URL(`/produit/${item.id}`, window.location.origin).href;
  }

  return `https://example.com/produit/${item.id}`;
}

export function buildOrderMessage(items, total) {
  const lines = items.flatMap((item) => {
    const unit = formatPrice(item.price);
    return [
      `• *${item.name}*`,
      `  • Quantité : ${item.qty}`,
      `  • Prix unitaire : ${unit}`,
      `  • Total article : ${formatPrice(item.price * item.qty)}`,
      item.id ? `  • Référence : ${item.id}` : null,
      "",
    ].filter(Boolean);
  });

  return [
    `🛍️ *Commande RAWDA Store*`,
    `Bonjour ${CONFIG.brandName} 👋`,
    "",
    "*Détails de la commande*",
    "",
    ...lines,
    `*Montant total : ${formatPrice(total)}*`,
    "",
    "Merci de confirmer la disponibilité et l'heure de livraison.",
    "Nous attendons votre retour pour valider la commande.",
  ].join("\n");
}

export function getWhatsappOrderLink(items, total) {
  const message = buildOrderMessage(items, total);
  const phone = CONFIG.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// function getProductUrl(product) {
//   if (typeof window !== "undefined") {
//     return new URL(`/produit/${product.id}`, window.location.origin).href;
//   }
//   return `https://example.com/produit/${product.id}`;
// }
function getProductUrl(product) {
  if (typeof window !== "undefined") {
    return new URL(`/produit/${product.id}`, window.location.origin).href;
  }
  return `https://example.com/produit/${product.id}`;
}

export function getWhatsappSingleProductLink(product) {
  const message = [
    `🛒 *Demande produit RAWDA Store*`,
    `Bonjour ${CONFIG.brandName} 👋`,
    "",
    `*${product.name}*`,
    `Prix : ${formatPrice(product.price)}`,
    `Quantité : 1`,
    product.id ? `Référence produit : ${product.id}` : null,
    "",
    "Merci de confirmer la disponibilité et la livraison.",
  ]
    .filter(Boolean)
    .join("\n");
  const phone = CONFIG.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
