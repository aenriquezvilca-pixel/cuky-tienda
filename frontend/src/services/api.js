const API_URL = "http://127.0.0.1:8000/api"

async function pedir(ruta, mensajeError, opciones) {
  const respuesta = await fetch(`${API_URL}${ruta}`, opciones)
  if (!respuesta.ok) throw new Error(mensajeError)
  return respuesta.json()
}

// Listado de productos (incluye descuento, stock y estado de inventario)
export function getProductos() {
  return pedir("/productos/", "Error al obtener los productos")
}

// Categorías disponibles
export function getCategorias() {
  return pedir("/categorias/", "Error al obtener las categorías")
}

// Recomendados generales: destacados y más vendidos
export function getRecomendados() {
  return pedir("/recomendados/", "Error al obtener los recomendados")
}

// Productos recomendados a partir de uno visto (misma categoría y más vendidos)
export function getRecomendadosDe(id) {
  return pedir(`/productos/${id}/recomendados/`, "Error al obtener las recomendaciones")
}

// Libro de Reclamaciones: envía una hoja de reclamación
export async function crearReclamacion(datos) {
  const respuesta = await fetch(`${API_URL}/reclamaciones/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
  const cuerpo = await respuesta.json().catch(() => ({}))
  if (!respuesta.ok) {
    const detalle = Object.values(cuerpo).flat().join(" ")
    throw new Error(detalle || "No se pudo registrar la hoja de reclamación")
  }
  return cuerpo
}
