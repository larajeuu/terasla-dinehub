import CartItem from './CartItem';

const groupByTenant = (items) => {
  const map = new Map();
  for (const item of items) {
    const key = item.merchant_id || item.merchant_nama || 'lain';
    if (!map.has(key)) {
      map.set(key, { merchant_nama: item.merchant_nama, items: [] });
    }
    map.get(key).items.push(item);
  }
  return Array.from(map.values());
};

const CartItemList = ({ items }) => {
  const groups = groupByTenant(items);

  return (
    <div className="px-4 mt-4 space-y-4">
      {groups.map((group, idx) => (
        <section key={idx}>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span
              className="w-1.5 h-4 rounded-full"
              style={{ background: '#C8961A' }}
            />
            <h3
              className="text-sm font-bold text-gray-800"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {group.merchant_nama}
            </h3>
            <span
              className="text-[11px] text-gray-400"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              · {group.items.length} item
            </span>
          </div>
          <div className="space-y-2.5">
            {group.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default CartItemList;
