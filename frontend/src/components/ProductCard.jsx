import { useState } from "react";
import { Cake, Cookie, Cupcake, IceCreamCone } from "lucide-react";
import { enlaceWhatsApp } from "@/config";

const ICONOS = { Tortas: Cake, Cupcakes: Cupcake, Galletas: Cookie, Helados: IceCreamCone };

export default function ProductCard({
  nombre,
  descripcion,
  precio,
  imagen,
  categoria,
  cantidad,
}) {
  const [fallo, setFallo] = useState(false);
  const agotado = !(cantidad > 0);
  const Icono = ICONOS[categoria] ?? Cake;
  const consulta = enlaceWhatsApp(`Hola Cuky, quisiera consultar por: ${nombre}`);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-rosado/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-frambuesa/15">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-rosado to-crema">
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
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              agotado ? "opacity-60 grayscale" : ""
            }`}
          />
        )}
        {agotado && (
          <span className="absolute left-3 top-3 rounded-full bg-cacao px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-frambuesa">
          {categoria}
        </p>
        <h3 className="mt-1 font-display text-lg font-bold leading-snug text-cacao">
          {nombre}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-[13px] leading-relaxed text-cacao/65">
          {descripcion}
        </p>

        <p className="mt-3 font-display text-2xl font-bold text-cacao">
          S/ {Number(precio).toFixed(2)}
        </p>
        <p className={`text-xs font-semibold ${agotado ? "text-red-500" : "text-emerald-600"}`}>
          {agotado ? "Sin stock" : `${cantidad} disponibles`}
        </p>

        {agotado ? (
          <span className="mt-4 rounded-full border border-cacao/15 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-cacao/40">
            No disponible
          </span>
        ) : (
          <a
            href={consulta}
            target="_blank"
            rel="noreferrer"
            className="mt-4 rounded-full border-2 border-frambuesa px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-frambuesa transition hover:bg-frambuesa hover:text-white"
          >
            Consultar
          </a>
        )}
      </div>
    </article>
  );
}
