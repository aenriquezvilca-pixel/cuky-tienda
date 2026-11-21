import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Cake, MessageCircle, X } from "lucide-react";
import { enlaceWhatsApp } from "@/config";
import { getRecomendadosDe } from "@/services/api";
import { ICONOS, datosPrecio, datosStock, soles } from "@/lib/producto";

export default function ProductModal({ producto, onCerrar, onCambiar }) {
  const [recomendados, setRecomendados] = useState([]);
  const [fallo, setFallo] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [origen, setOrigen] = useState("50% 50%");

  const { nombre, descripcion, imagen, categoria_nombre: categoria } = producto;
  const { precio, final, descuento, enOferta } = datosPrecio(producto);
  const stock = datosStock(producto);
  const agotado = stock.estado === "agotado";
  const Icono = ICONOS[categoria] ?? Cake;

  // Cerrar con Esc y bloquear el scroll de la página mientras está abierto
  useEffect(() => {
    const alTeclear = (e) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", alTeclear);
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = anterior;
    };
  }, [onCerrar]);

  // Recomendaciones del backend para el producto visto
  useEffect(() => {
    let activo = true;
    setRecomendados([]);
    setFallo(false);
    setZoom(false);
    getRecomendadosDe(producto.id)
      .then((lista) => activo && setRecomendados(lista))
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, [producto.id]);

  const moverZoom = (e) => {
    const caja = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - caja.left) / caja.width) * 100;
    const y = ((e.clientY - caja.top) / caja.height) * 100;
    setOrigen(`${x}% ${y}%`);
  };

  const pedido = enlaceWhatsApp(`Hola Cuky, quisiera pedir: ${nombre}`);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-cacao/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={nombre}
        className="relative max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-cacao shadow-md transition hover:bg-frambuesa hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Imagen grande con zoom que sigue al mouse */}
          <div
            className="relative aspect-square cursor-zoom-in overflow-hidden bg-gradient-to-br from-rosado to-crema md:rounded-l-3xl"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={moverZoom}
          >
            {fallo ? (
              <div className="flex h-full items-center justify-center text-frambuesa/40">
                <Icono className="h-28 w-28" strokeWidth={1.2} />
              </div>
            ) : (
              <img
                src={imagen}
                alt={nombre}
                onError={() => setFallo(true)}
                style={{ transform: zoom ? "scale(2)" : "scale(1)", transformOrigin: origen }}
                className="h-full w-full object-cover transition-transform duration-300 ease-out"
              />
            )}
            {enOferta && !agotado && (
              <span className="absolute left-4 top-4 rounded-full bg-frambuesa px-4 py-1.5 text-sm font-bold text-white shadow-md">
                -{descuento}%
              </span>
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-frambuesa">
              {categoria}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-cacao">
              {nombre}
            </h2>

            <div className="mt-4 flex items-baseline gap-3">
              <p className="font-display text-4xl font-bold text-frambuesa">{soles(final)}</p>
              {enOferta && <p className="text-lg text-cacao/45 line-through">{soles(precio)}</p>}
            </div>
            {enOferta && (
              <p className="mt-1 text-sm font-semibold text-emerald-600">
                Ahorras {soles(precio - final)}
              </p>
            )}

            <p
              className={`mt-3 text-sm font-semibold ${
                agotado ? "text-red-500" : stock.estado === "bajo" ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {stock.texto}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-cacao/75">{descripcion}</p>

            {agotado ? (
              <span className="mt-6 rounded-full border border-cacao/15 px-6 py-3 text-center text-sm font-bold uppercase tracking-widest text-cacao/40">
                No disponible por ahora
              </span>
            ) : (
              <a
                href={pedido}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-frambuesa px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-frambuesa/30 transition hover:-translate-y-0.5 hover:bg-frambuesa-oscuro"
              >
                <MessageCircle className="h-4 w-4" />
                Pedir por WhatsApp
              </a>
            )}
          </div>
        </div>

        {recomendados.length > 0 && (
          <div className="border-t border-rosado bg-crema/60 p-6 sm:p-8">
            <h3 className="font-display text-xl font-bold text-cacao">También te puede gustar</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {recomendados.map((r) => {
                const pr = datosPrecio(r);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onCambiar(r)}
                    className="group overflow-hidden rounded-2xl border border-rosado bg-white text-left transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-square overflow-hidden bg-rosado">
                      <img
                        src={r.imagen}
                        alt={r.nombre}
                        loading="lazy"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-1 text-sm font-bold text-cacao">{r.nombre}</p>
                      <p className="text-sm font-semibold text-frambuesa">{soles(pr.final)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
