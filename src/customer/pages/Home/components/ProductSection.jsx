import ProductCard from '../../../components/ProductCard';

const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Camilan'];

const ProductSection = ({ products, activeCategory, onCategoryChange, loading }) => {
  return (
    <div className="mt-4">
      {/* Category chips */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                fontFamily: "'Poppins', sans-serif",
                background: isActive ? '#C8961A' : '#f3f4f6',
                color: isActive ? '#fff' : '#6b7280',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between px-4 mt-4 mb-3">
        <h2
          className="text-base font-bold text-gray-900"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Produk Populer
        </h2>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 px-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
              <div className="h-28 bg-gray-200" />
              <div className="p-2.5 bg-white space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-7 bg-gray-200 rounded-lg mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
          Produk tidak ditemukan
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSection;
