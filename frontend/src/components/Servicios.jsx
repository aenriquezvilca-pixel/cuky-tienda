import { CalendarDays, Palette, Truck } from "lucide-react";

const SERVICIOS = [
  {
    icono: Truck,
    titulo: "Pedido para hoy",
    texto: "Elige tus postres favoritos y recíbelos el mismo día, según disponibilidad.",
    enlace: "#catalogo",
    accion: "Pedir ahora",
  },
  {
    icono: CalendarDays,
    titulo: "Pedido programado",
    texto: "Reserva con anticipación para cumpleaños, aniversarios y eventos especiales.",
    enlace: "#pedidos",
    accion: "Programar pedido",
  },
  {
    icono: Palette,
    titulo: "Torta personalizada",
    texto: "Cuéntanos tu idea y creamos una torta única para tu celebración.",
    enlace: "#personalizada",
    accion: "Diseñar mi torta",
  },
];

export default function Servicios() {
  return (
    <section className="relative z-20 mx-auto -mt-12 max-w-6xl px-4 sm:px-6">
      <div className="grid gap-4 md:grid-cols-3">
        {SERVICIOS.map((s) => {
          const Icono = s.icono;
          return (
            <a
              key={s.titulo}
              href={s.enlace}
              className="group flex items-start gap-4 rounded-2xl bg-white p-6 shadow-xl shadow-cacao/10 transition hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-frambuesa/20"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-frambuesa text-white transition group-hover:scale-105">
                <Icono className="h-7 w-7" strokeWidth={1.8} />
              </span>
              <span>
                <span className="block font-display text-lg font-bold text-cacao">
                  {s.titulo}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-cacao/70">
                  {s.texto}
                </span>
                <span className="mt-3 inline-block text-sm font-bold text-frambuesa">
                  {s.accion} →
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
