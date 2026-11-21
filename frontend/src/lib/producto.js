import { Cake, Cookie, Cupcake, IceCreamCone } from "lucide-react";

// Ícono de respaldo por categoría (se usa si la foto no carga)
export const ICONOS = {
  Tortas: Cake,
  Cupcakes: Cupcake,
  Galletas: Cookie,
  Helados: IceCreamCone,
};

export const soles = (valor) => `S/ ${Number(valor).toFixed(2)}`;

// Precio original, descuento y precio final de un producto
export function datosPrecio(producto) {
  const precio = Number(producto.precio);
  const descuento = Number(producto.descuento) || 0;
  const final =
    producto.precio_final !== undefined
      ? Number(producto.precio_final)
      : precio * (1 - descuento / 100);
  return { precio, descuento, final, enOferta: descuento > 0 };
}

// Estado del inventario: agotado, stock bajo o disponible
export function datosStock(producto) {
  const cantidad = Number(producto.cantidad) || 0;
  const minimo = Number(producto.stock_minimo ?? 5);
  if (cantidad <= 0) return { estado: "agotado", texto: "Sin stock" };
  if (cantidad <= minimo) {
    return { estado: "bajo", texto: `¡Últimas ${cantidad} unidades!` };
  }
  return { estado: "disponible", texto: `${cantidad} disponibles` };
}
