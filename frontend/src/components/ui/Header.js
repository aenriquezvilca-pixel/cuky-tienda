
export default function Header() {
  return (
    <header className="bg-pink-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">

        {/* Logotipo y nombre */}
        <div className="flex items-center gap-3">
          <span className="text-5xl">🧁</span>

          <div>
            <h1 className="text-3xl font-bold">
              Cuky
            </h1>

            <p className="text-pink-100 text-sm">
              Pastelería artesanal
            </p>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="flex gap-6 font-semibold">
          <a href="#inicio" className="hover:text-pink-200">
            Inicio
          </a>

          <a href="#catalogo" className="hover:text-pink-200">
            Catálogo
          </a>

          <a href="#nosotros" className="hover:text-pink-200">
            Nosotros
          </a>
        </nav>

      </div>
    </header>
  );
}
