const API_URL = "http://127.0.0.1:8000/api"

export async function getProductos() {
  const respuesta = await fetch(`${API_URL}/productos/`)
  if (!respuesta.ok) throw new Error("Error al obtener los productos")
  return respuesta.json()
}

export async function getCategorias() {
  const respuesta = await fetch(`${API_URL}/categorias/`)
  if (!respuesta.ok) throw new Error("Error al obtener las categorías")
  return respuesta.json()
}