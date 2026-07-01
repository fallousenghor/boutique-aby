import { CONFIG, formatPrice } from "../config";

export function buildOrderMessage(items, total) {
  const lines = items.map(
    (item) => `• ${item.qty} x ${item.name} — ${formatPrice(item.price * item.qty)}`
  );

  return [
    `Bonjour ${CONFIG.brandName} 👋`,
    "Je souhaite commander :",
    "",
    ...lines,
    "",
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

export function getWhatsappSingleProductLink(product) {
  const message = [
    `Bonjour ${CONFIG.brandName} 👋`,
    `Je suis intéressé(e) par : ${product.name} (${formatPrice(product.price)})`,
    "Est-il disponible ?",
  ].join("\n");
  const phone = CONFIG.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
