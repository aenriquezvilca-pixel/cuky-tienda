import { Cake, Cookie, Cupcake, IceCreamCone } from "lucide-react";

const ICONOS = { Tortas: Cake, Cupcakes: Cupcake, Galletas: Cookie, Helados: IceCreamCone };

export default function CategoriasDestacadas({ categorias, productos, onElegir }) {
  if (categorias.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 pt-20 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-frambuesa">
          Nuestras categorías
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          ¿Qué estás buscando hoy?
        </h2>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-8 sm:gap-12">
        {categorias.map((c) => {
          const foto = productos.find((p) => p.categoria === c.id)?.imagen;
          const Icono = ICONOS[c.nombre] ?? Cake;
          return (
            <a
              key={c.id}
              href="#catalogo"
              onClick={() => onElegir(c.nombre)}
              className="group flex w-28 flex-col items-center gap-4 text-center sm:w-40"
            >
              <span className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rosado to-crema text-frambuesa shadow-lg ring-4 ring-white outline outline-2 outline-rosado transition duration-300 group-hover:-translate-y-1.5 group-hover:outline-frambuesa sm:h-40 sm:w-40">
                <Icono className="h-12 w-12 sm:h-14 sm:w-14" strokeWidth={1.4} />
                {foto && (
                  <img
                    src={foto}
                    alt={c.nombre}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                )}
              </span>
              <span className="font-display text-base font-bold transition group-hover:text-frambuesa sm:text-lg">
                {c.nombre}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
