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
  const separator = "─".repeat(24);

  const lines = items.flatMap((item, index) => {
    const unit = formatPrice(item.price);
    const itemTotal = formatPrice(item.price * item.qty);
    return [
      `*${index + 1}. ${item.name}*`,
      `   Qté : ${item.qty}  •  PU : ${unit}`,
      `   Sous-total : *${itemTotal}*`,
      item.id ? `   Réf : ${item.id}` : null,
      "",
    ].filter(Boolean);
  });

  return [
    `🛍️ *NOUVELLE COMMANDE*`,
    `*RAWDA Store*`,
    "",
    `Bonjour ${CONFIG.brandName} 👋`,
    "",
    separator,
    `🧾 *Détails de la commande*`,
    separator,
    "",
    ...lines,
    separator,
    `💰 *Montant total : ${formatPrice(total)}*`,
    separator,
    "",
    "📦 Merci de confirmer la disponibilité et l'heure de livraison.",
    "✅ Nous attendons votre retour pour valider la commande.",
  ].join("\n");
}

export function getWhatsappOrderLink(items, total) {
  const message = buildOrderMessage(items, total);
  const phone = CONFIG.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function getProductUrl(product) {
  if (typeof window !== "undefined") {
    return new URL(`/produit/${product.id}`, window.location.origin).href;
  }
  return `https://example.com/produit/${product.id}`;
}

export function getWhatsappSingleProductLink(product) {
  const separator = "─".repeat(24);

  const message = [
    `🛒 *DEMANDE PRODUIT*`,
    `*RAWDA Store*`,
    "",
    `Bonjour ${CONFIG.brandName} 👋`,
    "",
    separator,
    `📌 *${product.name}*`,
    separator,
    "",
    `💵 Prix : *${formatPrice(product.price)}*`,
    `🔢 Quantité : 1`,
    product.id ? `🏷️ Référence : ${product.id}` : null,
    "",
    "📦 Merci de confirmer la disponibilité et la livraison.",
  ]
    .filter(Boolean)
    .join("\n");

  const phone = CONFIG.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}