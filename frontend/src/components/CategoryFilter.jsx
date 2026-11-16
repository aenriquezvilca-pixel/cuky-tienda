export default function CategoryFilter({ categorias, seleccionada, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-1 border-b border-rosado">
      {categorias.map((cat) => {
        const activa = seleccionada === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`-mb-px border-b-2 px-1 pb-3 pt-2 text-sm font-bold uppercase tracking-widest transition ${
              activa
                ? "border-frambuesa text-frambuesa"
                : "border-transparent text-cacao/55 hover:text-frambuesa"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
