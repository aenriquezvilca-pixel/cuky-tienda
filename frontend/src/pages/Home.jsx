import { useEffect, useState } from "react";
import { CakeSlice, CalendarDays, ChefHat, Clock, Gift, Leaf, MapPin, MessageCircle, PartyPopper } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import CategoryFilter from "@/components/CategoryFilter";
import ProductList from "@/components/ProductList";
import ProductModal from "@/components/ProductModal";
import CategoriasDestacadas from "@/components/CategoriasDestacadas";
import Ofertas from "@/components/Ofertas";
import Recomendados from "@/components/Recomendados";
import LibroReclamaciones from "@/components/LibroReclamaciones";
import Footer from "@/components/Footer";
import { getCategorias, getProductos } from "@/services/api";

// Cantidad de productos que se muestran antes de pulsar "Ver todos"
const LIMITE_INICIAL = 8;

const PASOS = [
  {
    numero: "01",
    icono: CakeSlice,
    titulo: "Elige tus postres",
    texto: "Explora el catálogo y filtra por tortas, cupcakes, galletas o helados.",
  },
  {
    numero: "02",
    icono: CalendarDays,
    titulo: "Define la fecha",
    texto: "Indícanos para cuándo lo necesitas y si lo recoges o prefieres delivery.",
  },
  {
    numero: "03",
    icono: MessageCircle,
    titulo: "Confirma tu pedido",
    texto: "Coordinamos los detalles contigo: sabores, decoración y forma de pago.",
  },
  {
    numero: "04",
    icono: Gift,
    titulo: "Recibe y disfruta",
    texto: "Preparamos tu pedido fresco para que solo te dediques a celebrar.",
  },
];

const VALORES = [
  {
    icono: Leaf,
    titulo: "Ingredientes naturales",
    texto: "Usamos mantequilla, frutas frescas y chocolate de calidad, sin sabores artificiales.",
  },
  {
    icono: ChefHat,
    titulo: "Hecho a mano",
    texto: "Cada receta se prepara de forma artesanal para cuidar el sabor y la presentación.",
  },
  {
    icono: PartyPopper,
    titulo: "Para cada ocasión",
    texto: "Cumpleaños, aniversarios o un antojo: tenemos el postre ideal para celebrar.",
  },
];

// Datos de ejemplo: cámbialos por los reales de tu tienda
const CONTACTO = [
  {
    icono: Clock,
    titulo: "Horario de atención",
    lineas: ["Lunes a sábado", "8:00 a. m. a 8:00 p. m."],
  },
  {
    icono: MessageCircle,
    titulo: "Pedidos y consultas",
    lineas: ["Escríbenos por WhatsApp", "o llámanos para coordinar"],
  },
  {
    icono: MapPin,
    titulo: "Entregas",
    lineas: ["Recojo en tienda", "Delivery con costo adicional"],
  },
];

