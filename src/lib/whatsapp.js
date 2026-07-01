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
    const lineHeader = `*${item.name}* — ${item.qty} x ${unit} = ${formatPrice(
      item.price * item.qty
    )}`;
    const itemLines = [
      lineHeader,
      item.image_url ? `${item.image_url}` : null,
      `Voir : ${getProductUrlFromItem(item)}`,
      "---",
    ];
    return itemLines.filter(Boolean);
  });

  return [
    `Bonjour ${CONFIG.brandName} 👋`,
    "*Nouvelle commande*",
    "",
    ...lines,
    "",
    `*Total : ${formatPrice(total)}*`,
    "",
    "Merci — j'attends votre confirmation.",
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
    "*Demande produit*",
    `*${product.name}*`,
    `Prix : ${formatPrice(product.price)}`,
    imageUrl ? `${imageUrl}` : null,
    `Voir : ${productUrl}`,
    "Quantité : 1",
    "",
    "Pouvez-vous confirmer la disponibilité ?",
  ]
    .filter(Boolean)
    .join("\n");
  const phone = CONFIG.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
