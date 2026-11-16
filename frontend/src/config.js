// Cambia este n\u00famero por el WhatsApp real de la tienda (c\u00f3digo de pa\u00eds + n\u00famero, sin + ni espacios)
export const WHATSAPP = "51999999999";

export const enlaceWhatsApp = (mensaje) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
