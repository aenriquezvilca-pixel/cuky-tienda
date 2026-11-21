import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Flame, PackageCheck, Trophy } from "lucide-react";
import { datosPrecio, datosStock, soles } from "@/lib/producto";

// Cada pestaña filtra y ordena los productos que ya vienen del backend
const PESTANAS = [
  {
    id: "vendidos",
    texto: "Más vendidos",
    icono: Trophy,
    lista: (ps) => [...ps].sort((a, b) => b.vendidos - a.vendidos).slice(0, 10),
  },
  {
    id: "ofertas",
    texto: "En oferta",
    icono: Flame,
    lista: (ps) =>
      ps
        .filter((p) => p.descuento > 0 && p.cantidad > 0)
        .sort((a, b) => b.descuento - a.descuento),
  },
  {
    id: "ultimas",
    texto: "Últimas unidades",
    icono: PackageCheck,
    lista: (ps) =>
      ps
        .filter((p) => p.cantidad > 0 && p.cantidad <= p.stock_minimo)
        .sort((a, b) => a.cantidad - b.cantidad),
  },
];

export default function Destacados({ productos, onVer }) {
  const [pestana, setPestana] = useState("vendidos");
  const [pausa, setPausa] = useState(false);
  const pista = useRef(null);

  const actual = PESTANAS.find((p) => p.id === pestana);
  const lista = actual.lista(productos);

  const mover = (direccion) => {
    const el = pista.current;
    if (!el) return;
    const paso = el.firstElementChild?.getBoundingClientRect().width ?? 220;
    const alFinal = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (direccion > 0 && alFinal) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: direccion * (paso + 16), behavior: "smooth" });
  };

  // Avance automático suave; se detiene al pasar el mouse
  useEffect(() => {
    if (pausa) return;
    const id = setInterval(() => mover(1), 3500);
    return () => clearInterval(id);
  }, [pausa, pestana, productos]);

  useEffect(() => {
    pista.current?.scrollTo({ left: 0 });
  }, [pestana]);

  if (productos.length === 0) return null;

  return (
    <section className="relative z-10 mx-auto -mt-14 max-w-6xl px-4 sm:px-6">
      <div
        className="rounded-[2rem] border border-rosado bg-white p-5 shadow-2xl shadow-frambuesa/15 sm:p-8"
        onMouseEnter={() => setPausa(true)}
        onMouseLeave={() => setPausa(false)}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-frambuesa">
              Lo que más se pide
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Antojos del momento</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-1 overflow-x-auto rounded-full bg-rosado/60 p-1 sm:flex-none">
              {PESTANAS.map((p) => {
                const Icono = p.icono;
                const activa = p.id === pestana;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPestana(p.id)}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                      activa
                        ? "bg-frambuesa text-white shadow-md"
                        : "text-cacao/70 hover:text-frambuesa"
                    }`}
                  >
                    <Icono className="h-4 w-4" />
                    {p.texto}
                  </button>
                );
              })}
            </div>
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => mover(-1)}
                aria-label="Anterior"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-rosado text-frambuesa transition hover:bg-frambuesa hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => mover(1)}
                aria-label="Siguiente"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-rosado text-frambuesa transition hover:bg-frambuesa hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {lista.length === 0 ? (
          <p className="py-12 text-center text-sm text-cacao/60">
            Por ahora no hay productos en esta categoría.
          </p>
        ) : (
          <div
            ref={pista}
            className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {lista.map((p, i) => {
              const { precio, final, descuento, enOferta } = datosPrecio(p);
              const stock = datosStock(p);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onVer(p)}
                  className="group w-[44%] shrink-0 snap-start overflow-hidden rounded-2xl border border-rosado bg-crema text-left transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-frambuesa/20 sm:w-52 lg:w-56"
                >
                  <div className="relative aspect-square overflow-hidden bg-rosado">
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-125"
                    />
                    {pestana === "vendidos" && (
                      <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white font-display text-base font-bold text-frambuesa shadow-md">
                        {i + 1}
                      </span>
                    )}
                    {enOferta && (
                      <span className="absolute right-3 top-3 rounded-full bg-frambuesa px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                        -{descuento}%
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-1 font-display font-bold">{p.nombre}</p>
                    <p className="mt-1 flex items-baseline gap-2">
                      <span className="font-display text-lg font-bold text-frambuesa">{soles(final)}</span>
                      {enOferta && (
                        <span className="text-xs text-cacao/45 line-through">{soles(precio)}</span>
                      )}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-cacao/60">
                      {pestana === "ultimas" ? stock.texto : `🔥 ${p.vendidos} vendidos`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
