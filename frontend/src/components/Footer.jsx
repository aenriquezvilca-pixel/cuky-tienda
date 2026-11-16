import Logo from "@/components/Logo";
import { enlaceWhatsApp } from "@/config";

const ENLACES = [
  { texto: "Inicio", href: "#inicio" },
  { texto: "Catálogo", href: "#catalogo" },
  { texto: "Pedidos", href: "#pedidos" },
  { texto: "Nosotros", href: "#nosotros" },
  { texto: "Contacto", href: "#contacto" },
];

export default function Footer() {
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
      <div className="border-t border-white/10 py-4 text-center text-xs text-crema/50">
        © 2026 Cuky Pastelería. Proyecto académico de comercio electrónico con ReactJS y Django.
      </div>
    </footer>
  );
}
