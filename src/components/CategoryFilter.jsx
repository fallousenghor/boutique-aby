export default function CategoryFilter({ categories, activeId, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-3">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
          activeId === null
            ? "bg-terracotta-500 border-terracotta-500 text-sable"
            : "bg-white border-ink-500/10 text-ink-400 hover:border-terracotta-400"
        }`}
      >
        Tout
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
            activeId === cat.id
              ? "bg-terracotta-500 border-terracotta-500 text-sable"
              : "bg-white border-ink-500/10 text-ink-400 hover:border-terracotta-400"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
