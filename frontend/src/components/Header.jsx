import { useState } from "react";
import Logo from "@/components/Logo";
import { enlaceWhatsApp } from "@/config";

const ENLACES = [
  { texto: "Inicio", href: "#inicio" },
  { texto: "Catálogo", href: "#catalogo" },
  { texto: "Pedidos", href: "#pedidos" },
  { texto: "Nosotros", href: "#nosotros" },
  { texto: "Contacto", href: "#contacto" },
];

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const whatsapp = enlaceWhatsApp("Hola Cuky, quisiera hacer un pedido.");

  return (
    <>
      {/* Barra superior */}
      <div className="bg-cacao px-4 py-2 text-center text-xs font-semibold tracking-wide text-crema">
        Pídelo y disfruta. ¡Te lo mereces! <span className="mx-2 text-pink-300">•</span>
        <span className="hidden sm:inline">Delivery y recojo en tienda</span>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <a href="#inicio" aria-label="Cuky, ir al inicio">
            <Logo />
          </a>

          <nav className="hidden items-center gap-7 text-[13px] font-bold uppercase tracking-widest text-cacao md:flex">
            {ENLACES.map((e) => (
              <a
                key={e.href}
                href={e.href}
                className="relative py-2 transition hover:text-frambuesa after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-frambuesa after:transition hover:after:scale-x-100"
              >
                {e.texto}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full bg-[#25a244] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#1e8a39] sm:inline-flex"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l.9-4.2A8 8 0 1 1 20 12Z" />
              </svg>
              Pedir por WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={abierto}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-rosado text-frambuesa md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                {abierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {abierto && (
          <nav className="border-t border-rosado bg-white px-4 pb-4 pt-2 md:hidden">
            <ul className="flex flex-col text-sm font-bold uppercase tracking-widest text-cacao">
              {ENLACES.map((e) => (
                <li key={e.href}>
                  <a
                    href={e.href}
                    onClick={() => setAbierto(false)}
                    className="block border-b border-rosado/70 px-2 py-3 transition hover:text-frambuesa"
                  >
                    {e.texto}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block rounded-full bg-[#25a244] px-4 py-3 text-center text-white"
                >
                  Pedir por WhatsApp
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
