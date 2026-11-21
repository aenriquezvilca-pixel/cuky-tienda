// Cambia este número por el WhatsApp real de la tienda (código de país + número, sin + ni espacios)
export const WHATSAPP = "51999999999";

export const enlaceWhatsApp = (mensaje) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

// Datos del establecimiento (se muestran en el Libro de Reclamaciones). Cámbialos por los reales.
export const NEGOCIO = {
  nombre: "Cuky Pastelería",
  razonSocial: "Cuky Pastelería E.I.R.L.",
  ruc: "20000000000",
  direccion: "Arequipa, Perú",
};

// Promoción de bienvenida que se muestra en la barra superior y en la sección de ofertas
export const CODIGO_PROMO = "CUKY10";