const ORDENES = {
  recomendado: (a, b) =>
    Number(b.destacado) - Number(a.destacado) || b.vendidos - a.vendidos || a.id - b.id,
  precio_asc: (a, b) => Number(a.precio_final) - Number(b.precio_final),
  precio_desc: (a, b) => Number(b.precio_final) - Number(a.precio_final),
  descuento: (a, b) => b.descuento - a.descuento,
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
};

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recomendado");
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [verTodos, setVerTodos] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [libroAbierto, setLibroAbierto] = useState(false);

  const cargarDatos = () => {
    setCargando(true);
    setError("");
    Promise.all([getProductos(), getCategorias()])
      .then(([listaProductos, listaCategorias]) => {
        setProductos(listaProductos);
        setCategorias(listaCategorias);
      })
      .catch(() =>
        setError("No se pudo conectar con el servidor. Verifica que Django esté en ejecución.")
      )
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const elegirCategoria = (nombre) => {
    setCategoriaActiva(nombre);
    setVerTodos(false);
  };

  // Las categorías vienen del backend; "Todos" se agrega al inicio
  const nombresCategorias = ["Todos", ...categorias.map((c) => c.nombre)];

  const productosFiltrados = productos
    .filter(
      (p) =>
        (categoriaActiva === "Todos" || p.categoria_nombre === categoriaActiva) &&
        (!soloOfertas || p.descuento > 0) &&
        p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
    )
    .sort(ORDENES[orden]);

  // Solo se muestran algunos; el botón "Ver todos" despliega el resto
  const visibles = verTodos ? productosFiltrados : productosFiltrados.slice(0, LIMITE_INICIAL);
  const ocultos = productosFiltrados.length - LIMITE_INICIAL;

  return (
    <div id="inicio" className="min-h-screen bg-crema font-sans text-cacao">
      <Header />
      <Hero onElegir={elegirCategoria} />
      <Servicios />
      <CategoriasDestacadas
        categorias={categorias}
        productos={productos}
        onElegir={elegirCategoria}
      />

      {/* Catálogo */}
      <main id="catalogo" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-frambuesa">
            Colección 2026
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Elige tu antojo favorito
          </h2>
        </div>

        <div className="mx-auto mb-8 flex max-w-3xl flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setVerTodos(false);
            }}
            placeholder="Buscar un postre..."
            aria-label="Buscar productos"
            className="w-full rounded-full border border-rosado bg-white px-6 py-3 text-sm shadow-sm outline-none transition placeholder:text-cacao/40 focus:border-frambuesa focus:ring-4 focus:ring-frambuesa/15"
          />
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            aria-label="Ordenar productos"
            className="rounded-full border border-rosado bg-white px-5 py-3 text-sm shadow-sm outline-none focus:border-frambuesa"
          >
            <option value="recomendado">Recomendados</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="descuento">Mayor descuento</option>
            <option value="nombre">Nombre (A-Z)</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSoloOfertas((v) => !v);
              setVerTodos(false);
            }}
            aria-pressed={soloOfertas}
            className={`whitespace-nowrap rounded-full border px-5 py-3 text-sm font-bold shadow-sm transition ${
              soloOfertas
                ? "border-frambuesa bg-frambuesa text-white"
                : "border-rosado bg-white text-cacao hover:border-frambuesa hover:text-frambuesa"
            }`}
          >
            🔥 Solo ofertas
          </button>
        </div>

        <div className="mb-10">
          <CategoryFilter
            categorias={nombresCategorias}
            seleccionada={categoriaActiva}
            onSelect={elegirCategoria}
          />
        </div>

        <ProductList
          productos={visibles}
          cargando={cargando}
          error={error}
          onReintentar={cargarDatos}
          onVer={setSeleccionado}
        />

        {!cargando && !error && ocultos > 0 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setVerTodos((v) => !v)}
              className="rounded-full border-2 border-frambuesa px-10 py-3 text-sm font-bold uppercase tracking-widest text-frambuesa transition hover:bg-frambuesa hover:text-white"
            >
              {verTodos ? "Ver menos" : `Ver todos (${productosFiltrados.length})`}
            </button>
          </div>
        )}

        <p className="mt-10 text-center text-xs text-cacao/50">
          Precios en soles. Las imágenes son referenciales y los precios incluyen decoración estándar.
        </p>
      </main>

      <Ofertas productos={productos} onVer={setSeleccionado} />
      <Recomendados onVer={setSeleccionado} />

      {/* Pedidos */}
      <section id="pedidos" className="scroll-mt-20 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-frambuesa">
              Pedidos
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Haz tu pedido en 4 pasos
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-cacao/70">
              Para pedidos programados te recomendamos reservar con anticipación.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p) => (
              <div
                key={p.numero}
                className="relative rounded-3xl border border-rosado bg-crema p-6 pt-9 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-frambuesa/10"
              >
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-frambuesa px-4 py-1 font-display text-sm font-bold text-white shadow-md">
                  {p.numero}
                </span>
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-rosado text-2xl">
                  <p.icono className="h-6 w-6 text-frambuesa" strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-lg font-bold">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cacao/70">{p.texto}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#catalogo"
              className="rounded-full bg-frambuesa px-8 py-3 text-sm font-bold text-white shadow-lg shadow-frambuesa/30 transition hover:-translate-y-0.5 hover:bg-frambuesa-oscuro"
            >
              Ver catálogo
            </a>
            <a
              href="#contacto"
              className="rounded-full border-2 border-frambuesa/30 px-8 py-3 text-sm font-bold text-frambuesa transition hover:bg-rosado"
            >
              Consultar mi pedido
            </a>
          </div>
        </div>
      </section>

      {/* Torta personalizada */}
      <section id="personalizada" className="scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-frambuesa to-frambuesa-oscuro px-6 py-20 text-center text-white shadow-2xl shadow-frambuesa/30 sm:px-12 sm:py-28">
          {/* Fotos de fondo que se funden y hacen zoom lento */}
          {[
            { clase: "cuky-foto-a", id: "1464349095431-e9a21285b5f3" },
            { clase: "cuky-foto-b", id: "1578985545062-69928b1d9587" },
          ].map((f) => (
            <img
              key={f.id}
              src={`https://images.unsplash.com/photo-${f.id}?auto=format&fit=crop&w=1600&q=80`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              onError={(e) => (e.currentTarget.style.display = "none")}
              className={`${f.clase} absolute inset-0 h-full w-full object-cover`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-frambuesa-oscuro/90 via-frambuesa/70 to-cacao/70" />
          <div className="cuky-flotar pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 backdrop-blur-[2px]" />
          <div className="cuky-flotar pointer-events-none absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-white/10 backdrop-blur-[2px] [animation-delay:-3s]" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
              Hecha a tu medida
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Cuéntanos tu idea y creamos una torta personalizada completamente única para tu celebración.
            </p>
            <a
              href="#contacto"
              className="mt-7 inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-frambuesa shadow-lg transition hover:-translate-y-0.5 hover:bg-rosado"
            >
              Cuéntanos tu idea →
            </a>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="relative scroll-mt-20 overflow-hidden bg-rosado py-20">
        {/* Foto de fondo con efecto parallax (se queda fija al hacer scroll) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center md:bg-fixed"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1800&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rosado/90 via-rosado/75 to-rosado/90" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-frambuesa">
              Nosotros
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Pastelería con cariño
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {VALORES.map((v) => (
              <div
                key={v.titulo}
                className="rounded-3xl bg-white/90 p-7 text-center shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-frambuesa/15"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rosado text-2xl">
                  <v.icono className="h-6 w-6 text-frambuesa" strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-xl font-bold">{v.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cacao/70">{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-frambuesa">
            Contacto
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Estamos para ayudarte
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {CONTACTO.map((c) => (
            <div
              key={c.titulo}
              className="rounded-3xl border border-rosado bg-white p-7 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-frambuesa/10"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rosado text-2xl">
                <c.icono className="h-6 w-6 text-frambuesa" strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-lg font-bold">{c.titulo}</h3>
              {c.lineas.map((l) => (
                <p key={l} className="mt-1 text-sm text-cacao/70">
                  {l}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Footer onLibro={() => setLibroAbierto(true)} />

      {seleccionado && (
        <ProductModal
          producto={seleccionado}
          onCerrar={() => setSeleccionado(null)}
          onCambiar={setSeleccionado}
        />
      )}
      {libroAbierto && <LibroReclamaciones onCerrar={() => setLibroAbierto(false)} />}
    </div>
  );
}
