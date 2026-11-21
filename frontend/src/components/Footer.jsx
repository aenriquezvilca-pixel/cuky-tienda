import { BookOpen } from "lucide-react";
import Logo from "@/components/Logo";
import { NEGOCIO, enlaceWhatsApp } from "@/config";

const ENLACES = [
  { texto: "Inicio", href: "#inicio" },
  { texto: "Catálogo", href: "#catalogo" },
  { texto: "Ofertas", href: "#ofertas" },
  { texto: "Pedidos", href: "#pedidos" },
  { texto: "Nosotros", href: "#nosotros" },
  { texto: "Contacto", href: "#contacto" },
];

export default function Footer({ onLibro }) {
  return (
    <footer className="bg-cacao text-crema">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
          <Logo claro completo className="h-32 w-32" />
          <p className="max-w-xs text-sm leading-relaxed text-crema/70">
            Elige endulzar tu vida. Tortas, cupcakes, galletas y helados hechos con cariño.
          </p>
        </div>

        <div className="text-center md:text-left">
          <h4 className="font-display text-lg font-bold text-pink-300">Navegación</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {ENLACES.map((e) => (
              <li key={e.href}>
                <a href={e.href} className="text-crema/75 transition hover:text-pink-300">
                  {e.texto}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h4 className="font-display text-lg font-bold text-pink-300">Contacto</h4>
          <ul className="mt-4 space-y-2 text-sm text-crema/75">
            <li>Lunes a sábado, 8:00 a. m. a 8:00 p. m.</li>
            <li>Recojo en tienda y delivery</li>
          </ul>
          <a
            href={enlaceWhatsApp("Hola Cuky, quisiera hacer una consulta.")}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full bg-[#25a244] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e8a39]"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>

      {/* Libro de Reclamaciones */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left">
          <div className="text-xs leading-relaxed text-crema/60">
            <p className="font-semibold text-crema/80">{NEGOCIO.razonSocial}</p>
            <p>
              RUC {NEGOCIO.ruc} · {NEGOCIO.direccion}
            </p>
          </div>
          <button
            type="button"
            onClick={onLibro}
            className="inline-flex items-center gap-3 rounded-xl border border-white/25 bg-white/5 px-5 py-2.5 text-left transition hover:border-pink-300 hover:bg-white/10"
          >
            <BookOpen className="h-7 w-7 text-pink-300" strokeWidth={1.6} />
            <span className="leading-tight">
              <span className="block font-display text-base font-bold">Libro de Reclamaciones</span>
              <span className="block text-[11px] text-crema/60">Registra tu reclamo o queja en línea</span>
            </span>
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-crema/50">
        © 2026 Cuky Pastelería. Proyecto académico de comercio electrónico con ReactJS y Django.
      </div>
    </footer>
  );
}
