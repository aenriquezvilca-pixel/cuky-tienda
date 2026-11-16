import ProductCard from "./ProductCard";

export default function ProductList({ productos, cargando, error, onReintentar }) {
  if (cargando) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-white py-16 text-cacao/70">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rosado border-t-frambuesa" />
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 py-12 text-center">
        <p className="font-semibold text-red-600">{error}</p>
        <button
          type="button"
          onClick={onReintentar}
          className="mt-4 rounded-full bg-frambuesa px-6 py-2.5 text-sm font-bold text-white transition hover:bg-frambuesa-oscuro"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <p className="rounded-3xl bg-white py-12 text-center text-cacao/60">
        No hay productos en esta categoría por ahora.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {productos.map((p) => (
        <ProductCard
          key={p.id}
          nombre={p.nombre}
          descripcion={p.descripcion}
          precio={p.precio}
          imagen={p.imagen}
          categoria={p.categoria_nombre}
          cantidad={p.cantidad}
        />
      ))}
    </div>
  );
}
