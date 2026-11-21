import { useEffect, useState } from "react";
import { Check, Copy, Flame } from "lucide-react";
import { CODIGO_PROMO } from "@/config";
import { datosPrecio, soles } from "@/lib/producto";

// Las ofertas terminan cada domingo a las 11:59 p. m. (hora local)
function finDeSemana() {
  const ahora = new Date();
  const fin = new Date(ahora);
  fin.setDate(ahora.getDate() + ((7 - ahora.getDay()) % 7));
  fin.setHours(23, 59, 59, 0);
  return fin;
}

function restante() {
  const ms = Math.max(0, finDeSemana() - new Date());
  const seg = Math.floor(ms / 1000);
  return {
    dias: Math.floor(seg / 86400),
    horas: Math.floor((seg % 86400) / 3600),
    min: Math.floor((seg % 3600) / 60),
    seg: seg % 60,
  };
}

function Cuenta() {
  const [t, setT] = useState(restante);
  useEffect(() => {
    const id = setInterval(() => setT(restante()), 1000);
    return () => clearInterval(id);
  }, []);
  const cajas = [
    ["Días", t.dias],
    ["Horas", t.horas],
    ["Min", t.min],
    ["Seg", t.seg],
  ];
  return (
    <div className="flex justify-center gap-2 sm:gap-3" aria-label="Tiempo restante de las ofertas">
      {cajas.map(([nombre, valor]) => (
        <div
          key={nombre}
          className="w-16 rounded-2xl bg-white/15 py-2 text-center backdrop-blur sm:w-20 sm:py-3"
        >
          <p className="font-display text-2xl font-bold tabular-nums sm:text-3xl">
            {String(valor).padStart(2, "0")}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/75">{nombre}</p>
        </div>
      ))}
    </div>
  );
}

export default function Ofertas({ productos, onVer }) {
  const [copiado, setCopiado] = useState(false);
  const ofertas = productos
    .filter((p) => Number(p.descuento) > 0 && Number(p.cantidad) > 0)
    .sort((a, b) => b.descuento - a.descuento)
    .slice(0, 4);

  if (ofertas.length === 0) return null;

  const copiar = () => {
    navigator.clipboard?.writeText(CODIGO_PROMO).catch(() => {});
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <section id="ofertas" className="scroll-mt-20 bg-gradient-to-br from-frambuesa-oscuro via-frambuesa to-rose-500 py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em]">
            <Flame className="h-4 w-4" /> Ofertas de la semana
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Endulza tu semana con descuento
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-white/85">
            Las promociones terminan el domingo. Aprovecha antes de que se acaben.
          </p>
          <div className="mt-6">
            <Cuenta />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {ofertas.map((p) => {
            const { precio, final, descuento } = datosPrecio(p);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onVer(p)}
                className="group overflow-hidden rounded-2xl bg-white text-left text-cacao shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative aspect-square overflow-hidden bg-rosado">
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-125"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-frambuesa px-3 py-1 text-xs font-bold text-white shadow-md">
                    -{descuento}%
                  </span>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="line-clamp-1 font-display font-bold sm:text-lg">{p.nombre}</p>
                  <p className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-xl font-bold text-frambuesa">{soles(final)}</span>
                    <span className="text-xs text-cacao/45 line-through">{soles(precio)}</span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <p className="text-sm text-white/90">
            ¿Primera compra? Usa el código en tu pedido por WhatsApp:
          </p>
          <button
            type="button"
            onClick={copiar}
            className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-white/70 px-5 py-2 font-display text-lg font-bold tracking-widest transition hover:bg-white hover:text-frambuesa"
          >
            {CODIGO_PROMO}
            {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}
