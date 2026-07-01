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
    const itemLines = [
      `• ${item.qty} x ${item.name} — ${formatPrice(item.price * item.qty)}`,
      item.image_url ? `  Photo : ${item.image_url}` : null,
      `  Voir : ${getProductUrlFromItem(item)}`,
      "",
    ];
    return itemLines.filter(Boolean);
  });

  return [
    `Bonjour ${CONFIG.brandName} 👋`,
    "Je souhaite commander :",
    "",
    ...lines,
    `Total : ${formatPrice(total)}`,
    "",
    "Merci de me confirmer la disponibilité 🙏",
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
  const imageUrl = product.image_urls?.[0] || product.image_url || null;
  const productUrl = getProductUrl(product);
  const message = [
    `Bonjour ${CONFIG.brandName} 👋`,
    `Je suis intéressé(e) par : ${product.name} (${formatPrice(product.price)})`,
    imageUrl ? `Photo : ${imageUrl}` : null,
    `Voir le produit : ${productUrl}`,
    "Est-il disponible ?",
  ]
    .filter(Boolean)
    .join("\n");
  const phone = CONFIG.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
