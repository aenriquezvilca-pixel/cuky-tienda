import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getRecomendados } from "@/services/api";
import { datosPrecio, soles } from "@/lib/producto";

// Recomendaciones generales: destacados y más vendidos (los calcula el backend)
export default function Recomendados({ onVer }) {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    let activo = true;
    getRecomendados()
      .then((datos) => activo && setLista(datos.slice(0, 4)))
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, []);

  if (lista.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 pt-16 sm:px-6">
      <div className="mb-8 text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-frambuesa">
          <Sparkles className="h-4 w-4" /> Recomendados para ti
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Los favoritos de Cuky</h2>
        <p className="mt-2 text-sm text-cacao/65">Los más pedidos y los destacados de la casa.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {lista.map((p, i) => {
          const { final } = datosPrecio(p);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onVer(p)}
              className="group relative overflow-hidden rounded-2xl text-left shadow-md transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-frambuesa/25"
            >
              <div className="aspect-[4/5] overflow-hidden bg-rosado">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
              <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 font-display text-sm font-bold text-frambuesa shadow">
                {i + 1}
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cacao/90 via-cacao/60 to-transparent p-3 pt-12 text-white sm:p-4 sm:pt-16">
                <p className="line-clamp-1 font-display font-bold sm:text-lg">{p.nombre}</p>
                <p className="text-sm font-semibold text-pink-200">
                  {soles(final)} · {p.vendidos} vendidos
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
