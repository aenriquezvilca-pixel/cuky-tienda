import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, CheckCircle2, X } from "lucide-react";
import { NEGOCIO } from "@/config";
import { crearReclamacion } from "@/services/api";

const VACIO = {
  tipo: "reclamo",
  nombres: "",
  tipo_documento: "DNI",
  documento: "",
  email: "",
  telefono: "",
  domicilio: "",
  bien: "producto",
  descripcion_bien: "",
  monto: "",
  detalle: "",
  pedido: "",
};

const campo =
  "w-full rounded-xl border border-rosado bg-white px-4 py-2.5 text-sm outline-none transition focus:border-frambuesa focus:ring-4 focus:ring-frambuesa/15";

function Etiqueta({ texto, children }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider text-cacao/70">
      {texto}
      <div className="mt-1 normal-case tracking-normal">{children}</div>
    </label>
  );
}

export default function LibroReclamaciones({ onCerrar }) {
  const [datos, setDatos] = useState(VACIO);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [codigo, setCodigo] = useState("");

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

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      const cuerpo = { ...datos, monto: datos.monto === "" ? null : datos.monto };
      const respuesta = await crearReclamacion(cuerpo);
      setCodigo(respuesta.codigo);
    } catch (err) {
      setError(err.message || "No se pudo enviar. Verifica que Django esté en ejecución.");
    } finally {
      setEnviando(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-cacao/70 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Libro de Reclamaciones"
        className="relative max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-crema shadow-2xl sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-cacao shadow-md transition hover:bg-frambuesa hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="rounded-t-3xl bg-gradient-to-r from-frambuesa-oscuro to-frambuesa p-6 pr-16 text-white">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
            <BookOpen className="h-4 w-4" /> Hoja de reclamación
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Libro de Reclamaciones</h2>
          <p className="mt-2 text-xs text-white/80">
            {NEGOCIO.razonSocial} · RUC {NEGOCIO.ruc} · {NEGOCIO.direccion}
          </p>
        </div>

        {codigo ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
            <h3 className="mt-3 font-display text-2xl font-bold">¡Hoja registrada!</h3>
            <p className="mt-2 text-sm text-cacao/70">Guarda tu código de seguimiento:</p>
            <p className="mt-2 font-display text-3xl font-bold tracking-widest text-frambuesa">{codigo}</p>
            <p className="mt-3 text-xs text-cacao/60">
              Recibirás una respuesta en un plazo máximo de 15 días hábiles.
            </p>
            <button
              type="button"
              onClick={onCerrar}
              className="mt-6 rounded-full bg-frambuesa px-8 py-3 text-sm font-bold text-white transition hover:bg-frambuesa-oscuro"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} className="space-y-4 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-frambuesa">
              1. Identificación del consumidor
            </p>
            <Etiqueta texto="Nombres y apellidos">
              <input className={campo} name="nombres" value={datos.nombres} onChange={cambiar} required maxLength={150} />
            </Etiqueta>
            <div className="grid gap-4 sm:grid-cols-3">
              <Etiqueta texto="Documento">
                <select className={campo} name="tipo_documento" value={datos.tipo_documento} onChange={cambiar}>
                  <option value="DNI">DNI</option>
                  <option value="CE">Carné de extranjería</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </Etiqueta>
              <div className="sm:col-span-2">
                <Etiqueta texto="Número de documento">
                  <input className={campo} name="documento" value={datos.documento} onChange={cambiar} required maxLength={20} />
                </Etiqueta>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Etiqueta texto="Correo electrónico">
                <input className={campo} type="email" name="email" value={datos.email} onChange={cambiar} required />
              </Etiqueta>
              <Etiqueta texto="Teléfono">
                <input className={campo} type="tel" name="telefono" value={datos.telefono} onChange={cambiar} required maxLength={20} />
              </Etiqueta>
            </div>
            <Etiqueta texto="Domicilio">
              <input className={campo} name="domicilio" value={datos.domicilio} onChange={cambiar} required maxLength={200} />
            </Etiqueta>

            <p className="pt-2 text-xs font-bold uppercase tracking-widest text-frambuesa">
              2. Identificación del bien contratado
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Etiqueta texto="Tipo">
                <select className={campo} name="bien" value={datos.bien} onChange={cambiar}>
                  <option value="producto">Producto</option>
                  <option value="servicio">Servicio</option>
                </select>
              </Etiqueta>
              <div className="sm:col-span-2">
                <Etiqueta texto="Descripción">
                  <input className={campo} name="descripcion_bien" value={datos.descripcion_bien} onChange={cambiar} required maxLength={200} placeholder="Ej.: Torta de chocolate" />
                </Etiqueta>
              </div>
            </div>
            <Etiqueta texto="Monto reclamado (S/) — opcional">
              <input className={campo} type="number" min="0" step="0.01" name="monto" value={datos.monto} onChange={cambiar} />
            </Etiqueta>

            <p className="pt-2 text-xs font-bold uppercase tracking-widest text-frambuesa">
              3. Detalle de la reclamación
            </p>
            <div className="flex gap-6 text-sm">
              {[
                ["reclamo", "Reclamo (disconformidad con el producto o servicio)"],
                ["queja", "Queja (disconformidad con la atención)"],
              ].map(([valor, texto]) => (
                <label key={valor} className="flex flex-1 cursor-pointer items-start gap-2">
                  <input type="radio" name="tipo" value={valor} checked={datos.tipo === valor} onChange={cambiar} className="mt-1 accent-[#c2185b]" />
                  <span>{texto}</span>
                </label>
              ))}
            </div>
            <Etiqueta texto="Detalle">
              <textarea className={campo} rows={3} name="detalle" value={datos.detalle} onChange={cambiar} required />
            </Etiqueta>
            <Etiqueta texto="Pedido del consumidor">
              <textarea className={campo} rows={2} name="pedido" value={datos.pedido} onChange={cambiar} required />
            </Etiqueta>

            {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-full bg-frambuesa px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-frambuesa/30 transition hover:bg-frambuesa-oscuro disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Enviar hoja de reclamación"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
