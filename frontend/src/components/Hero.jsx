import { useCallback, useEffect, useRef, useState } from "react";

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

const SLIDES = [
  {
    etiqueta: "Colección 2026",
    titulo: "Dulces momentos que se disfrutan",
    texto:
      "Tortas artesanales de chocolate, hechas con ingredientes naturales y mucho cariño.",
    boton: "Ver tortas",
    categoria: "Tortas",
    imagen: img("1578985545062-69928b1d9587"),
    fondo: "from-cacao to-frambuesa-oscuro",
    alt: "Torta de chocolate artesanal",
  },
  {
    etiqueta: "Para compartir",
    titulo: "Cupcakes para cada antojo",
    texto:
      "Cajas de 6 unidades con buttercream suave y chispitas de colores. Perfectos para regalar.",
    boton: "Ver cupcakes",
    categoria: "Cupcakes",
    imagen: img("1486427944299-d1955d23e34d"),
    fondo: "from-frambuesa to-rosado",
    alt: "Cupcakes decorados con crema rosada",
  },
  {
    etiqueta: "Recién horneadas",
    titulo: "Galletas crocantes por fuera, suaves por dentro",
    texto:
      "Chispas de chocolate, avena y canela. Acompañan muy bien un café o un vaso de leche.",
    boton: "Ver galletas",
    categoria: "Galletas",
    imagen: img("1499636136210-6f4ee915583e"),
    fondo: "from-amber-700 to-cacao",
    alt: "Galletas con chispas de chocolate",
  },
  {
    etiqueta: "Favorita de la casa",
    titulo: "Torta de fresas con crema chantilly",
    texto:
      "Frescura y suavidad en cada porción. La elección ideal para cumpleaños y aniversarios.",
    boton: "Quiero una",
    categoria: "Tortas",
    imagen: img("1464349095431-e9a21285b5f3"),
    fondo: "from-rose-500 to-frambuesa-oscuro",
    alt: "Torta de fresas con crema",
  },
];

export default function Hero({ onElegir }) {
  const [actual, setActual] = useState(0);
  const [pausa, setPausa] = useState(false);
  const [fallos, setFallos] = useState({});
  const inicioToque = useRef(null);
  const total = SLIDES.length;

  const siguiente = useCallback(() => setActual((i) => (i + 1) % total), [total]);
  const anterior = useCallback(
    () => setActual((i) => (i - 1 + total) % total),
    [total]
  );

  // Avance automático (se reinicia al cambiar de diapositiva)
  useEffect(() => {
    if (pausa) return;
    const t = setTimeout(siguiente, 5500);
    return () => clearTimeout(t);
  }, [actual, pausa, siguiente]);

  const alTocarInicio = (e) => {
    inicioToque.current = e.touches[0].clientX;
  };
  const alTocarFin = (e) => {
    if (inicioToque.current === null) return;
    const diferencia = e.changedTouches[0].clientX - inicioToque.current;
    if (Math.abs(diferencia) > 50) {
      diferencia < 0 ? siguiente() : anterior();
    }
    inicioToque.current = null;
  };

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Productos destacados"
      tabIndex={0}
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onTouchStart={alTocarInicio}
      onTouchEnd={alTocarFin}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") siguiente();
        if (e.key === "ArrowLeft") anterior();
      }}
      className="relative h-[470px] overflow-hidden bg-cacao outline-none sm:h-[550px] lg:h-[620px]"
    >
      {SLIDES.map((s, i) => {
        const activa = i === actual;
        return (
          <div
            key={s.titulo}
            aria-hidden={!activa}
            className={`absolute inset-0 transition-opacity duration-700 ${
              activa ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {/* Fondo: degradado (respaldo) + foto */}
            <div className={`absolute inset-0 bg-gradient-to-br ${s.fondo}`} />
            {!fallos[i] && (
              <img
                src={s.imagen}
                alt={s.alt}
                onError={() => setFallos((f) => ({ ...f, [i]: true }))}
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[7000ms] ease-out ${
                  activa ? "scale-110" : "scale-100"
                }`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-cacao/90 via-cacao/55 to-cacao/10" />

            {/* Texto */}
            <div className="relative mx-auto flex h-full max-w-6xl items-center px-5 sm:px-8">
              <div
                className={`max-w-xl text-white transition-all delay-150 duration-700 ${
                  activa ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur">
                  {s.etiqueta}
                </span>
                <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
                  {s.titulo}
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
                  {s.texto}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#catalogo"
                    onClick={() => onElegir?.(s.categoria)}
                    className="rounded-full bg-white px-7 py-3 text-sm font-bold text-frambuesa shadow-lg transition hover:-translate-y-0.5 hover:bg-rosado"
                  >
                    {s.boton}
                  </a>
                  <a
                    href="#nosotros"
                    className="rounded-full border-2 border-white/60 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                  >
                    Conócenos
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Flechas */}
      <button
        type="button"
        onClick={anterior}
        aria-label="Diapositiva anterior"
        className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white hover:text-frambuesa sm:flex"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={siguiente}
        aria-label="Diapositiva siguiente"
        className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white hover:text-frambuesa sm:flex"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-16 left-0 right-0 z-10 flex items-center justify-center gap-2 sm:bottom-20">
        {SLIDES.map((s, i) => (
          <button
            key={s.titulo}
            type="button"
            onClick={() => setActual(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            aria-current={i === actual}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === actual ? "w-9 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Contador */}
      <p className="absolute bottom-16 right-5 z-10 hidden font-display text-sm font-semibold tracking-widest text-white/80 sm:bottom-20 sm:right-8 sm:block">
        {String(actual + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
    </section>
  );
}
