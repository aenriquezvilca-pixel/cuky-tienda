import ProductCard from "./ProductCard";

export default function ProductList({ productos, cargando, error, onReintentar, onVer }) {
  if (cargando) {
    return (
      <div>
        <div className="mb-6 flex flex-col items-center gap-3 text-cacao/70">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rosado border-t-frambuesa" />
          <p>Cargando productos...</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-rosado/80 bg-white">
              <div className="aspect-square animate-pulse bg-rosado/60" />
              <div className="space-y-2 p-4">
                <div className="mx-auto h-3 w-1/3 animate-pulse rounded bg-rosado/70" />
                <div className="mx-auto h-4 w-2/3 animate-pulse rounded bg-rosado/70" />
                <div className="mx-auto h-6 w-1/2 animate-pulse rounded bg-rosado/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 py-12 text-center">
        <p className="px-4 font-semibold text-red-600">{error}</p>
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
        No encontramos productos con esos filtros.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {productos.map((p) => (
        <ProductCard key={p.id} producto={p} onVer={onVer} />
      ))}
    </div>
  );
}
