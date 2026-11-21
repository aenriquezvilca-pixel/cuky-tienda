import { useState } from "react";
import { Cake, Maximize2 } from "lucide-react";
import { enlaceWhatsApp } from "@/config";
import { ICONOS, datosPrecio, datosStock, soles } from "@/lib/producto";

export default function ProductCard({ producto, onVer }) {
  const [fallo, setFallo] = useState(false);
  const { nombre, descripcion, imagen, categoria_nombre: categoria } = producto;
  const { precio, final, descuento, enOferta } = datosPrecio(producto);
  const stock = datosStock(producto);
  const agotado = stock.estado === "agotado";
  const Icono = ICONOS[categoria] ?? Cake;
  const consulta = enlaceWhatsApp(`Hola Cuky, quisiera pedir: ${nombre}`);

  const colorStock = {
    agotado: "text-red-500",
    bajo: "text-amber-600",
    disponible: "text-emerald-600",
  }[stock.estado];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-rosado/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-frambuesa/20">
      {/* Imagen: al pasar el mouse se agranda; al hacer clic se abre en grande */}
      <button
        type="button"
        onClick={() => onVer?.(producto)}
        aria-label={`Ver ${nombre} en grande`}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-gradient-to-br from-rosado to-crema"
      >
        {fallo ? (
          <div className="flex h-full items-center justify-center text-frambuesa/40">
            <Icono className="h-20 w-20" strokeWidth={1.2} />
          </div>
        ) : (
          <img
            src={imagen}
            alt={nombre}
            loading="lazy"
            onError={() => setFallo(true)}
            className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-125 ${
              agotado ? "opacity-60 grayscale" : ""
            }`}
          />
        )}

        {/* Capa que aparece al pasar el mouse */}
        <span className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-cacao/70 via-transparent to-transparent pb-4 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="inline-flex translate-y-3 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-frambuesa shadow-lg transition duration-300 group-hover:translate-y-0">
            <Maximize2 className="h-3.5 w-3.5" />
            Ver en grande
          </span>
        </span>

        {/* Etiquetas */}
        <span className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {enOferta && !agotado && (
            <span className="rounded-full bg-frambuesa px-3 py-1 text-[11px] font-bold text-white shadow-md">
              -{descuento}%
            </span>
          )}
          {agotado && (
            <span className="rounded-full bg-cacao px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              Agotado
            </span>
          )}
          {stock.estado === "bajo" && (
            <span className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cacao">
              Stock bajo
            </span>
          )}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-3 text-center sm:p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-frambuesa sm:text-[11px]">
          {categoria}
        </p>
        <h3 className="mt-1 font-display text-base font-bold leading-snug text-cacao sm:text-lg">
          {nombre}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-[12px] leading-relaxed text-cacao/65 sm:text-[13px]">
          {descripcion}
        </p>

        <div className="mt-3 flex items-baseline justify-center gap-2">
          <p className="font-display text-xl font-bold text-cacao sm:text-2xl">{soles(final)}</p>
          {enOferta && (
            <p className="text-xs text-cacao/45 line-through sm:text-sm">{soles(precio)}</p>
          )}
        </div>
        <p className={`text-xs font-semibold ${colorStock}`}>{stock.texto}</p>

        {agotado ? (
          <span className="mt-4 rounded-full border border-cacao/15 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-cacao/40">
            No disponible
          </span>
        ) : (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onVer?.(producto)}
              className="rounded-full border-2 border-rosado px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-cacao transition hover:border-frambuesa hover:text-frambuesa"
            >
              Ver
            </button>
            <a
              href={consulta}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border-2 border-frambuesa bg-frambuesa px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-frambuesa-oscuro"
            >
              Pedir
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
